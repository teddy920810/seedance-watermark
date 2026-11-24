---
slug: krea-regional-prompting
title: "Krea Regional Prompting for Local Image Edits"
seoTitle: "Krea Regional Prompting for Local Image Edits"
description: "Use Krea 2 to plan image regions or Krea Edit to change specific areas. Follow examples for color, cleanup, annotations, and photo repair."
publishedAt: 2026-11-30
readTime: "8 min read"
author: "Seedances Editorial Team"
category: "AI Image Guides"
eyebrow: "AI IMAGE GUIDES"
heroDescription: "Use Krea 2 to plan image regions or Krea Edit to change specific areas. Follow examples for color, cleanup, annotations, and photo repair."
coverImage: "/uploads/blog/krea-regional-prompting/cover.jpg"
coverAlt: "A muted green cushion sits behind a ceramic mug in an image prepared for a newsletter."
coverCaption: "Editorial illustration. A muted green cushion sits behind a ceramic mug in an image prepared for a newsletter."
ctaHeading: "Plan a shot from your finished composition"
ctaLabel: "Explore the Seedances video planning preview →"
ctaHref: "/seedance-ai-generated"
featured: false
draft: false
contentMode: "markdown"
---

You finally have an image that works. The ceramic mug catches the light, the table has texture, and the composition leaves space for your newsletter headline. But the yellow cushion in the background draws your eye away from the mug. Describing a new cushion in the prompt for an entire new generation can give you a better cushion and a different picture. If you need to keep that specific composition, open the existing image in Krea Edit and tell the region tool exactly where the change belongs.

## Quick Answer

![The cushion is the edit target. The mug and table provide unchanged reference points.](/uploads/blog/krea-regional-prompting/section-1.jpg)

*The cushion is the edit target. The mug and table provide unchanged reference points.*

People searching for Krea 2 regional prompting can mean two different tasks. One is writing a prompt that places objects in different parts of a new image. The other is selecting a location in an existing image and editing it. The first uses ordinary positioning language. The second uses a brush, rectangle, object selection, or annotations inside Krea Edit. The tools give you different ways to handle the same visual idea.

## Choose between Krea 2 prompting and a local edit

![A tabletop composition uses the mug, cushion, and open wall as three spatial anchors.](/uploads/blog/krea-regional-prompting/section-2.jpg)

*A tabletop composition uses the mug, cushion, and open wall as three spatial anchors.*

Use Krea 2 for a new composition when you can accept a different arrangement of the scene. Name each object once, provide an anchor such as the left edge of the table, and specify which elements overlap. A prompt with “on the right” in three different sentences can make it harder to tell which object belongs there. Write the spatial relationships in a single pass from foreground to background.

> A ceramic mug sits on the left side of an oak table in the foreground. Behind the mug, a single sage-green linen cushion rests against a bench on the right. A plain cream wall fills the upper third. Window light falls across the table from the left.

A style reference in Krea 2 can steer color, texture, and other aesthetic traits in a new generation. For instance, use an owned reference photograph of matte linen to show the quiet look you want. Inspect whether the wardrobe, props, or composition from the reference carry into the new generation. If they do, lower the style reference influence if that control is available, or replace the reference with a closer view of the texture. Krea's own Krea 2 guidance describes style references and moodboards for generation. It does not describe painting a mask onto the original photo as a Krea 2 prompting control. [Krea 2 prompting guide](https://www.krea.ai/blog/krea-2-deep-dive-walkthrough)

Use Krea Edit when you have a particular image and know where you want to work. Open an existing generation in the editor or upload your own image. Save the starting file so you can compare it with the output independently of the edit history. In the mug scene, the cushion is one obvious area, and the mug should stay in place. The existing image gives the editor far more information about the table, window light, and camera angle than you would want to type again. [Krea Edit guide](https://www.krea.ai/blog/krea-edit)

In [Krea Academy’s regional edit](https://www.krea.ai/enterprise/academy/intro-to-krea), a cream sofa becomes green velvet while the window, table, and plants remain in place. Look at the line where the table overlaps the seat. An edit can pass the color check and still spoil that edge.

**If you searched for the ComfyUI regional canvas**

The community Krea2 Regional Builder serves a third task. It assigns text to drawn regions while generating a new image in ComfyUI. In a compatible setup, open its example workflow and start with a shared prompt for the room and overall lighting. Draw one region over the table and another over the window. Give each region its own short object description, then run the included Apply Regional and sampler chain. Compare the region boundaries and check that each object appears where you drew its region. A website edit is the simpler option when you already have a picture and just need to replace one object. [Community workflow and compatibility notes](https://github.com/januspluto/ComfyUI-Krea2-Regional)

## Select the smallest useful area and describe the change

![A hand compares two versions of the cushion area before choosing a local edit.](/uploads/blog/krea-regional-prompting/section-3.jpg)

*A hand compares two versions of the cushion area before choosing a local edit.*

Krea documents three region selection options in its editor. A rectangle works for a patch that sits apart from everything else, such as an area of bare wall. The brush gives you a way to trace around an irregular object or defect. Auto-select is useful when the object has a clear outline and you can check the selected area before applying the edit. For the cushion, review whether the selected region includes both the fabric and the seam where it meets the bench. Handle any overlap with the mug as a boundary you need to inspect afterward.

**Change a fabric color**

> Recolor the selected cushion to muted sage green. Keep its folds, stitching, and size. Match the soft window light and retain the existing shadow along the bench seam.

This prompt gives the edit a target, a property to change, and three physical details to preserve. Notice what it leaves out. The shape of the mug, the oak grain, and the layout are already in the image. If a first pass changes the fabric and flattens the folds, run a smaller edit from the original and focus on the cushion surface. Save a successful result before asking for a second change.

**Remove a small distraction**

> Remove the torn paper tab from the selected patch of wall. Continue the existing cream paint texture across the area and match the soft shadow to its left.

Removing a small object gives the model part of a surface to reconstruct. If the object crosses a strong line, such as the edge of a window frame, capture enough of that line in the region for a plausible continuation. Check it at normal view and at a close zoom. One crooked line that hides at full width can become obvious when the image appears behind larger type.

**Repair a mark in a scanned photo**

> Reduce the white scratch in the selected area. Extend the surrounding fabric pattern softly across the mark. Preserve the nearby button, the photograph's grain, and the original tones.

Start from a duplicate scan. In [Krea’s family picnic example](https://www.krea.ai/apps/enhance), the turquoise wagon and the four people stay in place. The plaid blanket sharpens into a distinct grid. That makes it easier to read the scene, but newly drawn facial detail cannot establish what a sitter actually looked like. Compare at equal zoom and keep the original scan.

## Use annotations for separate changes and inspect the result

![Two separate areas of a print are marked for color and background cleanup.](/uploads/blog/krea-regional-prompting/section-4.jpg)

*Two separate areas of a print are marked for color and background cleanup.*

A single edit is the easiest way to learn what the selected area covers. Once you have several clearly separated fixes, Krea Edit annotations let you draw rectangles around their regions and write a prompt for each. Krea also documents attaching a reference to an individual annotation as a visual guide for that region. You can use a file showing the shade of fabric you want without asking it to guide the whole composition. [Krea's annotations guide](https://www.krea.ai/blog/annotations)

Imagine that the mug shot needs the cushion color changed and a paper tab removed from the wall. Add one annotation for the cushion, then a separate one for the tab. Use a short prompt in each card. If the two regions overlap, edit them in sequence. Overlap makes it harder to tell which request produced a visible change and can complicate retries. Start with the larger edit, approve its boundaries, then handle the smaller correction on that version.

Seedream is another option within Krea. Krea lists Seedream 5.5 for both its Image and Edit tools. Pick it only if the editor you are using exposes the model and the input mode you need. To see whether it helps with a particular scratch or object, reuse the same source and prompt, and keep the selection as close to the first attempt as the interface permits. Compare the results on the one property that matters and keep the version with the strongest edge continuity. [Krea's Seedream model page](https://www.krea.ai/models/seedream-5-5)

If the mug scene becomes a short video, describe the finished color and the movement you want in [Seedances.co’s text-to-video settings preview](/seedance-ai-generated). Set the intended frame shape there. Keep the actual mask and source image in Krea for any further still-image edits.

## Frequently asked questions

![An original scan and its repaired copy stay side by side for review.](/uploads/blog/krea-regional-prompting/section-5.jpg)

*An original scan and its repaired copy stay side by side for review.*

**Can I use a mask in Krea 2 regional prompting?** Krea's Krea 2 prompting docs describe generation controls such as text, style references, and moodboards. For a visible selection on a specific existing image, open Krea Edit. Use its brush, rectangle, or object selection according to the edge you need to control.

**Why did my edit spill outside the area I expected?** Begin by comparing the source and the version at the same scale. A change in the material at the edge can make a nearby shadow look different. Confirm that the selected area excludes any objects you want to keep, write a narrower instruction, and try one change from the source. Then review the edge in the exported image.

**Should I edit every region in a single pass?** Use multiple annotations when the regions have enough space between them and you can describe each change independently. When one edit affects a shadow, reflection, or edge that the next edit depends on, check the first result before applying the second. You will have a clearer record of what caused each change.

**Will an edited scan recover detail that is gone from the original?** Local editing can fill a missing patch plausibly. You will need a second scan or another source of the same photo to verify what was there. Keep the original scan, protect recognizable features, and describe a generated patch as restoration when sharing details about how the photograph was prepared.

## Conclusion

![Inspect the repaired area beside the original at the same magnification.](/uploads/blog/krea-regional-prompting/section-6.jpg)

*Inspect the repaired area beside the original at the same magnification.*

For a final check, open the edited version beside the source at equal zoom. Look along the edited region first. Check folds, repeating textures, contact shadows, and abrupt shifts in color. Move to the parts you needed to keep, such as the mug rim and the angle of the tabletop. Review at the destination size too. A background patch that works on a phone may show a visible edge in a desktop banner. Export the version that holds up in the settings where you will use it.
