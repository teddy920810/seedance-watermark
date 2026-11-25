---
slug: wan-2-2-image-to-video-prompts
title: "Wan 2.2 Image-to-Video Prompts for Camera and Motion"
seoTitle: "Wan 2.2 Image-to-Video Prompts for Camera and Motion"
description: "Use the same starting image to try three Wan 2.2 prompts for subtle motion, a camera push, and faster subject action. Learn how to check drift."
publishedAt: 2026-12-04
readTime: "8 min read"
author: "Seedances Editorial Team"
category: "AI Video Guides"
eyebrow: "AI VIDEO GUIDES"
heroDescription: "Use the same starting image to try three Wan 2.2 prompts for subtle motion, a camera push, and faster subject action. Learn how to check drift."
coverImage: "/uploads/blog/wan-2-2-image-to-video-prompts/cover.jpg"
coverAlt: "The shared input for the three bicycle exercises. Track the ochre handlebar ribbon, wheel hubs, and window mullion."
coverCaption: "Editorial illustration. The shared input for the three bicycle exercises. Track the ochre handlebar ribbon, wheel hubs, and window mullion."
ctaHeading: "Plan a related shot in Seedance"
ctaLabel: "Explore the Seedances video planning preview →"
ctaHref: "/seedance-ai-generated"
featured: false
draft: false
contentMode: "markdown"
---

You upload a photo of a bicycle leaning against a storefront and ask for a slow camera move. The bike rolls away instead. The word “move” was clear to you because you were thinking like a camera operator. The image showed a bicycle with wheels and space to travel. Your prompt left both interpretations open.

## Quick Answer

![The ribbon and a mortar line offer two landmarks for a controlled motion test.](/uploads/blog/wan-2-2-image-to-video-prompts/section-1.jpg)

*The ribbon and a mortar line offer two landmarks for a controlled motion test.*

This Wan 2.2 image-to-video prompt guide uses one starting still for three jobs. You'll add a little wind, move the camera toward the stationary bicycle, and try a quicker subject move. Each example isolates a different kind of motion. The workflow details refer to ComfyUI’s native Wan 2.2 image-to-video template. If you are using a hosted interface, check its model label and available inputs before assuming the same controls will appear.

## Confirm which Wan 2.2 workflow you are using

![Check the original still and output framing before you generate.](/uploads/blog/wan-2-2-image-to-video-prompts/section-2.jpg)

*Check the original still and output framing before you generate.*

The Wan project publishes dedicated image-to-video weights under **I2V-A14B** and a smaller **TI2V-5B** model that supports text- and image-conditioned video. A text-to-video-only workflow uses a different input setup. Choose the documented **Wan2.2 14B I2V** template for this exercise. ComfyUI also maintains separate templates for the 5B model and first-to-last-frame work. These are useful once you know what your shot requires. They can change how your image is used and which settings you see. [Wan 2.2 repository](https://github.com/Wan-Video/Wan2.2) · [ComfyUI native workflows](https://docs.comfy.org/tutorials/video/wan/wan2_2)

In the 14B image-to-video template, load the starting still into **Load Image** and find the positive text encoder. Use the matching high-noise and low-noise **I2V** checkpoints from the official template instructions if you are setting it up locally. For a hosted version, keep the selected model and preset fixed across the three exercises. Open the [official ComfyUI workflow JSON](https://raw.githubusercontent.com/Comfy-Org/workflow_templates/main/templates/video_wan2_2_14B_i2v.json) if you want to inspect the graph before loading it. Its starting image feeds the generation subgraph, whose video output connects to Save Video. ComfyUI’s tutorial includes an input file you can use to check that the unmodified template runs on your setup. The bicycle scenes below are original practice prompts, and their illustrations show what to look for. Start with the template settings. If you adjust the frame count or output dimensions, write them down with the shot. For seed comparisons, set a fixed seed in your interface if it exposes the setting and can keep it stable across runs.

Use the bicycle still at the top of this article for all three prompts, or photograph a similar setup with a ribbon tied near the grip. Leave visible pavement in the direction the bike might roll. Keep enough of the wall in frame to use a mortar line as a reference. Hard lines help you spot the difference between the camera moving and the background changing shape. Shoot a photo you can use or create an original still and inspect it for preexisting errors in the spokes, frame, and handlebars.

View the projected crop before rendering. The [official Wan instructions](https://github.com/Wan-Video/Wan2.2) explain how its own image-to-video runner bases the aspect ratio on the input image. A ComfyUI template or hosted renderer can expose a different output size or crop behavior. Check the preview around the front wheel, the edge of the wall, and the empty pavement. Those edges matter more to the exercise than a round number in a settings box.

## Start with a subtle movement that is easy to inspect

![Frames 0, 26, and 52 in the fixed-camera run. The ribbon swings left and settles; the bicycle stays in place.](/uploads/blog/wan-2-2-image-to-video-prompts/section-3.jpg)

*Frames 0, 26, and 52 in the fixed-camera run. The ribbon swings left and settles; the bicycle stays in place.*

For the first take, keep both the camera and bicycle stationary. Ask the ribbon to move. It gives you one small visual detail to follow while the rest of the shot provides a consistency check. If the brick wall ripples in a locked frame, you can identify the problem even when the cloth moves convincingly.

**Positive prompt**

> One continuous locked shot of the green bicycle beside the brick storefront. A faint breeze lifts the loose end of the ochre ribbon tied to the right handlebar. The ribbon bends away from the grip for a moment and settles. The bicycle remains upright in the same place. The window edge and the brick wall stay steady in the frame.

Leave the default negative text alone on the first pass so you have a baseline. Watch the output at normal speed and then step through the movement. Find the knot at the start, halfway through, and near the end. If the knot disappears when the loose end lifts, repeat the shot with a simpler movement. “The ribbon tips slightly outward and returns” gives the model fewer new shapes to draw than a long flutter.

We ran that prompt on the r3gm Wan 2.2 I2V 14B demo using the bicycle at the top of this page. With seed 42, six steps and both guidance scales at 1, the returned clip held the wall and wheels nearly steady. At the midpoint the ribbon had blown almost horizontally to the left. By the end it was hanging down again. Follow its loose end rather than watching the whole bicycle.

<figure><video controls muted playsinline preload="metadata" aria-describedby="wan-locked-caption" style="display:block;width:100%;height:auto" src="/uploads/blog/wan-2-2-image-to-video-prompts/locked.mp4"><a href="/uploads/blog/wan-2-2-image-to-video-prompts/locked.mp4">Watch this motion example</a></video><figcaption id="wan-locked-caption">Fixed camera. The ribbon moves while the bicycle and storefront hold their positions.</figcaption></figure>

A clean cloth movement should read with the clip muted. Show the take to someone without sharing the prompt and ask what moved. If they notice the drifting storefront first, simplify the motion and try again.

If a breeze makes the whole bicycle move in your result, describe the stability in terms of physical contact. Try “Both bicycle tires stay planted on the same spots on the pavement.” This gives the wording a clear relationship to the picture. You can check the contact points even if the ribbon is small or becomes partially occluded.

## Compare a camera push with a faster subject move

![The same three frames from the push-in. The front wheel leaves the frame before the end.](/uploads/blog/wan-2-2-image-to-video-prompts/section-4.jpg)

*The same three frames from the push-in. The front wheel leaves the frame before the end.*

For the second take, use the same still, model, length, and crop. Describe a shift in viewpoint. You want the bike to occupy more of the frame while its tires remain at the same physical points relative to the wall. Keep the ribbon instruction out of this take so the camera action is the only deliberate source of movement.

**Positive prompt for a push-in**

> The camera pushes gently forward from its starting view toward the middle of the green bicycle, keeping the frame level. The parked bicycle stays alongside the wall. As the camera approaches, the handlebar and head tube occupy more of the frame. The move slows near the bike and stops before the front wheel is cropped.

Our push-in used the same input and settings. The bicycle grew smoothly in the sampled frames, but the front wheel ran out of frame despite the stopping instruction. For a second attempt, reduce the travel to a barely perceptible nudge or start from a wider photo. All three outputs contained 57 frames at 16 fps.

<figure><video controls muted playsinline preload="metadata" aria-describedby="wan-push-caption" style="display:block;width:100%;height:auto" src="/uploads/blog/wan-2-2-image-to-video-prompts/push.mp4"><a href="/uploads/blog/wan-2-2-image-to-video-prompts/push.mp4">Watch this motion example</a></video><figcaption id="wan-push-caption">Camera push-in. Watch the front wheel reach the edge of the frame.</figcaption></figure>

For the third take, give the movement to the subject and set a definite endpoint. A clean initial still should show both wheels and enough empty pavement. You can choose a simple camera angle that makes the wheel rotation easy to see.

**Positive prompt for quicker movement**

> Use a locked side view. The green bicycle rolls smoothly to the right along the wall for a short distance. Both wheels rotate in the direction of travel and stay on the pavement. The bike crosses the nearest window mullion and slows before the right edge of the frame. The storefront holds its position in the shot.

Use the movement of the hub against the brick pattern as a reference. Look for a sudden change in speed, wobbling wheels, or a tire appearing to slide. If the bike clips the edge, shorten its path. If the wheels buckle midway, try a slower action first and keep the camera fixed. Once you have a stable result, introduce faster movement in a separate pass.

You can storyboard an unrelated text-only scene in the [Seedances.co settings preview](/seedance-ai-generated). It is a Seedance 2.0 Fast prompt planning page. Use your chosen Wan workflow for the still-based tests and save each run with the matching model name, prompt, settings, and input.

In the rolling take, the front wheel crossed the window edge as requested. The kickstand stayed down, though, and the window slid left. The bike really did move relative to the bricks, but the camera also followed it. If you need a fixed viewpoint, compare the window corner with the edge of the screen. For more believable travel, start from a photo with the kickstand folded.

<figure><video controls muted playsinline preload="metadata" aria-describedby="wan-roll-caption" style="display:block;width:100%;height:auto" src="/uploads/blog/wan-2-2-image-to-video-prompts/roll.mp4"><a href="/uploads/blog/wan-2-2-image-to-video-prompts/roll.mp4">Watch this motion example</a></video><figcaption id="wan-roll-caption">Rolling bicycle. Watch the window slide left while the kickstand stays down.</figcaption></figure>

## Frequently asked questions

![Compare still frames before changing the prompt or settings.](/uploads/blog/wan-2-2-image-to-video-prompts/section-5.jpg)

*Compare still frames before changing the prompt or settings.*

**Do I need to describe everything already in my image?** Start with the motion, camera behavior, and details you need to track. Name the green bicycle so the model can identify the subject and name the ribbon if it is the part that moves. Leave the rest of the image to establish the scene unless an important detail keeps changing or two objects could fit the same instruction. A shorter prompt gives you a clearer basis for comparing runs.

**What should I change when the video jerks?** Identify what jerks and when. If the whole frame jumps at once, simplify the camera path and try a smaller movement. If the wheel shape changes, reduce the distance the bike travels or simplify the view. Compare clips with the same export frame rate. Where available, keep the seed fixed and change one variable at a time. Retain the last usable clip so you can see whether the change solved the issue.

**Where do negative prompts work?** In the native ComfyUI template, edit the negative **CLIP Text Encoder** used by the graph. First confirm you are editing the negative encoder and have not pasted the wording into the positive field. A hosted page with a single prompt box may provide no separate negative conditioning control. When the field is available, test one symptom at a time, such as “wobbling wheel rims,” against the default settings. Keep the positive movement instruction readable and check whether the change actually helps the shot.

## Conclusion

![The bicycle advances to the right while the window slides left. The kickstand remains down. Frames 0, 26, and 52.](/uploads/blog/wan-2-2-image-to-video-prompts/section-6.jpg)

*The bicycle advances to the right while the window slides left. The kickstand remains down. Frames 0, 26, and 52.*

When you name the files, include a short description of the intended movement. For example, use “ribbon only,” “camera push,” and “bike rolls.” Arrange the clips side by side in an editor and play them from the same starting point. The exercise is easier to judge when you can see which landmarks move in each version.
