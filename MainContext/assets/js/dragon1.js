cc.Class({
    extends: cc.Component,

    properties: {
        // anim: {
        //     default: null,
        //     type: cc.Animation
        // },
        game: {
            default: null,
            type: cc.Node
        },
    },

    onLoad: function () {
        // this.anim = this.getComponent(cc.Animation);
        // 设置第一个炸的点
        this.game.setCollider("body4");
    },

    /**
     * 随机设置龙的位置和角度
     */
    setDragonPosition: function () {
        this.node.x = Math.round(-365 + Math.random() * (-93 + 365)); // X = [-365,-93]
        this.node.y = Math.round(-686 + Math.random() * (341 + 686)); // Y = [-686,341]
        this.node.rotation = Math.round(60 + Math.random() * (90 - 60)); // rotation = [60,90]
    },

});
