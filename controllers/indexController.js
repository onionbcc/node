// 客户端的控制器
var indexController = {};
// 引入 item 数据库模型
var itemModel = require('../models/itemModel.js');
// 引入 article 数据库模型
var articleModel = require('../models/articleModel.js');
// 引入 link 数据库模型
var linkModel = require('../models/linkModel.js');

// 客户端首页 
indexController.Index = function (req, res, next) {
	// console.log(req.body)
	// 查询数据
	itemModel.find({}).sort({
		order: 1
	}).exec(function (err, data) {
		// console.log(data)
		if (err) {
			res.send('数据插入失败');
		} else {
			getItemArticles(0)

			function getItemArticles(i) {
				// 根据 栏目 id 去查询 =这个栏目下的文章
				articleModel.find({
					itemId: data[i]._id
				}).limit(3).exec(function (error, articles) {
					// 把查到的文章放 data 数组
					data[i].articleList = articles;
					if (i < data.length - 1) {
						getItemArticles(++i);
					} else {
						// 查询数据links
						linkModel.find({}, function (err, data1) {
							if (err) {
								res.send('数据插入失败');
							} else {
								// res.send('bbbb');
								res.render('index', {
									links: data1,
									items: data
								});
							}
						})
					}
				})
			}
		}
	})
}




//列表页
indexController.List = function (req, res) {
	// 当前页面 (用户如果没有 传 page 参数 就 让 page 默认 1)
	var page = req.query.page ? req.query.page : 1;
	// 每页显示多少条数据
	var pageSize =3;
	// 一共有多少页
	articleModel.find({itemId: req.params._id}).count(function (err, total) {
		// 最大页码
		var maxPageNumber = Math.ceil(total / pageSize);
		// 判断上一页 和下一页的边界
		if (page < 1) page = 1;
		if (page > maxPageNumber) page = maxPageNumber;
		// 查询数据的偏移量
		var offsetPage = pageSize * (page - 1);
		// 查询article数据
		articleModel.find({itemId: req.params._id}).limit(pageSize).skip(offsetPage).exec(function (err, articles) {
			if (err) {
				res.send('文章查询失败');
			} else {
				//查询items数据
				itemModel.find({}, function (err, itemss) {
					// console.log(req.params)
					// conosle.log(req.params.req.params._id)
					if (err) {
						res.send('栏目查询失败');
					} else {
						//查询links数据
						linkModel.find({}, function (err, links) {
							if (err) {
								res.send('友链查询失败');
							} else {
								// res.send('bbbb');
								res.render('list', {
									articles: articles,
									items: itemss,
									links: links,
									page: page,
									maxPageNumber: maxPageNumber
								});
								
							}
						})
					}
				})

			}
		})
	})
}

// //列表页
// indexController.List = function (req, res) {
// 	// console.log(req.params._id)
// 	itemModel.find({},function(err,items){
// 		// console.log(req.params._id)
// 		if (err) {
// 			res.send('栏目查询失败');
// 		} else {	
// 			// res.send('栏目查询ok');
// 			articleModel.find(),function(error,articles){
// 				if (error) {
// 					res.send('文章查询失败');
// 				} else {
// 					linkModel.find({},function(errors,links){
// 						if (errors) {
// 							res.send('友链查询失败');
// 						} else {
// 							// res.render('index', {
// 							// 	articles:articles,
// 							// 	links: links,
// 							// 	items: items
// 							// });
// 							res.send('友链查询ok');
// 						}
// 					})
					
// 				}
// 			}
// 		}
// 	})
// }


// 详情页
indexController.Detail = function (req, res) {
	articleModel.find({_id: req.params._id}, function (err, articles) {
		if (err) {
			res.send('文章查询失败');
		} else {
			itemModel.find({}, function (err, items) {
				if (err) {
					res.send('栏目查询失败');
				} else {
					itemModel.findOne({_id: articles[0].itemId}, function (error, itemss) {
						if (error) {
							console.log('查询一条栏目上面的ID');
						} else {
							linkModel.find({}, function (errors, links) {
								if (errors) {
									res.send('友链查询失败');
								} else {
									res.render('detail', {
										articles: articles,
										items: items,
										links: links,
										itemss: itemss
									})
								}
							})
						}
					})
				}
			})
		}
	})
}




// 暴露控制器
module.exports = indexController