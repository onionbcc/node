// 引入 path 模块
var path = require('path');
// 引入 格式化 日期的模块
var timestamp = require('time-stamp');
// 引入uid 模块 (生成唯一数)
var uid = require('uid');
// 引入 multer 模块
var multer  = require('multer');

/**
* 功能: 图片上传
* 参数: 
* 	imgPath  - String 	图片保存路径   
* 	imgType  - Array    允许上传图片的类型 例: ['image/jpeg','image/png','image/gif']
*   fileSize - Number   允许 上传图片的 大小  单位: 字节
* 返回值: 
*	upload   - Object   文件上传的对象
* 作者: simon
* 版本: 1.0.
* 日期: 2018-07-12
*/
function imgUpload(imgPath,imgType,fileSize){

	// 配置参数
	var storage = multer.diskStorage({
		destination: function (req, file, cb) {
			// 接收文件的路径
			cb(null, imgPath)
		},
		// 设置文件名称
		filename: function (req, file, cb) {
			// 获取扩展名
			var extname = path.extname(file.originalname);
			// 设置文件名称
			cb(null, file.fieldname + '-' + timestamp('YYYYMMDD')+'-'+uid() + extname);
		}
	})

	// 文件过滤函数
	function fileFilter (req, file, cb) {
		if( imgType.indexOf(file.mimetype) == -1){
			// 拒绝这个文件，使用`false`，像这样:
			cb(null, false)		
			// 如果有问题，你可以总是这样发送一个错误:
			cb(new Error('文件格式不正确!'))
		}else{
			// 接受这个文件，使用`true`，像这样:
			cb(null, true)
		}
	}

	// 文件上传配置
	var upload = multer({
		// 基本配置
		storage: storage,
		// 文件过滤器的配置
		fileFilter:fileFilter,
		// 限制文件大小
		limits:{
			// 单位 :字节
			fileSize: fileSize
		}
	})
	// 返回
	return upload;
}


// 暴露上传图片的函数
module.exports = imgUpload;