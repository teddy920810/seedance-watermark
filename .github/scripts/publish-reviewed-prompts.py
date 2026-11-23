"""Publish dated, editorially approved prompt articles from checked PRs."""
import base64
import datetime as dt
import json
import os
import re
import subprocess
import time
import urllib.request
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from zoneinfo import ZoneInfo

SITE = "https://www.seedances.co"
QUEUE = ".github/prompts-release-queue.json"


def gh(*args):
    raw = subprocess.check_output(["gh", *args], text=True)
    return json.loads(raw)


def download(url):
    with urllib.request.urlopen(url, timeout=20) as res:
        if res.status != 200 or res.geturl() != url:
            raise ValueError(f"Unexpected response for {url}")
        return res.read()


class Article(HTMLParser):
    def __init__(self):
        super().__init__()
        self.canonical = self.heading = self.body = ""
        self.in_heading = self.in_article = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical = attrs.get("href")
        if tag == "h1":
            self.in_heading = True
        if tag == "article":
            self.in_article = True

    def handle_endtag(self, tag):
        if tag == "h1":
            self.in_heading = False
        if tag == "article":
            self.in_article = False

    def handle_data(self, text):
        if self.in_heading:
            self.heading += text
        if self.in_article:
            self.body += text + " "


def live(item):
    url = f"{SITE}/blog/{item['slug']}"
    sitemap = ET.fromstring(download(f"{SITE}/sitemap.xml"))
    if url not in [node.text for node in sitemap.findall(".//{*}loc")]:
        return False
    page = Article()
    page.feed(download(url).decode())
    return (page.canonical == url and page.heading.strip() == item["title"]
            and item["bodyAnchor"] in " ".join(page.body.split())
            and len(page.body.split()) >= 1450)


def release(item, today):
    repo = os.environ["GH_REPO"]
    slug = item["slug"]
    if not re.fullmatch(r"[a-z0-9-]+", slug):
        raise ValueError("Invalid queue slug")
    head = item["head"]
    pr = gh("api", f"repos/{repo}/pulls/{item['pr']}")
    article = f"src/content/blog/{slug}.md"
    if not (pr["head"]["sha"] == head and pr["head"]["repo"]["full_name"] == repo
            and pr["base"]["ref"] == "main" and pr["user"]["login"] == "lindalei-bit"
            and not pr["draft"]):
        raise ValueError("PR changed after approval")
    if not pr["merged"]:
        if pr["state"] != "open":
            raise ValueError("Scheduled PR was closed")
        files = gh("api", f"repos/{repo}/pulls/{item['pr']}/files?per_page=100")
        if not (pr["changed_files"] == len(files) and any(f["filename"] == article for f in files)
                and all(f["status"] == "added" and (f["filename"] == article or
                        f["filename"].startswith(f"public/uploads/blog/{slug}/")) for f in files)):
            raise ValueError("PR has unexpected file changes")
        encoded = gh("api", f"repos/{repo}/contents/{article}?ref={head}")["content"]
        if f"publishedAt: {today}" not in base64.b64decode(encoded).decode().splitlines():
            raise ValueError("Front matter release date differs from queue")
        checks = gh("pr", "checks", str(item["pr"]), "--json", "name,workflow,bucket")
        for needed in ["CI", "Vercel"]:
            if not any(c["bucket"] == "pass" and
                       ((needed == "CI" and c["workflow"] == "CI" and c["name"] == "verify")
                        or (needed == "Vercel" and c["name"] == "Vercel")) for c in checks):
                raise ValueError(f"Missing green {needed} check")
        merged = gh("api", "--method", "PUT", f"repos/{repo}/pulls/{item['pr']}/merge",
                    "-f", "merge_method=squash", "-f", f"sha={head}")
        if not merged["merged"]:
            raise RuntimeError("Merge failed")
    for attempt in range(24):
        try:
            if live(item):
                print(f"Verified {SITE}/blog/{slug}", flush=True)
                return
        except (OSError, ValueError, ET.ParseError) as exc:
            print(str(exc), flush=True)
        if attempt < 23:
            time.sleep(20)
    raise RuntimeError(f"Production verification pending for {slug}")


if __name__ == "__main__":
    today = dt.datetime.now(ZoneInfo("Asia/Shanghai")).date().isoformat()
    with open(QUEUE, encoding="utf-8") as file:
        items = json.load(file)
    day = [item for item in items if item["date"] == today]
    limit = 1 if "2026-11-23" <= today <= "2026-11-27" else 2
    if (len(day) > limit or len({i["slug"] for i in items}) != len(items)
            or len({i["pr"] for i in items}) != len(items)):
        raise ValueError("Duplicate item or daily publication limit exceeded")
    for item in day:
        release(item, today)
    print(f"{today}: {len(day)} scheduled prompt article(s)")
