# PatchNote

**Live Demo:** [https://patch-note.vercel.app](https://patch-note.vercel.app)

PatchNote is an automated release notes generator built for product teams. It connects directly to your existing workflow tools like Linear and GitHub, pulls completed tickets and merged PRs, and generates polished, audience aware changelogs. It writes three distinct versions of your release notes: a user facing version, a technical developer version, and an executive summary.

Built originally for the Mind the Product Hackathon 2026.

## Overview

Writing release notes is often a rushed, last minute task. PatchNote solves this by automating the entire process. Connect your workspace, select a date range, and the application does the rest. It uses the Gemini API to analyze your tickets and PRs, formatting them into clear, readable updates tailored to different audiences.

## Features

* Linear Integration: Securely connect your Linear workspace via OAuth to automatically fetch completed issues.
* GitHub Integration: Pull merged pull requests based on the selected date range.
* Audience Specific Generation: Powered by Gemini 3 Flash Preview, it creates unique changelog versions for users, developers, and executives.
* Public Changelog Page: A dedicated, server side rendered public page to share your user facing notes.
* Beautiful Design System: A cohesive dark mode interface tailored for readability and speed.
* Analytics Ready: Novus.ai snippet injected into the public pages to track reads and engagement.

## Tech Stack

* Framework: Next.js 16 App Router
* Styling: Tailwind CSS v4 and Base UI components
* Authentication: Clerk
* Database: Supabase PostgreSQL
* AI: Google Gemini API
* Integrations: Linear SDK

## Local Development Setup

To run this project locally, follow these steps:

1. Clone the repository.
2. Run `npm install` to install the required dependencies.
3. Apply the database schema located in the `supabase/migrations` folder to your Supabase project using the SQL editor.
4. Duplicate the `.env.example` file to `.env.local` and fill it with your actual API keys.
5. Run `npm run dev` to start the development server at `http://localhost:3000`.

## How It Works

1. **Authentication:** Users sign up securely via Clerk.
2. **Integration:** Connect your Linear or GitHub workspace via OAuth 2.0.
3. **Data Fetching:** Select a date range. The backend securely pulls all tickets marked as "Done" or PRs merged within that timeframe.
4. **AI Processing:** The raw ticket data is fed into the Google Gemini API with a specialized system prompt, which parses the unstructured text and returns a structured JSON payload containing three beautifully formatted markdown changelogs.
5. **Publishing:** The generated release notes are saved to a Supabase PostgreSQL database. Users get a unique, sharable public URL for their changelog.

## License

This project is open source and available under the MIT License. See the [LICENSE](LICENSE) file for more information.
