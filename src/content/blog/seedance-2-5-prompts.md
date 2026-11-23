---
slug: seedance-2-5-prompts
title: "Seedance 2.5 Prompts for References, Keyframes, and Edits"
seoTitle: "Seedance 2.5 Prompts for References, Keyframes, and Edits"
description: "Copy three Seedance 2.5 prompts for asset references, first and last frames, and a local video edit. Check timing, framing, and continuity before export."
publishedAt: 2026-11-27
readTime: "8 min read"
author: "Seedances Editorial Team"
category: "AI Video Guides"
eyebrow: "AI VIDEO GUIDES"
heroDescription: "Copy three Seedance 2.5 prompts for asset references, first and last frames, and a local video edit. Check timing, framing, and continuity before export."
coverImage: "/uploads/blog/seedance-2-5-prompts/cover.jpg"
coverAlt: "A greenhouse storyboard plans one shot around a square brass lantern."
coverCaption: "Editorial illustration. A greenhouse storyboard plans one shot around a square brass lantern."
ctaHeading: "Explore Seedance video prompt settings"
ctaLabel: "Explore the Seedances video planning preview →"
ctaHref: "/seedance-ai-generated"
featured: false
draft: false
contentMode: "markdown"
---

A shot can look right until you pause it. The rain reads, the camera moves smoothly, and then the square brass lantern you supplied turns into a round lamp. The fix starts with a question you can answer before opening the prompt box. Did you want Seedance to borrow an object from a reference, start on a particular image, or repair an existing take? Each job calls for a different input.

This guide uses one greenhouse scene for all three. You'll direct a gardener with separate references, move between two planned frames, and change a single detail in a clip. The examples give you starting language and practical checks for judging a take. The controls described here come from [Runway's Seedance 2.5 documentation](https://help.runwayml.com/hc/en-us/articles/53542207042323-Creating-with-Seedance-2-5). If you use another interface, check which input roles and modes it exposes before pasting a prompt.

## Assign a job to each reference

![Separate reference images describe the gardener, setting, and lantern.](/uploads/blog/seedance-2-5-prompts/section-1.jpg)

*Separate reference images describe the gardener, setting, and lantern.*

Imagine a six-second shot in a rainy greenhouse. A gardener walks up to a potting bench, puts down a lantern, and pauses. Start with three pictures you can use: a clear portrait showing a short-haired adult in an ochre raincoat, a wide photograph of the greenhouse, and a plain product photograph of the brass lantern. Choose images where the relevant details are easy to see. The portrait can have an entirely different background because its job is to show the person and coat.

In Reference mode, insert the assets using the interface's reference labels. The example below uses Runway-style labels. Read back the chips or names before you submit. If the lantern ended up as the second asset, change the wording to match the actual assignment. A reference can guide the model but it does not act as a pixel lock. Check the lamp handle, the number of panes, and the hem of the coat afterward.

Watch the opera clip in [ByteDance’s Seedance 2.5 demonstration](https://seed.bytedance.com/en/blog/one-take-creation-flexible-referencing-introducing-seedance-2-5). Its prompt assigns the stage and the individual performers to numbered images. The camera opens close on a painted face and gold shoulder armor, then widens to show the ensemble. Look at the edge of the armor as more people enter the frame. That’s the kind of detail worth tracking in your own shot.

**Copy this prompt for a single shot with three references**

> Use @Image 1 for the gardener's face, short hair, and ochre raincoat. Use @Image 2 for the greenhouse layout and rainy window light. Use @Image 3 for the square brass lantern, including its straight handle and four glass panels. Start in a medium-wide shot with the potting bench on the right. From about 0 to 2 seconds, the gardener enters from the left with the lantern. From 2 to 4 seconds, she places it on the bench with one hand. From 4 to 6 seconds, she releases the handle and looks at the rain. The camera slides right slowly and settles as she puts the lantern down. Keep the raincoat and lantern design consistent throughout the shot.

Time ranges describe how you want to distribute the motion. Check the actual moment the lantern meets the bench. If it lands in the last half second, give the entry less work to do. Start the character closer to the bench and retain the rest of the prompt. Motion through several steps takes time, and a clear starting position can do more for the pace than adding three instructions about speed.

If the character takes on details from the background reference, inspect that input for other people. Crop distracting subjects out of reference photos you control before trying again. If the lantern changes whenever it turns, choose a second angle only when that angle supplies genuinely useful information. Two nearly identical pictures can make it harder to diagnose which one is driving the result. Decide what each additional image contributes before uploading it.

## Connect a first frame and a last frame

![Two matching frames show the lantern before and after it lights up.](/uploads/blog/seedance-2-5-prompts/section-2.jpg)

*Two matching frames show the lantern before and after it lights up.*

Use Keyframe mode when the way the shot opens or closes matters to the edit. For the greenhouse example, prepare two horizontal stills from the same camera position. In the first the lantern sits unlit on the bench. In the second it gives off a warm, modest glow. Keep the lantern in the same place and match the crop, horizon, and major edges. If one frame shows more of the bench than the other, a camera move can creep into a shot you meant to hold steady.

Before exporting the stills, layer them in an image editor and toggle between them. Look at the feet of the bench and the horizontal window bars. Any jump you can see now becomes another transition the model may have to invent. Reframe or remake the still that differs. Resize both to the proportions you want to deliver so the framing decision happens while you can still see what you are cutting off.

**Copy this prompt for the greenhouse transition**

> Begin on the dark lantern in the first frame. Inside the lantern, a faint amber light appears, then gradually fills the glass panels. A small warm reflection grows on the wood immediately below it. End with the lantern and reflection at the intensity shown in the last frame. The camera holds its position and the greenhouse stays still apart from rain on the window.

Play the transition twice. First follow the reflection. You want it to follow the rising light instead of jumping from one side of the bench to the other. Then follow one hard edge of the lantern or window. If it bends while the light changes, the generator may be trying to reconcile different layouts in the input stills. Align the stills and rerun the same sentence. That narrows the problem to the one change you made.

Look at the actual frame fields before assuming both images are in use. An interface can accept two pictures as references without assigning one to the beginning and the other to the end. When you have access to a first-frame field only, prompt the desired change and treat the target still as your own visual guide. If a precise endpoint matters more than a fluid transition, finish on the still in your editing timeline and choose a cut that feels intentional.

## Edit one visible detail in an existing take

![A red cloth strip marks the one detail to revise on the lantern.](/uploads/blog/seedance-2-5-prompts/section-3.jpg)

*A red cloth strip marks the one detail to revise on the lantern.*

Suppose the chosen take works, but the cloth tied to the lantern handle needs to become red. Save the original, duplicate the clip in your project, and isolate the shot containing the prop. Runway's documented Edit mode works with an uploaded source video and matches its duration and aspect ratio. Matching those settings helps the clip fit back into the timeline. Surrounding details still need visual review.

**Copy this prompt for a local revision**

> Change the small green cloth strip tied to the brass lantern handle to muted brick red while it is visible. Preserve the knot and the way the cloth moves. Keep the lantern brass, the gardener's coat ochre, and the rainy window light steady. Preserve the camera movement, framing, and shot timing.

Pick two inspection frames before submitting. Choose one where the knot is clear and one where a hand partially covers it. A plausible edit on the first frame can still smear across the fingers in motion. Compare both frames with the source. Then play the full shot at normal speed and check whether the red appears elsewhere. If you see color creep across the lantern or coat, narrow the description to the strip beneath the handle and try a shorter excerpt where the strip is easiest to follow.

If the tool offers an edit sketch or another way to anchor the change to a source frame, place it on a frame with a clear view of the cloth. Keep the nearest surrounding cuts in your editing timeline. Replace the isolated shot and inspect the joins, especially the hand positions and lighting. For a precise color revision with a clearly trackable object, a mask and targeted color correction can give you control over the area being changed.

Plan the framing and duration of a text-first shot in the [Seedances.co settings preview](/seedance-ai-generated). For reference, keyframe, and video edits, open a Seedance 2.5 interface with those controls.

## Frequently asked questions

![Reference prints and a storyboard help organize the assets before generation.](/uploads/blog/seedance-2-5-prompts/section-4.jpg)

*Reference prints and a storyboard help organize the assets before generation.*

**How do I bind multiple references in one Seedance 2.5 prompt?** Add the files in a mode that supports references. Insert each asset's on-screen label into the prompt and give it a specific job. Assign one image to an actor's appearance, one to the set, and one to a prop. If you add an audio or video reference, say which timing, action, or sound you are borrowing. Check whether the working interface supports that reference type.

**Why is the aspect ratio fixed when I use frames or video?** In BytePlus ModelArk, an explicit first frame sets the output ratio. The service can stretch the last frame if its proportions differ. Runway documents a ratio control in its Seedance 2.5 Keyframe mode and matches the source ratio in Edit and Extend. Prepare both stills in matching proportions and check the crop before generating. [BytePlus ModelArk prompt guide](https://ai.byteplus.com/ark/region:ap-southeast-1/docs/seedance-2-5-prompt-guide)

**How can I change one detail while protecting other shots?** Work on a duplicate of the affected shot outside the complete sequence. Give the model one change, then inspect the target, nearby surfaces, motion, and the incoming and outgoing cuts. If the material includes dialogue or production sound, keep that audio from your original timeline when the generated version changes it. Replace only the approved segment.

**Do timestamps guarantee exact frame timing?** Use them to communicate the order and pacing of visible actions. Inspect when the action lands in the result. If the beat has to hit a specific music cue or cut, use the editing timeline to set that cue precisely. When the shot still needs several conflicting adjustments, shorten the requested action or generate two simpler shots.
