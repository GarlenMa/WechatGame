var com = require("./common")
cc.Class({
    extends: cc.Component,

    properties: {
        firecrackersPrefab: {
            default: null,
            type: cc.Prefab
        },
        dragon: {
            default: null,
            type: cc.Node
        },
        touchArea1: {
            default: null,
            type: cc.Node
        },
        time: 60,
        timeDisplay: {
            default: null,
            type: cc.Label
        },
        timeCallback: null,
        score: 0,
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        plusTime: 6,
        plus: {
            default: null,
            type: cc.Label
        },
    },

    gameOverButtonFunc: function () {
        if (CC_WECHATGAME) {
            window.wx.postMessage({// 发消息给子域
                messageType: 4,
                MAIN_MENU_NUM: "game2"
            });
        } else {
            cc.log("获取横向展示排行榜数据。" + "game2");
        }
    },

    submitScoreButtonFunc() {
        let score = this.score;
        if (CC_WECHATGAME) {
            window.wx.postMessage({
                messageType: 3,
                MAIN_MENU_NUM: "game2",
                score: score,
            });
        } else {
            cc.log("提交得分: " + "game2" + " : " + score)
        }
    },

    onLoad: function () {
        // 开启碰撞检测系统
        cc.director.getCollisionManager().enabled = true;
        // 在touchArea1组件上暂存game对象的引用
        this.touchArea1.getComponent("touchArea").game = this;
        // 在dragon组件上暂存game对象的引用
        this.dragon.getComponent("dragon2").game = this;
        // 计时
        this.time = 60;
        this.timeCallback = function () {
            if (this.time == 1) {
                this.unschedule(this.timeCallback);
                this.node.getChildByName("mask").active = true;
                this.node.getChildByName("gameOverRankBox").active = true;
                // 上传分数
                this.submitScoreButtonFunc();
                // 获取排行榜
                this.gameOverButtonFunc();
            }
            this.time -= 1;
            this.timeDisplay.string = "" + this.time;
        };
        this.schedule(this.timeCallback, 1);
        this.score = 0;
        this.plusTime = 6;
    },

    newFirecrackers: function () {
        // 生成预制的鞭炮资源
        var scene = cc.director.getScene();
        var firecrackers = cc.instantiate(this.firecrackersPrefab);
        // 设置初始位置为触摸开始的位置
        firecrackers.x = com.touchBeginX;
        firecrackers.y = com.touchBeginY;
        // 设置碰撞分组
        firecrackers.group = "firecracker";
        scene.addChild(firecrackers);
        firecrackers.active = true;
        // 在firecrackers组件上暂存game对象的引用
        firecrackers.getComponent("firecrackers2").game = this;
    },

    setDragonSpeed: function (speed) {
        var dragonScript = this.dragon.getComponent("dragon2");
        dragonScript.clipSpeed = speed;
        dragonScript.setClipSpeed();
        this.plusTime += 1;
    },

    gainScore: function () {
        // 是否炸完整条龙
        if (com.collisionCount == 5) {
            this.time += this.plusTime;
            var plusNode = this.plus.node;
            plusNode.opacity = 255;
            plusNode.active = true;
            this.plus.string = "+" + this.plusTime;
            var plusOpacityCallback = function () {
                plusNode.opacity -= 10;
                if (plusNode.opacity <= 5) {
                    plusNode.active = false;
                    this.unschedule(plusOpacityCallback);
                }
            };
            this.schedule(plusOpacityCallback, 0.05);
        }
        this.score += 1;
        this.scoreDisplay.string = "" + this.score;
        // 30 60 90 分时龙加速,加时间依次递减
        if (this.score == 30) {
            this.setDragonSpeed(1);
        } else if (this.score == 60) {
            this.setDragonSpeed(1.5);
        } else if (this.score == 90) {
            this.setDragonSpeed(2);
        }
    }

});
