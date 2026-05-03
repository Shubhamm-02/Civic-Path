const DAY_MS = 24 * 60 * 60 * 1000;

export const COUNTRY_PROFILES = {
  us: {
    id: "us",
    name: "United States",
    civicApi: true,
    electionTypes: [
      { id: "federal", label: "Federal / statewide" },
      { id: "local", label: "Local / municipal" },
      { id: "primary", label: "Primary election" },
      { id: "special", label: "Special election" }
    ],
    officialLinks: [
      { label: "Vote.gov", url: "https://vote.gov/" },
      { label: "USA.gov voting and elections", url: "https://www.usa.gov/voting-and-elections" },
      { label: "Google Civic Information API", url: "https://developers.google.com/civic-information" }
    ],
    mapSearch: "election office near",
    registrationNoun: "voter registration",
    processWords: {
      register: "Check your state registration deadline and confirm your registration record.",
      id: "Review your state's ID, signature, absentee, and provisional ballot rules.",
      vote: "Pick a voting method, confirm the location or ballot return rules, and keep your confirmation."
    }
  },
  india: {
    id: "india",
    name: "India",
    civicApi: false,
    electionTypes: [
      { id: "lok_sabha", label: "Lok Sabha" },
      { id: "assembly", label: "State Assembly" },
      { id: "local", label: "Local body" },
      { id: "campus", label: "Campus / organization" }
    ],
    officialLinks: [
      { label: "Election Commission of India", url: "https://www.eci.gov.in/" },
      { label: "Voter Services Portal", url: "https://voters.eci.gov.in/" },
      { label: "Elector search", url: "https://electoralsearch.eci.gov.in/" }
    ],
    mapSearch: "election office near",
    registrationNoun: "elector registration",
    processWords: {
      register: "Verify your name on the electoral roll and use the correct ECI form if you need to register or update details.",
      id: "Check accepted voter identification guidance and keep your EPIC or approved ID ready.",
      vote: "Find your polling station, note the poll date, and plan travel before peak voting hours."
    }
  },
  global: {
    id: "global",
    name: "General election process",
    civicApi: false,
    electionTypes: [
      { id: "national", label: "National" },
      { id: "regional", label: "Regional / state" },
      { id: "local", label: "Local" },
      { id: "organization", label: "School / organization" }
    ],
    officialLinks: [
      { label: "ACE Electoral Knowledge Network", url: "https://aceproject.org/" },
      { label: "International IDEA", url: "https://www.idea.int/" },
      { label: "Google Maps", url: "https://maps.google.com/" }
    ],
    mapSearch: "election office near",
    registrationNoun: "voter registration",
    processWords: {
      register: "Find the official election authority for your jurisdiction and verify eligibility, registration, and deadline rules.",
      id: "Confirm identity, residency, and ballot access requirements from the official source.",
      vote: "Choose an allowed voting method, locate the correct polling or ballot-return channel, and save proof when available."
    }
  }
};

export const PERSONA_PROFILES = {
  first_time: {
    label: "First-time voter",
    priority: "Start with eligibility, registration, required ID, and a practice run of the voting steps.",
    checklistBoost: ["eligibility", "registration", "documents"]
  },
  moved: {
    label: "Recently moved",
    priority: "Treat your address update as the first risk to resolve because districts and polling places depend on it.",
    checklistBoost: ["registration", "address", "polling"]
  },
  busy: {
    label: "Busy on election day",
    priority: "Choose the earliest legal voting method and create a calendar reminder before the final week.",
    checklistBoost: ["method", "calendar", "transport"]
  },
  accessibility: {
    label: "Need accessible options",
    priority: "Check accessible voting options, assistance rules, transport, and contact details for election officials.",
    checklistBoost: ["accessibility", "polling", "documents"]
  },
  overseas: {
    label: "Away from home / overseas",
    priority: "Start absentee, postal, proxy, or service-voter steps early because mailing and verification can add delays.",
    checklistBoost: ["method", "documents", "calendar"]
  },
  educator: {
    label: "Helping someone else",
    priority: "Keep guidance neutral, source-led, and focused on process rather than candidate preference.",
    checklistBoost: ["sources", "calendar", "security"]
  }
};

export const SUGGESTED_QUESTIONS = [
  "What should I do first?",
  "How do I check registration?",
  "What documents should I prepare?",
  "How do I find my polling place?",
  "What if I need accessible voting?",
  "How do I avoid misinformation?"
];

const BASE_TIMELINE = [
  {
    id: "eligibility",
    title: "Confirm eligibility",
    offsetDays: -90,
    fallbackTime: "As early as possible",
    detail: "Check age, citizenship or membership, residency, and any local eligibility rules."
  },
  {
    id: "registration",
    title: "Register or update details",
    offsetDays: -60,
    fallbackTime: "Before the registration deadline",
    detail: "Register, update address/name details, or confirm the record is active."
  },
  {
    id: "documents",
    title: "Prepare documents",
    offsetDays: -30,
    fallbackTime: "A few weeks before voting",
    detail: "Review accepted ID, ballot request rules, and any proof of residence requirements."
  },
  {
    id: "research",
    title: "Review the ballot",
    offsetDays: -21,
    fallbackTime: "When the sample ballot or candidate list is published",
    detail: "Use nonpartisan or official sources to understand contests, measures, and candidate basics."
  },
  {
    id: "method",
    title: "Choose a voting method",
    offsetDays: -14,
    fallbackTime: "Before the final two weeks",
    detail: "Decide between in-person, early, mail, absentee, proxy, or the valid method in your jurisdiction."
  },
  {
    id: "calendar",
    title: "Make a voting plan",
    offsetDays: -7,
    fallbackTime: "During the final week",
    detail: "Save the date, route, documents, backup time, and official contact information."
  },
  {
    id: "vote",
    title: "Cast or return ballot",
    offsetDays: 0,
    fallbackTime: "Election day",
    detail: "Vote through the allowed channel and keep any receipt, tracking number, or confirmation."
  },
  {
    id: "results",
    title: "Follow official results",
    offsetDays: 1,
    fallbackTime: "After polls close",
    detail: "Use official election authorities for counting, recounts, certification, and final results."
  }
];

const INTENT_KEYWORDS = {
  registration: ["register", "registration", "roll", "enroll", "form 6", "address", "moved", "update"],
  documents: ["document", "id", "identity", "epic", "license", "passport", "proof"],
  timeline: ["deadline", "timeline", "when", "date", "calendar", "late", "missed"],
  polling: ["polling", "booth", "station", "location", "where", "place", "map"],
  method: ["mail", "absentee", "early", "postal", "proxy", "method", "remote"],
  accessibility: ["accessible", "disability", "wheelchair", "assistance", "language", "help"],
  security: ["misinformation", "fake", "scam", "secure", "privacy", "safe", "rumor"],
  candidates: ["candidate", "party", "ballot", "measure", "manifesto", "issue"],
  results: ["result", "count", "certify", "winner", "recount"]
};

export function normalizeContext(input = {}) {
  const country = COUNTRY_PROFILES[input.country] ? input.country : "us";
  const profile = COUNTRY_PROFILES[country];
  const electionType = profile.electionTypes.some((type) => type.id === input.electionType)
    ? input.electionType
    : profile.electionTypes[0].id;

  return {
    country,
    electionType,
    persona: PERSONA_PROFILES[input.persona] ? input.persona : "first_time",
    registrationStatus: input.registrationStatus || "unknown",
    votingMethod: input.votingMethod || "unknown",
    electionDate: input.electionDate || "",
    location: cleanText(input.location || ""),
    completedChecklist: Array.isArray(input.completedChecklist) ? input.completedChecklist : []
  };
}

export function cleanText(value) {
  return String(value).replace(/\s+/g, " ").trim();
}

export function parseLocalDate(dateValue) {
  if (!dateValue) return null;
  const parsed = new Date(`${dateValue}T12:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatDate(date) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

export function daysUntil(dateValue, today = new Date()) {
  const date = parseLocalDate(dateValue);
  if (!date) return null;
  const todayAtNoon = new Date(today);
  todayAtNoon.setHours(12, 0, 0, 0);
  return Math.ceil((date.getTime() - todayAtNoon.getTime()) / DAY_MS);
}

export function getUrgency(days) {
  if (days === null) return { label: "Planning", tone: "neutral" };
  if (days < 0) return { label: "Post-election", tone: "neutral" };
  if (days <= 3) return { label: "Immediate", tone: "danger" };
  if (days <= 14) return { label: "Final stretch", tone: "warning" };
  if (days <= 45) return { label: "Prepare now", tone: "active" };
  return { label: "Early planning", tone: "neutral" };
}

export function buildPlan(input = {}, today = new Date()) {
  const context = normalizeContext(input);
  const country = COUNTRY_PROFILES[context.country];
  const electionType = country.electionTypes.find((type) => type.id === context.electionType);
  const persona = PERSONA_PROFILES[context.persona];
  const days = daysUntil(context.electionDate, today);
  const electionDate = parseLocalDate(context.electionDate);
  const completed = new Set(context.completedChecklist);

  const timeline = BASE_TIMELINE.map((item) => {
    const dueDate = electionDate ? addDays(electionDate, item.offsetDays) : null;
    const status = getTimelineStatus(item.id, dueDate, today, context, completed);

    return {
      ...item,
      dueDate,
      displayTime: dueDate ? formatDate(dueDate) : item.fallbackTime,
      status
    };
  });

  const checklist = buildChecklist(context, country, persona, completed);
  const score = calculateReadinessScore(context, checklist, days);
  const nextAction = chooseNextAction(checklist, timeline, country, context, days);
  const urgency = getUrgency(days);
  const mapQuery = buildGoogleMapsUrl(`${country.mapSearch} ${context.location || country.name}`);

  return {
    context,
    country,
    electionType,
    persona,
    daysUntilElection: days,
    urgency,
    score,
    nextAction,
    timeline,
    checklist,
    officialLinks: country.officialLinks,
    mapQuery,
    caveat:
      "Election rules and deadlines vary by jurisdiction. Use official election authority links before making a legal or deadline-sensitive decision."
  };
}

export function answerQuestion(question, input = {}, today = new Date()) {
  const plan = buildPlan(input, today);
  const intent = classifyQuestion(question);
  const country = plan.country;
  const personaPriority = plan.persona.priority;

  const base = {
    intent,
    title: "A practical path",
    answer: "",
    steps: [],
    sources: plan.officialLinks,
    caveat: plan.caveat,
    suggestedFollowups: []
  };

  if (intent === "registration") {
    return {
      ...base,
      title: "Registration and eligibility",
      answer: `${country.processWords.register} For your situation, ${personaPriority.toLowerCase()}`,
      steps: [
        `Open the official ${country.registrationNoun} source for ${country.name}.`,
        "Search by your current legal name and current residential address where applicable.",
        "If the record is missing or outdated, complete the official registration or update process before the deadline.",
        "Save the confirmation, reference number, or screenshot from the official service."
      ],
      suggestedFollowups: ["What deadline should I watch?", "What if I moved recently?"]
    };
  }

  if (intent === "documents") {
    return {
      ...base,
      title: "Documents and ID",
      answer: country.processWords.id,
      steps: [
        "Check the official accepted-document list for your jurisdiction.",
        "Prepare the original document or approved digital/printed proof, depending on local rules.",
        "Keep a backup document ready if your jurisdiction accepts one.",
        "If your name or address recently changed, verify whether supporting proof is required."
      ],
      suggestedFollowups: ["Can I vote if my ID address is old?", "What should I carry to the polling place?"]
    };
  }

  if (intent === "timeline") {
    const datePhrase =
      plan.daysUntilElection === null
        ? "Add an election date to turn this into a dated timeline."
        : plan.daysUntilElection < 0
          ? "This election date has passed, so focus on results, ballot curing, or official certification updates."
          : `There are ${plan.daysUntilElection} day${plan.daysUntilElection === 1 ? "" : "s"} until election day.`;

    return {
      ...base,
      title: "Timeline",
      answer: `${datePhrase} Your current next action is: ${plan.nextAction}`,
      steps: plan.timeline.slice(0, 6).map((item) => `${item.displayTime}: ${item.title}. ${item.detail}`),
      suggestedFollowups: ["What should I do first?", "Add these steps to my calendar"]
    };
  }

  if (intent === "polling") {
    return {
      ...base,
      title: "Polling place",
      answer: "Polling places can change by address, election type, and date, so use the official lookup closest to election day.",
      steps: [
        "Confirm your registration address first.",
        "Use the official polling-location lookup or Google Civic API result if available for a US address.",
        "Check opening hours, accessibility, parking or transit, and required documents.",
        "Create a backup plan in case the first location is unavailable or lines are long."
      ],
      suggestedFollowups: ["Open Google Maps", "What if I am in the wrong polling place?"]
    };
  }

  if (intent === "method") {
    return {
      ...base,
      title: "Voting method",
      answer: country.processWords.vote,
      steps: [
        "List the voting methods allowed in your jurisdiction.",
        "Match the method to your situation, travel, accessibility needs, and deadlines.",
        "If voting by mail, absentee, postal, or proxy, start earlier and track each confirmation.",
        "If voting in person, save the location, hours, documents, and backup travel route."
      ],
      suggestedFollowups: ["What if I am busy on election day?", "How do I track a mail ballot?"]
    };
  }

  if (intent === "accessibility") {
    return {
      ...base,
      title: "Accessible voting",
      answer:
        "Accessible voting support is part of the voting process, but the exact options depend on local law and election authority procedures.",
      steps: [
        "Check official accessibility guidance for your jurisdiction.",
        "Confirm accessible entrance, voting equipment, assistance rules, language support, and transport options.",
        "Contact the local election office early if you need accommodation or clarification.",
        "Keep the official contact number and your voting plan with you."
      ],
      suggestedFollowups: ["How do I ask for assistance?", "What should I check before election day?"]
    };
  }

  if (intent === "security") {
    return {
      ...base,
      title: "Safety and misinformation",
      answer: "Treat unofficial election claims as unverified until an election authority, court, or official results page confirms them.",
      steps: [
        "Prefer official election authority pages over social posts or forwarded messages.",
        "Check the publication date, jurisdiction, and whether the claim applies to your election.",
        "Do not share sensitive personal data with unofficial lookup forms.",
        "Report intimidation, scams, or false polling-place information to the relevant election authority."
      ],
      suggestedFollowups: ["How do I spot fake deadline posts?", "Where should I verify results?"]
    };
  }

  if (intent === "candidates") {
    return {
      ...base,
      title: "Ballot research",
      answer: "Separate process facts from political preference: first learn what will appear on your ballot, then compare sources.",
      steps: [
        "Find the official sample ballot or candidate list for your address or constituency.",
        "Read candidate statements, party platforms, financial disclosures, or official affidavits where available.",
        "For ballot measures, read the official text and a neutral explainer before campaign material.",
        "Write down your choices before voting if local rules allow you to carry notes."
      ],
      suggestedFollowups: ["How do I compare candidates neutrally?", "What is a sample ballot?"]
    };
  }

  if (intent === "results") {
    return {
      ...base,
      title: "Results and certification",
      answer:
        "Election-night results can be partial. Final outcomes may depend on mail ballots, provisional ballots, recounts, or certification.",
      steps: [
        "Use the official election results page for your jurisdiction.",
        "Check whether the numbers are unofficial, partial, counted, recounted, or certified.",
        "Avoid treating projections as legal certification.",
        "Save the official result page if you need to reference it later."
      ],
      suggestedFollowups: ["Why do results change after election night?", "Where are official results posted?"]
    };
  }

  return {
    ...base,
    title: "Start with the next step",
    answer: `Your best next step is: ${plan.nextAction}`,
    steps: [
      "Confirm the official election authority for your jurisdiction.",
      "Verify registration, documents, voting method, and location in that order.",
      "Add deadlines to a calendar and keep confirmation records.",
      "Ask a narrower question about registration, documents, polling place, accessibility, or results."
    ],
    suggestedFollowups: SUGGESTED_QUESTIONS.slice(1, 4)
  };
}

export function classifyQuestion(question = "") {
  const normalized = cleanText(question).toLowerCase();
  if (/\b(fake|scam|rumor|misinformation|disinformation|hoax|phishing)\b/.test(normalized)) {
    return "security";
  }

  let bestIntent = "general";
  let bestScore = 0;

  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    const score = keywords.reduce((total, keyword) => {
      return normalized.includes(keyword) ? total + keyword.length : total;
    }, 0);

    if (score > bestScore) {
      bestIntent = intent;
      bestScore = score;
    }
  }

  return bestIntent;
}

export function buildGoogleCalendarUrl({ title, date, details }) {
  const parsed = date instanceof Date ? date : parseLocalDate(date);
  if (!parsed) return "";
  const start = toCalendarDate(parsed);
  const end = toCalendarDate(addDays(parsed, 1));
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${start}/${end}`,
    details
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildGoogleMapsUrl(query) {
  const params = new URLSearchParams({ api: "1", query: cleanText(query) || "election office" });
  return `https://www.google.com/maps/search/?${params.toString()}`;
}

export function createShareablePlanText(plan) {
  const lines = [
    `CivicPath plan for ${plan.country.name}`,
    `Election type: ${plan.electionType.label}`,
    `Readiness: ${plan.score}%`,
    `Next action: ${plan.nextAction}`,
    "",
    "Checklist:"
  ];

  for (const item of plan.checklist) {
    lines.push(`- ${item.done ? "[x]" : "[ ]"} ${item.label}`);
  }

  lines.push("", plan.caveat);
  return lines.join("\n");
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function toCalendarDate(date) {
  return date.toISOString().slice(0, 10).replace(/-/g, "");
}

function getTimelineStatus(id, dueDate, today, context, completed) {
  if (isChecklistDone(id, context, completed)) return "done";
  if (!dueDate) return id === "eligibility" || id === "registration" ? "current" : "upcoming";

  const distance = Math.ceil((dueDate.getTime() - today.getTime()) / DAY_MS);
  if (distance < -1) return "overdue";
  if (distance <= 7) return "current";
  return "upcoming";
}

function buildChecklist(context, country, persona, completed) {
  const boosted = new Set(persona.checklistBoost);
  const items = [
    {
      id: "eligibility",
      label: "Confirm eligibility rules",
      reason: "Prevents wasted effort before registration.",
      done: completed.has("eligibility")
    },
    {
      id: "registration",
      label: context.registrationStatus === "registered" ? "Registration confirmed" : "Register or update voter record",
      reason: country.processWords.register,
      done: context.registrationStatus === "registered" || completed.has("registration")
    },
    {
      id: "address",
      label: "Verify address or constituency",
      reason: "Address determines districts, contests, and polling place.",
      done: context.location.length > 2 || completed.has("address")
    },
    {
      id: "documents",
      label: "Prepare accepted ID or documents",
      reason: country.processWords.id,
      done: completed.has("documents")
    },
    {
      id: "method",
      label: "Choose voting method",
      reason: country.processWords.vote,
      done: context.votingMethod !== "unknown" || completed.has("method")
    },
    {
      id: "polling",
      label: "Confirm polling place or ballot return route",
      reason: "Locations and hours can change by election.",
      done: completed.has("polling")
    },
    {
      id: "accessibility",
      label: "Check accessibility or assistance options",
      reason: "Useful for disability, language, transport, or caregiving needs.",
      done: context.persona !== "accessibility" || completed.has("accessibility")
    },
    {
      id: "calendar",
      label: "Add deadlines and voting time to calendar",
      reason: "A saved reminder lowers last-minute risk.",
      done: completed.has("calendar")
    },
    {
      id: "sources",
      label: "Save official information sources",
      reason: "Protects against outdated or misleading instructions.",
      done: completed.has("sources")
    }
  ];

  return items.map((item) => ({
    ...item,
    priority: boosted.has(item.id) ? "high" : "normal"
  }));
}

function calculateReadinessScore(context, checklist, days) {
  const completedWeight = checklist.reduce((total, item) => total + (item.done ? (item.priority === "high" ? 14 : 10) : 0), 0);
  const possibleWeight = checklist.reduce((total, item) => total + (item.priority === "high" ? 14 : 10), 0);
  let score = Math.round((completedWeight / possibleWeight) * 100);

  if (context.electionDate) score += 5;
  if (days !== null && days <= 7 && score < 70) score -= 8;
  if (context.registrationStatus === "not_registered" || context.registrationStatus === "needs_update") score -= 8;

  return Math.max(0, Math.min(100, score));
}

function chooseNextAction(checklist, timeline, country, context, days) {
  const urgentTimeline = timeline.find((item) => item.status === "overdue" || item.status === "current");
  const highPriority = checklist.find((item) => !item.done && item.priority === "high");
  const firstOpen = highPriority || checklist.find((item) => !item.done);

  if (days !== null && days < 0) return "Use official results sources and check whether any ballot cure or certification steps apply.";
  if (context.registrationStatus === "not_registered") return `Register through the official ${country.registrationNoun} channel before the deadline.`;
  if (context.registrationStatus === "needs_update") return "Update your address or voter details before checking the polling place.";
  if (firstOpen) return `${firstOpen.label}. ${firstOpen.reason}`;
  if (urgentTimeline) return `${urgentTimeline.title}. ${urgentTimeline.detail}`;
  return "You have the core plan ready. Re-check official sources close to election day for any changes.";
}

function isChecklistDone(id, context, completed) {
  if (completed.has(id)) return true;
  if (id === "registration") return context.registrationStatus === "registered";
  if (id === "address") return context.location.length > 2;
  if (id === "method") return context.votingMethod !== "unknown";
  return false;
}
