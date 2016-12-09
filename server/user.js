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
    updateInfo: function (data, callback) {
        wx.showToast({
          title: '修改中...',
          icon: 'loading',
          duration: 10000
        });
        var url = root + "/photoBazaar/sPro/updateInfo";
        var data = data;
        data.uid = this.getUserId();

        wx.request({
            url: url,
            data: data?data:{},
            method: "GET",
            header:{
                "Content-Type":"application/json"
            },
            success: function(result) {
                if (result.statusCode == 200) {
                    setTimeout(function () {
                        wx.showToast({
                          title: '更新资料成功',
                          icon: 'success',
                          duration: 2000
                        });
                    }, 0);
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
            }
        });
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
            template_id: "ucz0HL9jStw_uL3GmQsxtEHMOeOWpDiohHJPSfglWn4",
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