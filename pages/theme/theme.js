import{Theme} from 'theme-model.js';
var theme=new Theme();

Page({

  data: {
    themeProducts:[], //主题商品数组
    headImg:''        //主题头部图片
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id=options.id;
    var desc=options.desc;
    wx.setNavigationBarTitle({
      title: desc,
    })
    this._loadData(id)
  },

  _loadData:function(id){
    //获取单个主题
    theme.getThemeWithProducts(id,(res)=>{ 
        //console.log(res);
        this.setData({
          headImg: res.head_img,
          themeProducts:res.products
        });
    })
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


  




})