var com = require("./common");
cc.Class({
    extends: cc.Component,

    properties: {
        anim: {
            default: null,
            type: cc.Animation
        },
        game: {
            default: null,
            type: cc.Node
        },
        clipNum: 1,
        clipSpeed: 0.5
    },

    refresh: function () {
        for (var i = 0; i < 5; i++) {
            // 开启各部分的碰撞组件
            this.node.children[i].getComponent(cc.Collider).enabled = true;
            // 为被碰撞目标设置提示
            var blink = cc.repeatForever(cc.blink(2, 10));
            var tipNode = this.node.children[i].getChildByName("tip");
            tipNode.active = true;
            tipNode.runAction(blink);
            // 设置已经产生碰撞组件个数为0
            com.collisionCount = 0;
        }
    },

    setClipSpeed: function () {
        this.anim.getAnimationState("line" + this.clipNum).speed = this.clipSpeed;
    },

    onLoad: function () {
        this.clipSpeed = 0.5;
        this.anim = this.getComponent(cc.Animation);
        this.refresh();
    },

    // 动画帧事件回调函数
    check: function () {
        // 初始化
        this.refresh();
        var clipNum = this.clipNum;
        if (clipNum == 8) {
            clipNum = 1;
        } else {
            clipNum += 1;
        }
        this.anim.play("line" + clipNum);
    },

    setCurrentClipNum: function (clipNum) {
        this.clipNum = clipNum;
    }

});
