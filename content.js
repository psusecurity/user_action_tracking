window.addEventListener('contextmenu', function () {
    var url = window.location.href;
    var mousePro = ["RightClilck", url];
    chrome.runtime.sendMessage(mousePro);
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
})
  .dblclick(function (event) {
      clearTimeout(t);
      prevent = true;
      eventProperty('dblclick', event);
  });


window.addEventListener('mousemove', function () {
    eventProperty('mousemove', event);
});

function eventProperty(action, event) {
    var x = event.pageX;
    var y = event.clientY;
    var w = window.innerWidth;
    var h = window.innerHeight;
    var scrX = window.screenX;
    var scrY = window.screenY;
    var timeStamp = Date.now();
    var mousePro = [action, x, y, w, h, scrX, scrY, timeStamp];
 //   console.log(action + "\t" + x + "\t" + y + "\t" + w + "\t" + h + "\t" + scrX + "\t" + scrY + "\t" + timeStamp)
    chrome.runtime.sendMessage(mousePro);

}

