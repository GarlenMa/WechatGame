var com = require("./common");
cc.Class({
    extends: cc.Component,

    properties: {
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
        // currentAudio: null,
        game: {
            default: null,
            type: cc.Node
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
        // 旋转
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
        if (other.node.group == "dragon") { //鞭炮与龙碰撞
            // 碰撞次数 + 1
            com.collisionCount += 1;
            // 得分
            this.game.gainScore();
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
            // 移除原被炸点的提示效果
            other.node.getChildByName("tip").active = false;
            // 关闭龙碰撞节点
            other.enabled = false;
            // 龙未消失之前就打完5个点，直接运行下一段路程
            if (com.collisionCount == 5) {
                other.node.parent.getComponent("dragon2").check();
            }
        } else { //鞭炮与墙碰撞
            // 关闭碰撞组件
            self.enabled = false;
            // 碰撞后鞭炮节点销毁
            this.node.destroy();
        }

    },

    /**
     * 根据触摸滑动的直线，更新每一帧鞭炮的位置
     */
    update: function (dt) {
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
    }

});
