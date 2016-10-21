var Loading ={
    init: function () {
        console.log("init");
    },
    show: function (callback) {
        this._deg = 180;
        var animation = wx.createAnimation({
            timingFunction:"linear"
        })
        animation.opacity(1).rotate(this._deg).step();
        setTimeout(function () {
            callback && callback(animation);
        }, 1000)
        setInterval(function () {
            this._deg += 180;
            animation.rotate(this._deg).step();
            // setTimeout(function () {
                callback && callback(animation);
            // }.bind(this), 200);
        }.bind(this),1000);
    },
    hide: function (callback) {
        var animation = wx.createAnimation({
            duration: 1000,
            timingFunction:"linear"
        })
        animation.translate(0, 45).step();
        setTimeout(function () {
            callback && callback(animation);
        }.bind(this), 500);
    },
}

module.exports = {
    Loading: Loading
}