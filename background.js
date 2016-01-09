const dbName = "BrowserPro";
const dbTable = "windTable"
const dbTable1 = "tabTable"
const dbTable2 = "clickTable"
const dbTable3 = "mousemoveTable"
const dbTable4 = "dblclickTable"
const dbTable5 = "RightClickTable"
const dbTable6 = "ScrollTable"


var oldURL = null;
var onRightClic = false;
var request = indexedDB.open(dbName, 4);

request.onerror = function (event) {
    console.log("There is an error in your database");
};
request.onupgradeneeded = function (event) {
    var db = event.target.result;

    /*** wind table ***/
    var objectStore = db.createObjectStore(dbTable, { keyPath: "key" });

    /*** tab table ***/
    var objectStore = db.createObjectStore(dbTable1, { keyPath: "key" });

    /*** clilc table ***/
    var objectStore = db.createObjectStore(dbTable2, { keyPath: "timeStamp" });

    /*** double table ***/
    var objectStore = db.createObjectStore(dbTable3, { keyPath: "timeStamp" });

    /*** movment table ***/
    var objectStore = db.createObjectStore(dbTable4, { keyPath: "timeStamp" });

    /*** Righ Click table **/
    var objectStore = db.createObjectStore(dbTable5, { keyPath: "timeStamp" });

    /** Scroll Table ***/
    var objectStore = db.createObjectStore(dbTable6, { keyPath: "timeStamp" });


    /*** tables premesions ***/
    objectStore.transaction.oncomplete = function (event) {
        var customerObjectStore = db.transaction(dbTable, "readwrite").objectStore(dbTable);
        var customerObjectStore = db.transaction(dbTable1, "readwrite").objectStore(dbTable1);
        var customerObjectStore = db.transaction(dbTable2, "readwrite").objectStore(dbTable2);
        var customerObjectStore = db.transaction(dbTable3, "readwrite").objectStore(dbTable3);
        var customerObjectStore = db.transaction(dbTable4, "readwrite").objectStore(dbTable4);
        var customerObjectStore = db.transaction(dbTable5, "readwrite").objectStore(dbTable5);
        var customerObjectStore = db.transaction(dbTable6, "readwrite").objectStore(dbTable6);
            }
};

//**** add the data ***//
request.onsuccess = function (event1) {

    /** windwos command
    These commdand is doen and we track only create and close windows
    we need to make refrence, table. 
    **/
    chrome.windows.onCreated.addListener(function (win) {
        if (onRightClic == true) {
            addWind("NvgToNewWind", win.id, event1, Date.now());
            onRightClic = false;
        } else {
            addWind("CreateWind", win.id, event1, Date.now());
        }
    });
    chrome.windows.onRemoved.addListener(function (win) {
        addWind("CloseWind", win, event1, Date.now())
    })
    chrome.windows.onFocusChanged.addListener(function (windID) {
        if (windID !== chrome.windows.WINDOW_ID_NONE) {
            addWind("ActivWind", windID, event1, Date.now())

        } else {
        };
    });

    /** TAB events 
      */
    var currnetTabID = {};
    var lastActiveTAB = null;
    chrome.tabs.onCreated.addListener(function (tab, creatInfo) {
        if (onRightClic == true) {
            addTAB("NavToNewTab", tab.id, tab.url, tab.windowId, event1, Date.now());
            currnetTabID[tab.id] = tab.url;
            onRightClic = false;
        } else {
            currnetTabID[tab.id] = tab.url;
            addTAB("CreateTab", tab.id, tab.url, tab.windowId, event1, Date.now());
            hidformNew = true;
        }
    });

    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        currnetTabID[tabId] = tab.url;
        if (changeInfo.status == 'loading') {
            addTAB("loadingPage", tabId, currnetTabID[tabId], tab.windowId, event1, Date.now());
        }
    });
    chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
        addTAB("CloseTab", tabId, currnetTabID[tabId], removeInfo.windowId, event1, Date.now());
        delete currnetTabID[tabId];
    });

    // I use here onActiveCahged instead of onActived becuase this work with chrome17
    chrome.tabs.onActiveChanged.addListener(function (tabId, info) {
        // console.log(info);
        if (typeof currnetTabID[tabId] === 'undefined' || currnetTabID[tabId] === null) {
            //  currnetTabID[tabId] = tab.url;

            chrome.tabs.getSelected(null, function (tab) {
                currnetTabID[tabId] = tab.url;
                addTAB("CloseTab", lastActiveTAB, currnetTabID[lastActiveTAB], info.windowId, event1, Date.now());
                addTAB("Prefetch", tab.id, tab.url, info.windowId, event1, Date.now());
                addTAB("CreateTab", tab.id, tab.url, info.windowId, event1, Date.now());
                addTAB("ActivTab", tabId, currnetTabID[tabId], info.windowId, event1, Date.now());
                addTAB("loadingPage", tabId, currnetTabID[tabId], info.windowId, event1, Date.now());
                lastActiveTAB = tabId;
            });
        } else {
            addTAB("ActivTab", tabId, currnetTabID[tabId], info.windowId, event1, Date.now());
            lastActiveTAB = tabId;
        }
    });

    /** all the foliwng events depende on content class */
    chrome.runtime.onMessage.addListener(function (resonse, sender, sendResopnse) {
        var data = resonse;
        chrome.windows.getLastFocused(function (win) {
            if (data[0] == "click" | data[0] == "dblclick" | data[0] == "RightClick") {
                table = data[0].concat("Table");
                var even = data[0];
                var x = data[1];
                var y = data[2];
                var w = data[3];
                var h = data[4];
                var scrX = data[5];
                var scrY = data[6];
                var timeStamp = data[7];
                oldURL = data[8];  // to find the nviagation
                addEVENT(table, even, x, y, w, h, scrX, scrY, sender.tab.id, win.id, event1, timeStamp);
            } else if (data[0] == "mousemove") {
                table = data[0].concat("Table");
                var even = data[0];
                var x = data[1];
                var y = data[2];
                var w = data[3];
                var h = data[4];
                var scrX = data[5];
                var scrY = data[6];
                var timeStamp = data[7];
                addEVENT(table, even, x, y, w, h, scrX, scrY, sender.tab.id, win.id, event1, timeStamp);
            } else if (data[0] == "Scroll") {
                table = data[0].concat("Table");
                var direction = data[1];
                var scrollPostion = data[2];
                var timeStamp = data[3];
                addScroll(table, event1, direction, scrollPostion, timeStamp);
            } else if (data[0] == "RightClick2") {

                /** adding the parameters to be used in navigation events**/
                onRightClic = true;
                oldURL = data[1];
            } else {
            }
        });
    });
};

function deletData(key, dbTable1, event) {
    var idb = event.target.result;
    var objectStore = idb.transaction(dbTable1, 'readwrite').objectStore(dbTable1);
    var request = objectStore.delete(key);
    request.onsuccess = function (ev) {
    };
    request.onerror = function (ev) {
        console.log('Error occured', ev.srcElement.error.message);
    };
}

function getData(dbTable1, event) {
    idb = event.target.result;
    var transaction = idb.transaction(dbTable1, IDBTransaction.READ_ONLY);
    var objectStore = transaction.objectStore(dbTable1);

    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            console.log('Cursor data', cursor.value);
            cursor.continue();
        }
        else {
            console.log('Entries all displayed.');
        }
    };
};


function addWind(action, windID, event, timeStamp) {

    var hash = CryptoJS.MD5(timeStamp + action + windID);
    var eventData = {
        key: hash.toString(),
        timeStamp: timeStamp,
        event: action,
        windId: windID,
    };
    var idb = event.target.result;
    var transaction = idb.transaction(dbTable, 'readwrite').objectStore(dbTable);
    var request = transaction.add(eventData);
    request.onsuccess = function (ev) {
        console.log("WINDOW: " + action + "\t" + windID + "\t\t Time: " + eventData.timeStamp)
    };
    request.onerror = function (ev) {
        console.log('Error occured', ev.srcElement.error.message);
    };
}


function addTAB(action, tabID, tabURL, windID, event, timeStamp) {

    var hash = CryptoJS.MD5(timeStamp + action + tabID + windID + tabURL);
    var eventData = {
        key: hash.toString(),
        timeStamp: timeStamp,
        event: action,
        tabID: tabID,
        windId: windID,
        url: tabURL
    };
    var idb = event.target.result;
    var transaction = idb.transaction(dbTable1, 'readwrite').objectStore(dbTable1);
    var request = transaction.add(eventData);
    request.onsuccess = function (ev) {
        console.log("TAB: " + action + "\t\t\t" + tabID + "\t\t\t wind: " + windID + "\t Time: " + eventData.timeStamp + " URL: " + tabURL);
    };

    request.onerror = function (ev) {
        console.log('Error occured', ev.srcElement.error.message);
    };
}

//*****  add events ***/
function addEVENT(table, even, x, y, w, h, scrX, scrY, tabID, windID, event, timeStamp) {

    var theData = {
        timeStamp: timeStamp,
        x_postion: x,
        y_postion: y,
        tabID: tabID,
        windID: windID,
        scr_high: h,
        scr_width: w,
        scrPosX: scrX,
        scrPosY: scrY
    };

    var idb = event.target.result;
    var transaction = idb.transaction(table, 'readwrite').objectStore(table);
    var request = transaction.add(theData);
    request.onsuccess = function (ev) {
        // console.log("Mouse: " + even + "\t" + theData.tabID + "\t" + theData.windID + "\t\t" + x + "\t" + y + "\t" + theData.timeStamp + "\tSecHiWi" + theData.scr_high + "\tSecPos:" + theData.scr_width + "\t" + theData.scrPosX + "\t" + theData.scrPosY);
    };
    request.onerror = function (ev) {
        console.log("Error: " + even + "\t" + theData.tabID + "\t" + theData.windID + "\t\t" + x + "\t" + y + "\t" + theData.timeStamp + "\tSecHiWi" + theData.scr_high + "\tSecPos:" + theData.scr_width + "\t" + theData.scrPosX + "\t" + theData.scrPosY);

        console.log('Error occured', ev.srcElement.error.message);
    };
}

function addScroll(table, event, direction, scrollPostion, timeStamp) {

    var theData = {
        timeStamp: timeStamp,
        direction: direction,
        scrollPostion: scrollPostion,
    };
    var idb = event.target.result;
    var transaction = idb.transaction(table, 'readwrite').objectStore(table);
    var request = transaction.add(theData);
    request.onsuccess = function (ev) {
        console.log("Scrolling " + "\t" + theData.direction + "\t" + theData.scrollPostion + "\t" + timeStamp);
    };
    request.onerror = function (ev) {
        console.log("Error: scrolling " + "\t" + theData.direction + "\t" + theData.scrollPostion);

        console.log('Error occured', ev.srcElement.error.message);
    };
}





