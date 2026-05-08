# 100 Datasets

[Open the catalogue](https://petergpt.github.io/100-datasets/) · [Machine-readable manifest](https://petergpt.github.io/100-datasets/datasets.json)

A compact catalogue of 100 openly downloadable datasets for data exploration projects. Each entry has a source link, protected direct data links, access notes, format and size guidance, caveats, story ideas, and a copyable prompt for AI agents.

![100 Datasets screenshot](assets/screenshot.png)

## What It Is

This is a static HTML catalogue for students, teachers, analysts, and AI agents who need a dataset that can be fetched without a login, API key, account gate, or custom tooling.

The catalogue is intentionally selective. Every included dataset has either a direct file URL or an unauthenticated API route in a standard format such as CSV, JSON, GeoJSON, XLSX, GTFS, or a ZIP of readable files. Most entries are small or subsettable enough for a one-off exploration task.

## How To Use It

Open the hosted page, search by topic or format, choose a category, and use the card buttons:

- **Open** opens the source or documentation page.
- **Data link** copies the direct download URL or endpoint.
- **Prompt** copies a dataset-specific instruction block for an AI agent.

Direct data links are copy-only in the UI so people do not accidentally download large files by clicking around.

## For Agents

The canonical source of catalogue data is [`datasets.json`](datasets.json). It contains:

- `categories`: short, human-readable groups.
- `datasets`: one object per dataset, with `download_links`, `formats`, `size`, `license`, `access`, `validation`, `caveats`, and `story_ideas`.

Agents should read `datasets.json` first, then use `download_links` for the actual fetch. The HTML also advertises the manifest through:

```html
<link rel="alternate" type="application/json" href="datasets.json" title="100 Datasets manifest">
```

There is also an [`llms.txt`](llms.txt) file with a concise agent-facing route map.

## Categories

| Category | Count |
| --- | ---: |
| People & Places | 11 |
| Transit & Travel | 14 |
| Public Safety | 10 |
| Homes & Cities | 8 |
| Weather & Hazards | 8 |
| Nature & Science | 5 |
| Energy & Emissions | 5 |
| Work & Trade | 6 |
| Money & Organisations | 6 |
| Health & Food | 7 |
| Arts & Archives | 9 |
| Culture & Leisure | 11 |

## Local Preview

This is a dependency-free static site. Any local static server will work:

```bash
python3 -m http.server 8899
```

Then open `http://127.0.0.1:8899/`.

## Files

- [`index.html`](index.html): static catalogue shell.
- [`datasets.json`](datasets.json): source manifest for humans and agents.
- [`datasets.js`](datasets.js): browser-loaded mirror of the manifest.
- [`app.js`](app.js): filtering, rendering, copy prompts, and deep links.
- [`styles.css`](styles.css): compact responsive catalogue styling.
- [`DATASET_SELECTION_SPEC.md`](DATASET_SELECTION_SPEC.md): selection rules and current inventory.

## Licence

The catalogue code and metadata in this repository are released under the MIT License. The datasets themselves are owned and licensed by their original publishers; each catalogue entry includes source and terms notes where available.
