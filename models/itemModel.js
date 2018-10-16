// 引入数据库的配置文件
var mongoose = require('../configs/db_config.js');

// 定义一个 item 集合的骨架 (用来约束集合的,告诉集合需要存储哪些属性)
var itemSchema = new mongoose.Schema({
	name : String,
	info : String,
	ctime: {
		type: Date,
		default: new Date()
	},
	order: Number,
});


// 创建数据库模型
var itemModel = mongoose.model('item', itemSchema);


// 暴露 itemModel
module.exports = itemModel;