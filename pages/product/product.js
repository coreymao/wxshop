import {Product} from 'product-model.js';
import {Cart} from '../cart/cart-model.js';
var product=new Product();
var cart=new Cart();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id:'',  //商品id 
    product:'', //商品具体信息
    countsArr:[1,2,3,4,5,6,7,8,9,10],
    productCount:1,
    tabName: ['商品详情', '参数设置','售后保障'],
    currentTabsIndex:0,
    cartTotalCounts:''  //购物车数量
  },
  onLoad: function (options) {
    this.setData({
      id:options.id, //绑定商品id
    });
    this._loadData();

  },
  _loadData:function(){
    product.getProduct(this.data.id,(res)=>{
     this.setData({
       product:res,  //根据id获取商品信息
       cartTotalCounts: cart.getCartTotalCounts(), //购物车商品绑定
     })
    });
    

  },
  //选择购买数目
  bindPickerChange:function(event){
     this.setData({
       productCount: this.data.countsArr[event.detail.value]
     })

  },
  onTabsItemTab:function(event){
    var index = event.currentTarget.dataset.index;  
    this.setData({
      currentTabsIndex:index
    })
  },

  //添加到购物车(缓存)
  onAddingToCartTap(events){
    this.setData({
      cartTotalCounts: cart.getCartTotalCounts()
    })
    //防止快速点击
    if (this.data.isFly) {
      return;
    }
    this._flyToCartEffect(events);
    this.addProductToCart();
    //var counts=this.data.productCount + this.data.cartTotalCounts;
   
  },
  addProductToCart(){
    var tempObj={};                     //当前商品
    var counts = this.data.productCount//购买数量
    var keys = ['id', 'name', 'main_img_url','price'];
    for (var key in this.data.product){
      if( keys.indexOf(key)>=0 ){
        tempObj[key]=this.data.product[key]
      }
    }
    cart.add(tempObj,counts);
  },

  /*加入购物车动效*/
  _flyToCartEffect: function (events) {
    //获得当前点击的位置，距离可视区域左上角
    var touches = events.touches[0];
    var diff = {
      x: '25px',
      y: 25 - touches.clientY + 'px'
    },
      style = 'display: block;-webkit-transform:translate(' + diff.x + ',' + diff.y + ') rotate(350deg) scale(0)';  //移动距离
    this.setData({
      isFly: true,
      translateStyle: style
    });
    var that = this;
    setTimeout(() => {
      that.setData({
        isFly: false,
        translateStyle: '-webkit-transform: none;',  //恢复到最初状态
        isShake: true,
      });
      setTimeout(() => {
        var counts = that.data.cartTotalCounts + that.data.productCount;
        that.setData({
          isShake: false,
          cartTotalCounts: counts
        });
      }, 200);
    }, 1000);
  },
  
  tapToCart:function(){
    wx.switchTab({
      url:'/pages/cart/cart'
    });

  },
  //分享效果
  onShareAppMessage: function () {
    return {
      title: '汀贝爱町吧',
      path: 'pages/product/product?id=' + this.data.id
    }
  }




})