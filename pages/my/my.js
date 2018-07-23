import { Address } from '../../utils/address.js';
import { Order } from '../order/order-model.js';
import {My} from '../my/my-model.js';
var my=new My();
var address = new Address();
var order = new Order();
Page({

  data: {
    userInfo:{},              //用户信息
    loadingHidden:true,
    pageIndex:1,
    orderArr:[],
    isLoadAll:false          //是否加载完
  },

  onLoad: function (options) {
    this._loadData();
    this._getUserAddress();
  },
  onShow:function(){
    var flag=order.hasNewOrder(); //是否有新订单
    if(flag){
      this._refresh();
    }
  },
  _refresh:function(){
    this.data.orderArr=[];
    this._getOrders(()=>{
      console.log('sssm');
      this.data.pageIndex=1;
      this.data.isLoadAll=false;         // 没加载完
      order.execSetStorageSync(false);   //更新缓存 
     
    }); 

  },
  /**加载用户数据与历史订单*/
    _loadData:function(){
      my.getUserInfo((res) => {
        this.setData({
          userInfo: res,
        })
      });
      this._getOrders(); 
    },

  /**获取用户地址*/
    _getUserAddress(){
      address.getAddress((res) => {
        this._blindAddressInfo(res);
      });
    },

    /**绑定地址*/
    _blindAddressInfo: function (res){
      this.setData({
        addressInfo: res,
      })
    },
    /* 获取历史订单 */ // 有问题???
    _getOrders:function(callback){
      var that=this;
      order.getOrders(this.data.pageIndex,(res)=>{
        var data=res.data.data;
        console.log(res);
        console.log(data);
           if(data.length>0){
              this.data.orderArr.push.apply(this.data.orderArr,data);
              this.setData({
                orderArr: this.data.orderArr
              });
           }else{
             this.data.isLoadAll=true; //(length丢失 API返回数据存在问题)
           }
      });
      callback && callback();

    },
    onReachBottom:function () {
      if (!this.data.isLoadAll) {
        this.data.pageIndex++;
        this._getOrders();
      }
    },
  //添加用户收货地址
  editAddress: function () {
      var that = this;
      wx.chooseAddress({
        success: function (res) {
          console.log(res);
          var addressInfo = {
            name: res.userName,
            mobile: res.telNumber,
            totalDetail: address.setAddressInfo(res)
          }
          that._blindAddressInfo(addressInfo);
          //保存地址
          address.submitAddress(res, (flage) => {
            if (!flage) {
              that.showTips('操作提示', '地址更新失败!手机号码错误!');
            }
          });
        }
      })
    },
  /**跳转订单详情页面*/
  showOrderDetailInfo:function(event){
    //console.log(event);
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../order/order?id=' +id+'&from=order',
    })

  },
  rePay:function(event){
    var id = event.currentTarget.dataset.id;
    console.log(id);
    var index = event.currentTarget.dataset.index;
    this._execplay(id,index);

  },
  _execplay:function(id,index){
    order.execpay(id,(statusCode)=>{
      if (statusCode >0 )
      {
          var flag = statusCode==2;
          if (flag){
            this.data.orderArr[index].status==2; //更新状态
            this.setData({
              orderArr: this.data.orderArr
            });
          }
          wx.navigateTo({
            url: '../pay-result/pay-result?id=' + id+ 
            '&flag=' + flag+'&from=my',
          })
      }
      else
      {
        this.showTips('错误提示', '商品库存量不足');//status==0
      }

    });
  },
/**
 * 信息提示窗口
 * 
 * @params: title(标题) content:(内容)
 * flag -{bool} 是否跳转到“我的页面”
 */
  showTips: function (title, content, flag) {
    wx.showModal({
      title: title,
      content: content,
      showCancel: false,
      success: function (res) {
        if (flag) {
          wx.switchTab({
            url: '../my/my',
          })
        }
      }
    })

  },
  naviToAbout:function(){
    wx.navigateTo({
      url: '../about/about',
    })
  }

   


  









})