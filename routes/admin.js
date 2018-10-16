var express = require('express');
var router = express.Router();
// 引入 admin 的控制器
var adminController = require('../controllers/adminController.js');
//引入item 模型
var itemModel = require('../models/itemModel.js');
// 管理员的首页
router.get('/', adminController.Index);
//栏目=====================================================================
// 添加栏目页面
router.get('/itemAdd', adminController.ItemAdd);
// 插入栏目数据
router.post('/itemInsert', adminController.ItemInsert);
// 栏目列表
router.get('/itemList', adminController.ItemList);
// 编辑栏目页面
router.get('/itemEdit/:_id', adminController.ItemEdit);
// 更新栏目数据
router.post('/itemUpdate', adminController.ItemUpdate);
//删除栏目
router.get('/itemRemove/:_id', adminController.ItemRemove);
//文章=====================================================================
//发布文章
router.get('/articleAdd', adminController.ArticleAdd);
//插入文章数据
router.post('/articleInsert', adminController.ArticleInsert);
//文章列表
router.get('/articleList', adminController.ArticleList);
// 编辑文章页面
router.get('/articleEdit/:_id', adminController.ArticleEdit);
// 修改文章
router.post('/articleUpdate',adminController.ArticleUpdate);
// 修改文章封面
router.post('/articleUpdateImage',adminController.ArticleUpdateImage);
// 删除文章
router.get('/articleRemove/:_id', adminController.ArticleRemove);
//友链===============================================================================
// 添加友链页面
router.get('/linkAdd', adminController.LinkAdd);
// 插入友链数据
router.post('/linkInsert', adminController.LinkInsert);
// 友链列表
router.get('/linkList', adminController.LinkList);
// 编辑友链页面
router.get('/linkEdit/:_id', adminController.LinkEdit);
// 更新友链数据
router.post('/linkUpdate', adminController.LinkUpdate);
//删除友链
router.get('/linkRemove/:_id', adminController.LinkRemove);

//管理员===============================================================================
// 添加管理员
router.get('/adminAdd', adminController.AdminAdd);
// 插入管理员数据
router.post('/adminInsert',adminController.AdminInsert);
// 验证码
router.get('/code',adminController.Code);
// 登录页面
router.get('/login',adminController.Login);
// 登录的操作
router.post('/doLogin',adminController.DoLogin);
// 退出登录的操作
router.get('/logout',adminController.Logout);


//
// 暴露 router 路由
module.exports = router;