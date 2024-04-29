import json
import requests

items = dict()
from_usd_to_rbm = 7.24

def get_prices_from_buff163():
    req = requests.get("https://prices.csgotrader.app/latest/buff163.json")
    data = req.json()

    for name in data:
        if data[name]['starting_at']['price']:
            price = data[name]['starting_at']['price']
        else:
            price = 0

        price = round(price*from_usd_to_rbm, 2)
        items[name] = price

get_prices_from_buff163()
  
with open("json.json", "w", encoding="utf-8") as file:
    json.dump(items, file, ensure_ascii=False, indent=4)
