/**
 * Created by luozhong on 16/8/2.
 *
 * 如何调用
 * 参数：input id 、裁剪宽度（必填 可为空 空则不裁剪）、回调
 *
  var fileReader = new FileRead();
  fileReader.changeFile("fileUpload", 800,function (res) {  //fileUpload 为 input file的 id
        res:{
            fileName:"",//文件名称
            fileType:"",//文件类型
            size:"",//文件大小
            src:"" //为base64 编码
        }

        //do ...
    });
 *
 *
 */

(function () {

    var imgDatas = {};
    var fileReader = function () {
        if (typeof FileReader == "undefined") {
            console.error("您的浏览器不支持FileReader！");
            return
        }
    };

    var a = fileReader.prototype;

    a.changeFile = function (obj,size, callback) {
        a.size = size;
        $("#" + obj).change(function (e) {
            readFile(this, function (res) {
                callback && callback(res);
            });
        });
    };

    function readFile($this, callback) {
        var file = $this.files; //input
        if(file.length < 1){
            return
        }
        $("#loading").addClass('active');
        $.each(file, function (i, val) {
            if (val.size > 20 * 1024 * 1024) {  //用size属性判断文件大小不能超过5M
                callback && callback(0);
            } else {
                var fileType = val.type.split("/");
                switch (fileType[0]) {
                    case "image":
                        readAsImage(val, function (datas) {
                            datas.size = val.size;
                            datas.fileType = fileType[0];
                            translateImg(datas.src,function(r){
                                datas.src = r;
                                callback && callback(datas);
                            });
                        });
                        break
                    default :
                        callback && callback({fileType:fileType[0]});
                        break
                }
            }
        });
    }

    //获取照片的元信息（拍摄方向）
    var getPhotoOrientation = function (img) {
        var orient;
        EXIF.getData(img, function () {
            orient = EXIF.getTag(this, 'Orientation');
        });
        return orient;
    };

    var translateImg = function (imgUrl, callback) {
        var cutCanvas = document.createElement("canvas");
        cutCanvas.style.width = "100%";
        var drawImage = cutCanvas.getContext("2d");
        var img = new Image();
        img.src = imgUrl;
        img.onload = function () {

            var orient = getPhotoOrientation(img);

            var imgW = img.width;
            var imgH = img.height;
            var w = a.size || imgW;
            console.log(w);

            var scale = w / imgW;
            var cutH = imgH * scale;
            //console.log(w,cutH);

            //判断图片拍摄方向是否旋转了90度
            if (orient == 6) {
                cutCanvas.width = cutH;
                cutCanvas.height = w;
                drawImage.save(); //保存状态
                drawImage.translate(cutH, 0); //设置画布上的(0,0)位置，也就是旋转的中心点
                drawImage.rotate(90 * Math.PI / 180); //把画布旋转90度
                // 执行Canvas的drawImage语句
                drawImage.drawImage(
                    img,//图片地址
                    0,//裁剪的x坐标
                    0,//裁剪结束的y坐标
                    imgW,//裁剪部分的宽
                    imgH,//裁剪部分的高
                    0,
                    0,
                    w,//画布大小
                    cutH
                );

                drawImage.restore(); //恢复状态

            }else if(orient == 8){
                cutCanvas.width = cutH;
                cutCanvas.height = w;
                drawImage.save(); //保存状态
                drawImage.translate(cutH, 0); //设置画布上的(0,0)位置，也就是旋转的中心点
                drawImage.rotate(90 * Math.PI / 180); //把画布旋转90度
                // 执行Canvas的drawImage语句
                drawImage.drawImage(
                    img,//图片地址
                    0,//裁剪的x坐标
                    0,//裁剪结束的y坐标
                    imgW,//裁剪部分的宽
                    imgH,//裁剪部分的高
                    0,
                    0,
                    w,//画布大小
                    cutH
                );

                drawImage.restore(); //恢复状态
            }else if(orient == 3){
                cutCanvas.width = w;
                cutCanvas.height = cutH;
                drawImage.save(); //保存状态
                drawImage.translate( w,cutH); //设置画布上的(0,0)位置，也就是旋转的中心点
                drawImage.rotate(180 * Math.PI / 180); //把画布旋转90度
                // 执行Canvas的drawImage语句
                drawImage.drawImage(
                    img,//图片地址
                    0,//裁剪的x坐标
                    0,//裁剪结束的y坐标
                    imgW,//裁剪部分的宽
                    imgH,//裁剪部分的高
                    0,
                    0,
                    w,//画布大小
                    cutH
                );

                drawImage.restore(); //恢复状态
            } else {
                cutCanvas.width = w;
                cutCanvas.height = cutH;
                drawImage.drawImage(
                    img,//图片地址
                    0,//裁剪的x坐标
                    0,//裁剪结束的y坐标
                    imgW,//裁剪部分的宽
                    imgH,//裁剪部分的高
                    0,
                    0,
                    w,//画布大小
                    cutH
                );
            }

            //$("body").before(cutCanvas);
            callback && callback(cutCanvas.toDataURL());
        }
    };

    function readAsImage(val, callback) {
        var reader = new FileReader();
        reader.readAsDataURL(val);
        reader.onload = function (e) {
            imgDatas.fileName = val.name;
            imgDatas.size = val.size;
            imgDatas.src = this.result;
            var loadTime = new Date(val.lastModifiedDate);
            imgDatas.uploadTime = loadTime.getFullYear() + " " + (parseInt(loadTime.getMonth()) + 1) + " " + loadTime.getDate();
            if (typeof(callback) == "function") {
                callback(imgDatas);
            }
        }
    }
    ////分段读取
    //function readBlob(val, start, end) {
    //    var reader = new FileReader();
    //    var start = parseInt(start) || 0;
    //    var end = parseInt(end) || (file.size - 1);
    //}

    window.FileRead = fileReader;
})();