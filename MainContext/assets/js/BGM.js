var com = require("./common");
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad () {
        if (!com.isSilent && !com.isPlayBGM) {
            cc.loader.loadRes("BGM", cc.AudioClip, function (err, BGM) {
                cc.audioEngine.play(BGM, true, 0.2);
                com.isPlayBGM = true;
            });
        }
    },

});