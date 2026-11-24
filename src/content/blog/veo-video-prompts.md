---
slug: veo-video-prompts
title: "Veo Prompts for Dialogue and Camera Control"
seoTitle: "Veo 3 Prompts for Dialogue and Camera Control"
description: "Build a Veo prompt in Google Flow for two-person dialogue, a steady shot, or a slow push-in. Learn how to check the model, speech timing, and camera position."
publishedAt: 2026-12-03
readTime: "9 min read"
author: "Seedances Editorial Team"
category: "AI Video Guides"
eyebrow: "AI VIDEO GUIDES"
heroDescription: "Build a Veo prompt in Google Flow for two-person dialogue, a steady shot, or a slow push-in. Learn how to check the model, speech timing, and camera position."
coverImage: "/uploads/blog/veo-video-prompts/cover.jpg"
coverAlt: "A customer in a mustard jacket and a mechanic in a gray apron meet at a bike shop counter."
coverCaption: "Editorial illustration. A customer in a mustard jacket and a mechanic in a gray apron meet at a bike shop counter."
ctaHeading: "Adapt your shot brief for Seedance"
ctaLabel: "Explore the Seedances video planning preview →"
ctaHref: "/seedance-ai-generated"
featured: false
draft: false
contentMode: "markdown"
---

Two people stand at a bike shop counter. One asks if a repair will be ready by five. The other gives a short answer. In your head, the camera stays with them while the second person slides the keys across the counter. In a generated clip, the wrong person may answer, the camera may move before the question lands, and the keys may turn into a different object halfway across the counter. Each detail has a fix you can test.

Start with a short Veo 3 prompt in Google Flow using an available Veo model. Give the shot one piece of visible action and one job for the camera. Add the sound you expect to hear after the shot reads clearly on its own. Below, the same bike shop scene shows how to isolate those choices and write a two-person exchange that is easier to diagnose.

## Check the model and block the shot

![The steady camera keeps both people and the keys visible across the counter.](/uploads/blog/veo-video-prompts/section-1.jpg)

*The steady camera keeps both people and the keys visible across the counter.*

Open a Google Flow project. In the prompt settings, check the name of the active video model and choose Text to Video for the first test. Google's Flow help lists Veo 3.1 Lite text-to-video outputs of four, six, or eight seconds. Pick eight seconds for the example with two short spoken lines. Choose a landscape frame when both characters and the keys need to remain visible together. Write down the actual model, mode, aspect ratio, and duration you used before trying another version. [Google Flow model and feature guide](https://support.google.com/flow/answer/16352836?hl=en)

The Gemini app is a different entry point. Google documents Gemini Omni 1.2 Flash for video creation in Gemini Apps. If your screen in Gemini names Omni, your clip can still help you rehearse the staging. Use Flow and check its active model if you need the comparison to be specific to Veo. Model availability and features can differ by account and change over time. [Gemini Apps video help](https://support.google.com/gemini/answer/16126339?hl=en)

Start by assigning the characters fixed positions. Riley is a customer in a mustard jacket on the left. Jo is a mechanic wearing a gray apron on the right. The keys sit near Jo. Those details give your eyes three anchors when you review the clip. Establish where the camera sits in relation to the counter. “From the customer side” is useful if the shop wall should stay behind Jo for the entire exchange.

**A baseline Veo prompt for blocking**

> A continuous medium two-shot at a small bike shop counter, viewed from the customer side. Riley, a customer in a mustard jacket, stands on the left. Jo, a mechanic in a gray apron, stands on the right with a set of keys by her hand. Riley looks down at the keys. Jo slides them a short distance across the counter, then rests her hand. The camera holds steady at eye level. Quiet room tone and the soft scrape of keys against wood.

Play the clip once with sound off. At the point when the keys move, ask whether you can see both the hand and the destination. If the keys vanish, ask for a shorter slide on a clear patch of the counter. If Riley and Jo switch sides during the shot, trim your description back to the positions and add a stable background cue. Solve the geometry before adding lines.

## Move the camera while preserving the action

![A short push toward the counter highlights the handoff without cropping either speaker.](/uploads/blog/veo-video-prompts/section-2.jpg)

*A short push toward the counter highlights the handoff without cropping either speaker.*

Use the original prompt as a base. Choose one camera movement that lets the viewer see something they could not see as well in the first composition. A small push-in can draw attention to the exchange. A wide pan may carry one person out of the frame, so check whether the movement still serves the two-person scene.

**A Veo prompt for a slow push-in**

> One continuous eye-level shot from the customer side of the counter. Begin with Riley in mustard on the left and Jo in a gray apron on the right. Jo slides the keys along the counter toward Riley. As the keys come to rest, the camera makes a slow, short push forward. Hold both people and the keys in frame until the end. Keep the bike rack behind Jo visible, with warm shop light throughout.

The movement has a start cue and an endpoint. Compare the first and last frames. A push-in should bring you closer to the subject while background relationships change in a way that makes sense for the setup. If the shot jumps to a completely different angle, remove language that reads like a second setup. “End on a close-up” can invite a cut. A phrase such as “finish only slightly closer, with both shoulders still visible” gives the intended frame a concrete boundary.

Watch for competing movements. The keys already slide across the frame. If Jo also turns away, Riley bends forward, and the camera tracks sideways, each movement can obscure the others. Try the camera move with the action reduced to one gesture. Then add a second gesture only if the audience needs it. Google's Veo prompting guide treats shot framing and motion as distinct choices and encourages describing the action, location, and dialogue in concrete terms. [Google DeepMind Veo prompt guide](https://deepmind.google/models/veo/prompt-guide/)

If the scene needs an exact final composition, check whether the selected Flow model supports first and last frame inputs. This is a different mode and needs actual source frames. A written ending frame helps convey the intention in Text to Video. A mode that takes both frames gives the model two visual endpoints. Use the same positions and aspect ratio in both images if you want a straightforward transition. [Google Flow model and feature guide](https://support.google.com/flow/answer/16352836?hl=en)

## Give every line a specific speaker and leave room for a reply

![The mechanic listens as the customer finishes a brief question.](/uploads/blog/veo-video-prompts/section-3.jpg)

*The mechanic listens as the customer finishes a brief question.*

An eight-second scene gives you time for a brief question, a pause, and a short answer. Read both lines aloud at the pace you want. If you have to rush, cut a few words before generating. Anchor the speaker's name to the clothing and position already in the shot. Use quotation marks for the exact line. Pair each line with a behavior the other person can hold comfortably while listening.

**A two-speaker Veo dialogue prompt**

> A continuous eye-level medium two-shot at the bike shop counter. Riley in mustard stands on the left. Jo in a gray apron stands on the right. Riley looks at Jo and asks, “Ready by five?” Jo listens with her lips closed. After a short pause, Jo nods and says, “Come by at four.” Riley listens quietly as Jo slides the keys across the wood. The camera stays fixed. Low shop ambience and a brief scrape from the keys leave both voices clear.

Use the fixed version first. If the characters speak in the right order, try the small push-in from the earlier prompt and check that both mouths remain visible. If the answer comes from Riley, shorten the script to Jo's line as a diagnostic. If the single line works, add Riley back with a pause. If the clip still assigns the wrong line or spoken wording needs to be exact, create a separate shot for each speaker or record the dialogue and place it in your edit.

Watch the sailor and the rally sequence in [DeepMind’s Veo 3 prompt guide](https://deepmind.google/models/veo/prompt-guide/). We inspected the two published eight-second clips. The sailor raises his pipe against the waves; the framing keeps his face and gesture together. His spoken line includes “it’s a force.” In the rally sequence, spray briefly hides the vehicle and the framing shifts as the car crosses the water. That suits a race. In the bike shop it could hide who answered. These examples came from Google’s Veo 3 guide. Check the model selected in your own Flow project before comparing results.

Keep sound cues sparse. A shop fan establishes the room. The keys make a distinct sound when they move. Loud music or several background voices compete with the words you need to hear. Review the clip once listening for line order and once watching the mouths. Then play it through at regular speed to see whether the motion and sound work together. Google DeepMind documents native audio and dialogue for the Veo family. The sample prompt is an editorial starting point for your own check. [Google DeepMind Veo model overview](https://deepmind.google/models/veo/)

When you evaluate the camera version, keep one still from the start, one from when the keys touch the counter, and one from the end. If the visible result improves but the dialogue timing changes, save the shot and audio separately in your edit. You can make a practical decision even when the strongest image and strongest line reading come from different takes.

Timing gets easier to judge when the scene fits on one line. Draft a silent version of the key handoff in [Seedances.co’s text-to-video settings preview](/seedance-ai-generated) and select a duration. Take that beat sheet into Flow when you add Riley and Jo’s lines.

## Frequently asked questions

![A creator compares film stills and a dialogue timeline before exporting a clip.](/uploads/blog/veo-video-prompts/section-4.jpg)

*A creator compares film stills and a dialogue timeline before exporting a clip.*

**How do I tell Veo which character should speak?** Give each character a name, a stable position, and an easy visual cue. Put the action and quoted line beside that character's name. For the listener, specify a small quiet action such as holding eye contact or nodding after the line. Review the mouth movement and audio together.

**Why does the camera cut when I ask for a push-in?** Wording about several separate framings can resemble a shot list. Ask for one continuous take. Describe where the camera begins, what cues the movement, and where it stops. A smaller movement with a clear endpoint gives you a simpler version to compare.

**Are Flow and Gemini the same way to run this prompt?** Flow lets you choose from the compatible models displayed for your selected mode. The Gemini Apps video help documents Gemini Omni. If you want a Veo test, record the actual Veo version shown in Flow. If you use the prompt in Gemini Apps, keep the clips labeled with that app and model.

**What if the clip has no audio or the dialogue is garbled?** First check that you selected a compatible model and that playback is unmuted. Try a single short line in a quiet scene. If speech needs to match a script precisely, treat generated audio as a scratch track and record a replacement. Watch the finished cut for timing before export.
