var Global = {
    init: function () {

    },
    // 设置首页界面scroll高度
    setHomeScrollTop: function (_homeScrollTop) {
        this._homeScrollTop = _homeScrollTop;
    },
    getHomeScrollTop: function () {
        return this._homeScrollTop;
    },
    // 设置订单界面scroll高度
    setOrderScrollTop: function (_orderScrollTop) {
        this._orderScrollTop = _orderScrollTop;
    },
    getOrderScrollTop: function () {
        return this._orderScrollTop;
    },
    // 设置照片库界面scroll高度
    setGalleryScrollTop: function (_galleryScrollTop) {
        this._galleryScrollTop = _galleryScrollTop;
    },
    getGalleryScrollTop: function () {
        return this._galleryScrollTop;
    },
}

module.exports = {
    Global: Global
}