'use strict';

var app = getApp();
function serverGet(url, data) {
    var promise = new Promise(function (resolve) {
        var postData = data;
        wx.request({
            url: url,
            data: postData,
            success: function success(res) {
                resolve(res.data);
            }
        });
    });
    return promise;
}

function serverPost(url, data) {
    var promise = new Promise(function (resolve) {
        var postData = data;
        wx.request({
            url: url,
            data: postData,
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function success(res) {
                resolve(res.data);
            }
        });
    });
    return promise;
}

function serverWebSocket(url, token) {
    var promise = new Promise(function (resolve, reject) {
        wx.connectSocket({
            url: url + '&token=' + token,
            header: { 'content-type': 'application/x-www-form-urlencoded' }
        });
        wx.onSocketOpen(function (res) {
            console.log(new Date(), '\u8FDE\u63A5\u670D\u52A1\u5668\u6210\u529F\uFF01'), resolve(res);
        });
        wx.onSocketClose(function (res) {
            console.log(new Date(), '\u670D\u52A1\u5668\u5DF2\u7ECF\u65AD\u5F00\u94FE\u63A5!'), reject(res);
            wx.connectSocket({
                url: url + '&token=' + token,
                header: { 'content-type': 'application/x-www-form-urlencoded' }
            });
        });
    });
    return promise;
}

module.exports = {
    get: serverGet,
    post: serverPost,
    websocket: serverWebSocket
};