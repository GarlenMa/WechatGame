cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.replay, this);
    },

    replay: function () {
        cc.director.loadScene(cc.director.getScene().name);
        // cc.director.resume();
    }

});
