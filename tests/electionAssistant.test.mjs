import test from "node:test";
import assert from "node:assert/strict";
import {
  answerQuestion,
  buildGoogleCalendarUrl,
  buildGoogleMapsUrl,
  buildPlan,
  classifyQuestion,
  createShareablePlanText,
  daysUntil
} from "../src/electionAssistant.js";

const today = new Date("2026-05-03T12:00:00");

test("buildPlan creates an urgent plan when election day is close", () => {
  const plan = buildPlan(
    {
      country: "us",
      electionType: "federal",
      persona: "busy",
      registrationStatus: "unknown",
      votingMethod: "unknown",
      electionDate: "2026-05-06",
      location: "Austin, TX"
    },
    today
  );

  assert.equal(plan.daysUntilElection, 3);
  assert.equal(plan.urgency.label, "Immediate");
  assert.ok(plan.score < 70);
  assert.match(plan.nextAction, /Choose|Confirm|Register|Add/i);
});

test("confirmed registration and chosen method increase readiness", () => {
  const early = buildPlan(
    {
      country: "india",
      electionType: "assembly",
      persona: "first_time",
      registrationStatus: "unknown",
      votingMethod: "unknown"
    },
    today
  );

  const prepared = buildPlan(
    {
      country: "india",
      electionType: "assembly",
      persona: "first_time",
      registrationStatus: "registered",
      votingMethod: "in_person",
      location: "Pune, Maharashtra",
      completedChecklist: ["eligibility", "documents", "calendar", "sources"]
    },
    today
  );

  assert.ok(prepared.score > early.score);
  assert.equal(prepared.country.name, "India");
});

test("question classifier recognizes common election intents", () => {
  assert.equal(classifyQuestion("How do I register after I moved?"), "registration");
  assert.equal(classifyQuestion("Where is my polling booth?"), "polling");
  assert.equal(classifyQuestion("How do I avoid fake result posts?"), "security");
});

test("answerQuestion returns neutral process steps and official-source caveat", () => {
  const answer = answerQuestion(
    "What documents should I carry?",
    {
      country: "us",
      electionType: "local",
      persona: "first_time",
      registrationStatus: "unknown"
    },
    today
  );

  assert.equal(answer.intent, "documents");
  assert.ok(answer.steps.length >= 3);
  assert.match(answer.caveat, /official election authority/i);
});

test("calendar and map helpers create Google action URLs", () => {
  const calendarUrl = buildGoogleCalendarUrl({
    title: "Confirm registration",
    date: "2026-05-10",
    details: "Check official election authority."
  });
  const mapsUrl = buildGoogleMapsUrl("election office near Austin, TX");

  assert.match(calendarUrl, /^https:\/\/calendar\.google\.com\/calendar\/render/);
  assert.match(calendarUrl, /Confirm\+registration/);
  assert.match(mapsUrl, /^https:\/\/www\.google\.com\/maps\/search/);
  assert.match(mapsUrl, /Austin/);
});

test("daysUntil uses local election dates", () => {
  assert.equal(daysUntil("2026-05-03", today), 0);
  assert.equal(daysUntil("2026-05-04", today), 1);
});

test("shareable plan text excludes API keys and includes next action", () => {
  const plan = buildPlan(
    {
      country: "global",
      electionType: "organization",
      persona: "educator",
      registrationStatus: "registered",
      votingMethod: "in_person"
    },
    today
  );
  const text = createShareablePlanText(plan);

  assert.match(text, /CivicPath plan/);
  assert.match(text, /Next action/);
  assert.doesNotMatch(text, /api/i);
});
