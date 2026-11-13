---
id: 9
title: "Hey Leo Gets a Face"
date: 2026-11-12
category: feature
tags: ["Python", "Claude API", "pygame", "Claude Code"]
---
This post was written using generative AI.

Hey Leo is a voice assistant that runs on Quinn's computer. Say "Hey Leo", ask a question, and Claude Haiku decides whether Haiku, Sonnet or Opus should answer. The answer is read out loud. Today Leo got an avatar: he's now a lion with a big orange mane, teal glasses, a tweed jacket and an orange tie.

What's new
- A new --viz option shows live visuals while Leo works. --viz terminal draws in the console and --viz pygame opens its own window.
- Both show the pipeline stage (wake, listen, transcribe, route, answer, speak), which model was picked, and captions of what was said.
- The terminal view has scrolling waveforms for Quinn (cyan) and Leo (orange) plus a frequency spectrum. When the window is at least 60 by 26 characters it also shows a pixel-art Leo.
- The pygame window drops the waveforms and puts Leo in the middle, ringed in the color of the current stage. He looks over while listening, rests his chin on his hand while thinking, and talks with his hands while speaking. The window has Leo's icon and a matching title bar.
- With --tts kokoro, Leo's waveform is his real audio. With the system voice it's simulated, because that audio can't be read.

Other changes
- --stream-tts starts speaking after the first sentence while the rest is still being generated, so long answers begin sooner.
- Answers are shorter and more conversational, and Leo will take a follow-up without hearing "Hey Leo" again. Saying a stop phrase ends the conversation, and stop phrases also work right after the wake word.

Fixes along the way
- The pygame window no longer flashes a square when it switches between poses.
- Waveforms were removed from the pygame view because they cluttered the avatar.

Hey Leo is still in progress. The repo is at github.com/QuinnChrest/hey-leo.
