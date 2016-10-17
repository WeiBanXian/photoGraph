var alert ={
    init: function () {
        console.log("init");
    },
    show: function (callback) {
        var animation = wx.createAnimation({
            timingFunction:"linear"
        })
        animation.translate(0, -45).step();
        setTimeout(function () {
            callback && callback(animation);
        }.bind(this), 1000);
    },
    hide: function (callback) {
        var animation = wx.createAnimation({
            timingFunction:"linear"
        })
        animation.translate(0, 45).step();
        setTimeout(function () {
            callback && callback(animation);
        }.bind(this), 1000);
    },
}

module.exports = {
    Alert: alert
}