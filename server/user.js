var {root, userCenterRoot, wxapi} = require("./common.js");
var md5 = require('../utils/md5.js')

// 注册号码
// 11000000907
// 密码
// 123456

var User = {
    // 初始化
    init:function (callback) {
        var _self = this;
        this.setUserParams();
        this.setPublicParams();
        wx.getStorage({
            key: 'loginData',
            success: function(res) {
                if (res.data.mobile) {
                    _self.setMobile(res.data.mobile);
                }
                if (res.data.password) {
                    _self.setPassword(res.data.password);
                }
                callback && callback(res.data);
            }
        })
    },

    // 校验手机号码格式
    checkPhoneNum: function () {
        var _phoneNum = this.getMobile();
        if (/^1\d{10}$/.test(_phoneNum)) {
            return true;
        } else {
            console.log("用户名错误");
            return false;
        }
    },

    // 校验邮箱格式
    checkEmail: function () {
        var _email = this.getUserName();
        if (/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(_email)) {
            return true;
        } else {
            console.log("邮箱格式错误");
            return false;
        }
    },

    // 校验密码格式
    checkPassword: function () {
        var _password = this.getPassword();
        var _length = _password.length;
        if (_length >= 6 && _length <= 20) {
            return true;
        } else {
            console.log("密码错误");
            return false;
        }
    },

    // 获取验证码
    getRequestRegisterCode: function (successCallback, failCallback) {
        if (!this.checkPhoneNum()) {
            failCallback && failCallback("用户名错误");
            return false;
        }
        if (!this.checkPassword()) {
            failCallback && failCallback("密码错误");
            return false;
        }
        // var url = root + '/manage/index/sendCode';
        var url = root + '/photoBazaar/sPro/sendCode';
        var data = {
            mobile: this.getMobile(),
            password: this.getPassword()
        };
        wx.request({
            url: url,
            data: data?data:{},
            medthod: 'post',
            header:{
                "Content-Type":"application/json"
            },
            success: function(res) {
                var data = res.data;
                successCallback && successCallback(res);
            }
        });
    },

    // 注册
    register: function (successCallback, failCallback) {
        if (!this.checkPhoneNum()) {
            failCallback && failCallback("用户名错误");
            return false;
        }
        if (this.getRegisterCode() == '' || this.getRegisterCode() == 'undefined') {
            failCallback && failCallback("验证码错误");
            return false;
        }
        // var url = userCenterRoot + '/api/v2/mobLoginForTest',
        var url = root + '/photoBazaar/sPro/register';
        var data = {
            mobile: this.getMobile(),
            vcode: this.getRegisterCode()
        };
        wx.request({
            url: url,
            data: data?data:{},
            medthod: 'post',
            header:{
                "Content-Type":"application/json"
            },
            success: function(res) {
                var data = res.data;
                if (res.data.status == "200") {
                    this.UserParams = data.data;
                    this.setToken(data.data.token);
                    this.setUserId(data.data.userId);
                    this.setPublicParams();
                }
                var loginData = {
                    mobile: this.getMobile(),
                    password: this.getPassword()
                };
                wx.setStorage({"loginData": loginData});
                successCallback && successCallback(res);
            }.bind(this)
        });
    },

    // 登录
    login: function (successCallback, failCallback) {
        if (!this.checkPhoneNum()) {
            failCallback && failCallback("用户名错误");
            return false;
        }
        if (!this.checkPassword()) {
            failCallback && failCallback("密码错误");
            return false;
        }

        wx.showToast({
            title: '登录中...',
            icon: 'loading',
            duration: 10000
        })

        var data = {};
        var isMobile = true;

        if (isMobile) {
            data = {
                mobile: this.getMobile(),
                password: this.getPassword(),
                // password: md5.MD5(md5.MD5(this.getPassword())),
                appkey: "f6cb3d93e7ac1146"
            };
        }
        wx.request({
            url: root + '/photoBazaar/sPro/login',
            // url: userCenterRoot + '/api/v2/mobLoginForTest',
            // url: root + '/manage/index/photoGrapherLogin',
            data: data,
            medthod: 'post',
            header:{
                "Content-Type":"application/x-www-form-urlencoded"
            },
            success: function(res) {
                if (res.data.status == "200") {
                    var data = res.data;
                    this.UserParams = data.data;
                    this.setToken(data.data.token);
                    this.setUserId(data.data.userId);
                    this.setPublicParams();
                    var loginData = {
                        mobile: this.getMobile(),
                        password: this.getPassword()
                    };
                    wx.setStorage({key: "loginData", data: loginData});
                    successCallback && successCallback();
                } else {
                    failCallback && failCallback();
                }
            }.bind(this),
            fail: function () {
                failCallback && failCallback();
            },
            complete: function (res) {
                wx.hideToast()
            }
        });
    },
    json2Form: function (json) {
        var str = [];
        for(var p in json){
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
        }
        return str.join("&");
    },
    // 用户名
    setUserName: function (_userName) {
        this._userName = _userName;
    },
    getUserName: function () {
        return this._userName;
    },
    // 手机号
    setMobile: function (_mobile) {
        this._mobile = _mobile;
    },
    getMobile: function () {
        return this._mobile;
    },
    // 密码
    setPassword: function (_password) {
        this._password = _password;
    },
    getPassword: function () {
        return this._password;
    },
    // 性别
    setGender: function (_gender) {
        this._gender = _gender;
    },
    getGender: function () {
        return this._gender;
    },
    // 头像
    setAvatar: function (_avatar) {
        this._avatar = _avatar;
    },
    getAvatar: function () {
        return this._avatar;
    },
    // 注册验证码
    setRegisterCode: function (_registerCode) {
        this._registerCode = _registerCode;
    },
    getRegisterCode: function () {
        return this._registerCode;
    },
    // 用户信息
    setUserParams: function () {
        this.UserParams = {
            avatar: ''
        };
    },
    getUserParams: function () {
        return this.UserParams;
    },
    // token
    setToken: function (_token) {
        this._token = _token;
    },
    getToken: function () {
        return this._token;
    },
    // userId
    setUserId: function (_userId) {
        this._userId = _userId;
    },
    getUserId: function () {
        return this._userId;
    },
    // 设置公共参数
    setPublicParams: function() {
        this.publicParams = {
            mnc: "01",
            device: "Unknown",
            deviceId: "4A27FABF-D501-4AA8-BF4F-BA844D742BF2",
            icc: "cn",
            channel: "appstore",
            appversion: "1.1.8",
            appVersion: "1.1.8",
            locale: "zh-Hans-CN",
            appKey: "f6cb3d93e7ac1146",
            cid: "",
            appname: "想拍就拍",
            platform: "iphone",
            timestamp: "1476863455.339511",
            certType: "production",
            appName: "想拍就拍",
            cnet: "wifi",
            systemVersion: "10.0",
            appkey: "f6cb3d93e7ac1146",
            token: this.getToken(),
            userId: this.getUserId()
        };
    },

    getDataWithPublicParams: function(data) {
        var _publicParams = this.publicParams;
        for (var key in this.publicParams) {
            data[key] = _publicParams[key];
        }
        return data;
    },

    // 获取优惠券列表
    getCouponList: function (callback) {
        var url = root + "/photoBazaar/order/couponList";
        var data = {};
        this.getDataWithPublicParams(data);
        wx.request({
            url: url,
            data: data?data:{},
            header:{
                "Content-Type":"application/json"
            },
            success: function(result) {
                if (result.statusCode == 200) {
                    callback && callback(result)
                }
            }.bind(this)
        });
    },

    // 更新用户信息
    updateInfo: function (data, callback) {
        wx.showToast({
          title: '修改中...',
          icon: 'loading',
          duration: 10000
        });
        var url = root + "/photoBazaar/user/updateInfo";
        var data = data;
        this.getDataWithPublicParams(data);
        wx.request({
            url: url,
            data: data?data:{},
            header:{
                "Content-Type":"application/json"
            },
            success: function(result) {
                if (result.statusCode == 200) {
                    var data = result.data.data;
                    if (data.sex == 0 || data.sex == 1) {
                        this.getUserParams().gender = data.sex;
                    }
                    if (data.nickname != "undefined") {
                        this.getUserParams().nickname = data.nickname;
                    }
                }
            }.bind(this),
            fail: function (error) {

            },
            complete: function () {
                wx.hideToast();
                wx.showToast({
                  title: '更新资料成功',
                  icon: 'success',
                  duration: 2000
                });
            }
        });
    },

    // 退出登录
    loginOut: function (callback) {
        wx.showToast({
          title: '退出登录中...',
          icon: 'loading',
          duration: 10000
        })
        var url = root + "/photoBazaar/user/loginOut";
        var data = {};
        this.getDataWithPublicParams(data);
        wx.request({
            url: url,
            data: data?data:{},
            header:{
                "Content-Type":"application/json"
            },
            success: function(result) {
                if (result.statusCode == 200) {
                    wx.clearStorage();
                    callback && callback(result)
                }
            }.bind(this),
            fail: function (error) {

            },
            complete: function () {
                wx.hideToast();
            }
        });
    },


    // 微信相关
    accessTokenRequest: function (callback) {
        var data = {
            grant_type: "client_credential",
            appid: "wx82141199f13f7f8b",
            secret: this.getAppSecret()
        };
        wx.request({
            url: wxapi + '/cgi-bin/token',
            data: data,
            medthod: 'GET',
            header:{
                "Content-Type":"application/x-www-form-urlencoded"
            },
            success: function(res) {
                // console.log(res);
                this.setAccessToken(res.data.access_token);
                callback && callback();
            }.bind(this),
            fail: function (error) {
                console.log(error);
            },
            complete: function (res) {
                // console.log(res);
            }
        });
    },
    /**
     * [getOpenId 获取openId]
     * @return {openId}
     */
    openIdRequest: function (callback) {
        var data = {
            grant_type: "authorization_code",
            appid: "wx82141199f13f7f8b",
            secret: this.getAppSecret(),
            js_code: this.getCode()
        };
        wx.request({
            url: wxapi + '/sns/jscode2session',
            data: data,
            medthod: 'GET',
            header:{
                "Content-Type":"application/x-www-form-urlencoded"
            },
            success: function(res) {
                // console.log(res);
                this.setOpenId(res.data.openid);
                callback && callback();
            }.bind(this),
            fail: function (error) {
                console.log(error);
            },
            complete: function (res) {
                // console.log(res);
            }
        });
    },

    setAppSecret: function (_appSecret) {
        this._appSecret = _appSecret;
    },
    getAppSecret: function () {
        // return this._appSecret;
        return "1c78c4b2b3bfa1870799217aa2c730c8";
    },

    setCode: function (_code) {
        this._code = _code;
    },
    getCode: function () {
        return this._code;
    },

    setOpenId: function (_openId) {
        this._openId = _openId;
    },
    getOpenId: function () {
        return this._openId;
    },

    setAccessToken: function (_accessToken) {
        this._accessToken = _accessToken;
    },
    getAccessToken: function () {
        return this._accessToken;
    },

    setFormId: function (_formId) {
        this._formId = _formId;
    },
    getFormId: function () {
        return this._formId;
    },

    wxLogin: function (callback) {

        var data = {
            openId: this.getOpenId(),
            accessToken: this.getAccessToken()
        };
        this.getDataWithPublicParams(data);
        wx.request({
            url: root + '/photoBazaar/user/login',
            data: data,
            medthod: 'GET',
            header:{
                "Content-Type":"application/x-www-form-urlencoded"
            },
            success: function(res) {
                // console.log(res);
                callback && callback();
            }.bind(this),
            fail: function (error) {
                console.log(error);
            },
            complete: function (res) {
                // console.log(res);
            }
        });
    },
    templateRequest: function () {
        var value = {
            "keyword1": {
                "value": "339208499",
                "color": "#173177"
            },
            "keyword2": {
                "value": "2015年01月05日 12:30",
                "color": "#173177"
            },
            "keyword3": {
                "value": "粤海喜来登酒店",
                "color": "#173177"
            } ,
            "keyword4": {
                "value": "广州市天河区天河路208号",
                "color": "#173177"
            }
        };
        var data = {
            touser: this.getOpenId(),
            template_id: "yiKa-vxiuNKaePbGydC9QHBMLmia3E2c9DSCjEL302g",
            // page: '',
            form_id: this.getFormId(),
            data: value,
            color: '#F00',
            // emphasis_keyword: ''
        };
        wx.request({
            url: wxapi + '/cgi-bin/message/wxopen/template/send?access_token=' + this.getAccessToken(),
            data: data,
            method: 'POST',
            header:{
                'Content-Type': 'application/json'
            },
            success: function(res) {
                console.log(res);
            }.bind(this),
            fail: function (error) {
                console.log(error);
            },
            complete: function (res) {
                // console.log(res);
            }
        });
    }
}

module.exports = {
    User: User
}