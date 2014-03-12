$(document).ready(function (data) {
    var uid = 0, uname = 'debug';//debug参数
    var clientId = '3GMv3CfMcLTSOuHyffkwieIx', rate = 200, gameurl;//基本参数
    var touchlist = 0, lasttouch = 0;//基本变量
    var screen = $('#screen img'), chatrecord = $('#chatrecord'), keyrecord = $('#keyrecord');//基本元素
    var btnchat = $('#chat button'), txtchat = $('#chat input'), btnkeypad = $('#keypad button'); //互动元素

    function login() {
        var oAuthUrl = [
          'https://openapi.baidu.com/oauth/2.0/authorize?response_type=token',
          'client_id=' + clientId,
          'redirect_uri=' + location.protocol + '//' + location.host
        ].join('&');
        if (location.hash.indexOf('access_token=') === -1)
            return location.href = oAuthUrl;

        var accessToken = location.hash.substr(location.hash.indexOf('access_token='));
        accessToken = accessToken.substr(0, accessToken.indexOf('&'));
        var restUrl = 'https://openapi.baidu.com/rest/2.0/passport/users/getLoggedInUser?' + accessToken + '&callback=?'

        $.getJSON(restUrl).done(function (data) {
            if ('error_msg' in data)
            { return document.write(data.error_msg); }
            else {
                recode(data); console.log(uid);
            }
        });
    }//登录认证
    function recode(udata) { uid = udata.uid; uname = udata.uname; gameurl = switchversion(uid);  }//基本变量重赋值
    function switchversion(uid) {
        switch (uid % 2) {
            case 0: gameurl = 'http://black.s.gerhut.me/'; return gameurl;
            case 1: gameurl = 'http://white.s.gerhut.me/'; return gameurl;
            default: gameurl = 'http://black.s.gerhut.me/'; return gameurl;
        }
    }//根据uid奇偶切换版本
    function sendkey(keycode) {
        $.get('http://bwinput.s.gerhut.me/key/input?name=' + uname + '&key=' + keycode);
    }//发送按键
    function sendmouse(x, y) {
        if (x >= 0 && y >= 0) $.get('http://bwinput.s.gerhut.me/touch/input?name=' + uname + '&touch=' + x + ',' + y);
    }//发送鼠标
    function sendmessage() {
        var message = $('#chat input')
        if (message.val() != '' && message.val.length <= 40) {
            $.get('http://bwinput.s.gerhut.me/chat?name=' + uname + '&content=' + message.val());
            message.val('');
        }
    }//发送聊天
    function refresh() {
        
        $(screen).load( gameurl + '?' + Date.now(), function () { setTimeout(refresh, rate); });
    }//刷新游戏屏幕
    function refreshchat() {
        chatrecord.load('http://bwinput.s.gerhut.me/chat', function () { chatrecord.text(decodeURIComponent(chatrecord.text().split('\n').reverse().join('\n'))); setTimeout(refreshchat, rate); });

    }//刷新聊天记录
    function refreshkey() {
        keyrecord.load('http://bwinput.s.gerhut.me/key', function () { keyrecord.text(decodeURIComponent(keyrecord.text().split('\n').reverse().join('\n'))); setTimeout(refreshkey, rate); });
    }//刷新按键记录
    function refreshtouch() {
        $.get('http://bwinput.s.gerhut.me/touch',
            function (touch) {
                touchlist = $.parseJSON('[' + touch.substr(0, touch.length - 3) + ']');
                if (touchlist.length) {

                    for (var i = touchlist.length - 1; i >= 0; i--) {
                        if (touchlist[i].toString() != lasttouch.toString()) {
                            if (!lasttouch) { lasttouch = touchlist[touchlist.length - 1]; break; }
                            var c;
                            var name = decodeURIComponent(touchlist[i][1])
                            var x = touchlist[i][2]
                            var y = touchlist[i][3]
                            $("#screen").append(
                                $("<span>").text(name).css({
                                    'top': y + 192,
                                    'left': x
                                }).fadeIn(400).fadeOut(400, function () {
                                    $(this).remove()[0]
                                })
                            );
                        }
                        else {
                            break;
                        }
                    }
                }
                lasttouch = touchlist[touchlist.length - 1];
            });
        setTimeout(refreshtouch, rate);
    }//刷新屏幕记录

    function init() {
        //login();
        refresh();
        refreshchat();
        refreshkey();
        //refreshtouch();
        btnchat.click(function () {
            sendmessage();
        })
        txtchat.keypress(function (e) {
            if (e.which == 13) sendmessage();
        })
        btnkeypad.click(function () {
            sendkey($(this).val())
        })
        screen.click(function () {
            sendmouse(Math.round(event.offsetX), Math.round(event.offsetY) - 192);
        })
    }//入口

    init();//调用入口
})
