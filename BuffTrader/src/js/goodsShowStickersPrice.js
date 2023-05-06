async function main(){ 
    var url = "https://raw.githubusercontent.com/OptonGroup/buff-ext/main/json.json";
    var steamPricesJson = await (await fetch(url)).json();

    var minimalPrice = Number($("a.i_Btn.i_Btn_trans_bule.active").text().match(/[-]{0,1}[\d]*[.]{0,1}[\d]+/g)[0]);
    console.log("minimal price on buff - " + minimalPrice.toString() + "¥");

    var goods = $("tr.selling");
    console.log(goods);
    for (let i = 0; i < goods.length; ++i){
        var good = goods.eq(i);
        var goodPrice = good.find(".t_Left").eq(3).text().match(/[-]{0,1}[\d]*[.]{0,1}[\d]+/g)[0];
        var json = JSON.parse(good[0].attributes["data-asset-info"].value);

        var stickers = json["info"]["stickers"];
        var stickersCount = new Object();
        for (let j = 0; j < stickers.length; ++j){
            var stickerName = "Sticker | " + stickers[j]["name"];
            if (stickers[j]["wear"] != 0) var stickerSteamPrice = 0;
            else var stickerSteamPrice = steamPricesJson[stickerName];

            if (!stickerSteamPrice) stickerSteamPrice = 0;

            if (stickers[j]["wear"] == 0){
                if (!stickersCount[stickerName])
                    stickersCount[stickerName] = [0, stickerSteamPrice];
                stickersCount[stickerName][0] += 1;
            }

            var goodSticker = good.find(".sticker-cont").eq(j);
            var priceSpan = `<span class="f_30px c_Black">`+ stickerSteamPrice.toFixed(2).toString() +`¥</span>`
            goodSticker.append(priceSpan)
        }

        var totalStickersPrice = 0;
        for (var stickerName in stickersCount){
            if (stickersCount[stickerName][0] <= 2)
                totalStickersPrice += stickersCount[stickerName][1]*0.07 * stickersCount[stickerName][0];
            else if (stickersCount[stickerName][0] == 3)
                totalStickersPrice += stickersCount[stickerName][1]*0.5;
            else if (stickersCount[stickerName][0] == 4)
                totalStickersPrice += stickersCount[stickerName][1];
        }

        var priceChange = (goodPrice - minimalPrice).toFixed(2);
        if (priceChange <= 0){
            var domElement = `<div class="f_12px" style="color: #009800;">▼¥ -`+ Math.abs(priceChange).toString() +`</div>`
        }else{
            var domElement = `<div class="f_12px" style="color: #c90000;">▲¥ `+ Math.abs(priceChange).toString() +`</div>`
        }
        good.find(".t_Left").eq(3).append(domElement);

        var goodRealPrice = minimalPrice + totalStickersPrice;
        var delt = ((goodRealPrice/goodPrice - 1) * 100).toFixed(1);
        if (delt <= 0){
            var domElement = `<div class="f_12px" style="color: #c90000;">-`+ Math.abs(delt).toString() + `%</div>`
        }else{
            var domElement = `<div class="f_12px" style="color: #009800;">+`+ Math.abs(delt).toString() + `%</div>`
        }
        good.find(".t_Left").eq(3).append(domElement);
    }
}

function checkMarketLoading(refreshId) {
    var market_listenings = $("#market-selling-list")
    if (market_listenings.length){
        clearInterval(refreshId);
        console.log("Market was loaded");
        main();
    }
}

// check if the products are loaded on the page
var refreshId = setInterval(
    function(){
        checkMarketLoading(refreshId)
    },
    100
);