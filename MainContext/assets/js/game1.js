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
        touchArea: {
            default: null,
            type: cc.Node
        },
        firecrackers: {
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
        plusTime: 1,
        scheduleTime: 0.8,
        plus: {
            default: null,
            type: cc.Label
        },
    },

    gameOverButtonFunc: function () {
        if (CC_WECHATGAME) {
            window.wx.postMessage({// 发消息给子域
                messageType: 4,
                MAIN_MENU_NUM: "game1"
            });
        } else {
            cc.log("获取横向展示排行榜数据。" + "game1");
        }
    },

    submitScoreButtonFunc() {
        let score = this.score;
        if (CC_WECHATGAME) {
            window.wx.postMessage({
                messageType: 3,
                MAIN_MENU_NUM: "game1",
                score: score,
            });
        } else {
            cc.log("提交得分: " + "game1" + " : " + score)
        }
    },

    onLoad: function () {
        // 开启碰撞检测系统
        cc.director.getCollisionManager().enabled = true;
        // 在touchArea组件上暂存game对象的引用
        this.touchArea.getComponent("touchArea").game = this;
        // 在dragon组件上暂存game对象的引用
        this.dragon.getComponent("dragon1").game = this;
        // 计时
        this.time = 60;
        this.scheduleTime = 0.8;
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
        this.schedule(this.timeCallback, this.scheduleTime);
        this.score = 0;
        this.plusTime = 1;
    },

    setDifficulty: function (scheduleTime) {
        this.scheduleTime = scheduleTime;
        this.plusTime += 1;
        this.unschedule(this.timeCallback);
        this.schedule(this.timeCallback, this.scheduleTime);
    },

    gainScore: function (isWholePart) {
        if (isWholePart) {
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
        // 设置难度梯度
        this.scoreDisplay.string = "" + this.score;
        if (this.score == 30) {
            this.setDifficulty(0.7);
        } else if (this.score == 60) {
            this.setDifficulty(0.6);
        } else if (this.score == 90) {
            this.setDifficulty(0.5);
        }
    },

    setCollider(name) {
        var partToBeShot = cc.find("Game1/dragon/" + name);
        var boxCollider = partToBeShot.getComponent(cc.BoxCollider);
        boxCollider.enabled = true;
        // 为被碰撞目标标记闪烁效果
        var blink = cc.repeatForever(cc.blink(1, 5));
        var tip = partToBeShot.getChildByName("tip");
        tip.active = true;
        tip.runAction(blink);
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
        firecrackers.getComponent("firecrackers1").game = this;
    }

});
