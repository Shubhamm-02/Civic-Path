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

export const BASE_TIMELINE = [
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

export const INTENT_KEYWORDS = {
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
