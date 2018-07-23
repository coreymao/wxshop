Page({

data:{
  from:null,
},
  onLoad: function (options){
    console.log(options);
    this.setData({
      id:options.id,
      from:options.from,
      payResult:options.flag
    })
},

viewOrder:function(){
  if(this.data.from=='my'){
    wx.navigateTo({
      url: '../order/order?id='+this.data.id + '&from=order',
    })
  }else{
    wx.navigateBack({     //返回上一级
      delta: 1
    })
  }
},



})