import {Cart} from '../cart/cart-model.js';
import {Address} from '../../utils/address.js';
import { Order } from '../order/order-model.js';
var cart=new Cart();
var address=new Address();
var order=new Order();
Page({
  data: {
    account:0,            //总金额
    productsArr:[],       //订单所有商品信息  
    addressInfo:null,     //收货地址 
    id:null,              //订单号   
    fromCartFlag:null,    //
    orderStatus:null,     //订单状态
    isEditAddress:false,  //是否禁用编辑地址
    
  },
  /**
   * 订单详情数据来源
   * 1.缓存 2.api
   */
  onLoad: function (options){
    console.log(options);
    var from = options.from;
    if (from =='cart'){
      this._formCart(options.account)   //数据来自缓存   
    }
    else{
      var id=options.id;
       this.data.id=id;
       console.log(this.data.id);                 
    }
  },
  /*返回上一页刷新页面*/
  onShow: function () {
    console.log('show');
    if (this.data.id) {
      this._fromOrder(this.data.id);
    }
  },
  _formCart:function(account){
    var productsArr = cart.getCartDataFromLocal(true);
    this.setData({
      account: account,
      productsArr: productsArr,
      orderStatus: 0,                     //'0' 代表来自购物车
      isEditAddress: true
    })
    address.getAddress((res) => {         //从服务器加载收货地址
      
      this._blindAddressInfo(res);
    })
  },

  /*入口来历史订单*/
  _fromOrder(id){
    if(id){
      order.getOrderInfoById(id, (data) => {
        this.setData({
          orderStatus: data.status,             //上线微信回调API
          productsArr: data.snap_items,
          account: data.total_price,
          isEditAddress: false,
          basicInfo: {
            orderTime: data.create_time,
            orderNo: data.order_no
          }
        });
        var addressInfoByID = data.snap_address;    //地址数据库读取
        addressInfoByID.totalDetail = address.setAddressInfo(addressInfoByID);
        this._blindAddressInfo(addressInfoByID);
      });
    }
  },
/*编辑用户收货地址*/
  editAddress:function(){
    var that=this;
    wx.chooseAddress({
      success:function(res){
        console.log(res);
        var addressInfo={
          name:res.userName,
          mobile:res.telNumber,
          totalDetail: address.setAddressInfo(res)
        }
        that._blindAddressInfo(addressInfo);    //异步返回 地址绑定
        address.submitAddress(res,(flage)=>{    //保存数据库
            if(!flage){
              that.showTips('操作提示','地址更新失败!手机号码错误!');
            }
        });
      }
    }) 
  },
  /**
   * 
   * 下订单与支付
   * 1.访问api 获取订单号 2.访问支付接口获取支付参数,3.调微信支付
   * 2.支付入口 (1)购物车进入订单详情  (2)支付失败订单详情再次支付     
   */
  pay:function(){
    if (!this.data.addressInfo){
      this.showTips('下订单提示','您还没有填写收货地址');
      return;
    }
    if(this.data.orderStatus==0){
        this._firstTimePay();
    }else{
        this._oneMoresTimePay();
    }
  },

  /**第一次支付 */
  _firstTimePay:function(){
    var orderInfo=[];
    var productsInfo = this.data.productsArr;
    for (let i = 0; i < productsInfo.length;i++){
      orderInfo.push({
        product_id: productsInfo[i].id,
        count: productsInfo[i].counts
      });
    }
    var that=this;
    order.doOrder(orderInfo,(data)=>{
      if (data.pass){                //下订单成功
       console.log(data);
        var id = data.order_id;       //订单id
        that.data.id = id;           //绑定订单号
        that.data.fromCartFlag=false;
        that._execPay(id);           //调用支付函数
      }
      else
      {
        this._orderFail(data);    //下订单失败[没通过APi库存检测..]
      }
    });
  },

  /* 再次次支付*/
  _oneMoresTimePay: function () {
    this._execPay(this.data.id);
  },

  /**
   * 开始支付
   * @param id(int) 订单号
   * @return statusCode 0失败(没取到支付参数) 1失败 2成功
   */
  _execPay:function(id){
    var that=this;
    order.execpay(id,(statusCode)=>{
      if(statusCode!=0){
        that.deleteProducts();     //支付成功,失败都删除购物车商品
        var flag=statusCode==2;
        wx.navigateTo({
          url: '../pay-result/pay-result?id=' + id + '&flag=' + flag + '&from=order',
        })
      }else{
        that.showTips('错误提示','商品库存量不足'); 
      }
    })
  },

  /**商品从购物车删除 */
  deleteProducts:function(){
    var ids=[],
        items = this.data.productsArr;
    for (let i = 0; i < items.length;i++){
      ids.push(items[i].id);
    }
    cart.deletes(ids);
  },

  /**下订单失败(没通过库存检测) */
  _orderFail:function(data){
    var pArr=data.pStatusArr;
    var name='',
        nameArr=[],
        str='';
    for(let i=0;i<pArr.length;i++){
      if(!pArr[i].haveStock){
        name = pArr[i].name;
        if(name.length>6){
          name=name.substr(0,5)+'...';
        }
        nameArr.push(name);
        if(nameArr.length>=2){
          break;
        }
      }
    }
    str+=nameArr.join('、');
    if (nameArr.length > 2) {
      str += "等";
    }
    str+="缺货";
    this.showTips('下单失败', str);
  },

  /**收货地址就行数据绑定*/
  _blindAddressInfo: function(addressInfo){
      this.setData({
        addressInfo: addressInfo
      })
  },
  /**
   * 
   * dialog弹出框
   * @params title标题
   * content:内容
   * flag -{bool} 是否跳转到“我的页面”
   */
  showTips:function(title,content,flag){
    wx.showModal({
      title: title,
      content: content,
      showCancel:false,
      success:function(res){
        if(flag){
          wx.switchTab({
            url: '../my/my',
          })
        }
      }
    })
  }

})