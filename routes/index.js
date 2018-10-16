var express = require('express');
var router = express.Router();
// 引入 index 的控制器
var indexController = require('../controllers/indexController.js');
//引入item 模型
var itemModel = require('../models/itemModel.js');
//引入link 模型
var linkModel = require('../models/linkModel.js');

/* 客户端首页 */
router.get('/',indexController.Index);
//列表页
router.get('/list/:_id',indexController.List);
//详情页
router.get('/detail/:_id',indexController.Detail)

//暴露模块
module.exports = router;
