var File = {
    saveNetworkPicture: function (url, callback) {
        setTimeout(function () {
            console.log(url);
            wx.downloadFile({
                url: url,
                success: function(res) {
                    wx.saveFile({
                        tempFilePath: res.tempFilePath,
                        success: function(res) {
                            var savedFilePath = res.savedFilePath
                            callback && callback();
                        },
                        fail: function (error) {
                            console.log(error)
                        },
                        complete: function (res) {
                            console.log(res)
                        }
                    });
                }
            });
        }, 4000);
    },
    getSavedFileList: function () {
        wx.getSavedFileList({
            success: function(res) {
                console.log(res.fileList)
            }
        });
    }
}

module.exports = {
    File: File
}