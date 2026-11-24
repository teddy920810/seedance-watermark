---
slug: prompt-for-consistent-character
title: "AI Character Prompts for Consistent Video Dialogue"
seoTitle: "AI Character Prompts for Consistent Faces and Dialogue"
description: "Keep two AI video characters recognizable and give each line to the right speaker with shot prompts, continuity checks, and an audio fallback."
publishedAt: 2026-12-02
readTime: "8 min read"
author: "Seedances Editorial Team"
category: "AI Video Guides"
eyebrow: "AI VIDEO GUIDES"
heroDescription: "Keep two AI video characters recognizable and give each line to the right speaker with shot prompts, continuity checks, and an audio fallback."
coverImage: "/uploads/blog/prompt-for-consistent-character/cover.jpg"
coverAlt: "The approved layout puts Nora in a sage apron on the left and Eli in burgundy holding a folded paper bag on the right."
coverCaption: "Editorial illustration. The approved layout puts Nora in a sage apron on the left and Eli in burgundy holding a folded paper bag on the right."
ctaHeading: "Plan a scene with consistent characters"
ctaLabel: "Explore the Seedances video planning preview →"
ctaHref: "/seedance-ai-generated"
featured: false
draft: false
contentMode: "markdown"
---

You finally get a believable shot of a baker asking where the key went. Cut to her coworker, and the coworker suddenly has the baker's face. On the next pass, both faces look right, but the baker speaks the reply. Those are two separate editing problems. Treat the face, the line, and the cut as three things you can inspect independently, and it becomes much easier to decide which shot to keep.

## Quick Answer

![Rejected alternate. The apron and burgundy cardigan switch characters, and Nora’s square glasses disappear.](/uploads/blog/prompt-for-consistent-character/section-1.jpg)

*Rejected alternate. The apron and burgundy cardigan switch characters, and Nora’s square glasses disappear.*

An AI character prompt for video carries a short description of the same person through every shot. Give each character recognizable features, pair each line with one speaker and one visible action, then check the shots against each other. If your generator struggles to assign dialogue to the right mouth, give each person a separate speaking shot and build the conversation in the edit.

Compare the opening photo with the alternate above. In the opening, Nora wears square glasses and the apron while Eli holds the paper bag. In the alternate, the apron goes to the man and the cardigan to the woman. The bakery still looks right, which makes the swap easy to overlook. Reject the shot before adding dialogue.

## Give both characters a reference you can recognize

![Side by side neutral reference photos of two fictional bakery workers with clear facial identities.](/uploads/blog/prompt-for-consistent-character/section-2.jpg)

*Side by side neutral reference photos of two fictional bakery workers with clear facial identities.*

Start with an image you own or have permission to use. If you are designing fictional characters, choose a clean still for each person with their hair, face and main item of clothing visible. Avoid strong side lighting for this first reference. A deep shadow can hide exactly the cheek or eyebrow shape you need to compare later.

For a scene in a neighborhood bakery, call the characters Nora and Eli. Nora wears a sage apron and has a short dark bob and square glasses. Eli wears a burgundy cardigan and has close-cropped curls and a small hoop in his left ear. Each prompt can repeat those same details, in the same order. The names help you write and organize the shots. The visible details help you check whether the output still depicts the right person.

Use this block at the top of your shot notes and paste the relevant lines into each generation.

> Nora has a short dark bob, square glasses, and a sage apron over a cream shirt. She stands behind the bakery counter. Eli has close-cropped curls, a small hoop in his left ear, and a burgundy cardigan. He stands on the customer side. Nora and Eli remain distinct, with the same faces, hair, and clothes throughout the scene.

If your generator lets you attach character or ingredient references, check how it identifies each image. An attachment slot labeled as a first frame serves a different purpose from an ingredient slot that guides subject appearance. When the interface gives you labels, use the exact label in your shot notes and record which image goes with it. Give the files specific names such as nora-front and eli-front so you can catch an accidental swap before you generate. Google Cloud's Veo guide describes a multi-shot workflow using character ingredients where the selected mode supports them. [Veo prompting guide](https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-veo-3-1)

When a mode accepts a single starting image, start the close-up from a clean still of the person who will speak. Return to that approved image if a new take drifts. Feeding a slightly altered failed frame into the next take can keep carrying the altered features forward. If the establishing shot shows both characters, check whether the glasses and apron belong to Nora and the earring and cardigan belong to Eli before you use anything from that shot as a reference.

## Bind each line to one visible speaker

![A plausible bakery close-up still needs a continuity check. This alternate drops Nora’s square frames.](/uploads/blog/prompt-for-consistent-character/section-3.jpg)

*A plausible bakery close-up still needs a continuity check. This alternate drops Nora’s square frames.*

A two-person prompt gets easier to follow when each line has a job in the picture. Suppose Nora asks for the front door key and Eli tells her where it is. In your storyboard, Nora stops folding a towel just before she speaks. Eli puts down a paper bag just before he replies. That physical action gives you something to look for when you check which person spoke first. It also makes it easier to communicate timing without filling the prompt with exact timestamps.

For a short trial in a model with native dialogue, start with one continuous two-shot and two short lines. Use the dialogue notation your chosen model documents. The example below uses speaker actions followed by colons, a format documented in Google Cloud's current video generation guidance. Trim the script further if you have to rush the two lines when you read them aloud. [Google Cloud video generation best practices](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/video/best-practice)

> Static medium two-shot at a bakery counter. Nora in the sage apron stands on the left behind the counter. Eli in the burgundy cardigan stands on the right in front of it. Nora stops folding a towel and says: Did you find the key? Eli listens with his mouth closed. One brief pause. Eli lowers a paper bag to the counter and says: It was under the flour scoop. Nora listens and leaves her towel on the counter. Soft bakery room tone.

Play the first take with headphones. Listen for any missing words, a voice switching in the middle of a sentence, or an extra line during the pause. Then watch it muted and check whose mouth moves. If both mouths move on the same words, shorten the exchange or switch to one speaker per shot. Clearing up the audio can prove faster than continually rerolling a two-shot that otherwise looks good.

For the split version, begin with Nora's approved close-up and describe only Nora's question. Keep Eli's face out of view or show only his shoulder. Generate Eli's reply from his reference with the camera facing him. If the model you have available produces silent video, record the two lines separately and put them on two tracks in an editor. You can use an appropriate performance or lip-sync tool for a visible speaking face. If a take still looks wrong, put the troublesome words over the listener's reaction or over an insert of the key on the counter.

## Check faces and dialogue through the cut

![Separate waveform tracks on a home editing screen with two distinct character thumbnails.](/uploads/blog/prompt-for-consistent-character/section-4.jpg)

*Separate waveform tracks on a home editing screen with two distinct character thumbnails.*

Watch the [paired speaker cut](/uploads/blog/prompt-for-consistent-character/paired.mp4) and the [swapped speaker cut](/uploads/blog/prompt-for-consistent-character/swapped.mp4). We made both still-image animatics from the opening two-shot. In the animatic, Nora asks “Did you move the key?” and Eli replies “It is beside the till.” Then we swapped the portraits while keeping the exact same two synthetic voice recordings, pauses, and cut times. The same dialogue now appears to come from the wrong person twice. Our decoded soundtracks were identical. Play your rough cut with one eye on who is visible at each line onset. A static animatic checks the assignment and the timing; it cannot show how a moving mouth will match the syllables.

Pick a still from three places in each shot. Use an early frame, one during the line, and one near the cut. Compare all three with the reference and with the adjoining shot. Check the features that identify the person at the size viewers will see them. Eyeglasses and a hairline often read clearly on a phone. An earring may disappear in a wide shot even when it matters in a close-up. Also compare the height of the counter and which side of frame each actor looks toward. Those details keep the space understandable as you cut from one face to the other.

You can rough out a cutaway in [Seedances.co’s text-to-video settings preview](/seedance-ai-generated). Describe the bag on the counter and select a duration short enough to fit between the lines. Record or generate the two speaking parts in your dialogue workflow.

## Frequently asked questions

![Hands checking a pair of bakery scene contact sheets for wardrobe and eyeline continuity.](/uploads/blog/prompt-for-consistent-character/section-5.jpg)

*Hands checking a pair of bakery scene contact sheets for wardrobe and eyeline continuity.*

**How do I stop a character's face from changing between clips?** Keep the approved reference constant and repeat a small set of visible traits. Pick a still that shows the face at an angle close to the shot you need. If the tool accepts only one starting frame, use a clean frame or still for the speaking character. A shared name provides a consistent label, but you still need to compare the output with its source, especially when you switch lighting, camera angle or model.

**How can I stop one person from saying the other person's line?** Tie each line to an observable action by its speaker and give the other character a clear listening beat. Start with two short lines. If the generator still swaps them, build each line in its own shot. A separate voice track gives you a place to correct the words without asking the model to recreate an approved reaction or camera move.

**Should I include an accent, emotion, or pace in the AI character prompt?** Start with whichever detail affects the scene. Nora can ask quietly because the bakery has just opened. Eli can answer after a short pause because he is setting something down. Build a clip you can evaluate before stacking many delivery notes. If the same voice needs to extend across multiple scenes, keep a written voice brief and use the same approved recording workflow where possible.

**What should I keep from a take that looks good but sounds wrong?** Save the original take and make a duplicate in your editor. Mute the generated audio and see whether the picture works as a reaction shot or a short insert. Use separate dialogue if the visible mouth supports it, then check the full sequence once for sync and once for visual continuity. Name the accepted takes and references so the next scene can start from the same material.

## Conclusion

![Review the cut between two speakers before replacing a voice or regenerating a shot.](/uploads/blog/prompt-for-consistent-character/section-6.jpg)

*Review the cut between two speakers before replacing a voice or regenerating a shot.*

Give each problem its own repair. For a wardrobe change, regenerate the affected shot with the same reference and the exact clothing phrase. For a voice swap, replace or reassign audio first and check the mouth separately. If a talking shot needs a couple of frames trimmed, hide the trim under a reaction or the paper bag hitting the counter. When the scene finally plays, listen again with your eyes closed. Two clean voices and a steady level of room sound help the exchange feel as though it happened in one place. Export a short copy and review it at phone size before assembling a longer sequence.
