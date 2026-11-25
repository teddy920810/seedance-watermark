---
slug: image-to-video-prompts
title: "Image-to-Video Prompts for Natural Motion"
seoTitle: "Image-to-Video Prompts for Natural Subject and Camera Motion"
description: "Give a still photo believable motion with copyable prompts for a locked camera, a slow push-in, and first-to-last-frame transitions. Check each shot before export."
publishedAt: 2026-12-03
readTime: "8 min read"
author: "Seedances Editorial Team"
category: "AI Video Guides"
eyebrow: "AI VIDEO GUIDES"
heroDescription: "Give a still photo believable motion with copyable prompts for a locked camera, a slow push-in, and first-to-last-frame transitions. Check each shot before export."
coverImage: "/uploads/blog/image-to-video-prompts/cover.jpg"
coverAlt: "A paper pinwheel and a fixed windowsill give a short shot one moving subject and a stable landmark."
coverCaption: "Editorial illustration. A paper pinwheel and a fixed windowsill give a short shot one moving subject and a stable landmark."
ctaHeading: "Translate a still image into a motion brief"
ctaLabel: "Explore the Seedances video planning preview →"
ctaHref: "/seedance-ai-generated"
featured: false
draft: false
contentMode: "markdown"
---

Put a red paper pinwheel in a jar, take a picture, and ask a video model to “bring this scene to life.” You might get a spinning pinwheel. You might also get a jar that slides across the sill while the window moves toward you. All three movements satisfy the request. Only one belongs in the shot you had in mind.

A strong image-to-video prompt makes that choice explicit. Decide what moves, what stays put, and where the movement should end. Start with an action small enough to read in a single glance. The examples below use ordinary objects you can photograph yourself. You can copy the wording, change the object, and judge the resulting clip against a visible cue.

## Read the still before you write the movement

![Leave space above the cup for rising steam when composing the starting photo.](/uploads/blog/image-to-video-prompts/section-1.jpg)

*Leave space above the cup for rising steam when composing the starting photo.*

Look at your picture as if it were the first frame of a movie. Find the edges where an object meets the background. Find a landmark near the middle and another near a corner. These are your measuring points. In the pinwheel photo, the jar rim and the window latch make good landmarks. If the latch slides while the blades turn, the camera or room is moving too.

Choose a photo that gives the intended action somewhere to go. For a curtain lifting in a breeze, include the lower edge and some empty wall beside it. For a dog looking toward a doorway, leave space on the doorway side. If the animal’s nose already touches the border, a head turn asks the model to invent part of the room outside the picture. Reframing your original can be cheaper than generating take after take.

Look for physical clues that contradict the request. A splash frozen above a glass hints that something is falling. A scarf streaming sideways suggests wind. If you ask for absolute calm, the source and the motion instruction pull in different directions. Try a quieter source photo before adding more adjectives. [Runway’s image-to-video guide](https://help.runwayml.com/hc/en-us/articles/48324313115155-Image-to-Video-Prompting-Guide) also explains how directional blur or a mid-action pose can affect the movement a model produces.

For a published input-and-output example, open the table in [Runway’s motion guide](https://help.runwayml.com/hc/en-us/articles/48324313115155-Image-to-Video-Prompting-Guide). Find the climber on a giant soda can. Watch the can’s rim as the view closes in, then follow the climber separately. That exercise helps you tell camera travel from subject motion before trying your own shot. The pinwheel illustrations here depict the exercise setup.

Write a one-sentence shot description in a notebook. For the pinwheel, that might be “The blades turn a quarter turn clockwise while the glass stays on the sill.” You can now point to the expected change in two frames. If you cannot describe that difference, simplify the shot before opening the generator.

## Keep the camera still and animate one element

![Our Wan 2.2 locked-camera sample. Watch the ribbon tip while using the window and wheels to check the camera.](/uploads/blog/image-to-video-prompts/section-2.jpg)

*Our Wan 2.2 locked-camera sample. Watch the ribbon tip while using the window and wheels to check the camera.*

Steam rising out of a coffee cup is a forgiving first exercise. The ceramic rim gives you a clear boundary. Steam can change shape without looking broken. Start with a cup against a darker background so you can actually see the movement. Upload it through the service’s image-to-video or starting-frame input. Check that the preview shows the intended crop.

**Copy this for a locked shot**

> A thin ribbon of steam rises from the center of the cup and curls gently to the right. The mug rests on the table throughout. The camera holds the original framing from beginning to end.

Play the clip once looking only at the steam. Then watch the handle. If the steam looks convincing but the handle grows wider, the shot has a shape problem. A practical second attempt is a shorter movement with fewer changes in density. You can also choose a plainer handle or a source with clearer edges. Both changes make the object easier to recognize between frames.

Now change the task to background-only movement. Use a still of a chair beside a window with a visible curtain. Try, “The chair stays in place. A light breeze lifts the bottom corner of the curtain and lets it fall. The camera stays at the original height and angle.” Watch the front foot of the chair against the floor seam. Even a small slide becomes obvious when two hard edges meet.

Try two directions with the opening pinwheel photo. In one version, ask for a quarter turn of the blades while the camera holds. In the other, keep the blades still and ask the sheer curtain behind the jar to lift and settle. Use the same input, crop, and clip length. Compare the rim and window latch at the same points in both clips. They should serve as fixed landmarks.

We used one bicycle image and seed for three takes. With a locked camera, the ribbon blew sideways and fell back while the wheels stayed put. With a push-in, the front wheel grew until the frame cut through it. When we asked the bike to roll right, it crossed the window edge, but that edge drifted left. Compare the bike against the window to judge subject motion. Compare the window against the screen to judge camera motion.

## Move the camera with a destination in mind

![The same bicycle and seed with a push-in. The front wheel is cropped by the last sample.](/uploads/blog/image-to-video-prompts/section-3.jpg)

*The same bicycle and seed with a push-in. The front wheel is cropped by the last sample.*

A push-in can make an ordinary object feel important. It can also crop out the one detail viewers need. Before writing a camera instruction, draw a smaller rectangle inside your starting image. Would that tighter frame still contain the subject, the handle, and the reflection you care about? This quick sketch tells you whether to request a modest push or leave the camera alone.

**Copy this for a product detail**

> Start with the entire toy sailboat visible on the table. Move the camera slowly toward the painted bow. Finish with the bow and front edge of the sail still in frame. The boat remains stationary, and the table stays level.

That prompt gives the camera both a destination and a boundary. Watch the mast against a vertical line in the background. If the mast bends while the wall stays vertical, surface geometry is changing. If every object grows uniformly and the perspective stays the same, the result may read as a digital zoom. Decide whether that matters for your use. A gentle crop can work perfectly well for a slideshow. A product demo that needs to show the shape of the hull calls for closer inspection.

When you need a pan, describe the start and end of the framing. “Pan right” is easy to interpret from the operator’s position or as a request to move the subject. Try “Begin on the boat at the left edge of the workbench. Turn the camera right until the brass compass beside it sits in the center.” Only use this when the compass is visible or the model has a suitable reference. Otherwise you are asking it to design a new prop during the move.

Try the pinwheel photo again with a slow push toward the hub and still blades. Check how the jar and latch move in relation to each other. For a new shot described in text, [Seedances.co’s settings preview](/seedance-ai-generated) can help you plan framing and duration. Use a starting-frame input for the photo exercises.

## Connect two frames and inspect the transition

![Two photos of the same door preserve the camera angle while the opening changes.](/uploads/blog/image-to-video-prompts/section-4.jpg)

*Two photos of the same door preserve the camera angle while the opening changes.*

Suppose the first photo shows a red door open a crack and the last shows the same door halfway open. The easiest transition is a swing around the existing hinges. Take both photos from the same spot and keep the crop steady. [Vidu](https://www.vidu.com/ai-image-to-video) documents a first-and-last-frame mode. Check that you see both slots in your selected mode before uploading. If the second photo comes from the other side of the hallway, the model must solve a camera move and a door movement at the same time.

**Copy this when your interface accepts both frames**

> The door swings slowly inward around the hinges on its left edge. The handle follows one smooth arc. Hold the camera in the same hallway position. Ease into the final opening angle shown in the end frame.

Compare the doorframe in the first, middle, and last moments. A convincing final picture can hide a handle that jumps halfway through. Check the floor line as well. If it bows toward the viewer, try a smaller difference between the two opening angles. A simpler pair of endpoints gives the model a shorter visual distance to bridge.

When the interface offers just one image input, treat the second photo as your own editing reference. You can describe the destination, but a text description cannot lock an exact final frame. For a shot that must end on a particular composition, use a mode that accepts an end frame or cut to the still in your editor. A clean cut on the sound of the latch can feel deliberate and spare you a distracting last-second morph.

## Frequently asked questions

![The bicycle advances to the right while the window slides left. The kickstand remains down. Frames 0, 26, and 52.](/uploads/blog/image-to-video-prompts/section-5.jpg)

*The bicycle advances to the right while the window slides left. The kickstand remains down. Frames 0, 26, and 52.*

**Why is my picture barely moving?** Check the crop and the scale of the action. A tiny leaf moving in a wide landscape may be changing more than you realize. Watch at the final display size. Give the action a clear destination or use a closer source. Change one of those variables at a time so the next take teaches you something.

**How do I keep the subject still while only the background moves?** Name the stationary subject and give the background one visible job. In a portrait, a curtain lifting behind the person is easier to assess than a general breeze through the room. Compare the eyes and shoulder line across frames. If likeness matters more than the background animation, you can keep the portrait static and animate a separate background layer in an editor.

**Why does the end frame look wrong?** Confirm that you used an actual last-frame input. Some upload fields accept a style or subject reference instead. Then inspect the two source crops side by side. Different proportions, lens angles, or lighting can create a difficult transition even when both inputs loaded correctly.

**How do I know when to stop generating?** Watch the clip at normal speed, muted, and in the crop you intend to publish. Can a viewer identify the intended action without reading the prompt? Does the anchor object stay recognizable? If both answers are yes, save the take. A small trim at the beginning or end often improves the edit more than another round of generation.
