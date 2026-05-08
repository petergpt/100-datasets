const catalogue = window.DATASET_CATALOG;

const byId = (id) => document.getElementById(id);
const categoryById = new Map(catalogue.categories.map((category) => [category.id, category]));
const datasetNumberById = new Map(catalogue.datasets.map((dataset, index) => [dataset.id, index + 1]));
const state = {
  query: "",
  category: "all"
};

const elements = {
  search: byId("search"),
  categoryFilter: byId("category-filter"),
  categoryRail: byId("category-rail"),
  groups: byId("dataset-groups"),
  resultCount: byId("result-count"),
  emptyState: byId("empty-state"),
  reset: byId("reset-filters"),
  template: byId("dataset-template"),
  toast: byId("toast"),
  promptDialog: byId("prompt-dialog"),
  promptDialogTitle: byId("prompt-dialog-title"),
  promptDialogNote: byId("prompt-dialog-note"),
  promptFallback: byId("prompt-fallback")
};

const categoryLabels = {
  "people-places": "People",
  "transit-travel": "Transit",
  "public-safety": "Safety",
  "homes-cities": "Cities",
  "weather-hazards": "Hazards",
  "nature-science": "Nature",
  "energy-emissions": "Energy",
  "work-trade": "Work",
  "money-organisations": "Money",
  "health-food": "Health",
  "arts-archives": "Archives",
  "culture-leisure": "Culture"
};

function normalise(value) {
  return String(value || "").toLowerCase();
}

function datasetHaystack(dataset) {
  return normalise([
    dataset.title,
    dataset.description,
    dataset.category,
    dataset.formats?.join(" "),
    dataset.access,
    dataset.size,
    dataset.caveats,
    dataset.story_ideas?.join(" ")
  ].join(" "));
}

function sourceUrl(dataset) {
  return dataset.links?.[0]?.url || dataset.source;
}

function buildDownloadLinkText(dataset) {
  const links = dataset.download_links || [];
  if (!links.length) return sourceUrl(dataset);
  return links
    .map((link, index) => {
      const label = link.label || `Data link ${index + 1}`;
      const format = link.format ? ` (${link.format})` : "";
      return `${index + 1}. ${label}${format}: ${link.url}`;
    })
    .join("\n");
}

function buildAgentPrompt(dataset) {
  const category = categoryById.get(dataset.category)?.title || dataset.category;
  const links = (dataset.links || [])
    .map((link) => `- ${link.label}: ${link.url}`)
    .join("\n");
  const ideas = (dataset.story_ideas || []).join("; ");
  return [
    `Please access and prepare the dataset "${dataset.title}" for an exploratory data analysis project.`,
    "",
    `Category: ${category}`,
    `Description: ${dataset.description}`,
    `Source: ${dataset.source}`,
    `Useful links:\n${links}`,
    `Direct data links:\n${buildDownloadLinkText(dataset)}`,
    `Expected formats: ${(dataset.formats || []).join(", ")}`,
    `Access instructions: ${dataset.access}`,
    `Expected size/manageability: ${dataset.size}`,
    `Licence or terms: ${dataset.license}`,
    `Validation note: ${dataset.validation}`,
    `Caveats: ${dataset.caveats}`,
    `Possible exploration angles: ${ideas}`,
    "",
    "Tasks:",
    "1. Use the direct data links above; open the source page only if the links have moved.",
    "2. Download or query a manageable subset first, preferably well under 1GB.",
    "3. Preserve source URLs, licence notes and any data dictionaries or metadata.",
    "4. Load the data into a standard tool using its native format where possible.",
    "5. Summarise row count, fields, date/geography coverage, missingness and any caveats before analysis."
  ].join("\n");
}

async function copyText(text, successMessage, fallbackTitle = "Copy text") {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    showToast(successMessage);
  } catch (error) {
    showPromptFallback(text, fallbackTitle);
    showToast("Text selected for manual copy");
  }
}

function showPromptFallback(text, title) {
  elements.promptDialogTitle.textContent = title;
  elements.promptDialogNote.textContent = "Copy is restricted in this browser context. The text is selected below.";
  elements.promptFallback.value = text;
  if (typeof elements.promptDialog.showModal === "function") {
    elements.promptDialog.showModal();
  } else {
    elements.promptDialog.setAttribute("open", "");
  }
  requestAnimationFrame(() => {
    elements.promptFallback.focus();
    elements.promptFallback.select();
  });
}

let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("visible");
  toastTimer = setTimeout(() => {
    elements.toast.classList.remove("visible");
  }, 2600);
}

function setupFilters() {
  catalogue.categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = categoryLabels[category.id] || category.title;
    elements.categoryFilter.appendChild(option);
  });

  elements.search.addEventListener("input", () => {
    state.query = elements.search.value.trim();
    render();
  });

  elements.categoryFilter.addEventListener("change", () => {
    state.category = elements.categoryFilter.value;
    render();
  });

  elements.reset.addEventListener("click", () => {
    elements.search.value = "";
    elements.categoryFilter.value = "all";
    state.query = "";
    state.category = "all";
    render();
  });
}

function matchesQuery(dataset) {
  return !state.query || datasetHaystack(dataset).includes(normalise(state.query));
}

function renderRail() {
  const base = catalogue.datasets.filter(matchesQuery);
  const counts = new Map();
  base.forEach((dataset) => {
    counts.set(dataset.category, (counts.get(dataset.category) || 0) + 1);
  });

  elements.categoryRail.replaceChildren();
  const allButton = document.createElement("button");
  allButton.type = "button";
  allButton.className = `category-button${state.category === "all" ? " active" : ""}`;
  allButton.textContent = "All";
  allButton.addEventListener("click", () => {
    elements.categoryFilter.value = "all";
    state.category = "all";
    render();
  });
  elements.categoryRail.appendChild(allButton);

  catalogue.categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `category-button${state.category === category.id ? " active" : ""}`;
    button.textContent = categoryLabels[category.id] || category.title;
    button.addEventListener("click", () => {
      elements.categoryFilter.value = category.id;
      state.category = category.id;
      render();
    });
    elements.categoryRail.appendChild(button);
  });
}

function passesFilters(dataset) {
  if (state.category !== "all" && dataset.category !== state.category) return false;
  if (state.query && !datasetHaystack(dataset).includes(normalise(state.query))) return false;
  return true;
}

function renderDataset(dataset) {
  const clone = elements.template.content.cloneNode(true);
  const card = clone.querySelector(".dataset-card");
  const number = datasetNumberById.get(dataset.id);
  const heading = clone.querySelector("h3");
  const headingId = `${dataset.id}-title`;
  card.id = dataset.id;
  card.dataset.id = dataset.id;
  card.setAttribute("aria-labelledby", headingId);
  clone.querySelector(".dataset-number").textContent = number ? String(number).padStart(2, "0") : "";
  clone.querySelector(".card-category").textContent = categoryLabels[dataset.category] || categoryById.get(dataset.category)?.title || dataset.category;
  heading.id = headingId;
  heading.textContent = dataset.title;
  clone.querySelector(".description").textContent = dataset.description;
  clone.querySelector(".formats").textContent = (dataset.formats || []).join(", ");
  clone.querySelector(".size").textContent = dataset.size;
  clone.querySelector(".access").textContent = dataset.access;
  clone.querySelector(".caveats").textContent = dataset.caveats;

  const source = clone.querySelector(".source-link");
  source.href = sourceUrl(dataset);
  source.textContent = "Open";

  const copy = clone.querySelector(".copy-action");
  copy.addEventListener("click", () => {
    copyText(buildAgentPrompt(dataset), `${dataset.title} prompt copied`, "Agent prompt");
  });

  const dataLinks = dataset.download_links || [];
  const copyLinks = clone.querySelector(".copy-links-action");
  copyLinks.textContent = dataLinks.length === 1 ? "Data link" : "Data links";
  copyLinks.addEventListener("click", () => {
    copyText(buildDownloadLinkText(dataset), `${dataset.title} data links copied`, "Data links");
  });

  const ideas = clone.querySelector(".story-ideas");
  ideas.title = (dataset.story_ideas || []).join("; ");
  (dataset.story_ideas || []).slice(0, 2).forEach((idea) => {
    const tag = document.createElement("span");
    tag.textContent = idea;
    ideas.appendChild(tag);
  });

  return clone;
}

function renderGroups(filtered) {
  elements.groups.replaceChildren();
  catalogue.categories.forEach((category) => {
    const groupDatasets = filtered.filter((dataset) => dataset.category === category.id);
    if (!groupDatasets.length) return;

    const group = document.createElement("section");
    group.className = "group";
    group.id = category.id;

    const header = document.createElement("div");
    header.className = "group-header";
    const copy = document.createElement("div");
    const title = document.createElement("h2");
    title.textContent = categoryLabels[category.id] || category.title;
    copy.append(title);
    header.append(copy);
    group.appendChild(header);
    const grid = document.createElement("div");
    grid.className = "dataset-grid";

    groupDatasets.forEach((dataset) => grid.appendChild(renderDataset(dataset)));
    group.appendChild(grid);
    elements.groups.appendChild(group);
  });
}

function render() {
  const filtered = catalogue.datasets.filter(passesFilters);
  renderRail();
  renderGroups(filtered);
  const resultText = state.query || state.category !== "all" ? `${filtered.length} shown` : "";
  elements.resultCount.textContent = resultText;
  elements.resultCount.parentElement.hidden = !resultText;
  elements.emptyState.hidden = filtered.length !== 0;
}

function initialise() {
  setupFilters();
  render();
  scrollToCurrentHash();
}

function scrollToCurrentHash() {
  const id = decodeURIComponent(window.location.hash.slice(1));
  if (!id) return;
  window.setTimeout(() => {
    document.getElementById(id)?.scrollIntoView({ block: "start" });
  }, 0);
}

window.addEventListener("hashchange", scrollToCurrentHash);
window.addEventListener("load", scrollToCurrentHash);

initialise();
