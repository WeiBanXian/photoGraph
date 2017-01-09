var {root, userCenterRoot, wxapi, message} = require("./common.js");

var User = {
    // 校验手机号码格式
    checkPhoneNum: function (phone) {
        var _phoneNum = phone?phone:this.getMobile();
        if (/^1\d{10}$/.test(_phoneNum)) {
            return true;
        } else {
            return false;
        }
    },
    // 用户名
    setUserName: function (_userName) {
        this._userName = _userName;
    },
    getUserName: function () {
        return this._userName?this._userName:'';
    },
    // 手机号
    setMobile: function (_mobile) {
        this._mobile = _mobile;
    },
    getMobile: function () {
        return this._mobile?this._mobile:'';
    },
    // 性别
    setGender: function (_gender) {
        this._gender = _gender;
    },
    getGender: function () {
        return this._gender?this._gender:0;
    },
    // 头像
    setAvatar: function (_avatar) {
        this._avatar = _avatar;
    },
    getAvatar: function () {
        return this._avatar;
    },
    // userId
    setUserId: function (_userId) {
        this._userId = _userId;
    },
    getUserId: function () {
        return this._userId;
    },

    // 更新用户信息
    updateInfo: function (_updateData, callback) {
        var _self = this;
        wx.getNetworkType({
            success: function(res) {
                var networkType = res.networkType;
                if (networkType == "fail") {
                    wx.showModal({
                        title: '提示',
                        content: '当前网络不可用',
                        success: function(res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                            }
                        }
                    })
                } else {
                    wx.showToast({
                      title: '修改中...',
                      icon: 'loading',
                      duration: 10000
                    });
                    var url = root + "/photoBazaar/sPro/updateInfo";
                    var updateData = _updateData;
                    updateData.uid = _self.getUserId();

                    wx.request({
                        url: url,
                        data: updateData?updateData:{},
                        method: "GET",
                        header:{
                            "Content-Type":"application/json"
                        },
                        success: function(result) {
                            if (result.data.status == 200) {
                                setTimeout(function () {
                                    wx.showToast({
                                      title: '更新资料成功',
                                      icon: 'success',
                                      duration: 2000
                                    });
                                }, 500);
                                var data = result.data.data;
                                var keys = []
                                for (var key in data) {
                                    if (key == "sex") {
                                        _self.setGender(data[key]);
                                    } else if (key == "nickname") {
                                        _self.setUserName(data[key]);
                                    } else if (key == "mobile") {
                                        _self.setMobile(data[key]);
                                    }
                                }
                            } else {
                                wx.showModal({
                                    title: '提示',
                                    content: '更新资料失败，请稍后重试',
                                    success: function(res) {
                                        if (res.confirm) {
                                            // console.log('用户点击确定')
                                        }
                                    }
                                });
                            }
                        }.bind(this),
                        fail: function (error) {
                            wx.showModal({
                                title: '提示',
                                content: '更新资料失败，请稍后重试',
                                success: function(res) {
                                    if (res.confirm) {
                                        // console.log('用户点击确定')
                                    }
                                }
                            });
                        },
                        complete: function () {
                            wx.hideToast();
                        }
                    });
                }
            }
        })
    },

    // 微信相关
    // 获取access_token
    accessTokenRequest: function (callback) {
        var data = {
            grant_type: "client_credential",
            appid: this.getAppId(),
            secret: this.getAppSecret()
        };
        wx.request({
            url: wxapi + '/cgi-bin/token',
            data: data,
            method: 'GET',
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
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        })
        var data = {
            grant_type: "authorization_code",
            appid: this.getAppId(),
            secret: this.getAppSecret(),
            js_code: this.getCode()
        };
        wx.request({
            url: wxapi + '/sns/jscode2session',
            data: data,
            method: 'GET',
            header:{
                "Content-Type":"application/x-www-form-urlencoded"
            },
            success: function(res) {
                // console.log(res);
                this.setOpenId(res.data.openid);
                this.setSession_key(res.data.session_key);
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
        // return "1c78c4b2b3bfa1870799217aa2c730c8";  // 微信小程序
        return "6eb657957dd48302a1c1e98b7332b280";  // 微信小程序公司
        // return "0961a05bf6cb3d93e7ac1146ddda23bc";  //想拍就拍
    },

    setAppId: function (_appId) {
        this._appId = _appId;
    },
    getAppId: function () {
        return "wx8c04fbf04dc2cdab";
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

    setSession_key: function (_session_key) {
        this._session_key = _session_key;
    },
    getSession_key: function () {
        return this._session_key;
    },

    setFormId: function (_formId) {
        this._formId = _formId;
    },
    getFormId: function () {
        return this._formId;
    },

    setIv: function (_iv) {
        this._iv = _iv;
    },
    getIv: function () {
        return this._iv;
    },

    setEncryptedData: function (_encryptedData) {
        this._encryptedData = _encryptedData;
    },
    getEncryptedData: function () {
        return this._encryptedData;
    },

    // 用户信息获取
    exchangeUid: function (callback) {
        var data = {
            appId: this.getAppId(),
            sessionKey: this.getSession_key(),
            iv: this.getIv(),
            encryptedData: this.getEncryptedData()
        }
        wx.request({
            url: root + '/photoBazaar/sPro/exchangeUid',
            data: data,
            method: 'GET',
            header:{
                'content-type': 'application/json'
            },
            success: function(res) {
                if (res.data.status == 200) {
                    this.setUserId(res.data.data.uid);
                    this.setUserName(res.data.data.nickname);
                    this.setGender(res.data.data.sex);
                    this.setMobile(res.data.data.mobile);
                    this.setAvatar(res.data.data.avatar);
                    callback && callback();
                }
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