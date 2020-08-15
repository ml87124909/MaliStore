"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _urls = require("../../modules/urls.js");

var _urls2 = _interopRequireDefault(_urls);

var _server = require("../../modules/server.js");

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let livePlayer = requirePlugin('live-player-plugin')

exports.default = Page({
    data: {
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px',
        WIN_HEIGHT: wx.DEFAULT_CONTENT_HEIGHT - wx.DEFAULT_HEADER_HEIGHT + 20,
        current: 0,
        fahuo: 0,
        share: 0,
        check_live:[],
        showMask: false,
        customStyle: {
            'background': 'rgba(51, 51, 51, 0.9)'
        }
    },
    onshow: function onshow() {
        var that = this;
        var data = that.data.setDataE;
        
        if (data) {
            
            //that.handleChangeBtn(data.id);
            that.onLoad(that.data.setDataE);
        }
    },
    onLoad: function onLoad(e) {
        var that = this;
        let customParams = encodeURIComponent(JSON.stringify({ path: 'pages/pages/home/home'}))
        that.setData({
            setDataE: e,
            customParams:customParams
        });
        
        that.getLiveList();
        //that.handleChange(e.id);
        if (e.share) {
            that.setData({ share: e.share });
        }
    },
    getLiveList: function getLiveList(e) {
        
        var that = this;
        var checklive=[];
       
        wx.showLoading({ title: "\u52A0\u8F7D\u4E2D..." });
        var postData = {
            //token: wx.getStorageSync('__appUserInfo').token
        };
        
        if (e == 2) {//直播
            postData.status = '2';
        }else if (e == 3) {//已结束
            postData.status = '3';
        }else{
            postData.status = '';
        }
        
        _server2.default.get(_urls2.default.links[0].livelist, postData).then(function (res) {
            wx.hideLoading();
            //console.log(res.data)
            if (res.code == 0) {
                let datas=res.data.data;
                let t=res.data.t;
                if (t!=0){
                    for (var i=0;i<t;i++)
                    {
                        if (datas[i].live_status==101 || datas[i].live_status==102 || datas[i].live_status==105){
                            checklive.push(datas[i])   
                        }
                    }    
                }
                
                  
                that.setData({ 
                    orderList: res.data.data,
                    //check_live:checklive
                 });
                 that.checkLive(checklive);

            } else {
                that.setData({ orderList: '' });
            }
        });
    },
    handleChangeBtn: function handleChangeBtn(e) {
        var btnIndex = e;
        this.data.current = btnIndex;
        this.setData({
            current: this.data.current
        });
        
        this.getLiveList(btnIndex);
    },
    handleChange: function handleChange(e) {
        console.log('handleChange')
        var btnIndex = e.target.dataset.index;
        var index = e.detail.index;
        this.data.current = index;
        this.setData({
            current: this.data.current
        });
        this.getLiveList(index);
    },
    send_live: function send_live(roomid,status) {
        //console.log('send_live,6666666666')
        _server2.default.get(_urls2.default.links[0].get_live, { status: status, room_id: roomid }).then(function (res) {
            console.log(res.data)
        });
    },
    getLive: function getLive(e) {
        //console.log(e)
        const room_Id = e.currentTarget.dataset.id
        livePlayer.getLiveStatus({room_id:room_Id}).then(res => {
            // 101: 直播中, 102: 未开始, 103: 已结束, 104: 禁播, 105: 暂停中, 106: 异常，107：已过期 
            const liveStatus = res.liveStatus
            //console.log(res,'get live status', liveStatus)
            that.send_live(room_Id,liveStatus);
            // 往后间隔1分钟或更慢的频率去轮询获取直播状态
            setInterval(() => {
                livePlayer.getLiveStatus({room_id:room_Id})
                    .then(res => {
                        // 101: 直播中, 102: 未开始, 103: 已结束, 104: 禁播, 105: 暂停中, 106: 异常，107：已过期 
                        const liveStatus = res.liveStatus
                        that.send_live(room_Id,liveStatus);
                    })
                    .catch(err => {
                        console.log('aaaaaaaaa get_live_status', err)
                    })
            }, 80000)
        })
        .catch(err => {
            console.log('xxxxxxxxxxxx get_live_status', err)
        })
        wx.navigateTo({
          url: "plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id="+room_Id+"&custom_params="+this.data.customParams
        })
    },
    checkLive: function checkLive(e) {
        var that=this;
        const checklive=[];
        for (var i=0;i<e.length;i++)
        {   
            const roomId = e[i].roomid;
            livePlayer.getLiveStatus({room_id:roomId}).then(res => {
                // 101: 直播中, 102: 未开始, 103: 已结束, 104: 禁播, 105: 暂停中, 106: 异常，107：已过期 
                const liveStatus = res.liveStatus;
                //console.log(res,'get live status', liveStatus)
                if (liveStatus==101 || liveStatus==102 || liveStatus==105){
                    checklive.push(e[i])   
                }
                that.send_live(roomId,liveStatus);
            })
            .catch(err => {
                console.log('xxxxxxxxxxxx get_live_status', err)
            })
    
        }
        if (checklive.length>0){
            that.setData({ 
                check_live:checklive
             });
        }
        
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
    
    
});