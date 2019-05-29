cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.backToGame, this);
    },

    backToGame: function () {
        this.node.parent.active = false;
        cc.director.resume();
    }

});
