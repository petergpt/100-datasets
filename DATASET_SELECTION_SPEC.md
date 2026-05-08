# Dataset Selection Spec

This catalogue is for datasets that a human or AI agent can quickly find, fetch and explore without special setup. A dataset should be kept only if it is genuinely accessible as data, not just browsable through a website.

## Hard Requirements

Keep a dataset only when all of these are true:

- It has a direct downloadable file or unauthenticated endpoint that an agent can access.
- It does not require login, account creation, API keys, tokens, captchas, paid access, licence-click gates or email request forms.
- It uses a standard, broadly readable format: CSV, TSV only if easily handled and clearly tabular, XLS, XLSX, ODS, JSON, GeoJSON, shapefile ZIP, GeoPackage, or a ZIP containing those formats.
- It is manageable for a one-off exploration task: under 1GB maximum, preferably under 250MB, and ideally much smaller.
- It is reasonably contained: one file, one ZIP, a small set of linked files, or a simple API query with clear pagination.
- It can tell a useful story by itself: enough rows, fields, geography, time span or categories to support exploration without needing a large external warehouse.
- It has enough context to use responsibly: source, licence or terms, date/freshness, geography/time coverage, and caveats.

## Strong Positive Signals

Prioritise datasets with:

- Clean tabular or geospatial structure.
- A stable direct URL from an official source, GitHub raw file, public object store, or well-documented open API.
- Built-in metadata, data dictionaries, column notes or documentation.
- Obvious visual hooks: maps, timelines, rankings, flows, networks, distributions or comparisons.
- Useful granularity without being overwhelming, such as local-authority, station, product, artwork, route, incident, country-year or monthly records.
- Good subset paths, such as one year, one region, one indicator, one city or one small table.

## Acceptable Access Patterns

These are acceptable:

- Direct file URL, for example a `.csv`, `.xlsx`, `.json`, `.geojson`, `.zip`, `.ods` or shapefile ZIP.
- Public raw GitHub or Hugging Face file URL.
- Public API endpoint that returns CSV, JSON or GeoJSON with no key.
- Queryable API where the catalogue provides an exact working example and clear notes for changing parameters.
- Mirror URLs, if the original source is noted and the mirror is openly downloadable.

These are not acceptable:

- Search-only websites with no bulk or endpoint access.
- “Click download after logging in” flows.
- Kaggle-only downloads unless there is a separate direct public mirror.
- APIs requiring keys, bearer tokens, app registration or special headers beyond ordinary content/version headers.
- Files that need specialist tooling as the primary route, such as NetCDF, HDF, raw database dumps, custom binaries or opaque archives.
- Very large national/global dumps that exceed the size rule unless there is a simple documented subset route.

## Validation Procedure

For each candidate:

1. Find the source page and identify the actual data route, not just the landing page.
2. Capture at least one direct data URL or exact unauthenticated API query.
3. Probe the direct URL without downloading the whole dataset:
   - Try `HEAD`.
   - If `HEAD` fails or is unsupported, try a small ranged `GET`.
   - Record whether bytes are returned, the status code, content type and any redirects.
4. Confirm the returned content is actually data, not HTML, a login screen, a 403 page or a JavaScript app shell.
5. Check size where possible. Drop anything over 1GB unless there is a smaller official subset route.
6. Open a small sample or first rows where feasible and verify the format is intelligible.
7. Record licence/terms, freshness, coverage and caveats.
8. Deduplicate against existing catalogue items and merge better links into the existing entry.
9. If the agent cannot fetch it directly, remove it rather than keeping it as “interesting”.

## Catalogue Entry Shape

Each accepted dataset should include:

- `id`: short stable slug.
- `title`: human-readable dataset name.
- `category`: broad catalogue group.
- `description`: 1-3 sentences explaining what it contains and why it is useful.
- `source`: main source or documentation page.
- `links`: landing page, docs, data dictionary or official source links.
- `download_links`: protected copyable direct data URLs with label and format.
- `formats`: expected data formats.
- `size`: estimated size and manageability notes.
- `license`: licence or terms summary.
- `access`: practical instructions for fetching the data.
- `validation`: what was validated and when.
- `caveats`: quality, coverage, privacy, bias or interpretation notes.
- `story_ideas`: a few concrete exploration angles.

## Already In The Catalogue

Do not propose duplicates of these existing catalogue entries. If you find a better direct download link for one of them, return it as an improvement to the existing entry rather than a new dataset.
Current catalogue size: 100 datasets.

### People & Places

- Census 2021 Bulk Data via Nomis
- Census 2021 Origin-Destination Flows
- English Indices of Deprivation 2025
- Eurostat Regional Statistics by NUTS Region
- GeoNames Cities500 Gazetteer
- IRS County-to-County Migration Data
- Nomis Annual Population Survey / Labour Market Data
- OECD Regional Well-Being
- ONS Open Geography Portal Boundaries
- UNHCR Refugee Population Statistics API
- World Bank World Development Indicators

### Transit & Travel

- Bus Open Data Service - England
- Citi Bike January 2024 Trip Data
- DfT Road Traffic Counts
- Divvy Chicago Trip Data - 2018 Q3
- London Public Transport Journeys by Mode
- MBTA Static GTFS Schedule Feed
- MTA NYC Subway Static GTFS Feed
- NaPTAN Public Transport Access Nodes
- NYC Taxi and For-Hire Vehicle Trip Records
- ORR Estimates of Station Usage
- OurAirports Global Airports and Runways
- TfL Cycle Hire Usage
- US BTS Airline On-Time Statistics
- Washington State Electric Vehicle Population Data

### Public Safety

- Chicago Crimes - Filtered Monthly Extract
- FEMA Disaster Declarations Summaries
- FHWA National Bridge Inventory 2025
- London Fire Brigade Animal Rescues
- London Fire Brigade Incident Records
- NHTSA FARS National Fatal Crash Data
- NYC Motor Vehicle Collisions - Crashes
- Police.uk Street-Level Crime Data
- STATS19 Road Safety Open Data
- UCDP Georeferenced Event Dataset

### Homes & Cities

- Historic England National Heritage List for England
- HM Land Registry Price Paid Data
- Inside Airbnb
- NYC 2015 Street Tree Census
- NYC 311 Service Requests - Filtered Extract
- OS Open Greenspace
- Planning Data Platform - England
- Zillow Real Estate Research Data

### Weather & Hazards

- Defra UK-AIR Modelled Background Pollution Maps
- Environment Agency Flood Monitoring APIs
- EPA AirData Annual AQI by County
- NOAA CO-OPS Tides and Currents Water Levels
- NOAA Storm Prediction Center Severe Weather Reports
- Open-Meteo Historical Weather API
- USGS Earthquake Hazards Recent Feeds
- USGS Water Services Streamflow Time Series

### Nature & Science

- GBIF Occurrence Search API Example
- NASA Exoplanet Archive Planetary Systems Table
- NASA Meteorite Landings
- NASA/JPL Small-Body Close-Approach Data API
- National Forest Inventory GB

### Energy & Emissions

- DESNZ NEED Energy Consumption Tables
- EIA State Energy Data System Complete File
- Global Power Plant Database
- NESO Historic Electricity Demand Data
- Our World in Data CO2 and Greenhouse Gas Emissions

### Work & Trade

- BLS QCEW 2024 Annual Single File
- Business Register and Employment Survey - Nomis
- FAOSTAT Crops and Livestock Production - Oceania
- HMRC UK Overseas Trade Statistics
- IRS County Income Data
- ONS Subregional Labour Productivity

### Money & Organisations

- Charity Commission Full Register Download
- Companies House Free Company Data Product
- FDIC Failed Bank List
- IPSA MPs Staffing and Business Costs
- U.S. Treasury Monthly Treasury Statement Table 1
- World Bank Global Findex

### Health & Food

- CDC Chronic Disease Indicators
- CDC PLACES Local Health Estimates
- CDC/ATSDR Social Vulnerability Index 2022
- Food Standards Agency Food Hygiene Ratings API
- Open Food Facts
- USDA Food Environment Atlas
- USDA FoodData Central Foundation Foods

### Arts & Archives

- Library of Congress Chronicling America API
- Metropolitan Museum of Art Open Access CSV
- Museum of Modern Art Collection
- National Park Service Visitor Use Statistics
- Old Bailey Online Data
- Roman Amphitheaters Database
- Slave Voyages Database
- Social Security Baby Names
- Tate Collection Metadata

### Culture & Leisure

- Bob Ross Paintings Elements
- Eurovision Song Contest Data
- Film Dialogue by Gender
- Global Shark Attack File
- Hip Hop Vocabulary
- Michelin Star Restaurants Worldwide
- Rebrickable Lego Sets Database
- Spotify Tracks Audio Features
- The Pudding: Women's Pocket Sizes
- UFO Sightings Database
- Wine Enthusiast Reviews

## Search Guidance

Search broadly and use judgement about where to look. The aim is not to follow a fixed list of portals, but to discover new datasets that meet the access and quality bar above.

Good searches should:

- Bias toward terms that imply downloadable data, such as CSV, XLSX, JSON, GeoJSON, shapefile, bulk download, open data, data dictionary and API.
- Explore across domains rather than staying only in UK public-sector data.
- Prefer concrete dataset pages over listicles, dashboards or search interfaces.
- Follow promising source pages until the actual data file or endpoint is found.
- Check whether an apparently gated dataset has an open mirror, official API, or smaller public extract.
- Look for datasets with fresh story potential, not just more examples of categories already well covered.

## Output From Search Agents

For each proposed dataset, return:

```text
Title:
Decision: keep / drop / needs replacement
Reason:
Direct data link(s):
Source/doc link:
Format:
Estimated size:
Auth/key/login required: no / yes / unclear
Validation proof: status/content-type/sample note
Licence/terms:
Caveats:
Story ideas:
Suggested category:
```

Use `drop` for anything gated, oversized, search-only, specialist-format-first, or not directly fetchable from an agent environment.
