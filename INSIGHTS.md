# Player Behaviour Insights

## Insight 1: AmbroseValley Has Dead Zones That Are Costing the Studio Money

### What Caught My Eye
The traffic heatmap on AmbroseValley tells a blunt story — the Far North and Far East corners are completely empty. Zero player activity across 5 days and 21 matches. The entire player population is cramming into the center.

### The Data
- Far North/Far East corners: 0 position events across 5 days and 21 matches
- Center-Mid zone: 322 position events — the single most trafficked cell on the map
- Kill distribution: 13 of 17 mid-zone kills happen in the Center column
- Loot distribution: Center-Mid has 52 loot events vs 2 in the entire North-West zone

### Actionable Items
- **Add a named POI or loot spawn** in the Far North/East to incentivize exploration
- **Evaluate cutting the dead zones** in the next map iteration — art, geometry,
  lighting and collision all cost production time for areas with zero player impact
- **Bonus thought:** Storm pathing could nudge campers toward dead zones — 
  worth exploring with the game design team

### Metrics That Get Affected & Why
- **% of matches where any player visits Far North/East (currently 0%, target 25%+)**
  — Most direct signal. If the zone change works, players will go there. If this 
  number doesn't move, the intervention failed.
- **Average map coverage per match**
  — Measures how much of the total map gets touched per game. Low coverage means 
  wasted design real estate.
- **Match entropy (spread of fights across zones)**
  — More spread out fights means more varied, replayable matches. Concentrated 
  fights make the game predictable and stale.

### Why A Level Designer Should Care
A feature only exists if players use it. Dead zones mean real money spent on art and geometry with zero player impact. Either make the zone worth visiting or cut it- both are valid. Ignoring it is not.

## Insight 2: Bots Are Dying Too Easily — Making the Game Feel Staged

### What Caught My Eye
Filter to kill and death events, split by human vs bot — the imbalance is 
immediate. Humans are farming bots at a rate that makes the game feel scripted. 
Bots exist to add difficulty and thrill. Right now they're adding neither.

### The Data
- AmbroseValley: Humans scored 24 kills vs Bots scoring only 5
- AmbroseValley: Bot deaths = 9 vs Human deaths = 1
- GrandRift: Humans scored 6 kills vs Bots scoring 4 — slightly better but still skewed
- 25 unique bots vs 10 unique humans — bots outnumber humans yet consistently lose

### Actionable Items
- **Review bot spawn positions on the minimap** — bot death clusters reveal spots 
  where bots are consistently eliminated. These are exposed positions with poor 
  cover or bad sightlines — a level design problem
- **Add cover geometry** near high bot-death zones to give bots a fighting chance
- **Flag bot death cluster coordinates** to the AI team — the map may be funneling 
  bots into chokepoints they can't navigate out of

### Metrics That Get Affected & Why
- **Bot K/D ratio vs Human K/D ratio**
  — Most direct measure of bot competitiveness. Currently heavily skewed toward 
  humans. Closing this gap means bots feel like real opponents, not target practice.
- **Average match duration**
  — If bots die too fast, matches end too quickly. Competitive bots = longer, 
  more engaging matches.
- **Player retention after first match**
  — A game that feels too easy in the first session loses players fast. Bots that 
  fight back signal depth and replayability.

### Why A Level Designer Should Care
Bots aren't filler — they are the difficulty and thrill of the game. When bots die too easily, the game becomes indistinguishable from any generic shooter. The map is likely the culprit — exposed spawns, poor cover, chokepoint geometry bots can't navigate. Fix the map, fix the bot problem.

## Insight 3: The Storm Mechanic Is Effectively Dead — And That's a Design Failure

### What Caught My Eye
Filter for KilledByStorm. Across 89,104 events and 5 days of production data — 
2 deaths. A mechanic that costs significant design, engineering and art time is 
having virtually zero impact on gameplay. That's a problem.

### The Data
- Total KilledByStorm events: 2 out of 89,104 (0.002% of all events)
- Storm death 1: AmbroseValley, near center coordinates (-4.2, 140.9)
- Storm death 2: Lockdown, far eastern edge coordinates (244.5, 5.5)
- Both on February 14 only — zero storm deaths across Feb 10–13

### Why These Locations Are Suspicious
- **AmbroseValley center death** — a player in the center has the most escape 
  routes on any map. Dying to the storm there means the storm closed too fast, 
  a structure trapped the player, or the circle was poorly calibrated for that zone
- **Lockdown eastern edge death** — storm pushing players into a wall with no exit. 
  Classic level design trap — storm direction meets map boundary with zero escape geometry

### Actionable Items
- **Review storm closing speed** — if players can't react in time, the mechanic 
  punishes map awareness rather than rewarding it
- **Add escape routes near the Lockdown eastern boundary** — players pushed into 
  a wall is a geometry problem, not a skill problem
- **Add storm warning indicators** near AmbroseValley center structures — 
  if a building traps players during storm phase, visual cues can fix it
- **Increase storm lethality or frequency** — 0.002% death rate means players 
  have stopped fearing it entirely

### Metrics That Get Affected & Why
- **KilledByStorm rate as % of total deaths**
  — Currently 0.002% — effectively zero. A healthy storm mechanic should account 
  for at least 5-10% of deaths to create real urgency.
- **Average player rotation speed during storm phase**
  — If players aren't moving when the storm closes, they aren't feeling its pressure. 
  Measures whether the mechanic influences behaviour at all.
- **% of matches where storm forces a zone change**
  — If the storm never forces anyone to move, it's not doing its job as a 
  map control mechanic.

### Why A Level Designer Should Care
The storm exists for one reason — to force player movement and create urgency. A 0.002% death rate means it is failing completely. The two death locations point directly at level design issues including trapped geometry, no escape routes, miscalibrated circles. Fix the map around the storm, and the mechanic starts doing its job.

