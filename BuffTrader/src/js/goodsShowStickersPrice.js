async function main(){ 
    var url = "https://raw.githubusercontent.com/OptonGroup/buff-ext/main/json.json";
    var steamPricesJson = await (await fetch(url)).json();

    var minimalPrice = $("a.i_Btn.i_Btn_trans_bule.active").text().match(/[-]{0,1}[\d]*[.]{0,1}[\d]+/g)[0];
    console.log(minimalPrice);

    var goods = $("tr.selling");
    console.log(goods);
    for (let i = 0; i < goods.length; ++i){
        var good = goods.eq(i);
        var goodPrice = good.find(".t_Left").eq(3).text().match(/[-]{0,1}[\d]*[.]{0,1}[\d]+/g)[0];
        var json = JSON.parse(good[0].attributes["data-asset-info"].value);

        var stickers = json["info"]["stickers"];
        for (let j = 0; j < stickers.length; ++j){
            var stickerName = "Sticker | " + stickers[j]["name"];
            if (stickers[j]["wear"] != 0) var stickerSteamPrice = 0;
            else var stickerSteamPrice = steamPricesJson[stickerName];

            var goodSticker = good.find(".sticker-cont").eq(j);
            var priceSpan = `<span class="f_30px c_Black">`+Math.round(stickerSteamPrice).toString()+`¥</span>`
            goodSticker.append(priceSpan)
        }

        var priceChange = (goodPrice - minimalPrice).toFixed(2);
        if (priceChange <= 0){
            var domElement = `<div class="f_12px" style="color: #009800;">▼¥ -`+ Math.abs(priceChange).toString() +`</div>`
        }else{
            var domElement = `<div class="f_12px" style="color: #c90000;">▲¥ `+ Math.abs(priceChange).toString() +`</div>`
        }
        good.find(".t_Left").eq(3).append(domElement)
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