(function () {
    var name
    var lastclick = ''
    var host = window.location.host, gamehost = 'pokemod.gerhut.net';
    var version;
    switch (host) {
        case 'platinum.gerhut.net': version = 'platinum'; break;
        case 'heartgold.gerhut.net': version = 'heartgold'; break;
        default: version = 'heartgold';
    }

    var urlImg = 'http://' + gamehost + '/' + version
      , urlChat = 'http://' + gamehost + '/' + version + '/chat'
      , urlInfo = 'http://' + gamehost + '/' + version + '/info'
      , urlKeys
      , urlMouse;
    var timeout = -1
    var gamescreen = document.getElementById('imgGamescreen')
        , chatlist = document.getElementById('chatlist')
        , inputlist = document.getElementById('inputlist')
        , message = document.getElementById('txtMessage');

    window.sendkey = function (code) {
        jsonp(urlKeys + '/' + code, function (data) {
            return;
        })
    }

    window.imageLoaded = function () {
        setTimeout(function () { gamescreen.src = urlImg + '/?' + Date.now(); }, 200);
    }

    window.refreshChat = function () {
        jsonp(urlInfo, function (chatData, inputData, touchData) {
            chatlist.innerHTML = chatData;
            inputlist.innerHTML = inputData;
            if (touchData.length) {
                for ( var i = 0, touch = touchData[i];
                      touch;
                      i += 1, touch = touchData[i]) {

                    if (lastclick === touch.toString())
                        break;
                    var c;
                    var name = touch[0]
                    var x = touch[1]
                    var y = touch[2]
                    $("#mainscreen").append(
                        $("<span>").text(name).css({
                            'top': y,
                            'left': x
                        }).fadeIn(400).fadeOut(400, function () {
                            $(this).remove()[0]
                        })
                    );
                }
                lastclick = touchData[0].toString();
            }
            setTimeout(window.refreshChat, 500);
        })
    }
    window.talk = function () {
        if (message.value != '' && message.value.length <= 40) {
            jsonp(urlChat + '/' + encodeURIComponent(name) + '/' + encodeURIComponent(txtMessage.value), function send(data) {
                return;
            })
            message.value = ''
        }
    }
    window.sendmouse = function (event) {
        jsonp(urlMouse + '/' + Math.round(event.offsetX) + ',' + Math.round(event.offsetY), function (data) {
            return;
        })
    }

    window.run = function (udata) {
        name = udata.uname
        urlKeys = 'http://' + gamehost + '/' + version + '/input/' + name + '/key'
        urlMouse = 'http://' + gamehost + '/' + version + '/input/' + name + '/mouse';
        window.refreshChat()
    }
})()