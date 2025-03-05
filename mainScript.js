// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: brown; icon-glyph: magic;
//2학은 2, 3학은 3, 제4학생회관은 4, 생활과학대학은 5를 아래에 입력.
const cafeteria = 2;
//조식정보를 원하시면 아래에 1을 입력하세요.
const eatBreakfast = 1;
//직원이라면 1을 입력하세요.
const staffMenu = 0;

function getDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const DAY = today.getDay();

    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;

    const formattedDate = `${year}.${formattedMonth}.${formattedDay}`;
    
    if (DAY >= 6) {
        return addDaysToDate(8 - DAY);
    }
    return formattedDate;
}

//날짜 덧셈 함수
function addDaysToDate(days) {
    const today = new Date();
    // 입력된 일수 * 24시간 * 60분 * 60초 * 1000밀리초
    const daysInMilliseconds = days * 24 * 60 * 60 * 1000;
    const futureDate = new Date(today.getTime() + daysInMilliseconds);
    const year = futureDate.getFullYear();
    const month = futureDate.getMonth() + 1;
    const day = futureDate.getDate();

    // month와 day가 10보다 작으면 앞에 0을 붙여줍니다.
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;

    const formattedDate = `${year}.${formattedMonth}.${formattedDay}`;
    return formattedDate;
}

function getBLD(eatBreakfast) {
    const today = new Date();
    const hour = today.getHours();
    let result = 0;

    if (hour < 9 && eatBreakfast == 1) {
        result = 2;
    } else if ((hour >= 9 || eatBreakfast == 0) && (hour < 14)) {
        result = 4;
    } else {
        result = 2;
    }
    return result;
}

function getTitleDate() {
    const today = new Date();
    const DAY = today.getDay();
    var result = getDate().slice(7);

    return result;
}

let crawlingscript = `let data = [];
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
data;`

const req = new Request(`https://mobileadmin.cnu.ac.kr/food/index.jsp?searchYmd=${getDate()}&searchLang=OCL04.10&searchView=cafeteria&searchCafeteria=OCL03.02&Language_gb=OCL04.10`);
const wv = new WebView();
await wv.loadRequest(req);
let data = await wv.evaluateJavaScript(crawlingscript);

const data_json = data.map((item) => ({
    type: `${item[0]},${item[1]}`,
    menu: item[2],
    price: item[3]
}));
console.log(data_json);

function getCoord(cafeteria, BLD) {
    let n1 = -1;
    let n2 = -1;
    if (cafeteria == 2) {
        n1 = BLD;
        n2 = cafeteria;
    } else if (cafeteria == 3) {
        const hour = new Date().getHours(); // hour 변수 정의
        n1 = hour < 14 ? 3 : 5;
        n2 = cafeteria;
    }
    return `${n1},${n2}`;
}

var title_date = getDate().slice(7);
var menu = data_json.find(e => e.type === getCoord(cafeteria, getBLD(eatBreakfast)));
const menu_fianl = menu["menu"].replace(/\s*\([^)]*\)/g, '');
const price_fianl = menu["price"].replace(/[^0-9]/g, '');

let widget = new ListWidget();

let titleTxt = widget.addText(`${cafeteria}학(${getDate().slice(5)})`);
let menuTxt = widget.addText(`${menu_fianl}`);

titleTxt.font = Font.systemFont(16);
menuTxt.font = Font.systemFont(12);
Script.setWidget(widget);
Script.complete();
