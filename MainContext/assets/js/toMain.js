cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.toMain, this);
    },

    toMain: function () {
        cc.director.loadScene("GameGuide");
    }

});
