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
                if (res.data.code != 0) {
                    console.log(url, res.data);
                }
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
                if (res.data.code != 0) {
                    console.log(url, res.data);
                }
            }
        });
    });
    return promise;
}

module.exports = {
    get: serverGet,
    post: serverPost
};