# Vib3.dev

<img width="1840" alt="vib3-2" src="https://github.com/user-attachments/assets/70d4b67d-6822-4748-b477-da2d5b864b69" />

![vib3-4](https://github.com/user-attachments/assets/4b35791f-4c7c-40c8-9c8e-25a97028599c)

Vibe coding is here in web3.

Make dapps in minutes.

What if you could "one shot" prompt a dapp?

## Problem / Challenge

Vibe coding and AI Assitant tools are amazing... BUT... there is a limitation due to pretraining from LLM models.

The latest documentation and best practices are not accessible to the LLM, even if we add @Docs to them via IDEs like Cursor

## Solution

Our project empowers developers to quickly and effortlessly build functional web3 decentralized applications (dApps) with a single AI-powered prompt. Using the Claude 3.5 AI model, users simply describe their desired dApp—such as a voting app with wallet connection—and the system generates fully deployable code instantly.

The intuitive homepage interface features clickable filters, allowing users to easily incorporate essential dApp functionalities without writing code. We've integrated the Curvegrid API to streamline blockchain interactions, making web3 application development more accessible, fast, and efficient for both novice and experienced developers. Our goal is to unlock web3 development for more developers and enable a broader range of applications.

## Architecture Diagram

<img width="1054" alt="diagram" src="https://github.com/user-attachments/assets/a4e4e8ae-1907-4e89-9491-a22d6cf9f514" />

### Technology Stack

- Frontend: Next.js 14, React 18, Tailwind CSS
- AI: Claude 3.5
- Code Preview / Editor: Sandpack + Prism.js + Simple Code Editor (set to Page Router due to restraints)

### Modules / Relevant Sponsors

- [CurveGrid](./app/modules/voting-app/reference_curvegrid.ts)
