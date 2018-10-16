// 管理员的控制器
var adminController = {};
// 引入 item 数据库模型
var itemModel = require('../models/itemModel.js');
// 引入 article 数据库模型
var articleModel = require('../models/articleModel.js');
// 引入 link 数据库模型
var linkModel = require('../models/linkModel.js');
// 引入 admin 数据库模型
var adminModel = require('../models/adminModel.js');

// 管理员首页 
adminController.Index = function(req,res){ 
	//console.log(req.session.user)
	//看session 里面有没有 user 属性;如果用户没有登录，就跳转到登录页面
	if(!req.session.user){
		// console.log('ok');
		res.redirect('/admin/login');
	}
	res.render('admin/index');
}

/*==========================栏目================================*/
// 添加栏目页面
adminController.ItemAdd = function(req,res){
	//看session 里面有没有 user 属性;如果用户没有登录，就跳转到登录页面
	if(!req.session.user) res.redirect('/admin/login');
	res.render('admin/itemAdd');
}

// 插入栏目数据
adminController.ItemInsert = function(req,res){
	// 插入数据
	itemModel.create(req.body,function(err){
		
		if(err){
			res.send('插入栏目失败');
		}else{
			res.redirect('/admin/itemList');
		}
	})
}

// 栏目列表
adminController.ItemList = function(req,res){
	//看session 里面有没有 user 属性;如果用户没有登录，就跳转到登录页面
	if(!req.session.user) res.redirect('/admin/login');
	// 查询数据
	itemModel.find({}).sort({order:1}).exec(function(err,data){
		if(err){
			res.send('数据插入失败');
		}else{
  			res.render('admin/itemList',{data:data});
		}
	})
}

// 编辑栏目页面
adminController.ItemEdit = function(req,res){
	//看session 里面有没有 user 属性;如果用户没有登录，就跳转到登录页面
	if(!req.session.user) res.redirect('/admin/login');
	// 查询数据
	itemModel.find({_id:req.params._id},function(err,data){
		if(err){
			res.send('数据插入失败');
		}else{
  			res.render('admin/itemEdit',{data:data[0]});
		}
	})
}

// 更新栏目数据
adminController.ItemUpdate = function(req,res){
	// console.log(req.body);
	// 更新数据
	itemModel.update({_id:req.body._id},req.body,function(err){
		if(err){
			res.send('数据更新失败');
		}else{
			res.redirect('/admin/itemList');
		}
	})
}

// 删除栏目
adminController.ItemRemove = function(req,res){
	// res.send('ok')
	// 删除数据
	itemModel.remove({_id:req.params._id},function(err){
		if(err){
			res.send('数据删除失败');
		}else{
			res.redirect('/admin/itemList');
		}
	})
}

/*================================文章=====================================*/
//发布文章的页面
adminController.ArticleAdd=function(req,res){
	//看session 里面有没有 user 属性;如果用户没有登录，就跳转到登录页面
	if(!req.session.user) res.redirect('/admin/login');
	// res.send('ok')
	// 查询栏目
	itemModel.find({},function(err,data){
		if(err){
			res.send('栏目查询失败');
		}else{
  			res.render('admin/articleAdd',{items:data});
		}
	})
}

//插入文章
adminController.ArticleInsert = function(req, res) {
	// 允许接收图片的类型
	var imgType = ['image/jpeg', 'image/png', 'image/gif'];
	// 图片大小
	var fileSize = 1024 * 1024 * 5;
	// 图片的存在位置
	var imgPath = 'uploads';
	// 引入 图片上传配置的模块
	var imgUpload = require('../configs/imgUpload_config.js');

	var upload = imgUpload(imgPath, imgType, fileSize).single('imgurl');
	upload(req, res, function(err) {
		if(err) {
			res.send('图片上传失败');
		} else {
			// 获取上传图片的名称  给 req.body
			req.body.imgurl = req.file.filename;
			// 插入数据
			articleModel.create(req.body, function(error) {
				if(error) {
					res.send('数据插入失败');
				} else {
					// res.send('ok');
					res.redirect('/admin/articleList');
				}
			})
		}
	})
}

//文章列表页
adminController.ArticleList=function(req,res){
	//看session 里面有没有 user 属性;如果用户没有登录，就跳转到登录页面
	if(!req.session.user) res.redirect('/admin/login');
	// 当前页面 (用户如果没有 传 page 参数 就 让 page 默认 1)
	var page = req.query.page ? req.query.page : 1;
	// 每页显示多少条数据
	var pageSize = 3;
	// 一共有多少页
	articleModel.find().count(function(err, total) {
		// console.log('12');
		// 最大页码
		var maxPageNumber = Math.ceil(total / pageSize);
		// 判断上一页 和下一页的边界
		if(page < 1) page = 1;
		if(page > maxPageNumber) page = maxPageNumber;
		// 查询数据的偏移量
		var offsetPage = pageSize * (page - 1);
		articleModel.find({}).limit(pageSize).skip(offsetPage).populate('itemId', {
			name: 1
		}).exec(function(err, data) {
			// console.log('13');
			if(err) {
				res.send('查询数据失败');
			} else {
				// console.log('14');
				//   res.send('okoko');
				// 响应模版
				res.render('admin/articleList', {
					articles: data,
					maxPageNumber: maxPageNumber,
					page: page,
				});
			}
		})
	})
}

// 文章编辑页面
adminController.ArticleEdit = function(req,res){
	// console.log('0');
	// console.log(req.session.user);
	//看session 里面有没有 user 属性;如果用户没有登录，就跳转到登录页面
	//if(!req.session.user) res.redirect('/admin/login');
	// 查询数据
	articleModel.find({_id:req.params._id},function(err,data){
		// console.log('1');
		// console.log(req.session.user);
		if(err){
			res.send('数据插入失败');
		}else{
			// 查询栏目列表
			itemModel.find({},function(err,itemdata){
				// console.log('2');
				// console.log(req.session.user);
				if(err){
					res.send('栏目查询失败');
				}else{
					// console.log('3');
					// console.log(req.session.user);
					// 响应模版
  					res.render('admin/articleEdit',{data:data[0],items:itemdata});		
				}
			})
		}
	})
}

// 修改文章封面
adminController.ArticleUpdateImage = function(req,res){
	// 允许接收图片的类型
	var imgType = ['image/jpeg','image/png','image/gif'];
	// 图片大小
	var fileSize = 1024 * 1024 * 5;
	// 图片的存在位置
	var imgPath = 'uploads';
	// 引入 图片上传配置的模块
	var imgUpload = require('../configs/imgUpload_config.js');
	var upload = imgUpload(imgPath,imgType,fileSize).single('imgurl');
	upload(req,res,function(err){
		if(err){
			res.send('图片上传失败');
		}else{
			// 更新数据   
			articleModel.update({_id:req.body._id},{$set:{imgurl:req.file.filename}},function(err){
				if(err){
					res.send('数据更新失败');
				}else{
					res.redirect('/admin/articleList');
				}
			})
		}
	})
}

// 修改文章数据
adminController.ArticleUpdate = function(req,res){
	// 更新数据   
	articleModel.update({_id:req.body._id},req.body,function(err){
		if(err){
			res.send('数据更新失败');
		}else{
			// res.send('ok');
			res.redirect('/admin/articleList');
		}
	})
}


// 删除文章
adminController.ArticleRemove = function(req, res) {
	// 删除数据
	articleModel.remove({ 
		_id: req.params._id
	}, function(err) {
		if(err) {
			res.send('数据删除失败');
		} else {
			res.redirect('/admin/articleList');
		}
	})
}

/*=====================================友链======================================*/
// 添加友链页面
adminController. LinkAdd = function(req,res){
	//看session 里面有没有 user 属性;如果用户没有登录，就跳转到登录页面
	if(!req.session.user) res.redirect('/admin/login');
	// res.send('link');
	res.render('admin/linkAdd');
}
// 插入友链数据
adminController.LinkInsert = function(req,res){
	// 插入数据
	linkModel.create(req.body,function(err){
		if(err){
			res.send('插入友链失败');
		}else{
			// res.send('OK失败');
			res.redirect('/admin/linkList');
		}
	})
}

// 友链列表
adminController.LinkList = function(req,res){
	//看session 里面有没有 user 属性;如果用户没有登录，就跳转到登录页面
	if(!req.session.user) res.redirect('/admin/login');
	// 查询数据
	linkModel.find({}).sort({order:1}).exec(function(err,data){
		if(err){
			res.send('数据插入失败');
		}else{
			// res.send('数据插入ok');
  			res.render('admin/linkList',{data:data});
		}
	})
}

// 编辑友链页面
adminController.LinkEdit = function(req,res){
	//看session 里面有没有 user 属性;如果用户没有登录，就跳转到登录页面
	if(!req.session.user) res.redirect('/admin/login');
	// res.send('数据插入ok');
	// 查询数据
	linkModel.find({_id:req.params._id},function(err,data){
		if(err){
			res.send('数据插入失败');
		}else{
			// res.send('数据插入ok');
  			res.render('admin/linkEdit',{data:data[0]});
		}
	})
}

// 更新友链数据
adminController.LinkUpdate = function(req,res){
	// res.send('数据插入ok');
	// 更新数据
	linkModel.update({_id:req.body._id},req.body,function(err){
		if(err){
			res.send('数据更新失败');
		}else{
			// res.send('ok');
			res.redirect('/admin/linkList');
		}
	})
}

// 删除友链
adminController.LinkRemove = function(req,res){
	// res.send('ok')
	// 删除数据
	linkModel.remove({_id:req.params._id},function(err){
		if(err){
			res.send('数据删除失败');
		}else{
			res.redirect('/admin/linkList');
		}
	})
}

/*=======================================管理员==============================*/
// 添加管理员
adminController.AdminAdd = function(req,res){
	//看session 里面有没有 user 属性;如果用户没有登录，就跳转到登录页面
	if(!req.session.user) res.redirect('/admin/login');
	// 响应管理员的页面
	res.render('admin/adminAdd');	
}

// 插入管理员数据
adminController.AdminInsert= function(req,res){
	// console.log(req.body)
	// 引入 md5 的模块 用来加密密码
	var md5 = require('md5');
	// 判断验证码是否正确
	if(req.body.code != req.session.code){	
		// res.redirect('/admin/login');
		console.log('验证码不正确');	
		return ;
	}
	//判断密码
	if(req.body.password != req.body.password1){
		res.send('两次输入的密码不一样');
	}
	// 去掉 用户名两端的空白字符trim()
	var username = req.body.username.trim();
	var password = req.body.password.trim();
	// 获取管理员数据
	var userdata = {
		username:username,
		password:md5(password),
		tel:req.body.tel
	}
	adminModel.create(userdata,function(err,data){
		if(err){
			res.send('添加管理员失败');
		}else{
			res.send('添加管理员成功');
		}
	})
	// res.send('管理员成功');
}

// 登录的页面
adminController.Login = function(req,res){
	res.render('admin/login');
}

// 登录的操作
adminController.DoLogin = function(req,res){
	// 判断验证码是否正确
	if(req.body.code != req.session.code){
		res.redirect('/admin/login');
		console.log('验证码不正确');
		return ;
	}
	// 引入 md5 的模块 用来加密密码
	var md5 = require('md5');
	// 去掉 用户名和密码 两端的空白字符 接收
	var username = req.body.username.trim();
	var password = md5(req.body.password.trim());
	// 查询 账号对应的数据
	adminModel.findOne({username:username},function(err,data){
		if(data == null){
			console.log('用户名不存在');
			res.redirect('/admin/login');
		}else{
			// 判断密码是否正确
			if(password==data.password){
				// 把登录成功的信息 记录 session 里
				req.session.user = data;
				// 登录成功
				res.redirect('/admin');
			}else{
				console.log('密码不正确');
				res.redirect('/admin/login');
			}			
		}
	})
}

// 退出登录操作
adminController.Logout = function(req,res){
	console.log('退出登录');
	// 把 session 的user 信息赋值 null
	req.session.user = null;
	// 跳转到登录页面
	res.redirect('/admin/login');
}

//验证码
adminController.Code = function(req,res){
	// 引入验证码模块
	var captchapng = require('captchapng');
	// 验证码
	var code = parseInt(Math.random()*9000+1000);
	// 把验证码存到 session 里
	req.session.code = code;
	// console.log(code)
	var p = new captchapng(80,30,code); 
    p.color(0, 0, 0, 0); 
    p.color(80, 80, 80, 255); 
    var img = p.getBase64();
    var imgbase64 = new Buffer(img,'base64');
    res.send(imgbase64);
}

// 暴露控制器
module.exports = adminController