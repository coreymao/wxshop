import {Category} from 'category-model.js';
var category=new Category();

Page({
  data: {
    categoryTypeArr:[],   //所有分类
    categoryProducts:{},  //分类以及分类下所有商品
    currentIndex:0        //当前分类Index
    
  },
  onLoad: function (options) {
   this._loadData();
  },
  onShow:function(){
    console.log('cesshi');
  },
  _loadData: function (callback){
    //加载所有分类
    category.getCategories((res)=>{
      console.log(res);
      this.setData({
        categoryTypeArr:res          //res代表所有分类
      })
      //拿到第一个分类下所有商品
      category.getProductsByCategory(res[0].id, (products) => {
        var dataObject = {
          products: products,
          topImg:res[0].img.url,
          title:res[0].name
        }
        this.setData({
          categoryProducts: dataObject //第一个分类以及所有商品

      })
        callback && callback();
    })

    });
      
  },
  /**
   * 跳转商品详情页面
   */
  onProductsItemTap: function (event) {
    var id = event.currentTarget.dataset.id;  //商品id
    wx.navigateTo({
      url: '../product/product?id=' + id,
    })
  },

  onCategoryItemTap:function(event){
    console.log(event);
    var id = event.currentTarget.dataset.id;
    var name = event.currentTarget.dataset.name;
    var topImg = event.currentTarget.dataset.img;
    var index = event.currentTarget.dataset.index;
    category.getProductsByCategory(id, (products) => {
      var dataObject = {
        products: products,
        topImg: topImg,
        title: name
      }
      this.setData({
        categoryProducts: dataObject, //第一个分类以及所有商品
        currentIndex:index,
      })
    })
  },

  /*下拉刷新页面*/
  onPullDownRefresh: function(){
    this._loadData(()=>{
      wx.stopPullDownRefresh()
    });
  },










})