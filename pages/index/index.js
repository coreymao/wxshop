

import {Index} from 'index-model.js';
var index = new Index();

Page({
  data:{
    imgUrls: [],  //banner图片
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    themeArr: [],  //theme列表图片


  },
  //页面初始化
  onLoad:function(){
    this._loadData();
  },

 //获取banner
  _loadData:function(){
    var id = 1;
    index.getBannerData(id,(res)=>{   
      this.setData({
        imgUrls: res.items
      })
    });
   //获取主题
    index.getThemeData((res)=>{     
        this.setData({
          themeArr: res
        })
    });

    //获取最近商品
    index.getRecentProducts((res)=>{
          this.setData({
            productsArr:res
          })
    });

  },
  /**
   * 跳转商品详情页面
   */
  onProductsItemTap:function(event){
    var id=index.getDataSet(event,'id');
    wx.navigateTo({
      url: '../product/product?id='+id,
    })
  },
  /**
   * 跳转主题页面
   */
  onThemesItemTap:function(event){
    var id = index.getDataSet(event, 'id');
    var desc = index.getDataSet(event, 'desc');
    wx.navigateTo({
      url: '../theme/theme?id=' +id + '&desc=' +desc,
    })
  },
  //nav 跳转
  navigateTo:function(event){
    var naviTo = event.currentTarget.dataset.to;
    console.log(naviTo);
    if (naviTo=='category'){
      console.log(1);
      wx.switchTab({
        url: '../category/category',
      });
    }else if(naviTo=='cart'){
      wx.switchTab({
        url: '../cart/cart',
      });
    }else{
      wx.switchTab({
        url: '../my/my',
      });
    }
  }






})