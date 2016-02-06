

/*
I depdends on the Key Codes instead of using key identifier. 
That will help to reduce the size of data storge
The char codes or key codes is found here 
http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes

*/
window.addEventListener("keydown", function (event) {
    if (event.key !== undefined) {
    } else if (event.keyIdentifier !== undefined) {
        var y = event.which;
        var url = window.location.href;
        var timeStamp = Date.now();
        var url = window.location.href;
        var mousePro = ["keydown", y, timeStamp, url];
        chrome.runtime.sendMessage(mousePro);
         console.log(event.keyIdentifier + "\t OR: " + y);
        } 
    if (event.defaultPrevented) {
        return;
    }
}, true);


var scrollPostion = 0;
window.addEventListener('contextmenu', function (event) {
    var url = window.location.href;
    var mousePro = ["RightClick2", url];
    chrome.runtime.sendMessage(mousePro);
    eventProperty('RightClick', event);

});

// these vars and fucntion to make sure there is no douplicate of clikc when use dbclick
var t = 0;
var delay = 200;
var prevent = false;

$(window).click(function (event) {
    timer = setTimeout(function () {
        if (!prevent) {
            eventProperty('click', event);
        }
        prevent = false;
    }, delay);
}).dblclick(function (event) {
    clearTimeout(t);
    prevent = true;
    eventProperty('dblclick', event);
}).scroll(function (event) {
    var direction = null;
    var postion = $(this).scrollTop();
    if (postion > scrollPostion) {
        direction ="down";
        } else {
        direction="up";
    }
    // the scroll's Postion is the highest point of the scroll. 
    scrollPostion = postion;
    var timeStamp = Date.now();
    var url = window.location.href;
    var mousePro = ["Scroll", direction, scrollPostion, timeStamp, url];
    chrome.runtime.sendMessage(mousePro);
    });

window.addEventListener('mousemove', function () {
    eventProperty('mousemove', event);
});

function eventProperty(action, event) {
    var url = window.location.href;
    var x = event.pageX;
    var y = event.clientY;
    var w = window.innerWidth;
    var h = window.innerHeight;
    var scrX = window.screenX;
    var scrY = window.screenY;
    var timeStamp = Date.now();
    var mousePro = [action, x, y, w, h, scrX, scrY, timeStamp, url];
 //  console.log(action + "\t" + x + "\t" + y + "\t" + w + "\t" + h + "\t" + url)
    chrome.runtime.sendMessage(mousePro);

}

