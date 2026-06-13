# PatchNote

PatchNote is an automated release notes generator built for product teams. It connects directly to your existing workflow tools like Linear and GitHub, pulls completed tickets and merged PRs, and generates polished, audience aware changelogs. It writes three distinct versions of your release notes: a user facing version, a technical developer version, and an executive summary.

## Overview

Writing release notes is often a rushed, last minute task. PatchNote solves this by automating the entire process. Connect your workspace, select a date range, and the application does the rest. It uses the Gemini API to analyze your tickets and PRs, formatting them into clear, readable updates tailored to different audiences.

## Features

* Linear Integration: Securely connect your Linear workspace via OAuth to automatically fetch completed issues.
* GitHub Integration: Pull merged pull requests based on the selected date range.
* Audience Specific Generation: Powered by Gemini 1.5 Flash, it creates unique changelog versions for users, developers, and executives.
* Public Changelog Page: A dedicated, server side rendered public page to share your user facing notes.
* Analytics Ready: Novus.ai snippet injected into the public pages to track reads and engagement.

## Tech Stack

* Framework: Next.js 14 App Router
* Styling: Tailwind CSS and shadcn components
* Authentication: Clerk
* Database: Supabase PostgreSQL
* AI: Google Gemini API
* Analytics: Novus.ai

## Setup Instructions

1. Clone the repository.
2. Run npm install to install the required dependencies.
3. Apply the database schema located in the supabase/migrations folder to your Supabase project using the SQL editor.
4. Fill in the .env.local file with your actual API keys.
5. Run npm run dev to start the development server.

## Current Progress

* Scaffolded the Next.js App Router project.
* Configured Tailwind CSS, shadcn components, and typography plugins.
* Implemented Supabase schemas with Row Level Security.
* Created the Clerk authentication flow including sign in, sign up, and protected routes.
* Built the Linear OAuth flow and callback handlers.
* Created the API routes to fetch completed Linear issues and merged GitHub PRs.
* Built the Gemini integration route to process tickets and save changelogs to the database.
* Designed the protected user dashboard and the public facing changelog page.
