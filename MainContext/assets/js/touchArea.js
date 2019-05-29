var com = require("./common");
cc.Class({
    extends: cc.Component,

    properties: {
        game: {
            default: null,
            type: cc.Node
        },
        anim: {
            default: null,
            type: cc.Animation
        },
    },

    onLoad: function () {
        // 载入时的特效
        this.anim = this.getComponent(cc.Animation);
        this.anim.play("touchScale");
        // 监听触摸开始、结束和取消事件
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    },

    onTouchBegan: function (event) {
        // 播放动画效果
        if (this.anim.getAnimationState("touchRotation").isPlaying) {
            this.anim.resume("touchRotation");
        } else {
            this.anim.playAdditive("touchRotation");
        }
        this.anim.playAdditive("speedControl");
        // 获取开始触摸时的坐标
        com.touchBeginX = event.touch.getLocationX();
        com.touchBeginY = event.touch.getLocationY();
    },

    onTouchEnd: function (event) {
        this.anim.pause("touchRotation");
        this.anim.stop("speedControl");
        // 获取结束触摸时的坐标
        com.touchEndX = event.touch.getLocationX();
        com.touchEndY = event.touch.getLocationY();
        // 根据触摸区的最终大小设置鞭炮速度
        var scale = this.node.scale;
        var delta = (scale - 1) * scale / ((1.8 - scale) * 1.8);
        if (scale >= 1 && scale <= 1.2) {
            com.speed = delta * 3300 + 300;
        } else if (scale > 1.2 && scale <= 1.4) {
            com.speed = delta * 300 + 300;
        } else {
            com.speed = delta * 450 + 100;
        }
        // cc.log("scale: " + scale + "    speed：" + com.speed);
        // 生成鞭炮
        this.game.newFirecrackers();
        this.node.scale = 1;
    }

});
