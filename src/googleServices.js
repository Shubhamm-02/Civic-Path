import { cleanText } from "./electionAssistant.js";

const CIVIC_BASE_URL = "https://www.googleapis.com/civicinfo/v2";
const GEMINI_MODEL = "gemini-2.5-flash";

export async function fetchCivicElections(apiKey) {
  assertApiKey(apiKey, "Google Civic API key");
  const url = new URL(`${CIVIC_BASE_URL}/elections`);
  url.searchParams.set("key", apiKey);
  return fetchJson(url);
}

export async function fetchVoterInfo({ apiKey, address, electionId }) {
  assertApiKey(apiKey, "Google Civic API key");
  const cleanAddress = cleanText(address);
  if (!cleanAddress) throw new Error("Enter a US residential address for the voter info lookup.");

  const url = new URL(`${CIVIC_BASE_URL}/voterinfo`);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("address", cleanAddress);
  if (cleanText(electionId)) url.searchParams.set("electionId", cleanText(electionId));

  return fetchJson(url);
}

export async function askGemini({ apiKey, question, plan, localAnswer }) {
  assertApiKey(apiKey, "Gemini API key");
  const cleanQuestion = cleanText(question);
  if (!cleanQuestion) throw new Error("Ask a question before calling Gemini.");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
  const payload = {
    system_instruction: {
      parts: [
        {
          text:
            "You are CivicPath, a neutral election process assistant. Explain timelines and steps clearly. Do not endorse parties or candidates. Do not invent legal deadlines. If exact rules are needed, tell the user to verify official election authority links. Keep responses concise, actionable, and accessible."
        }
      ]
    },
    contents: [
      {
        role: "user",
        parts: [
          {
            text: JSON.stringify(
              {
                question: cleanQuestion,
                context: {
                  country: plan.country.name,
                  electionType: plan.electionType.label,
                  persona: plan.persona.label,
                  daysUntilElection: plan.daysUntilElection,
                  registrationStatus: plan.context.registrationStatus,
                  votingMethod: plan.context.votingMethod,
                  locationHint: plan.context.location
                },
                deterministicPlan: {
                  nextAction: plan.nextAction,
                  readiness: plan.score,
                  localAnswer
                },
                officialLinks: plan.officialLinks
              },
              null,
              2
            )
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.25,
      maxOutputTokens: 700
    }
  };

  const data = await fetchJson(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey
    },
    body: JSON.stringify(payload)
  });

  const text = data?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("\n").trim();
  if (!text) throw new Error("Gemini returned an empty response.");

  return text;
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.error?.message || `Request failed with status ${response.status}.`;
    throw new Error(message);
  }

  return data;
}

function assertApiKey(apiKey, label) {
  if (!cleanText(apiKey)) throw new Error(`${label} is required for this Google service.`);
}
