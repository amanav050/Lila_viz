import pandas as pd
import os
import json

data_dir = "src/data/player_data"
output_dir = "public/data"
os.makedirs(output_dir, exist_ok=True)

all_events = []

for date_folder in os.listdir(data_dir):
    date_path = os.path.join(data_dir, date_folder)
    if not os.path.isdir(date_path):
        continue
    for filename in os.listdir(date_path):
        if filename == '.DS_Store':
            continue
        filepath = os.path.join(date_path, filename)
        try:
            df = pd.read_parquet(filepath)
            df['date'] = date_folder
            df['event'] = df['event'].apply(lambda x: x.decode() if isinstance(x, bytes) else x)
            df['is_bot'] = df['user_id'].apply(lambda uid: str(uid).isdigit())
            df['ts'] = df['ts'].astype(str)
            all_events.append(df)
        except Exception as e:
            print(f"Skipping {filename}: {e}")

combined = pd.concat(all_events, ignore_index=True)
print(f"Total events: {len(combined)}")
print(f"Maps: {combined['map_id'].unique().tolist()}")
print(f"Event types: {combined['event'].unique().tolist()}")
print(f"Dates: {sorted(combined['date'].unique().tolist())}")

# Compute coordinate bounds per map
bounds = {}
for map_id in combined['map_id'].unique():
    sub = combined[combined['map_id'] == map_id]
    bounds[map_id] = {
        "x_min": float(sub['x'].min()),
        "x_max": float(sub['x'].max()),
        "z_min": float(sub['z'].min()),
        "z_max": float(sub['z'].max())
    }

# Save per map JSON
for map_id in combined['map_id'].unique():
    sub = combined[combined['map_id'] == map_id].copy()
    sub = sub[['user_id', 'match_id', 'map_id', 'x', 'z', 'ts', 'event', 'is_bot', 'date']]
    sub['x'] = sub['x'].astype(float)
    sub['z'] = sub['z'].astype(float)
    out = sub.to_dict(orient='records')
    with open(f"{output_dir}/{map_id}.json", 'w') as f:
        json.dump(out, f)
    print(f"Saved {map_id}.json — {len(out)} events")

# S