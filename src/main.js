import {
  COUNTRY_PROFILES,
  SUGGESTED_QUESTIONS,
  answerQuestion,
  buildGoogleCalendarUrl,
  buildPlan,
  createShareablePlanText,
  formatDate
} from "./electionAssistant.js";
import { askGemini, fetchCivicElections, fetchVoterInfo } from "./googleServices.js";

const STORAGE_KEY = "civicPathContext";
const KEY_STORAGE = "civicPathGoogleKeys";

const elements = {
  form: document.querySelector("#contextForm"),
  country: document.querySelector("#country"),
  electionType: document.querySelector("#electionType"),
  persona: document.querySelector("#persona"),
  registrationStatus: document.querySelector("#registrationStatus"),
  votingMethod: document.querySelector("#votingMethod"),
  electionDate: document.querySelector("#electionDate"),
  location: document.querySelector("#location"),
  resetButton: document.querySelector("#resetButton"),
  scoreRing: document.querySelector("#scoreRing"),
  scoreValue: document.querySelector("#scoreValue"),
  nextAction: document.querySelector("#nextAction"),
  urgencyBadge: document.querySelector("#urgencyBadge"),
  timelineList: document.querySelector("#timelineList"),
  checklist: document.querySelector("#checklist"),
  officialLinks: document.querySelector("#officialLinks"),
  googleActions: document.querySelector("#googleActions"),
  suggestedQuestions: document.querySelector("#suggestedQuestions"),
  questionForm: document.querySelector("#questionForm"),
  questionInput: document.querySelector("#questionInput"),
  answerBox: document.querySelector("#answerBox"),
  assistantMode: document.querySelector("#assistantMode"),
  calendarHeaderLink: document.querySelector("#calendarHeaderLink"),
  mapsHeaderLink: document.querySelector("#mapsHeaderLink"),
  geminiKey: document.querySelector("#geminiKey"),
  civicKey: document.querySelector("#civicKey"),
  civicAddress: document.querySelector("#civicAddress"),
  civicElectionId: document.querySelector("#civicElectionId"),
  rememberKeys: document.querySelector("#rememberKeys"),
  loadElectionsButton: document.querySelector("#loadElectionsButton"),
  lookupVoterButton: document.querySelector("#lookupVoterButton"),
  clearKeysButton: document.querySelector("#clearKeysButton"),
  googleStatus: document.querySelector("#googleStatus"),
  timelineTemplate: document.querySelector("#timelineItemTemplate")
};

const state = {
  context: loadContext(),
  completedChecklist: new Set(loadContext().completedChecklist || []),
  plan: null
};

init();

function init() {
  restoreKeys();
  hydrateForm();
  renderElectionTypes();
  renderSuggestedQuestions();
  bindEvents();
  render();
}

function bindEvents() {
  elements.form.addEventListener("submit", (event) => {
    event.preventDefault();
    updateContextFromForm();
    render();
  });

  for (const input of elements.form.elements) {
    input.addEventListener("change", () => {
      updateContextFromForm();
      if (input === elements.country) renderElectionTypes();
      render();
    });
  }

  elements.resetButton.addEventListener("click", () => {
    state.context = getDefaultContext();
    state.completedChecklist = new Set();
    persistContext();
    hydrateForm();
    renderElectionTypes();
    render();
  });

  elements.questionForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await respondToQuestion(elements.questionInput.value);
  });

  elements.loadElectionsButton.addEventListener("click", loadCivicElections);
  elements.lookupVoterButton.addEventListener("click", lookupVoterInfo);
  elements.clearKeysButton.addEventListener("click", clearKeys);

  for (const keyInput of [elements.geminiKey, elements.civicKey]) {
    keyInput.addEventListener("change", persistKeys);
    keyInput.addEventListener("input", updateAssistantMode);
  }

  elements.rememberKeys.addEventListener("change", persistKeys);
}

function getDefaultContext() {
  return {
    country: "us",
    electionType: "federal",
    persona: "first_time",
    registrationStatus: "unknown",
    votingMethod: "unknown",
    electionDate: "",
    location: "",
    completedChecklist: []
  };
}

function loadContext() {
  try {
    return { ...getDefaultContext(), ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
  } catch {
    return getDefaultContext();
  }
}

function persistContext() {
  const serializable = {
    ...state.context,
    completedChecklist: [...state.completedChecklist]
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
}

function restoreKeys() {
  try {
    const keys = JSON.parse(localStorage.getItem(KEY_STORAGE) || "{}");
    elements.geminiKey.value = keys.geminiKey || "";
    elements.civicKey.value = keys.civicKey || "";
    elements.rememberKeys.checked = Boolean(keys.remember);
  } catch {
    clearKeys();
  }
  updateAssistantMode();
}

function persistKeys() {
  if (!elements.rememberKeys.checked) {
    localStorage.removeItem(KEY_STORAGE);
    return;
  }

  localStorage.setItem(
    KEY_STORAGE,
    JSON.stringify({
      remember: true,
      geminiKey: elements.geminiKey.value,
      civicKey: elements.civicKey.value
    })
  );
}

function clearKeys() {
  elements.geminiKey.value = "";
  elements.civicKey.value = "";
  elements.rememberKeys.checked = false;
  localStorage.removeItem(KEY_STORAGE);
  setGoogleStatus("API keys cleared from this browser.");
  updateAssistantMode();
}

function hydrateForm() {
  elements.country.value = state.context.country;
  elements.persona.value = state.context.persona;
  elements.registrationStatus.value = state.context.registrationStatus;
  elements.votingMethod.value = state.context.votingMethod;
  elements.electionDate.value = state.context.electionDate;
  elements.location.value = state.context.location;
}

function renderElectionTypes() {
  const country = COUNTRY_PROFILES[elements.country.value] || COUNTRY_PROFILES.us;
  elements.electionType.replaceChildren();

  for (const type of country.electionTypes) {
    const option = document.createElement("option");
    option.value = type.id;
    option.textContent = type.label;
    elements.electionType.append(option);
  }

  const typeIds = new Set(country.electionTypes.map((type) => type.id));
  elements.electionType.value = typeIds.has(state.context.electionType)
    ? state.context.electionType
    : country.electionTypes[0].id;
  state.context.electionType = elements.electionType.value;
}

function updateContextFromForm() {
  state.context = {
    country: elements.country.value,
    electionType: elements.electionType.value,
    persona: elements.persona.value,
    registrationStatus: elements.registrationStatus.value,
    votingMethod: elements.votingMethod.value,
    electionDate: elements.electionDate.value,
    location: elements.location.value,
    completedChecklist: [...state.completedChecklist]
  };
  persistContext();
}

function render() {
  state.context.completedChecklist = [...state.completedChecklist];
  state.plan = buildPlan(state.context);
  persistContext();
  renderPlan(state.plan);
  updateAssistantMode();
}

function renderPlan(plan) {
  elements.scoreValue.textContent = String(plan.score);
  elements.scoreRing.style.setProperty("--score", `${plan.score * 3.6}deg`);
  elements.nextAction.textContent = plan.nextAction;
  elements.urgencyBadge.textContent = plan.urgency.label;
  elements.urgencyBadge.dataset.tone = plan.urgency.tone;

  renderTimeline(plan);
  renderChecklist(plan);
  renderOfficialLinks(plan);
  renderGoogleActions(plan);
}

function renderTimeline(plan) {
  elements.timelineList.replaceChildren();
  for (const item of plan.timeline) {
    const node = elements.timelineTemplate.content.firstElementChild.cloneNode(true);
    node.dataset.status = item.status;
    node.querySelector(".timeline-title").textContent = item.title;
    node.querySelector(".timeline-meta").textContent = `${item.displayTime} - ${item.detail}`;
    elements.timelineList.append(node);
  }
}

function renderChecklist(plan) {
  elements.checklist.replaceChildren();
  for (const item of plan.checklist) {
    const row = document.createElement("label");
    row.className = "check-row";
    row.dataset.priority = item.priority;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.done;
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        state.completedChecklist.add(item.id);
      } else {
        state.completedChecklist.delete(item.id);
      }
      render();
    });

    const copy = document.createElement("span");
    const title = document.createElement("strong");
    const reason = document.createElement("small");
    title.textContent = item.label;
    reason.textContent = item.reason;
    copy.append(title, reason);

    row.append(checkbox, copy);
    elements.checklist.append(row);
  }
}

function renderOfficialLinks(plan) {
  elements.officialLinks.replaceChildren();
  for (const link of plan.officialLinks) {
    const li = document.createElement("li");
    const anchor = document.createElement("a");
    anchor.href = link.url;
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
    anchor.textContent = link.label;
    li.append(anchor);
    elements.officialLinks.append(li);
  }
}

function renderGoogleActions(plan) {
  elements.googleActions.replaceChildren();

  const firstCalendarItem = plan.timeline.find((item) => item.dueDate && item.status !== "done") || plan.timeline.find((item) => item.dueDate);
  const calendarUrl = firstCalendarItem
    ? buildGoogleCalendarUrl({
        title: `CivicPath: ${firstCalendarItem.title}`,
        date: firstCalendarItem.dueDate,
        details: `${firstCalendarItem.detail}\n\n${plan.caveat}`
      })
    : "";

  setLink(elements.calendarHeaderLink, calendarUrl, "Add next deadline to Google Calendar");
  setLink(elements.mapsHeaderLink, plan.mapQuery, "Open election office search in Google Maps");

  if (calendarUrl) {
    elements.googleActions.append(createActionLink("Add next deadline to Google Calendar", calendarUrl));
  }

  elements.googleActions.append(createActionLink("Open election office search in Google Maps", plan.mapQuery));

  const copyButton = document.createElement("button");
  copyButton.className = "button subtle";
  copyButton.type = "button";
  copyButton.textContent = "Copy plan";
  copyButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText(createShareablePlanText(plan));
    setGoogleStatus("Plan copied to clipboard.");
  });
  elements.googleActions.append(copyButton);
}

function renderSuggestedQuestions() {
  elements.suggestedQuestions.replaceChildren();
  for (const question of SUGGESTED_QUESTIONS) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "question-chip";
    button.textContent = question;
    button.addEventListener("click", async () => {
      elements.questionInput.value = question;
      await respondToQuestion(question);
    });
    elements.suggestedQuestions.append(button);
  }
}

async function respondToQuestion(question) {
  const localAnswer = answerQuestion(question, state.context);
  renderAnswer(localAnswer, "Local logic");

  if (!elements.geminiKey.value.trim()) {
    updateAssistantMode();
    return;
  }

  elements.assistantMode.textContent = "Gemini thinking";
  try {
    const text = await askGemini({
      apiKey: elements.geminiKey.value,
      question,
      plan: state.plan,
      localAnswer
    });
    renderGeminiAnswer(text, localAnswer);
    elements.assistantMode.textContent = "Gemini + local logic";
  } catch (error) {
    renderAnswer(
      {
        ...localAnswer,
        title: `${localAnswer.title} (local fallback)`,
        answer: `${localAnswer.answer} Gemini was unavailable: ${error.message}`
      },
      "Local fallback"
    );
  }
}

function renderAnswer(answer, mode) {
  elements.assistantMode.textContent = mode;
  elements.answerBox.replaceChildren();

  const title = document.createElement("h3");
  title.textContent = answer.title;
  const body = document.createElement("p");
  body.textContent = answer.answer;

  const list = document.createElement("ol");
  for (const step of answer.steps) {
    const li = document.createElement("li");
    li.textContent = step;
    list.append(li);
  }

  const caveat = document.createElement("p");
  caveat.className = "caveat";
  caveat.textContent = answer.caveat;

  elements.answerBox.append(title, body, list, caveat);
}

function renderGeminiAnswer(text, localAnswer) {
  elements.answerBox.replaceChildren();
  const title = document.createElement("h3");
  title.textContent = "Gemini response";

  const paragraphs = text.split(/\n{2,}/).filter(Boolean);
  elements.answerBox.append(title);
  for (const paragraph of paragraphs) {
    const p = document.createElement("p");
    p.textContent = paragraph.replace(/\*\*/g, "");
    elements.answerBox.append(p);
  }

  const details = document.createElement("details");
  const summary = document.createElement("summary");
  summary.textContent = "Local reasoning snapshot";
  const fallback = document.createElement("p");
  fallback.textContent = `${localAnswer.title}: ${localAnswer.answer}`;
  details.append(summary, fallback);
  elements.answerBox.append(details);
}

async function loadCivicElections() {
  setGoogleStatus("Loading available elections from Google Civic Information API...");
  try {
    const data = await fetchCivicElections(elements.civicKey.value);
    const elections = data.elections || [];
    setGoogleStatus(`Loaded ${elections.length} election${elections.length === 1 ? "" : "s"}.`);
    renderCivicData(elections.map((election) => `${election.name} (${election.id}) - ${election.electionDay || "date unavailable"}`));
  } catch (error) {
    setGoogleStatus(error.message);
  }
}

async function lookupVoterInfo() {
  setGoogleStatus("Looking up voter information with Google Civic Information API...");
  try {
    const data = await fetchVoterInfo({
      apiKey: elements.civicKey.value,
      address: elements.civicAddress.value,
      electionId: elements.civicElectionId.value
    });

    const lines = [];
    if (data.election?.name) lines.push(`Election: ${data.election.name}`);
    if (data.normalizedInput) {
      const input = data.normalizedInput;
      lines.push(`Normalized address: ${[input.line1, input.city, input.state, input.zip].filter(Boolean).join(", ")}`);
    }
    if (data.pollingLocations?.length) {
      lines.push(`Polling locations: ${data.pollingLocations.length}`);
      data.pollingLocations.slice(0, 3).forEach((location) => {
        lines.push(`- ${formatCivicAddress(location.address)} ${location.pollingHours || ""}`.trim());
      });
    }
    if (data.earlyVoteSites?.length) lines.push(`Early vote sites: ${data.earlyVoteSites.length}`);
    if (data.contests?.length) lines.push(`Contests on response: ${data.contests.length}`);
    if (data.state?.[0]?.electionAdministrationBody?.electionInfoUrl) {
      lines.push(`Election info: ${data.state[0].electionAdministrationBody.electionInfoUrl}`);
    }

    setGoogleStatus("Voter information loaded.");
    renderCivicData(lines.length ? lines : ["Google Civic returned a response, but no location details were available for this query."]);
  } catch (error) {
    setGoogleStatus(error.message);
  }
}

function renderCivicData(lines) {
  const wrapper = document.createElement("div");
  wrapper.className = "civic-results";
  const title = document.createElement("strong");
  title.textContent = "Google Civic results";
  const list = document.createElement("ul");

  for (const line of lines) {
    const item = document.createElement("li");
    item.textContent = line;
    list.append(item);
  }

  wrapper.append(title, list);
  elements.googleStatus.replaceChildren(wrapper);
}

function formatCivicAddress(address = {}) {
  return [address.locationName, address.line1, address.city, address.state, address.zip].filter(Boolean).join(", ");
}

function setGoogleStatus(message) {
  elements.googleStatus.textContent = message;
}

function updateAssistantMode() {
  elements.assistantMode.textContent = elements.geminiKey.value.trim() ? "Gemini ready" : "Local logic";
}

function createActionLink(label, href) {
  const anchor = document.createElement("a");
  anchor.className = "button";
  anchor.href = href;
  anchor.target = "_blank";
  anchor.rel = "noreferrer";
  anchor.textContent = label;
  return anchor;
}

function setLink(anchor, href, label) {
  if (!href) {
    anchor.setAttribute("aria-disabled", "true");
    anchor.removeAttribute("href");
    return;
  }

  anchor.href = href;
  anchor.textContent = label;
  anchor.removeAttribute("aria-disabled");
}
