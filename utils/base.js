//Base.js
import {Config} from '../utils/config.js';
import { Token } from 'token.js';
class Base{
  constructor(){
  this.baseRequestUrl = Config.restUrl;  //常量 静态调用
  }

  /**
   * @params params (object)
   * request 函数封装 request请求
   * noRefetch 为true不重复发送request请求
   */
  request(params, noRefetch){
    var that=this;     
    var url = this.baseRequestUrl + params.url;
    if (!params.type) {
      params.type = 'GET';
    };
    wx.request({
      url: url,
      method: params.type,
      data: params.data,
      header: {
        'content-type' : 'application/json',
        'token': wx.getStorageSync('token')
      },
      success:function(res){
        var code=res.statusCode.toString();
        var startChar=code.charAt(0);   //截取字符串第一个数
        if (startChar=='2'){
          params.sCallBack && params.sCallBack(res.data); //200,201
        }else{
          if (code=='401'){           //token令牌过期401; 
            if (!noRefetch){
              that._refetch(params);  //第二次重发request请求
            }
          }
          that._processError(res);
          if (noRefetch){
            params.eCallBack && params.eCallBack(res); //第2次发送返回错误信息 400
          }

        }
      },
      fail:function(error){
        that._processError(error);
      }
    })
  }

  /**
   * 重新获取令牌
   */
  _refetch(params){
    var token = new Token();
    token.getTokenFromServer((token)=>{
      //重新向服务器申请领 并保存到缓存 再次发送之前API请求
      this.request(params, true);

    });
  }

  /**
   * 输出错误结果
   */
  _processError(err) {
    console.log(err);
  }

  

}


export{Base};