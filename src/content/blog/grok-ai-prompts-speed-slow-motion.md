---
slug: grok-ai-prompts-speed-slow-motion
title: "Grok Imagine Motion Prompts"
seoTitle: "Grok Imagine Motion Prompts for Slow, Stable Video"
description: "Copy Grok Imagine motion prompts for slow action from a photo, lock the camera, preserve the subject, and retime the finished clip in your editor."
publishedAt: 2026-12-02
readTime: "8 min read"
author: "Seedances Editorial Team"
category: "AI Video Guides"
eyebrow: "AI VIDEO GUIDES"
heroDescription: "Copy Grok Imagine motion prompts for slow action from a photo, lock the camera, preserve the subject, and retime the finished clip in your editor."
coverImage: "/uploads/blog/grok-ai-prompts-speed-slow-motion/cover.jpg"
coverAlt: "A dog on a porch turns its head slowly while the camera stays in one place."
coverCaption: "Editorial illustration. A dog on a porch turns its head slowly while the camera stays in one place."
ctaHeading: "Plan a slow-motion shot"
ctaLabel: "Explore the Seedances video planning preview →"
ctaHref: "/seedance-ai-generated"
featured: false
draft: false
contentMode: "markdown"
---

A dog looks up from a porch step, and you want the little head turn to happen slowly enough to see the ears move. You upload the photo to Grok Imagine and ask for dramatic slow motion. The model gives you a camera swing, a tail wag, and two quick head turns. “Slow motion” described a look. The prompt left the system to decide which parts of the scene should move and where the movement should finish.

## Quick Answer

![The dog’s ear provides a visible marker for a controlled head turn.](/uploads/blog/grok-ai-prompts-speed-slow-motion/section-1.jpg)

*The dog’s ear provides a visible marker for a controlled head turn.*

For a more controlled Grok Imagine motion prompt, describe one action, give it a visible pace, and anchor the camera. Use a starting photo with room for the action, and watch the background as closely as you watch the subject. If the cleanest generation still moves too fast, slow that downloaded clip in an editor. The examples below show how to decide which step will help.

## Tell Grok what moves and how far it goes

![A steady porch photo leaves room in the direction the dog will turn.](/uploads/blog/grok-ai-prompts-speed-slow-motion/section-2.jpg)

*A steady porch photo leaves room in the direction the dog will turn.*

Start in Imagine with a photo you have permission to animate. In the video composer, attach the photo and check the role shown for the image. Grok's release notes describe an attached image appearing as the first frame in video mode, with a slot for a last frame. Its Imagine notes also describe other attachment roles, including Reference. Use First frame when the clip should begin from the specific composition you uploaded. If your composer looks different, confirm that the upload is a first frame before relying on its framing. [Grok Imagine release notes](https://grok.com/release-notes/oct-03-2026) · [Grok attachment role notes](https://grok.com/release-notes/sep-12-2026)

Choose a source that makes the intended movement possible. For the porch photo, pick a sharp frame with space in the direction the dog will turn. If the muzzle already touches the edge of the photo, the model may have to invent the top of the step or move the image to find room. Choose a picture with a stable geometric feature, such as a window frame, which will make drift easy to spot.

**Prompt for a gentle head turn**

> Begin from the attached porch photo. The seated dog gradually turns its head a quarter turn toward the left over most of the clip. Its body and paws stay planted, and the collar retains its color and position. The turn settles into one quiet hold at the end. Fixed camera, with the porch step and window frame steady.

“A quarter turn” gives the gesture a destination. “Over most of the clip” describes its pace without relying on a frame rate or a second-by-second command. If the dog turns quickly and then waits, change the prompt to put the final position in the last part of the clip. Give yourself two versions to compare. In the first, the dog turns and settles early. In the second, it reaches the same position just before the end. The angle should remain comparable so you can judge the timing itself.

For a subtle photo animation, ask which objects should retain their relationship. A stable collar above the front paws matters more than individually directing every leaf in the yard. Look at the eye, nose, and collar in the first, middle, and last frames. If the head changes shape, ask for a smaller turn and use a starting photo closer to that final angle. Grok's image-to-video documentation describes directing movement from a source image with a text prompt. Its API settings are specific to that interface, so use the controls displayed in your own Imagine composer. [Grok image-to-video documentation](https://docs.x.ai/developers/model-capabilities/video/image-to-video)

## Keep the camera still and make one change between takes

![The chair and window frame give a curtain movement shot stable reference points.](/uploads/blog/grok-ai-prompts-speed-slow-motion/section-3.jpg)

*The chair and window frame give a curtain movement shot stable reference points.*

Camera movement can make a subject appear to move faster. In the porch shot, a push toward the dog will enlarge its head at the same time it turns. A sideways tracking shot moves the window frame across the picture. A fixed camera makes it easier to see whether the animal's movement itself slowed down. In a first test, ask for a fixed lens and one subject action. Add a camera move later only if it improves the finished shot.

**Prompt for a fabric movement**

> Starting from the attached photo, the lower edge of the white curtain gently lifts inward a few inches, pauses briefly, and settles back. Keep the rest of the room in the same position. A chair in the foreground remains still. Fixed camera and unchanged crop through the clip.

**Prompt for a controlled move across a tabletop**

> The small green toy car begins at the left side of the wooden table. It rolls steadily toward the center and eases to a stop beside the white mug. The movement takes most of the clip. Keep the camera fixed and the mug and table edge steady.

A target object gives the motion a place to finish. With the car, look at the distance between the rear wheel and the mug at three moments. Are the wheels turning as it travels? Does it roll past the intended point and then jump back? If its path zigzags, simplify the request to a straight line. If the target mug drifts, check the table edge. When the edge and mug shift together, the camera may be part of the problem. When the edge stays still and the mug moves alone, make the stationary object more explicit on the next run.

To see how much movement can fit in the same three seconds, compare the two Grok Imagine Video 1.5 clips in [Layer’s image-to-video guide](https://help.layer.ai/articles/1161385804-prompt-grok-imagine-for-image-to-video). We checked Layer’s published files frame by frame. Both run about 3.04 seconds and open on a staff-bearing figure by a castle. In the faster take the figure jumps and fire spreads across the ground. In the slower take the feet mostly stay planted as the staff rises and a small ring of fire grows. Watch the feet first. Duration alone tells you very little about the action inside the shot.

## Slow a good take in editing and check the new frames

![A creator checks the timing and shape of a generated clip in a video editor.](/uploads/blog/grok-ai-prompts-speed-slow-motion/section-4.jpg)

*A creator checks the timing and shape of a generated clip in a video editor.*

Once the dog's face, collar, and movement are stable, download the clip. Import it into your editor and keep an original on the timeline or a duplicate project. A speed setting below 100 percent makes a clip play more slowly in Adobe Premiere. A constant 80 percent setting turns a four-second section into five seconds. Use a modest change first. Large slowdowns make any repeated or distorted frames easier to see, especially in fur, reflections, and thin edges. [Adobe's clip speed and duration guide](https://helpx.adobe.com/premiere/desktop/edit-projects/change-clip-speed/change-clip-speed-using-the-speedduration-option.html)

Premiere exposes three time interpolation choices. Frame sampling repeats or drops frames to fit the new playback. Frame blending mixes adjacent frames, which may make a hard edge look doubled. Optical flow estimates movement and generates in-between frames. Compare all the ones available to you for the same short section. Optical flow can look smooth in an open area and warp a collar or window frame where edges cross. Frame sampling can be preferable when preserving a clean edge counts more than removing every small pause.

Keep the review focused on the destination. For a vertical social post, watch the rescaled export on your phone. For a wide loop, play the seam a few times. Listen as well. The timing and pitch of a sound from the original may feel wrong after retiming. If the sound needs to be natural, use a matching bed of ambience and set the faint collar jingle to the visible turn in the edit.

A generation prompt can describe a curve in the action, such as moving slowly and then settling. The video editor gives you direct control over how long the finished clip plays. If the precise duration is the requirement, use the editor to meet it after you have checked shape and camera stability in Imagine.

For a second version that starts from a written description, try drafting the slow turn in [Seedances.co’s text-to-video settings preview](/seedance-ai-generated). Choose a target duration and save the wording. Keep the original photo-based motion tests in Imagine so their starting frame stays consistent.

## Frequently asked questions

![Three matching frames reveal the difference between subject motion and camera drift.](/uploads/blog/grok-ai-prompts-speed-slow-motion/section-5.jpg)

*Three matching frames reveal the difference between subject motion and camera drift.*

**How do I slow motion without jitter?** Start from a generation that already has stable movement. Ask for one gesture in one direction, lock the camera in the prompt, and check geometry behind the subject. In editing, try a small slowdown before comparing frame sampling, blending, and optical flow. Review the exported version at normal playback speed.

**How do I keep the subject from changing when I upload a photo?** Use the first-frame attachment role when the photograph should determine the first composition. Start with a sharp photo where the intended movement has space. Preserve two or three concrete features in your instructions, such as collar color and paw positions, and compare them frame by frame.

**Does asking for 120 fps make Grok Imagine output at that frame rate?** Treat a frame-rate description in a prompt as creative direction unless your interface gives you a setting for the actual output frame rate. Check the file properties after download. You can choose your delivery frame rate in an editor and use its interpolation options when retiming.

**How do I tell if the camera or subject is causing the motion?** Pick a stationary edge in the background, such as a windowsill. Compare that edge with a stable point on the subject. When both shift in the same direction, inspect the camera move first. When the background holds and only a subject detail morphs, narrow that part of the movement.

## Conclusion

![A sequence of frames can reveal a shape change that a single still hides.](/uploads/blog/grok-ai-prompts-speed-slow-motion/section-6.jpg)

*A sequence of frames can reveal a shape change that a single still hides.*

Make the timing decision from the exported clip rather than from a single attractive still. A motion test can have a crisp first frame and lose the ear shape five frames into the turn. Isolate a short stretch around that moment and play it at the intended speed, then frame by frame. Keep the edit that reads cleanly in motion and holds the features people recognize.
