cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        if (CC_WECHATGAME) {
            window.wx.showShareMenu({ withShareTicket: true });//设置分享按钮
        }
    },

    toGame1: function () {
        cc.director.loadScene("Game1");
        cc.director.resume();
    },

    toGame2: function () {
        cc.director.loadScene("Game2");
        cc.director.resume();
    },

    toAbout: function () {
        cc.director.loadScene("About");
        cc.director.resume();
    },

    toGameGuide: function () {
        cc.director.loadScene("GameGuide");
        cc.director.resume();
    },

    toRank: function () {
        cc.director.loadScene("Rank");
        cc.director.resume();
    }

});