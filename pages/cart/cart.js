import {Cart} from 'cart-model.js';
var cart=new Cart();
Page({

  data: {
    selectedCounts:0,
    account:0,
    selectedTypeCounts:0,
    cartData:[]
    
  },

  onLoad: function (options) {
    
  },

  onShow: function () {
    var cartData = cart.getCartDataFromLocal();     //获取缓存数据
    var res=this.getAllSelectedData(cartData);  //获取选中商品 总金额 数量
    this.setData({
      cartData: cartData,
      selectedCounts: res.selectedCounts,
      account:res.account,
      selectedTypeCounts: res.selectedTypeCounts
    })
    
  },

  //获取选择所有选中商品 价格 数量 金额 
  getAllSelectedData(data) {
    var selectedCounts=0,       //所有商品选择数量
         account=0,             //金额
         selectedTypeCounts=0;  //选择中商品类型数量
     let multiple=100; 
     for (let i = 0; i < data.length; i++){
       if(data[i].selectStatus){
         selectedCounts += data[i].counts;
         account += data[i].counts * multiple * Number(data[i].price) * multiple;
         selectedTypeCounts++;
        }
      }
     return {
       selectedCounts: selectedCounts,
       account: (account / (multiple * multiple )).toFixed(2),
       selectedTypeCounts: selectedTypeCounts
     }

  },

  //单击商品checkbox
  toggleSelect:function(event){
      var id = event.currentTarget.dataset.id,
         status = event.currentTarget.dataset.status,
         index = this._getProductIndexById(id);
         this.data.cartData[index].selectStatus = !status;
         this._resetCartData();
  },

  //全选操作
  toggleSelectAll:function(event){
    var status = event.currentTarget.dataset.status=='true';
    var data=this.data.cartData
    for (let i = 0; i < data.length;i++){
      data[i].selectStatus = !status;
    }
    this._resetCartData();   //重新计算价格

  },

   //根据id找到当前商品 更新状态
  _getProductIndexById(id){
    var data=this.data.cartData;
    for(let i=0;i<data.length;i++){
      if(data[i].id==id){
        return i;
      }
    }

  },

  //重新计算选中总金额与数量
  _resetCartData:function(){
    var newData = this.getAllSelectedData(this.data.cartData);
    this.setData({
      cartData:this.data.cartData,
      account:newData.account,
      selectedCounts: newData.selectedCounts,
      selectedTypeCounts: newData.selectedTypeCounts

    });
  },


  /**
   * 更改商品数量
   */
  changeCounts:function(event){
    console.log(event);
    var id = event.currentTarget.dataset.id,
        types = event.currentTarget.dataset.type,
        index =this. _getProductIndexById(id),
        counts=1;
    if(types=='add'){
      cart.addCounts(id);
    }else{
      counts=-1;
      cart.cutCounts(id);
    }
    this.data.cartData[index].counts += counts;
    this._resetCartData();   //再次计算价格 数量
  },


  //删除商品 Ui上删除，缓存也需要删除 
  deletes:function(event){
    var id = event.currentTarget.dataset.id;
    var index = this._getProductIndexById(id);
    console.log(event);
    this.data.cartData.splice(index,1);
    this._resetCartData(); 
    cart.deletes(id);       //删除缓存里商品

  },
  /**
   * 跳转商品详情页面
   */
  onProductsItemTap: function (event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../product/product?id=' + id,
    })
  },
  /**
   * 提交订单
   */
  submitOrder:function(event){
    wx.navigateTo({
      url: '../order/order?account=' + this.data.account + '&from=cart',
    })

  },
  /**
   * 生命周期当离开时
   */
  onHide:function(){
    cart.execSetStorage(this.data.cartData);
  }












})