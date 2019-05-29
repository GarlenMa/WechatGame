var com = require("./common");
cc.Class({
    extends: cc.Component,

    properties: {
        game: {
            default: null,
            type: cc.Node
        },
        speed: 0,
        touchBeginX: 0,
        touchBeginY: 0,
        touchEndX: 0,
        touchEndY: 0,
        rotationCallback: null,
        audioFire: {
            default: null,
            type: cc.AudioClip
        },
        audioBoom: {
            default: null,
            type: cc.AudioClip
        },
        spriteBoom: {
            default: null,
            type: cc.SpriteFrame
        }
    },

    onLoad: function () {
        this.speed = com.speed;
        this.touchBeginX = com.touchBeginX;
        this.touchBeginY = com.touchBeginY;
        this.touchEndX = com.touchEndX;
        this.touchEndY = com.touchEndY;
        // 鞭炮旋转
        this.rotationCallback = function () {
            this.node.rotation += 8;
        };
        this.schedule(this.rotationCallback, 0.01);
        // 播放发射音效
        if (!com.isSilent) {
            cc.audioEngine.play(this.audioFire, false, 1);
        }
    },

    /**
     * 碰撞回调函数
     */
    onCollisionEnter: function (other, self) {
        var otherNode = other.node;
        if (otherNode.group == "dragon") { //鞭炮与龙碰撞
            // 播放爆炸音效
            if (!com.isSilent) {
                cc.audioEngine.play(this.audioBoom, false, 1);
            }
            // 更改鞭炮节点分组，便于销毁
            this.node.group = "default";
            // 爆炸效果
            this.unschedule(this.rotationCallback);
            this.node.scaleX = 0.1;
            this.node.scaleY = 0.1;
            this.getComponent(cc.Sprite).spriteFrame = this.spriteBoom;
            // var t = this;
            // cc.loader.loadRes("boom", cc.SpriteFrame, function (err, spriteFrame) {
            //     t.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            //     t.node.scaleX = 0.1;
            //     t.node.scaleY = 0.1;
            // });
            // 移除原被炸点的提示
            otherNode.getChildByName("tip").active = false;
            // 获取龙产生碰撞的点的标记设置下一个碰撞点
            var nextTag = other.tag - 1;
            var isWholePart = false;
            if (nextTag == 0) {
                nextTag = 4;
                isWholePart = true;
                otherNode.parent.getComponent(cc.Animation).play("dragonOpacity");
            }
            this.game.setCollider("body" + nextTag);
            this.game.gainScore(isWholePart);
            // 关闭龙碰撞组件
            other.enabled = false;
        } else { // 鞭炮与墙碰撞
            // 关闭碰撞组件
            self.enabled = false;
            // 碰撞后鞭炮节点销毁
            this.node.destroy();
        }

    },

    update: function (dt) {
        // 根据触摸滑动的直线，更新每一帧鞭炮的位置
        var deltaX = this.touchEndX - this.touchBeginX;
        var deltaY = this.touchEndY - this.touchBeginY;
        if (deltaX < -50) {
            this.node.x -= this.speed * dt;
            this.node.y -= this.speed * dt * (deltaY / deltaX);
        } else if (deltaX > 50) {
            this.node.x += this.speed * dt;
            this.node.y += this.speed * dt * (deltaY / deltaX);
        } else {  // 当水平方向滑动很小时，认为是完全竖直滑动
            if (deltaY > 0) {
                this.node.y += this.speed * dt;
            } else {
                this.node.y -= this.speed * dt;
            }
        }
    },

});
