cc.Class({
    extends: cc.Component,

    properties: {
        // groupFriendButton: cc.Node,
        // friendButton: cc.Node,
        // gameOverButton: cc.Node,
        rankingScrollView: cc.Sprite,//显示排行榜
        module: "game1",
        title: cc.Label
    },

    onLoad() {
        
    },

    setTitle: function (module, isFriend) {
        if (isFriend) {
            if (module == "game1") {
                this.title.string = "模式一好友排行榜";
            } else {
                this.title.string = "模式二好友排行榜";
            }
        } else {
            if (module == "game2") {
                this.title.string = "模式二群排行榜";
            } else {
                this.title.string = "模式一群排行榜";
            }
        } 
    },

    start() {
        this.module = "game1";
        this.setTitle(this.module, true);
        if (CC_WECHATGAME) {
            window.wx.showShareMenu({ withShareTicket: true });//设置分享按钮，方便获取群id展示群排行榜
            window.wx.postMessage({
                messageType: 1,
                MAIN_MENU_NUM: this.module
            });
        } else {
            cc.log("获取好友排行榜数据。" + this.module)
        }
    },

    friendButtonFunc() {
        this.setTitle(this.module, true);
        if (CC_WECHATGAME) {
            // 发消息给子域
            window.wx.postMessage({
                messageType: 1,
                MAIN_MENU_NUM: this.module
            });
        } else {
            cc.log("获取好友排行榜数据。" + this.module);
        }
    },

    groupFriendButtonFunc: function () {
        this.setTitle(this.module, false);
        if (CC_WECHATGAME) {
            window.wx.shareAppMessage({
                success: (res) => {
                    if (res.shareTickets != undefined && res.shareTickets.length > 0) {
                        window.wx.postMessage({
                            messageType: 5,
                            MAIN_MENU_NUM: this.module,
                            shareTicket: res.shareTickets[0]
                        });
                    }
                }
            });
        } else {
            cc.log("获取群排行榜数据。" + this.module);
        }
    },

    game1Btn: function () {
        this.module = "game1";
        this.friendButtonFunc();
    },

    game2Btn: function () {
        this.module = "game2";
        this.friendButtonFunc();
    },
});
