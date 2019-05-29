cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.block, this);
    },

    // 阻止触摸事件穿透到下层
    block: function () {}
});
