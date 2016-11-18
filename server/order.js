var {root} = require("./common.js");
var UserServer = require("./user.js").User;
var GlobalServer = require("./global.js").Global;

var Order = {
    // 地址信息
    setLocationText: function (_locationText) {
        this._locationText = _locationText;
    },
    getLocationText: function () {
        return this._locationText;
    },
    // 当前城市
    setCurrentCity: function (_currentCity) {
        this._currentCity = _currentCity;
    },
    getCurrentCity: function () {
        return this._currentCity;
    },
    // 经度
    setLongitude: function (_longitude) {
        this._longitude = _longitude;
    },
    getLongitude: function () {
        return this._longitude;
    },
    // 纬度
    setLatitude: function (_latitude) {
        this._latitude = _latitude;
    },
    getLatitude: function () {
        return this._latitude;
    },
    // 搜索的Pois列表
    setLocationPois: function (_pois) {
        this._pois = _pois;
    },
    getLocationPois: function () {
        return this._pois;
    },
    // 搜索关键字
    setSearchText: function (_searchText) {
        this._searchText = _searchText;
    },
    getSearchText: function () {
        return this._searchText;
    },
    // 详细地址
    setDetailAddress: function (_detailAddress) {
        this._detailAddress = _detailAddress;
    },
    getDetailAddress: function () {
        return this._detailAddress;
    },
    // 时长
    setTimeLength: function (_timeLength) {
        this._timeLength = _timeLength;
    },
    getTimeLength: function () {
        return this._timeLength;
    },
    // 日期
    setDate: function (_date) {
        this._date = _date;
    },
    getDate: function () {
        return this._date;
    },
    // 姓名
    setUserName: function (_userName) {
        this._userName = _userName;
    },
    getUserName: function () {
        return this._userName;
    },
    // 性别
    setGender: function (_gender) {
        this._gender = _gender;
    },
    getGender: function () {
        return this._gender;
    },
    // 手机号
    setMobile: function (_mobile) {
        this._mobile = _mobile;
    },
    getMobile: function () {
        return this._mobile;
    },
    // 拍摄类型
    setType: function (_type) {
        this._type = _type;
    },
    getType: function () {
        return this._type;
    },
    // 订单号
    setOrderId: function (_orderId) {
        this._orderId = _orderId;
    },
    getOrderId: function () {
        return this._orderId;
    },
    // 订单列表
    setOrderListData: function (_orderListData) {
        this._orderListData = _orderListData;
    },
    getOrderListData: function () {
        return this._orderListData;
    },
    // 是否取消订单
    setIsCancelOrder: function (_isCancelOrder) {
        this._isCancelOrder = _isCancelOrder;
    },
    getIsCancelOrder: function () {
        return this._isCancelOrder;
    },
    // 获取当前经纬度的信息
    getLocationInfo: function (callback) {
        wx.showToast({
            title: '定位中...',
            icon: 'loading',
            duration: 10000
        });
        wx.getLocation({
            type: 'wgs84',
            success: function (res) {
                this.setLongitude(res.longitude);
                this.setLatitude(res.latitude);
                var url = root + '/photoBazaar/location/getPoi';
                var data = {
                    query: '',
                    lat: res.latitude,
                    lng: res.longitude,
                    region: this.getCurrentCity()
                }
                UserServer.getDataWithPublicParams(data);
                wx.request({
                    url: url,
                    data: data?data:{},
                    header:{
                        "Content-Type":"application/json"
                    },
                    success: function(result) {
                        if (result.data.status == 200) {
                            this.setLocationPois(result.data.data.list);
                            this.setLocationText(result.data.data.list[0].name);
                            callback && callback();
                        } else {
                            GlobalServer.alert("定位失败");
                        }
                    }.bind(this),
                    fail: function () {
                        GlobalServer.alert("定位失败");
                    },
                    complete: function () {
                        wx.hideToast();
                    }
                });
            }.bind(this)
        })
    },
    // 获取关键字搜索的信息
    searchLocation: function (callback) {
        var url = root + '/photoBazaar/location/getPoi';
        var data = {
            query: this.getSearchText(),
            lat: this.getLatitude(),
            lng: this.getLongitude(),
            region: this.getCurrentCity()
        }
        UserServer.getDataWithPublicParams(data);
        wx.request({
            url: url,
            data: data?data:{},
            header:{
                "Content-Type":"application/json"
            },
            success: function(result) {
                if (result.data.status == 200) {
                    this.setLocationPois(result.data.data.list);
                    callback && callback(result.data.data.list);
                } else {
                    GlobalServer.alert("没有搜索到相关定位信息");
                }
            }.bind(this),
            fail: function () {
                GlobalServer.alert("没有搜索到相关定位信息");
            },
            complete: function () {

            }
        });
    },
    // 创建订单
    createOrder: function (callback) {
        if (this.getLocationText() == '') {
            GlobalServer.alert("预约时间不能为空");
            return false;
        }
        if (this.getUserName() == '') {
            GlobalServer.alert("姓名不能为空");
            return false;
        }
        if (this.getMobile() == '') {
            GlobalServer.alert("手机号不能为空");
            return false;
        }
        wx.showToast({
            title: '预约中...',
            icon: 'loading',
            duration: 10000
        });
        var url = root + "/photoBazaar/order/create";
        var data = {
            lat: this.getLatitude(),         // 经度
            lng: this.getLongitude(),        // 纬度
            type: this.getType(),            // 拍摄服务类型：1-8 场景 ; 0,快拍
            bookDate: this.getDate(),        // 预约时间
            place: this.getLocationText(),   // 预约地点
            sex: this.getGender(),           // 性别，默认为 0/女, 1/男
            name: this.getUserName(),        // 姓名
            mobile: this.getMobile()         // 电话
        };
        UserServer.getDataWithPublicParams(data);
        wx.request({
            url: url,
            data: data?data:{},
            header:{
                "Content-Type":"application/json"
            },
            success: function(result) {
                if (result.data.status == 200) {
                    wx.showToast({
                        title: '预约成功',
                        icon: 'success',
                        duration: 2000
                    });
                    callback && callback(result)
                } else {
                    GlobalServer.alert("预约失败，请重试");
                }
            }.bind(this),
            fail: function () {
                GlobalServer.alert("预约失败，请重试");
            },
            complete: function () {
                wx.hideToast();
            }
        });
    },
    // 获取订单列表
    getOrderList:function (sp, callback) {
        if (sp > 1) {
            wx.showToast({
                title: '加载中...',
                icon: 'loading',
                duration: 10000
            });
        }
        var url = root + "/photoBazaar/order/getList";
        var data = {
            sp: sp,
            limit: 34
        };
        UserServer.getDataWithPublicParams(data);
        wx.request({
            url: url,
            data: data?data:{},
            header:{
                "Content-Type":"application/json"
            },
            success: function(result) {
                if (result.data.status == 200) {
                    this.setOrderListData(result.data.data);
                    this.setIsCancelOrder(false);
                    callback && callback(result)
                } else {
                    // GlobalServer.alert("订单列表请求失败");
                }
            }.bind(this),
            complete: function () {
                wx.hideToast();
            }
        });
    },
    // 取消订单
    cancelOrder: function (callback) {
        wx.showToast({
            title: '取消中...',
            icon: 'loading',
            duration: 10000
        });
        this.setIsCancelOrder(true);
        var url = root + "/photoBazaar/order/cancelOrder";
        var data = {
            orderId: this.getOrderId()
        };
        UserServer.getDataWithPublicParams(data);
        wx.request({
            url: url,
            data: data?data:{},
            header:{
                "Content-Type":"application/json"
            },
            success: function(result) {
                if (result.statusCode == 200) {
                    callback && callback(result)
                } else {
                    GlobalServer.alert("取消失败，请重试");
                }
            }.bind(this),
            fail: function () {
                GlobalServer.alert("取消失败，请重试");
            },
            complete: function () {
                wx.hideToast();
            }
        });
    },
    // 获取云端照片
    getPhotosByOrderId: function (oid, callback) {
        var oid = "201611051622107885";
        var url = root + "/photoBazaar/index/getPhotosByOrderId";
        var data = {
            oid: oid,
            all: 0
        };
        UserServer.getDataWithPublicParams(data);
        wx.request({
            url: url,
            data: data?data:{},
            header:{
                "Content-Type":"application/json"
            },
            success: function(result) {
                callback && callback(result)
            }.bind(this),
            complete: function () {

            }
        });
    },
    // 获取云端照片
    getOrderPhoto: function (callback) {
        var url = root + "/photoBazaar/photo/orderPhoto";
        var data = {
            oid: '201611051622107885',
            all: 1
        };
        UserServer.getDataWithPublicParams(data);
        wx.request({
            url: url,
            data: data?data:{},
            header:{
                "Content-Type":"application/json"
            },
            success: function(result) {
                callback && callback(result)
            }.bind(this),
            complete: function () {

            }
        });
    }
}

module.exports = {
    Order: Order
}