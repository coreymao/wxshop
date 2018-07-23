import { Base } from '../../utils/base.js';
class Order extends Base {
  constructor() {
    super();
    this._storageKeyName = "newOrder";
  }
  /**单条订单具体信息
   *订单id 加载服务器订单信息
   */
  getOrderInfoById(id, callback) {
    var parmas = {
      url: 'order/' + id,
      type: 'POST',
      sCallBack: function (res) {
        callback && callback(res);
      },
      eCallBack: function (eres) {
        console.log(eres);
      }

    };
    this.request(parmas);
  }
/**
 * @param  pageIndex(int) 当前页码
 * 用户历史订单
 */
  getOrders(pageIndex,callback){
  var params={
    url:'order/by_user',
    type:'POST',
    data: { page: pageIndex},
    sCallBack:function(res){
        callback && callback(res);
    },
    eCallBack:function(res){
      console.log(res);
    }
  };
  this.request(params);
  }

  /**
   * 访问下订单接口
   */
  doOrder(orderInfo, callback) {
    var that = this;
    var parmas = {
      url: 'order',
      type: 'post',
      data: { products: orderInfo },
      sCallBack: function (data) {
        console.log(data);
        that.execSetStorageSync(true);   //产生新订单
        callback && callback(data);
      },
      eCallBack: function (data) {
        console.log(data);
      }
    }
    this.request(parmas);
  }
  //更新 保存缓存
  execSetStorageSync(flag) {
    wx.setStorageSync(this._storageKeyName, flag);
  }
  /**是否有新订单 */
  hasNewOrder(){
    var flag = wx.getStorageSync(this._storageKeyName);
    return flag==true;
  }
  /**
   * 访问支付接口  获取支付参数
   * 再次访问WX.Service 请求支付
   */
  execpay(orderID, callback) {
    var parmas = {
      url: 'pays/pre_order',
      type: 'post',
      data: { id: orderID },
      sCallBack: function (data) {
        console.log(data);
        var timeStamp = data.timeStamp;
        if (timeStamp) {
          wx.requestPayment({
            'timeStamp': timeStamp.toString(),
            'nonceStr': data.nonceStr,
            'package': data.package,
            'signType': data.signType,
            'paySign': data.paySign,
            success: function (res) {
              console.log('支付成功了');
              console.log(res);
              callback && callback(2); // 成功
            },
            fail: function (res) {
              callback && callback(1);  // 失败
              console.log(res);
              console.log('支付失败了');
            }
          });
        } else {
          callback && callback(0);//没有获取支付参数(检测自己商户号等支付参数)
        }
      }
    };
    this.request(parmas);
  }


}
export { Order }