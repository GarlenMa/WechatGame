var com = require("./common");
cc.Class({
    extends: cc.Component,

    properties: {
        silentLabel: {
            default: null,
            type: cc.Node
        }
    },

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.setVoice, this);
        // 载入时判断是否静音设置图标状态
        this.silentLabel.active = com.isSilent ? true : false;
    },

    setVoice: function () {
        if (com.isSilent) { // 已静音
            com.isSilent = false;
            this.silentLabel.active = false;
            cc.loader.loadRes("BGM", cc.AudioClip, function (err, BGM) {
                cc.audioEngine.play(BGM, true, 0.2);
                com.isPlayBGM = true;
            });
        } else { // 未静音
            com.isSilent = true;
            this.silentLabel.active = true;
            cc.audioEngine.stopAll();
            com.isPlayBGM = false;
        }
    }

});
