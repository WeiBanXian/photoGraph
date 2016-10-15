var {root, loginRoot} = require("./common.js");
var md5 = require('../utils/md5.js')

var User = {
    init:function () {
        this.setPublicParams();
    },
    login: function (callback) {
        var data = {};
        var isMobile = true;

        if (isMobile) {
            data = {
                mobile: this.getUserName(),
                password: md5.MD5(md5.MD5(this.getPassword())),
                appkey: "f6cb3d93e7ac1146"
            };
        }
        wx.request({
            url: loginRoot + '/api/v2/mobLoginForTest',
            data: data?data:{},
            medthod: 'post',
            header:{
                "Content-Type":"application/json"
            },
            success: function(res) {
                var data = res.data;
                if (res.data.status == "200") {
                    this.publicParams = data.data;
                    // avatar: "https://phototask.c360dn.com/FgLLcrZnb5GdQ9ND8SEC6JqJFYZI"
                    // backgroundPic: ""
                    // birthday: ""
                    // cc: 86
                    // certificated: 2
                    // city: "1"
                    // country: "1"
                    // desc: ""
                    // description: ""
                    // email: ""
                    // firstLogin: false
                    // forgetPass: 0
                    // gender: ""
                    // language: "zh-Hans"
                    // lastLoginTime: 1476497959
                    // mobile: "18583269107"
                    // nickname: "丰哦吼吼吼"
                    // province: "51"
                    // regDateTime: 1462864073
                    // setPass: 1
                    // third: ""
                    // token: "VGkxQjhXNTZiTXprckt6NkVXOEsxcmwvYlFRenE3cDZGbkgyYndTSzNhMGU3Yll1Q2tCeW92WG5NMzFNQXNaZ2JkYlpOdUdOT1ZZRzhNOG96akN0UUhLNUkwQ1BFc0xsYUZHSDN3Y0tTUzBGYVBMUzNDaCtpQWF3T2JhT2pkVHM="
                    // tokenEnd: 1479090029
                    // tokenExpire: 2592000
                    // userId: "06943d573188c9317ee6e176"
                    callback && callback(data);
                }
            }.bind(this)
        });
    },
    setUserName: function (_userName) {
    	this._userName = _userName;
    },
    getUserName: function () {
    	return this._userName;
    },
    setPassword: function (_password) {
    	this._password = _password;
    },
    getPassword: function () {
    	return this._password;
    },
    setPublicParams: function () {
        this.publicParams = {
            avatar: ''
        };
    },
    getPublicParams: function () {
        return this.publicParams;
    }
}

module.exports = {
    User: User
}