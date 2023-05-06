import json
with open("steam.json", "r", encoding="utf-8") as file:
  data = json.load(file)

items = dict()

for name in data:
  price = round(min(data[name]["last_24h"], data[name]["last_7d"], data[name]["last_30d"], data[name]["last_90d"])/0.14475,2)
  items[name] = price
  
with open("json.json", "w", encoding="utf-8") as file:
  json.dump(items, file, ensure_ascii=False, indent=4)
