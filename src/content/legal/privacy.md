---
slug: privacy
title: Privacy Policy | Seedance Watermark Remover
description: How Seedance Watermark Remover handles uploaded images, extracted frames, authentication, and temporary processing data.
eyebrow: Privacy
heading: Private processing with clear retention limits
---

Seedance Watermark Remover processes the supported image or extracted video frame you choose to upload so it can return a result. Direct video upload is not currently supported. Files are stored in private object storage rather than exposed through permanent public URLs.

## Retention

Uploads, results, and processing records are designed to expire after 24 hours. Temporary signed access links expire sooner. The site shares Cloudflare R2 infrastructure with another independently deployed service, while access remains server-side and job reads are restricted to the signed-in owner.

## Google sign-in and analytics

You may select and preview a file before signing in. Google sign-in is required before upload processing begins. The service uses an encrypted session and stores the Google account's provider user identifier as the job owner ID; it does not provide a public profile directory. Analytics is currently disabled for this new site unless a site-specific measurement ID is configured later.

## Your choices

Do not upload confidential media or content you are not authorized to edit. You may close the page before processing to keep the selected file on your device. Contact the site operator if you need help with a privacy request.
