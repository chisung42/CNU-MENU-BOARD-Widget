let data = [];
for (let row = 2; row <= 5; row++) {
    for (let col = 1; col <= 6; col++) {
        const menuSelector = "body > div > form > div.menu-wr > div.is-wauto-box.menu-tbl-wr > table > tbody > tr:nth-child(" + row + ") > td:nth-child(" + col + ") > ul > li > p";
        const priceSelector = "body > div > form > div.menu-wr > div.is-wauto-box.menu-tbl-wr > table > tbody > tr:nth-child(" + row + ") > td:nth-child(" + col + ") > ul > li > h3";
        const menuElement = document.querySelector(menuSelector);
        const priceElement = document.querySelector(priceSelector);
        if (menuElement && priceElement) {
            data.push([row, col, menuElement.innerText, priceElement.innerText]);
        }
    }
}
data;
