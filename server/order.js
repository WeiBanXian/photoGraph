var {root, wxapi, message} = require("./common.js");
var UserServer = require("./user.js").User;

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
    setShootTime: function (_shootTime) {
        this._shootTime = _shootTime;
    },
    getShootTime: function () {
        return this._shootTime;
    },
    // 日期（时间戳）
    setDate: function (_date) {
        this._date = _date;
    },
    getDate: function () {
        return this._date;
    },
    // 日期（可读时间）
    setDateStr: function (_dateStr) {
        this._dateStr = _dateStr;
    },
    getDateStr: function () {
        return this._dateStr;
    },
    // 日期（可读时间）
    setSceneData: function (_sceneData) {
        this._sceneData = _sceneData;
    },
    getSceneData: function () {
        return this._sceneData;
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
                            message.alert("定位失败");
                        }
                    }.bind(this),
                    fail: function () {
                        message.alert("定位失败");
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
                    message.alert("没有搜索到相关定位信息");
                }
            }.bind(this),
            fail: function () {
                message.alert("没有搜索到相关定位信息");
            },
            complete: function () {

            }
        });
    },
    // 创建订单
    createOrder: function (callback) {
        if (this.getLocationText() == '') {
            message.alert("请选择预约时间");
            return false;
        }
        if (this.getUserName() == '') {
            message.alert("请输入姓名");
            return false;
        }
        if (this.getMobile() == '') {
            message.alert("请输入手机号");
            return false;
        }
        if (!UserServer.checkPhoneNum(this.getMobile())) {
            message.alert("请输入正确的手机号");
            return false;
        }
        wx.showToast({
            title: '预约中...',
            icon: 'loading',
            duration: 10000
        });
        var url = root + "/photoBazaar/sPro/createOrder";
        var data = {
            uid: UserServer.getUserId(),
            lat: this.getLatitude(),         // 经度
            lng: this.getLongitude(),        // 纬度
            type: this.getType(),            // 拍摄服务类型：1-8 场景 ; 0,快拍
            bookDate: this.getDate(),        // 预约时间
            shootTime: this.getShootTime(),        // 预约时长
            place: this.getLocationText(),   // 预约地点
            sex: this.getGender(),           // 性别，默认为 0/女, 1/男
            name: this.getUserName(),        // 姓名
            mobile: this.getMobile()         // 电话
        };
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
                    this.setIsCancelOrder(true);
                    callback && callback(result)
                } else {
                    message.alert("预约失败，请重试");
                }
            }.bind(this),
            fail: function () {
                message.alert("预约失败，请重试");
            },
            complete: function () {
                wx.hideToast();
            }
        });
    },
    templateRequest: function () {
        // 姓名
        // 电话
        // 项目
        // 时间
        // 地址
        var typeStr = '想拍就拍专题拍摄';
        for (var i in this.getSceneData()) {
            if (this.getType() == this.getSceneData()[i].type) {
                typeStr += '——' + this.getSceneData()[i].name;
            }
        }
        var value = {
            "keyword1": {
                "value": this.getUserName(),
                "color": "#173177"
            },
            "keyword2": {
                "value": this.getMobile(),
                "color": "#173177"
            },
            "keyword3": {
                "value": typeStr,
                "color": "#173177"
            },
            "keyword4": {
                "value": this.getDateStr(),
                "color": "#173177"
            },
            "keyword5": {
                "value": this.getLocationText(),
                "color": "#173177"
            }
        };
        var data = {
            touser: UserServer.getOpenId(),
            template_id: "j7dnCXGWS2QVQT4R7GNRRHj5CImwUHJ9H1Fd7jb8ES8",
            // page: '',
            form_id: UserServer.getFormId(),
            data: value,
            color: '#F00',
            // emphasis_keyword: ''
        };
        wx.request({
            url: wxapi + '/cgi-bin/message/wxopen/template/send?access_token=' + UserServer.getAccessToken(),
            data: data,
            method: 'POST',
            header:{
                'Content-Type': 'application/json'
            },
            success: function(res) {
                // console.log(res);
            }.bind(this),
            fail: function (error) {
                console.log(error);
            },
            complete: function (res) {
                // console.log(res);
            }
        });
    },
    // 获取订单列表
    getOrderList:function (sp, callback) {
        if (sp > 1) {
            // wx.showToast({
            //     title: '加载中...',
            //     icon: 'loading',
            //     duration: 10000
            // });
        }
        var url = root + "/photoBazaar/sPro/orderList";
        var data = {
            sp: sp,
            limit: 5,
            uid: UserServer.getUserId()
        };
        wx.request({
            url: url,
            data: data?data:{},
            method: "GET",
            header:{
                "Content-Type":"application/json"
            },
            success: function(result) {
                if (result.data.status == 200) {
                    this.setOrderListData(result.data.data);
                    this.setIsCancelOrder(false);
                    callback && callback(result)
                } else {
                    message.alert("订单列表获取失败");
                }
            }.bind(this),
            fail: function () {
                message.alert("订单列表获取失败");
            },
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
        var url = root + "/photoBazaar/sPro/cancelOrder";
        var data = {
            orderId: this.getOrderId()
        };
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
                    message.alert("取消失败，请重试");
                }
            }.bind(this),
            fail: function () {
                message.alert("取消失败，请重试");
            },
            complete: function () {
                wx.hideToast();
            }
        });
    },
    // 获取云端照片
    getPhotosByOrderId: function (oid, callback) {
        var url = root + "/photoBazaar/sPro/getPhotosByOrderId";
        var data = {
            // uid: UserServer.getUserId(),
            oid: oid,
            all: 0
        };
        wx.request({
            url: url,
            data: data?data:{},
            method: "GET",
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
    getOrderPhoto: function (sp, callback) {
        var url = root + "/photoBazaar/sPro/orderPhoto";
        var data = {
            uid: UserServer.getUserId(),
            limit: 18,
            sp: sp
        };
        wx.request({
            url: url,
            data: data?data:{},
            header:{
                "Content-Type":"application/json"
            },
            success: function(result) {
                callback && callback(result)
            }.bind(this),
            fail: function () {
                message.alert("照片库获取失败");
            },
            complete: function () {
                wx.hideToast();
            }
        });
    },
    // 删除云端照片
    getDelPhotos: function (pid, callback) {
        wx.showToast({
            title: '删除中...',
            icon: 'loading',
            duration: 10000
        });
        var url = root + "/photoBazaar/sPro/delPhotos";
        var data = {
            uid: UserServer.getUserId(),
            pid: pid
        };
        wx.request({
            url: url,
            data: data?data:{},
            header:{
                "Content-Type":"application/json"
            },
            success: function(result) {
                callback && callback(result)
            }.bind(this),
            fail: function () {
                message.alert("照片删除失败，请稍候重试");
            },
            complete: function () {
            }
        });
    },

    // 获取优惠券列表
    getCouponList: function (callback) {
        // var url = root + "/photoBazaar/order/couponList";
        var url = root + "/photoBazaar/sPro/myCoupon";
        var data = {
            uid: UserServer.getUserId()
        };
        wx.request({
            url: url,
            data: data?data:{},
            header:{
                "Content-Type":"application/json"
            },
            success: function(result) {
                if (result.data.status == 200) {
                    callback && callback(result)
                } else {
                    message.alert("优惠券列表获取失败");
                }
            }.bind(this),
            fail: function () {
                message.alert("优惠券列表获取失败");
            },
            complete: function () {
                wx.hideToast();
            }
        });
    },
    // 优惠券检测
    checkCoupon: function (callback) {
        var url = root + "/photoBazaar/sPro/checkCoupon";
        var data = {
            uid: UserServer.getUserId()
        };
        wx.request({
            url: url,
            data: data?data:{},
            header:{
                "Content-Type":"application/json"
            },
            success: function(result) {
                if (result.data.status == 200) {
                    callback && callback(result)
                }
            }.bind(this),
            fail: function () {

            },
            complete: function () {
                wx.hideToast();
            }
        });
    },
    // 获取支付优惠券
    getPayCoupon: function (callback) {
        var url = root + "/photoBazaar/sPro/myCoupon";
        var data = {
            uid: UserServer.getUserId(),
            orderId: this.getOrderId()
        };
        wx.request({
            url: url,
            data: data?data:{},
            header:{
                "Content-Type":"application/json"
            },
            success: function(result) {
                if (result.data.status == 200) {
                    this.setIsUseCoupon(true);
                    if (result.data.data.list.length > 0) {
                        this.setPrid(result.data.data.list[0].prid);
                        this.setAmount(result.data.data.list[0].amount);
                    }
                    callback && callback(result)
                } else {
                    message.alert("支付唤起失败，请重试！");
                }
            }.bind(this),
            fail: function () {
                message.alert("支付唤起失败，请重试！");
            },
            complete: function () {
                wx.hideToast();
            }
        });
    },
    setIsUseCoupon: function (_isUseCoupon) {
        this._isUseCoupon = _isUseCoupon;
    },
    getIsUseCoupon: function () {
        return this._isUseCoupon;
    },
    setPrid: function (_prid) {
        this._prid = _prid;
    },
    getPrid: function () {
        return this._prid?this._prid:'';
    },
    setAmount: function (_amount) {
        this._amount = _amount;
    },
    getAmount: function () {
        return this._amount?this._amount:0;
    },
    // 使用优惠券
    useCoupon: function (callback) {
        var url = root + "/photoBazaar/sPro/useCoupon";
        var data = {
            orderId: this.getOrderId(),
            uid: UserServer.getUserId(),
            payType: 202,
            coupon: this.getIsUseCoupon()?this.getPrid():'',
            openid: UserServer.getUserId()
        };
        wx.showToast({
            title: '加载中...',
            icon: 'loading',
            duration: 10000
        });
        wx.request({
            url: url,
            data: data?data:{},
            header:{
                "Content-Type":"application/json"
            },
            success: function(result) {
                if (result.data.status == 200) {
                    callback && callback(result)
                } else {
                    message.alert("支付唤起失败，请重试！");
                }
            }.bind(this),
            fail: function () {
                message.alert("支付唤起失败，请重试！");
            },
            complete: function () {
                wx.hideToast();
            }
        });
    },

    // 支付唤起
    prepayOrder: function (callback) {
        var url = root + "/photoBazaar/sPro/payOrder";
        var data = {
            orderId: this.getOrderId(),
            uid: UserServer.getUserId(),
            payType: 202,
            coupon: this.getIsUseCoupon()?this.getPrid():'',
            openid: UserServer.getOpenId()
        };
        wx.showToast({
            title: '加载中...',
            icon: 'loading',
            duration: 10000
        });
        wx.request({
            url: url,
            data: data?data:{},
            header:{
                "Content-Type":"application/json"
            },
            success: function(result) {
                if (result.data.status == 200) {
                    this.setTimeStamp(result.data.data.sdk.timeStamp);
                    this.setNonceStr(result.data.data.sdk.nonceStr);
                    this.setPackage(result.data.data.sdk.package);
                    this.setPaySign(result.data.data.sdk.paySign);
                    this.setSignType(result.data.data.sdk.signType);
                    callback && callback(result)
                } else {
                    message.alert("支付唤起失败，请重试！");
                }
            }.bind(this),
            fail: function () {
                message.alert("支付唤起失败，请重试！");
            },
            complete: function () {
                wx.hideToast();
            }
        });
    },

    setTimeStamp: function (_timeStamp) {
        this._timeStamp = _timeStamp;
    },

    getTimeStamp: function () {
        return this._timeStamp;
    },

    setNonceStr: function (_nonceStr) {
        this._nonceStr = _nonceStr;
    },

    getNonceStr: function () {
        return this._nonceStr;
    },

    setPackage: function (_package) {
        this._package = _package;
    },

    getPackage: function () {
        return this._package;
    },

    setPaySign: function (_paySign) {
        this._paySign = _paySign;
    },

    getPaySign: function () {
        return this._paySign;
    },

    setSignType: function (_signType) {
        this._signType = _signType;
    },

    getSignType: function () {
        return this._signType;
    },

    // 支付
    payOrder: function (callback) {
        wx.showToast({
            title: '加载中...',
            icon: 'loading',
            duration: 10000
        });
        wx.requestPayment({
            timeStamp: this.getTimeStamp(),
            nonceStr: this.getNonceStr(),
            package: this.getPackage(),
            signType: this.getSignType(),
            paySign: this.getPaySign(),
            success: function(result) {
                if (result.errMsg.indexOf("ok") > -1) {
                    message.alert("支付成功！", function () {
                        this.setIsCancelOrder(true);
                        wx.navigateBack();
                    }.bind(this));
                } else {
                    message.alert("支付失败，请重试！");
                }
            }.bind(this),
            fail: function (errMsg) {
                message.alert("支付失败，请重试！");
            },
            complete: function (res) {
                wx.hideToast();
                if (res.errMsg.indexOf("cancel") > -1) {
                    message.alert("支付取消！");
                }
            }
        });
    },
    controlCouponHidden: function (_callback) {
        this._callback = _callback;
    },
    couponHiddenListener: function () {
        this._callback && this._callback();
    }
}

module.exports = {
    Order: Order
}