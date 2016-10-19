var {root} = require("./common.js");
var UserServer = require("./user.js").User;

var Order = {
    // 地址信息
    setLocationText: function (_locationText) {
        this._locationText = _locationText;
    },
    getLocationText: function () {
        return this._locationText;
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
    // 获取当前经纬度的信息
    getLocationInfo: function (callback) {
        wx.getLocation({
            type: 'wgs84',
            success: function (res) {
                this.setLongitude(res.longitude);
                this.setLatitude(res.latitude);
                var url = 'http://restapi.amap.com/v3/geocode/regeo';
                wx.request({
                    url: url,
                    data: {
                        key: "6bbcf8a9041e51985d60fb352723e62c",
                        location: res.longitude + ',' + res.latitude,
                        radius: 100,
                        extensions: "all"
                    },
                    header:{
                        "Content-Type":"application/json"
                    },
                    success: function(result) {
                        this.setLocationPois(result.data.regeocode.pois);
                        this.setLocationText(result.data.regeocode.pois[0].name);
                        callback && callback();
                    }.bind(this)
                });
            }.bind(this)
        })
    },
    // 获取关键字搜索的信息
    searchLocation: function (callback) {
        var url = "http://restapi.amap.com/v3/place/text";
        wx.request({
            url: url,
            data: {
                key: "6bbcf8a9041e51985d60fb352723e62c",
                keywords: this.getSearchText(),
                // keywords: "四川大学",
                city: "chengdu",
                offset: 25,
                page: 1,
                extensions: "all"
            },
            header:{
                "Content-Type":"application/json"
            },
            success: function(result) {
                this.setLocationPois(result.data.pois);
                callback && callback(result)
            }.bind(this)
        });
    },
    // 创建订单
    createOrder: function (callback) {
        var url = root + "/photoBazaar/order/create";
        var data = {
            lat: this.getLatitude(),  // 经度
            lng: this.getLongitude(),  // 纬度
            type: this.getType(),  // 拍摄服务类型：1-8 场景 ; 0,快拍
            bookDate: this.getDate(),  // 预约时间
            place: this.getLocationText(),  // 预约地点
            sex: this.getGender(),  // 性别，默认为 0/女, 1/男
            name: this.getUserName(),  // 姓名
            mobile: this.getMobile()  // 电话
            // name: "this.getUserName()",  // 姓名
            // mobile: "18583269107"  // 电话
        };
        UserServer.getDataWithPublicParams(data);
        wx.request({
            url: url,
            data: data?data:{},
            header:{
                "Content-Type":"application/json"
            },
            success: function(result) {
                // if (result.statusCode == 200) {}
                callback && callback(result)
            }.bind(this)
        });
    },
    getOrderList:function (callback) {
        var url = root + "/photoBazaar/order/getList";
        var data = {
            sp: 0,
            limit: 10
        };
        console.log(UserServer.getDataWithPublicParams(data))
        wx.request({
            url: url,
            data: data?data:{},
            header:{
                "Content-Type":"application/json"
            },
            success: function(result) {
                // if (result.statusCode == 200) {}
                callback && callback(result)
            }.bind(this)
        });
    }
}

module.exports = {
    Order: Order
}