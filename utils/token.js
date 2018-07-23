//Aop 对tokne做初始化  确保缓存必须含有令牌
import{ Config } from 'config.js';

class Token{
    constructor(){
      this.tokenUrl = Config.restUrl+'token/user';
      this.verifyUrl=Config.restUrl+'token/verify';

    }
    //从缓存读取令牌,如果没有令牌向API发送请求 有令牌进行验证令牌是否过期
    verify(){
      var token=wx.getStorageSync('token');
      if(!token){
        this.getTokenFromServer();  //从服务器获取令牌
      }else{
        this._verifyFromServer(token); //验证令牌
      }
    }
    _verifyFromServer(token){
      var that=this;
      wx.request({
        url: that.verifyUrl,
        method:'POST',
        data:{
          token:token
        },
        success:function(res){
          var valid=res.data.isValid;  //若返回false
          if(!valid){
            that.getTokenFromServer()  //重新获取令牌
          }
        }
      })
    }
    getTokenFromServer(callBack){
      var that=this;
      wx.login({
        success:function(res){
          wx.request({
            url: that.tokenUrl,
            method:'POST',
            data:{
              code:res.code
            },
            success:function(res){
                wx.setStorageSync('token', res.data.token);//保存缓存
                callBack && callBack(res.data.token);
            }
          })
        }
        
      })

    }


}
export{Token}