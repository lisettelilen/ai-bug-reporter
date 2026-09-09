# 🐞 AI Bug Reporter

> An AI-powered QA engineering tool designed to streamline incident reporting by automatically capturing HTTP failures, JavaScript exceptions, and screen interactions, turning raw technical logs into structured, backlog-ready bug reports.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://ai-bug-reporter-fawn.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Chrome Extension](https://img.shields.io/badge/Chrome_Extension-MV3-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/mv3/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 📌 Problem & Motivation

In modern agile environments, QA engineers spend a significant percentage of their sprint cycles manually drafting bug tickets: reproducing failures, inspecting DevTools network tabs, copying payloads, extracting error codes, formatting markdown, and estimating backlog priority.

**AI Bug Reporter** automates this operational bottleneck. By intercepting browser events at the runtime level and leveraging LLMs with strictly defined schemas, it bridges the gap between raw diagnostic data and high-quality, actionable tickets for development teams.

---

## 🚀 Key Features

* **🌐 Network & Console Interception (Chrome Extension MV3):** Automatically tracks client-side errors, HTTP `4xx`/`5xx` status codes, failed request payloads, and unhandled JS exceptions in real-time.
* **🤖 AI-Driven Synthesis:** Analyzes diagnostic payloads and structures them into standardized QA reports:
  * Unified, descriptive issue title
  * Step-by-step reproduction steps
  * Actual vs. Expected results
  * Technical evidence summary (endpoints, status, payload traces)
  * Calculated **Backlog Priority**
* **🎥 Multi-Modal Capture Support:** Supports direct input via Chrome extension, client-side screen recording, and manual log/screenshot pasting (`Ctrl+V`).
* **⚡ 1-Click Export:** Pre-formatted output ready to be copied directly into Jira, Linear, or GitHub Issues.

---

## 🏗️ Architecture & Workflow

```mermaid
flowchart TD
    subgraph Client ["Client Layer"]
        A[Web App / User Interaction] -->|HTTP Failure / JS Error| B(Chrome Extension MV3)
        C[Screen Recording / Manual Log] -->|Direct Input| D(Dashboard UI - Next.js)
        B -->|Scan ID & Network Logs| D
    end

    subgraph Backend ["Serverless API (Next.js)"]
        D -->|Raw Technical Payload| E[/api/generate-bug-report]
        E -->|Structured Prompt + JSON Schema| F[LLM Engine]
        F -->|Normalized QA Report| E
    end

    subgraph Output ["Target Integration"]
        E -->|JSON Response| D
        D -->|Backlog-Ready Ticket| G[Jira / Linear / GitHub Issues]
    end