// get item prices to display them on page
async function getPrices(){
    var url = "https://raw.githubusercontent.com/OptonGroup/Buff-Trader/main/json.json";
    pricesJson = await (await fetch(url)).json();
    console.log("Prices was loaded");
}

// get the minimum price of the product to display the delta price
function getMinimalPriceOfGood(){
    var minPriceTable = $($("#market_min_price_pat")[0].innerText);
    minPriceTable = minPriceTable.find(".has_des .custom-currency")[0].attributes;
    minimalPrice = Number(minPriceTable["data-price"].value);
}

async function showStickersPrice(){
    var goods = $("tr.selling");
    for (let i = 0; i < goods.length; ++i){
        var good = goods.eq(i);
        var goodPrice = good.find(".t_Left").eq(3).text().match(/[-]{0,1}[\d]*[.]{0,1}[\d]+/g)[0];
        var json = JSON.parse(good[0].attributes["data-asset-info"].value);

        var stickers = json["info"]["stickers"];
        var stickersCount = new Object();
        for (let j = 0; j < stickers.length; ++j){
            var stickerName;
            if (stickers[j]["category"] == "patch"){                    // parsing Agents
                stickerName = "Patch | " + stickers[j]["name"];
            }else{                                                      // parsing Skins
                stickerName = "Sticker | " + stickers[j]["name"];
            }

            var stickerSteamPrice;
            if (stickers[j]["category"] == "sticker" && stickers[j]["wear"] != 0) stickerSteamPrice = 0;   // if the sticker is worn out, we do not include it in the overpayment
            else stickerSteamPrice = pricesJson[stickerName];

            if (!stickerSteamPrice) stickerSteamPrice = 0;              // if you could not find the item in the table, then consider that the price is equal to 0, so that there are no errors

            if (stickerSteamPrice){                                     // counting the number of identical stickers 
                if (!stickersCount[stickerName])
                    stickersCount[stickerName] = [0, stickerSteamPrice];
                stickersCount[stickerName][0] += 1;
            }

            var goodSticker = good.find(".sticker-cont").eq(j);
            var priceSpan = `<span class="f_30px c_Black">`+ stickerSteamPrice.toFixed(2).toString() +`¥</span>`;
            goodSticker.append(priceSpan);
        }

        // overpayment calculation
        var totalStickersPrice = 0;
        for (var stickerName in stickersCount){
            if (stickersCount[stickerName][0] <= 2)
                totalStickersPrice += stickersCount[stickerName][1]*0.07 * stickersCount[stickerName][0];
            else if (stickersCount[stickerName][0] == 3)
                totalStickersPrice += stickersCount[stickerName][1]*0.5;
            else if (stickersCount[stickerName][0] == 4)
                totalStickersPrice += stickersCount[stickerName][1];
        }

        // delta relative to the minimum price
        var priceChange = (goodPrice - minimalPrice).toFixed(2);
        if (priceChange <= 0){
            var domElement = `<div class="f_12px" style="color: #009800;">▼¥ -`+ Math.abs(priceChange).toString() +`</div>`
        }else{
            var domElement = `<div class="f_12px" style="color: #c90000;">▲¥ `+ Math.abs(priceChange).toString() +`</div>`
        }
        good.find(".t_Left").eq(3).append(domElement);

        // expected overpayment in %
        var goodRealPrice = minimalPrice + totalStickersPrice;
        var delt = ((goodRealPrice/goodPrice - 1) * 100).toFixed(1);
        if (delt <= 0){
            var domElement = `<div class="f_12px" style="color: #c90000;">-`+ Math.abs(delt).toString() + `%</div>`
        }else{
            var domElement = `<div class="f_12px" style="color: #009800;">+`+ Math.abs(delt).toString() + `%</div>`
        }
        good.find(".t_Left").eq(3).append(domElement);
        
        if (Number(delt) >= 15){
            good.css("background-color", "lightgreen");
        }
    }
}

// сheck whether lots are loaded or not
function checkMarketLoading(refreshId) {
    if ($("#market-selling-list").length){
        clearInterval(refreshId);
        console.log("Market was loaded");
        showStickersPrice();
    }
}
function checkReloader(){
    if (!window.location.hash.match("tab=selling")) return;
    var refreshId = setInterval(
        function(){
            checkMarketLoading(refreshId)
        },
        100
    );
}


// main part
async function main(){
    await getPrices();
    getMinimalPriceOfGood();
    console.log("Minimal price on buff - " + minimalPrice.toString() + "¥");

    checkReloader();

    window.onhashchange = function() {
        checkReloader();
    };
}

var pricesJson, minimalPrice;
main()