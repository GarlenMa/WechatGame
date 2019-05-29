cc.Class({
    extends: cc.Component,

    properties: {
       menu: {
           default: null,
           type: cc.Node
       }
    },

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.showMenu, this);
    },

    showMenu: function () {
        // 暂停当前场景
        cc.director.pause();
        this.menu.active = true;
    }
    
});
