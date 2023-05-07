import json
import requests

req = requests.get("https://prices.csgotrader.app/latest/steam.json")
data = req.json()

items = dict()

for name in data:
	price = 1000000000000
	if data[name]["last_24h"] != 0:
		price = min(price, data[name]["last_24h"])
	if data[name]["last_7d"] != 0:
		price = min(price, data[name]["last_7d"])
	if data[name]["last_30d"] != 0:
		price = min(price, data[name]["last_30d"])
	if data[name]["last_90d"] != 0:
		price = min(price, data[name]["last_90d"])
		
	if price == 1000000000000:
		price = 0
	price = round(price/0.14475, 2)
	items[name] = price
  
with open("json.json", "w", encoding="utf-8") as file:
	json.dump(items, file, ensure_ascii=False, indent=4)
