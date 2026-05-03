# CivicPath Election Assistant

CivicPath is an interactive assistant that helps people understand election timelines, registration steps, voting methods, official sources, and post-election result stages. It is built as a small static web app so the repository stays lightweight and easy to evaluate.

## Chosen Vertical

**Civic education and voter readiness.** The assistant is designed for voters, first-time voters, people who moved recently, accessibility-focused voters, overseas or away-from-home voters, and educators helping others understand the election process.

## Approach and Logic

The app combines deterministic civic workflow logic with optional Google services:

- Builds a personalized election plan from country/region, election type, voter situation, registration status, voting method, location, and election day.
- Converts the user context into a readiness score, next best action, timeline, and checklist.
- Answers process questions with local rule-based intent detection for registration, documents, timelines, polling place, voting method, accessibility, misinformation, candidates, and results.
- Avoids inventing legal deadlines. The assistant repeatedly routes deadline-sensitive questions to official election sources.
- Stores only non-sensitive planning context by default. API keys are saved only when the user opts in.

## Google Services Used

- **Google Gemini API:** Optional AI explanation layer using `gemini-2.5-flash`. The local deterministic answer and voter context are supplied to Gemini so the model stays grounded in the app logic.
- **Google Civic Information API:** Optional US voter information lookup for available elections, polling locations, early vote sites, contests, and election administration links.
- **Google Calendar:** Generates add-to-calendar links for timeline milestones.
- **Google Maps:** Opens election-office and location searches based on the user’s region.

No API key is committed. For demo use, enter restricted API keys in the app’s Google services drawer.

## How It Works

1. Select a country/region, election type, voter situation, registration status, voting method, date, and location.
2. CivicPath generates a readiness score, priority action, timeline, checklist, official links, Google Calendar action, and Google Maps action.
3. Ask the assistant a question. Without a Gemini key, the app uses local logic. With a Gemini key, it asks Gemini for a concise response grounded in the local plan.
4. US users can add a Google Civic API key and residential address to retrieve official Civic API voter information when available.

## Assumptions

- Exact election rules, deadlines, and accepted documents vary by jurisdiction and can change. CivicPath is an educational planning assistant, not a legal authority.
- Google Civic Information API election data is US-focused and depends on API coverage for a given election and address.
- For non-US workflows, the app provides general process guidance and links to official or reputable civic information sources.
- Users should restrict browser API keys and avoid entering unnecessary sensitive data.

## Run Locally

```bash
npm run serve
```

Then open `http://localhost:5173`.

## Test

```bash
npm test
```

The tests validate plan generation, urgency logic, intent detection, Google action URL creation, and privacy-sensitive share text.

## Submission Notes

- Repository should be public.
- Keep one branch.
- Keep repository size below 10 MB.
- Commit all project code, including this README, `index.html`, `src/`, `assets/`, and `tests/`.
