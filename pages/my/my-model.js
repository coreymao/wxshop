import {Base} from '../../utils/base.js';
class My extends Base{
  constructor(){
    super();
  }
  getUserInfo(callback){
    var that=this;
    wx.login({
      success:function(){
        wx.getUserInfo({
          success:function(res){
                typeof callback=="function" && callback(res);
          },
          fail:function(res){
            typeof callback == "function" && callback(
              {
                nickName:'汀贝爱町吧',
                avatarUrl:'../../images/icon/user@default1.png'
              }
            );
          }
        });
      }
    })


  }




}
export{My}