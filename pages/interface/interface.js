Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: 12,
    name: "你是"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

  },
  getToken: function () {
    wx.login({
      success: function (res) {
        console.log(res);
        //console.log(res.code);
        if (res.code) {
          wx.request({
            url: 'http://localhost:8888/wxshop/public/api/v1/token/user',
            method: 'post',
            data: {
              code: res.code
            },
            success: function (res) {
              console.log(res.data); //token令牌
              wx.setStorageSync('token', res.data.token);
            },
            fail: function (res) {
              console.log(res);
            }

          })
        }

      }
    })

  },
  pay: function () {
    var token = wx.getStorageSync('token');
    var that = this;
    //console.log(token)    
    wx.request({
      url: 'http://localhost:8888/wxshop/public/api/v1/order',
      method: 'post',
      header: {
        token: token
      },
      data: {
        products: [
          {
            product_id: 4, count: 430
          },
          {
            product_id: 6, count: 630
          }
        ]

      },
      success: function (res) {
        console.log(res.data);   //下订单
        if (res.data.pass) {
          //访问支付接口
          wx.setStorageSync('order_id', res.data.order_id);
          that.getPreOrder(token, res.data.order_id);

        } else {
          console.log('订单未创建成果');
        }

      },
      fail: function (res) {
        console.log(res.data);
      }

    })

  },
  getPreOrder: function (token, orderID) {
    if (token) {
      wx.request({
        url: 'http://localhost:8888/wxshop/public/api/v1/pays/pre_order',
        method: 'POST',
        header: {
          token: token
        },
        data: {
          id: orderID
        },
        success: function (res) {
          //如果API参数配置成果情况下
          console.log(res);//  接受到API传入客户端 微信支付需要的参数

          //发起微信支付
          // wx.requestPayment({
          //   timeStamp: res.data.timeStamp.toString(),
          //   nonceStr: res.data.nonceStr,
          //   package: res.data.package,
          //   signType: res.data.signType,
          //   paySign: res.data.paySign,
          //   success:function(res){
          //     console.log(res.data);
          //   }

          // })

        }
      })
    }

  }











})