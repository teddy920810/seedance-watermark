---
slug: midjourney-prompt-guide
title: "Midjourney Prompts With Examples and Parameter Fixes"
seoTitle: "Midjourney Prompts With Examples and Parameter Fixes"
description: "Write reusable Midjourney prompts, set the aspect ratio and exclusions, and troubleshoot version and weight errors using working examples."
publishedAt: 2026-11-24
readTime: "8 min read"
author: "Seedances Editorial Team"
category: "AI Image Guides"
eyebrow: "AI IMAGE GUIDES"
heroDescription: "Write reusable Midjourney prompts, set the aspect ratio and exclusions, and troubleshoot version and weight errors using working examples."
coverImage: "/uploads/blog/midjourney-prompt-guide/cover.jpg"
coverAlt: "Editorial arrangement of three print mockups of a red kettle in distinct image styles, photographic studio."
coverCaption: "Editorial illustration. Editorial arrangement of three print mockups of a red kettle in distinct image styles, photographic studio."
ctaHeading: "Plan a video shot around your finished image"
ctaLabel: "Explore the Seedances video planning preview →"
ctaHref: "/seedance-ai-generated"
featured: false
draft: false
contentMode: "markdown"
---

A red kettle is a simple subject until the image has to sit under a headline. The first generation puts the kettle in the middle. The next gives it two handles. You add a line about clean composition, and now the backdrop works, but the handle is outside the crop. The easiest way out is to separate the image description from the settings and change one of them at a time.

Start with what belongs inside the picture. Add the aspect ratio as a parameter, then read the result at the size it will appear. A Midjourney prompt for a magazine spread needs a different composition from a square post, even with the same subject. The examples below show how to keep the concept recognizable across formats, pick the right type of reference, and repair a prompt that the selected version rejects.

## Describe what the image has to show

![A red enamel kettle on a calm cream background, window light and generous side room.](/uploads/blog/midjourney-prompt-guide/section-1.jpg)

*A red enamel kettle on a calm cream background, window light and generous side room.*

Say what the viewer should recognize first, where it sits, and what kind of light falls on it. Pick distinctive visible details, such as a curved black handle or a bright enamel finish. A word such as premium leaves several decisions open. A narrow highlight along the rim and a warm cream wall give you something to check on the picture.

For a landscape image next to a title, try this starting point.

> Red enamel kettle with a black curved handle on the right third of a pale kitchen counter, full kettle and handle in frame, soft window light from the left, warm cream wall and open space on the left, editorial still life photograph --ar 3:2

The first pass tells you which problem to solve. If the kettle has the right finish but crowds the title, keep the finish description and move the kettle farther right. If the space works but the enamel looks like plastic, change the surface language. A line about a glossy enamel highlight gives you a concrete difference to look for. Try the revised prompt with the same aspect ratio so you can see whether the wording fixed that issue.

A square social tile usually has less space for unused surface. Give the kettle breathing room on all sides, particularly above the handle. Ask for one well-placed point of interest such as the reflection of a window on the red enamel. For a vertical story background, move the kettle lower and leave quiet wall above it. The prompt can reuse the subject, light and color palette. The intended crop decides where those ingredients go.

Midjourney's documentation recommends choosing clear, specific words and letting shorter prompts leave unspecified details to the model. Keep an exact copy of the prompt before appending more detail. If several runs keep creating competing props, remove the least important details until you can tell which phrase draws attention away from the subject. [Midjourney Prompt Basics](https://docs.midjourney.com/hc/en-us/articles/32023408776205-Prompt-Basics/)

## Use a few parameters you can evaluate

![Prints of the same red kettle concept in square, tall, and wide framing on a light table.](/uploads/blog/midjourney-prompt-guide/section-2.jpg)

*Prints of the same red kettle concept in square, tall, and wide framing on a light table.*

Place parameters at the end of the prompt. The ratio describes the shape of the canvas, while a phrase such as “subject low in frame” describes the placement inside that shape. Midjourney accepts an aspect ratio such as the 4:5 example below. The finished image still needs a visual crop check. Look at what happens around the spout and handle and leave enough space to fit your layout without forcing a second crop. [Midjourney Parameter List](https://docs.midjourney.com/hc/en-us/articles/32859204029709-Parameter-List)

> Red enamel kettle with one black curved handle, standing on a pale tabletop below the middle of the frame, matte cream wall above it, soft morning window light, simple editorial photo --ar 4:5

The default create settings are enough for a first pass. If you need broader visual options, try a separate run with a modest chaos value. The documentation calls the control Chaos or Variety and describes it as a way to increase variation across results. Look at the results together and decide whether the added choices improved the crop or gave you distracting shifts in subject and props. Lower the setting again before making a small composition fix so the comparison is easier to read. [Midjourney Chaos and Variety](https://docs.midjourney.com/hc/en-us/articles/32099348346765-Chaos-Variety)

Use exclusions for clear, independent items that you can name. If text and logos keep appearing on a fictional kettle, try adding a short exclusion such as `--no text, logos` after all the descriptive words. Also positively describe a plain enamel body. Test the simpler wording first if an exclusion causes an unwanted change. Removing an ill-defined category can also discourage something you wanted in the scene, particularly when the term shares an attribute with the subject.

Keep a simple run log. Record the selected model, prompt, ratio, reference settings and what you intended to change. Give each saved result a short note such as “correct wall space, spout too close to border.” When a later prompt produces a better kettle but loses the framing, the log gives you a clear version to return to instead of relying on memory.

If you are generating for a page with copy, make a rough version of the finished layout now. Drop a temporary headline over the background and view it at normal size. A little texture can look attractive on its own and still make small letters hard to read. Adjust that space while the image is easy to revise.

## Choose the reference control for the change you need

![An editor reviewing several visual style examples in a studio, with a tangible palette and reference prints.](/uploads/blog/midjourney-prompt-guide/section-3.jpg)

*An editor reviewing several visual style examples in a studio, with a tangible palette and reference prints.*

An ordinary Image Prompt can guide what appears in the picture, how it is composed, and its colors. Use one if you own a still life that already has the shape, palette or arrangement you want to carry into a new image. Describe the finished picture in the text prompt, then pick the Image Prompt option when you attach the source on the web. Midjourney treats image references as guidance. If the exact shape of a handle or the placement of a label matters, compare the generated version against the source. [Midjourney Image Prompts](https://docs.midjourney.com/hc/en-us/articles/32040250122381-Image-Prompts)

Use a Style Reference when the treatment is the part worth borrowing. You might want muted warm colors and slightly grainy paper texture while changing the subject from a kettle to a lemon. Attach an image you can use, then name the qualities that matter in your own words. The result gives you a quick comparison of how the style carries across subjects. If the new frame still inherits too much of the old subject, check which type of reference you attached. [Midjourney Style Reference](https://docs.midjourney.com/hc/en-us/articles/32180011136653-Style-Reference)

For a change to an existing image, open the Edit model where your version supports it. Midjourney currently identifies V8.2 as its default and describes the Edit model as compatible with V8.1 and V8.2. It can work with existing images and selected areas. In an older V7 workflow, you may see Omni Reference described for subject identity or object form. That older reference control has its own version rules. Identify which version is selected before following a tutorial that includes its flags. [Midjourney Version](https://docs.midjourney.com/hc/en-us/articles/32199405667853-Version) · [Midjourney Edit Model](https://docs.midjourney.com/hc/en-us/articles/48495453462797-Edit-Model)

For the kettle, a useful Edit instruction would be to “change the cream wall to pale dusty blue and preserve the kettle's rim, handle and cast shadow.” Once you see the result, crop in and inspect those three parts. If the shadow edge disappears or the handle bends, return to the original and reduce the area being edited. Keep the best starting picture available as a separate file so repairs always begin from the version you approved.

Once the kettle still is approved, try describing a new shot of steam rising from the spout in [Seedances.co’s text-to-video settings preview](/seedance-ai-generated). Choose the frame shape before you write the movement. Keep your original Midjourney settings with the still for future image revisions.

## Frequently asked questions

![Two side by side prints of the same scene, one cluttered and one with clean negative space.](/uploads/blog/midjourney-prompt-guide/section-4.jpg)

*Two side by side prints of the same scene, one cluttered and one with clean negative space.*

**Do I need special Midjourney wording to get a clean image?** Start with ordinary concrete language about the subject, viewpoint, lighting and use. Add Midjourney parameters for jobs such as aspect ratio, variation and exclusions. When a camera word has little effect, replace it with a visible goal. “Low tabletop view with the top of the kettle still visible” is easier to inspect than a list of interchangeable photographic terms.

**Why does a pasted prompt throw an invalid parameter error?** Run the subject description by itself. Check which version is selected and add settings back one at a time. Put the flags at the end and use two regular hyphens to start each flag. A tutorial may target a different version and include a flag or combination that the current model handles differently. If you used rich text to copy the prompt, retype any suspect punctuation and check the allowed setting in the official parameter list.

**What does “the sum of all prompt weights must be positive” mean?** In models that support multi-prompt weights, Midjourney adds the weights assigned to your prompt parts. A positive subject weight of 1 and a negative weight of minus 2 give a total below zero. Keep the total above zero, or remove the weight syntax and describe the simple composition directly. Check the model compatibility before putting old double-colon syntax into a new prompt. [Midjourney Multi-Prompts and Weights](https://docs.midjourney.com/hc/en-us/articles/32658968492557-Multi-Prompts-Weights)

**Can I use a generated still as a reference for the next shot?** Save a clean copy with enough room around anything that needs to move later. Keep its model and settings with the file so you can reproduce the look as closely as the workflow allows. If you use it in a video tool, check whether the upload acts as a first frame or as a visual reference. That choice affects how much of the original image the next shot can carry forward.
