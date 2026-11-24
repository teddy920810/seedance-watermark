---
slug: minimax-reference-prompting-guide
title: "MiniMax Reference Prompting Guide for Hailuo and H3"
seoTitle: "MiniMax Reference Prompting Guide for Hailuo and H3"
description: "Learn when to use a MiniMax subject reference or first frame. Compare prompts using the same photo and check motion, identity, and camera continuity."
publishedAt: 2026-12-01
readTime: "8 min read"
author: "Seedances Editorial Team"
category: "AI Video Guides"
eyebrow: "AI VIDEO GUIDES"
heroDescription: "Learn when to use a MiniMax subject reference or first frame. Compare prompts using the same photo and check motion, identity, and camera continuity."
coverImage: "/uploads/blog/minimax-reference-prompting-guide/cover.jpg"
coverAlt: "A rust-jacketed character stands beside flowers outside a neighborhood shop."
coverCaption: "Editorial illustration. A rust-jacketed character stands beside flowers outside a neighborhood shop."
ctaHeading: "Plan a shot around your reference"
ctaLabel: "Explore the Seedances video planning preview →"
ctaHref: "/seedance-ai-generated"
featured: false
draft: false
contentMode: "markdown"
---

You have a photo of your sister in a rust-colored jacket standing outside a flower shop. One video needs to open on that exact pavement, with the same window and row of buckets. Another only needs her character, now in a different shop with different light. Both jobs begin with the same picture. If you put it in the wrong MiniMax input, you may spend your next few attempts rewriting a prompt when the input mode is what needs to change.

## Quick Answer

![A wide source photo and a character portrait serve different input roles.](/uploads/blog/minimax-reference-prompting-guide/section-1.jpg)

*A wide source photo and a character portrait serve different input roles.*

Use a first frame when the uploaded composition defines the opening. Use a subject or image reference when the image guides who or what appears in a newly described scene. Then use the prompt to tell MiniMax which details you want to carry over, what happens, and where the camera goes. This guide uses one flower-shop photo to make those choices easy to compare.

## Check what the image slot does before you write

![A source portrait gives the character room to move beside the row of flower buckets.](/uploads/blog/minimax-reference-prompting-guide/section-2.jpg)

*A source portrait gives the character room to move beside the row of flower buckets.*

Open your MiniMax video tool and look at the selected model and the label beside the attachment slot. MiniMax Design describes a video workflow with prompts, images, and reference videos. It lists multiple model options. MiniMax's H3 documentation makes a more specific distinction. H3's first-and-last-frame variant can begin or end on a provided frame. Its omni-reference variant can use image, video, and audio references for tasks that include subject and motion guidance. Match the job to the model and attachment roles your screen offers. [MiniMax Design video generator](https://design.minimax.io/tools/ai-video-generator) · [MiniMax H3 documentation](https://design.minimax.io/h3)

Hailuo model names have their own history. MiniMax announced S2V-01 as a subject-reference model designed to guide character identity from one image. The company also separately documented Hailuo 02 start and end frames on web and mobile. Those pages explain why some Hailuo guides say “Subject Reference” while others say “Start Frame.” Look at what your selected Hailuo model accepts today before following steps for an older one. [MiniMax S2V-01 announcement](https://www.minimax.io/news/s2v-01-release) · [Hailuo 02 start and end frames](https://www.minimax.io/news/minimax-hailuo-02-start-end-frames-feature-is-now-live)

For the flower-shop example, use a picture with permission from the person in it. Look for a clear face, unobstructed shoulders, and enough space on the right if the character will take a step in that direction. Keep the original file beside the output. Write down the model, first-frame or reference mode, and displayed aspect ratio and duration. That record matters when you run a second version. If you change the model and the prompt at the same time, your comparison can tell you which clip you prefer, but it cannot tell you which change fixed the problem.

Look at the original before deciding which parts of the scene matter. If you promised the florist that the clip would show their existing storefront, use the first frame and check the shop as the camera moves. If you are building a fictional series with a recurring person, select a subject-reference workflow and describe the new place. Your prompt has a different job in each mode.

## Animate from the original composition or start in a new place

![Two settings illustrate how the same person can guide a new composition.](/uploads/blog/minimax-reference-prompting-guide/section-3.jpg)

*Two settings illustrate how the same person can guide a new composition.*

For the first-frame run, upload the flower-shop picture to the first-frame slot. Describe the movement that should follow. The photo already supplies the shop, subject, and opening camera angle. If you need to call out a detail that must stay stable, name it briefly. A full rewrite of the storefront gives the model lots of new decisions about a setup you already have.

**First-frame prompt**

> Start from the attached flower-shop photo. The person in the rust jacket glances toward the flowers, takes one small step to the right, then stops near the metal bucket. Hold the opening camera angle at eye level. Keep the shop window and the row of buckets in place. The light stays soft and overcast.

Review the opening frame and pause halfway through the step. Check whether the window edges remain straight, the jacket retains its shape, and the face stays recognizable. If the bucket changes position, try the same shot with a smaller step. If the face changes when the person turns, use a source photo closer to their intended final head angle. Record what you changed so the next generation answers one question.

For the subject-reference run, use the same source photograph in a model and mode that accepts an image as a subject reference. The task now is to place the subject in a new scene. Define where the shot opens so the model can interpret which details belong to the picture and which belong to the new setting.

**Subject-reference prompt**

> Use the attached person as the character reference. Keep the character's recognizable facial features, hair, and rust-colored jacket. Show the character beside a flower stand inside a covered market. From a steady eye-level medium shot, the character turns slightly toward the stand, takes one small step right, and stops beside a metal bucket. Warm light filters down through the covered market roof.

Look for details from the old storefront appearing inside the market. If the original window leaks into the new scene, try a tighter crop of the source person and keep the new location specific. If the new background looks right but the character drifts, simplify the motion and describe the facial angle. Compare identity with the reference and composition with the written brief. In first-frame mode, the whole source image helps define the opening. The subject-reference run should carry the selected person's appearance into the different composition.

## Add a camera move after the basic shot works

![A restrained camera push keeps the character and foreground bucket in view.](/uploads/blog/minimax-reference-prompting-guide/section-4.jpg)

*A restrained camera push keeps the character and foreground bucket in view.*

Watch the wheels in [Opper’s same-reference comparison](https://opper.ai/blog/video-models-reference-images-first-last-frames). The publisher gave MiniMax H3 and Grok Imagine the same mint-green ice cream van and asked for a pullback on a beach. In the five-second previews we reviewed, H3 began close to the grille and ended with children and shoreline surrounding a smaller van. Grok began wide and moved toward the service window. Both kept the vehicle recognizable. Only one followed the requested direction in these takes. Check the first and last frames separately for identity and camera direction before changing your reference.

A small camera move is easier to judge after you have a clip in which the character takes the intended step. To add a push-in, write where it starts, what starts it, and which subjects must still fit when it stops. In the first-frame prompt, change only the camera instruction. You could write, “The camera holds its opening angle as the character takes the step. Once the character stops, the camera pushes in slightly, keeping the head, shoulders, and nearest bucket visible.” Keep a copy of the fixed-camera version.

Watch the difference between the starting frame and the last clear moment. When the camera moves sideways without being asked, compare the lines of the window and the edge of the flower bucket. If both drift together, the camera moved. If only the bucket warps, the generated object's geometry changed. Make the next revision match the diagnosis. A shorter movement can help with drift, while a shorter step or fewer props in the shot can help with object consistency.

Some MiniMax interfaces propose camera controls or a model with named presets. MiniMax documented preset camera controls for the Hailuo 01 Director family. Other documentation describes natural language and references. Use the instruction format supported in the selected interface. A useful plain-language version gives one direction and one endpoint, whether your editor offers a preset or only a text field. [MiniMax Hailuo Director announcement](https://www.minimax.io/news/01-director)

If the clip needs to end in an exact composition, check for a first-and-last-frame mode. Supply an ending image with a compatible crop and view, then describe how the subject gets from one position to the other. Start with a scene that can be traversed in one motion. A pair of matching frames of someone standing a step apart is a simpler request than a pair of different outfits, lighting conditions, and camera angles in the same shot. Watch the middle of the video for a jump or stretch even when the endpoints look right.

To sketch a separate text-first shot after the reference clip, write its first visible action in [Seedances.co’s text-to-video settings preview](/seedance-ai-generated) and choose the frame shape. Save the actual image-input settings and the matching reference still with your Hailuo project.

## Frequently asked questions

![A contact sheet makes it easier to check face, jacket, and window details across frames.](/uploads/blog/minimax-reference-prompting-guide/section-5.jpg)

*A contact sheet makes it easier to check face, jacket, and window details across frames.*

**Which actions should I put in a MiniMax video prompt?** Describe visible events in order. For a short clip, one head turn and one step are enough to test whether the person and background remain stable. Put a pause or settling position at the end if you need a clean moment for a cut. Camera direction belongs in its own sentence so you can revise it separately.

**Does MiniMax require a negative prompt?** Start with a positive description that names the composition and motion you want. If a tool shows a separate negative-prompt field, follow its model-specific guidance. If it offers only a regular prompt, words like “fixed eye-level shot” and “window stays in place” give you a more precise instruction than a long list of prohibited movements.

**Can the same image work as both a reference and a first frame?** Yes, when your selected modes accept it. Test under comparable conditions by reusing the same image, core motion, aspect ratio, and duration where possible. Write down the role you chose each time. Judge the first-frame run by continuity with the uploaded composition and the subject-reference run by likeness in the scene you described.

**Why is the character recognizable in the first frame and different halfway through?** A profile change, a moving camera, or a passing object can make it harder for the generation to carry those details through. Pause near the first visible change. Try a shorter motion, a clearer reference, or a fixed camera. If you need the person to be continuously recognizable, reject a take where the face drifts even if the background and lighting look good.

## Conclusion

![Compare the framing and the seller’s appearance at the cut.](/uploads/blog/minimax-reference-prompting-guide/section-6.jpg)

*Compare the framing and the seller’s appearance at the cut.*

Review the new material on a timeline if it needs to cut against other footage. Put the source photo before the generated clip and play across that join. A new crop may be acceptable in a reference shot but distracting in a shot that promises to begin from the attached frame. Save the first-frame and subject-reference versions with different file names so they stay easy to compare.
