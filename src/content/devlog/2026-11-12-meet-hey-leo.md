---
id: 9
title: "Meet Hey Leo"
date: 2026-11-12
project: hey-leo
category: update
tags: ["Python", "Claude API", "Claude Code"]
---
This post was written using generative AI.

Hey Leo is a voice assistant for Quinn's computer, like "Hey Google" but powered by Claude. It's still a work in progress, and this post is an introduction to what it is and how it works.

How it works
- Say "Hey Leo" and it beeps. Then ask your question.
- Claude Haiku reads the question and decides which model should answer it. Quick facts and simple math go to Haiku, questions that need a real explanation go to Sonnet, and big multi-step problems go to Opus.
- The answer is read out loud. The terminal shows which model was picked and why.
- When a question needs current information like weather, scores or news, Claude searches the web.

Why route between models
- Haiku is the fastest and cheapest, and Opus is the slowest and smartest. Most questions don't need Opus, so letting a small model pick the right one keeps answers quick and the bill small.
- Most questions cost a fraction of a cent. Opus questions cost a few cents.

Privacy
- The wake word and speech-to-text both run on the computer. Only the text of a question goes to Claude.
- Stop phrases and a global hotkey (Ctrl + Alt + S) make Leo stop talking right away if he wakes up by mistake.

The avatar
- Leo got a face today: a lion with a big orange mane, teal glasses, a tweed jacket and an orange tie.
- An optional visual mode shows him live in a window. He looks over while listening, rests his chin on his hand while thinking, and talks with his hands while speaking. There's also a terminal version with waveforms and a pixel-art Leo.

Stack
- Python and the Claude API, with a local voice model for the wake word and speech. The voice can be the system voice or a more natural-sounding local one.
- Built with help from Claude Code. The code is at github.com/QuinnChrest/hey-leo.
