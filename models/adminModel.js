// 引入数据库的配置文件
var mongoose = require('../configs/db_config.js');

// 定义一个集合的骨架 (用来约束集合的,告诉集合需要存储哪些属性,比较重要啊)
var adminSchema = new mongoose.Schema({
	username : String,
	password : String,
	tel: String,
});


//创建数据库模型  
var adminModel = mongoose.model('admin', adminSchema);


// 暴露 adminModel
module.exports = adminModel;

