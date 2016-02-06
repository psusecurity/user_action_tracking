

const dbTable = "windTable";
const dbTable1 = "tabTable";;
const dbTable2 = "clickTable";
const dbTable3 = "mousemoveTable";
const dbTable4 = "dblclickTable";
const dbTable5 = "RightClickTable";
const dbTable6 = "ScrollTable";



document.getElementById("dblclickTable").addEventListener("click", function () {
    var mousePro = ["saveitnow", "dblclickTable"];
    chrome.runtime.sendMessage(mousePro);

});

document.getElementById("RightClickTable").addEventListener("click", function () {
    var mousePro = ["saveitnow", "RightClickTable"];
    chrome.runtime.sendMessage(mousePro);

});
document.getElementById("clickTable").addEventListener("click", function () {
    var mousePro = ["saveitnow", "clickTable"];
    chrome.runtime.sendMessage(mousePro);

});

document.getElementById("mousemoveTable").addEventListener("click", function () {
    var mousePro = ["saveitnow", "mousemoveTable"];
    chrome.runtime.sendMessage(mousePro);

});

document.getElementById("tabTable").addEventListener("click", function () {
    var mousePro = ["savetab", "tabTable"];
    chrome.runtime.sendMessage(mousePro);

});

document.getElementById("windTable").addEventListener("click", function () {
    var mousePro = ["saveWind", "windTable"];
    chrome.runtime.sendMessage(mousePro);

});

document.getElementById("ScrollTable").addEventListener("click", function () {
    var mousePro = ["saveScroll", "ScrollTable"];
    chrome.runtime.sendMessage(mousePro);

});


document.getElementById("keydownTable").addEventListener("click", function () {
    var mousePro = ["saveKeyEvent", "keydownTable"];
    chrome.runtime.sendMessage(mousePro);

});