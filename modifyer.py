import json
import requests

items = dict()
from_usd_to_rbm = 0.13876009

def get_prices_from_steam():
    req = requests.get("https://prices.csgotrader.app/latest/steam.json")
    data = req.json()

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
        price = round(price/from_usd_to_rbm, 2)
        items[name] = price

def get_prices_from_buff163():
    req = requests.get("https://prices.csgotrader.app/latest/buff163.json")
    data = req.json()

    for name in data:
        try:
            price = data[name]["highest_order"]["price"]
            price = round(price/from_usd_to_rbm, 2)
        except:
            price = 0

        items[name] = price

get_prices_from_buff163()
  
with open("json.json", "w", encoding="utf-8") as file:
    json.dump(items, file, ensure_ascii=False, indent=4)
