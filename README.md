# Motion-S — Text-to-Sign Language Motion Generator

Motion-S is an open-source web app that translates text into
real-time 3D sign language animations using a humanoid avatar.
Built with React, Three.js, and the Gemini 2.0 API.

## What it does

Type or speak any sentence — Motion-S translates it into
grammatically correct sign language and animates a 3D avatar
signing it back to you in real time. It supports American Sign
Language (ASL), British Sign Language (BSL), and Nigerian Sign
Language (NSL).

## Features

- 3D humanoid avatar with arm, hand, and finger animation
- Voice input via Web Speech API
- Multi-language sign support: ASL, BSL, NSL
- Grammatically correct translation (not fingerspelling)
- Emotion-aware facial expression markers
- Gloss sequence timeline with playback controls
- Translation history saved locally
- Fully browser-based — no backend required

## Tech stack

- React 18 + TypeScript + Vite
- Three.js (3D avatar rendering)
- Google Gemini 2.0 Flash (NLP + sign language translation)
- Tailwind CSS
- Web Speech API (voice input)



## Why we built this

70 million people worldwide are deaf or hard of hearing.
Most accessibility tools only support fingerspelling —
translating text letter by letter, not into real sign language.
Motion-S translates at the linguistic level, respecting the
grammar and structure of each sign language it supports.

NSL support specifically addresses a gap in West Africa where
Nigerian Sign Language has almost no digital tooling.

## Supported sign languages

| Language | Region | Status |
|---|---|---|
| ASL | United States | Supported |
| BSL | United Kingdom | Supported |
| NSL | Nigeria | Supported |

## Project status

Built for the Signvrse Hackathon 2026. Active development.
Contributions welcome.

## License

Apache 2.0
