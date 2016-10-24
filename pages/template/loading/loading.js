var Loading ={
    init: function (callback) {
        this._deg = 0;
    // },
    // show: function (callback) {
    //     clearInterval(this.timer);
        // var animation = wx.createAnimation({
        //     timingFunction:"linear"
        // })
        // animation.opacity(1).step({ duration: 500 });
        // callback && callback(animation);
        this.timer = setInterval(function () {
            var animation = wx.createAnimation({
                timingFunction:"linear"
            })
            this._deg += 180;
            animation.rotate(this._deg).step({ duration: 500 });
            callback && callback(animation);
        }.bind(this), 500);
    },
    hide: function (callback) {
        clearInterval(this.timer);
        var animation = wx.createAnimation({
            timingFunction:"linear"
        })
        animation.rotate(this._deg).step({ duration: 10 });
        callback && callback(animation);
    },
}

module.exports = {
    Loading: Loading
}