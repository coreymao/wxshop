//class Index

import {Base} from '../../utils/base.js';

class Index extends Base
{

  constructor(){
    super();  //调用class Base 构造函数
  }
  /**
   * http请求获取banner信息
   */
  getBannerData(id,callBack){
    var params={
      'url':'banner/'+id,
      'type':'',
      'sCallBack':function(res){
          callBack && callBack(res);
      }

    };
    this.request(params);
  }
  
  /**
   * 获取主题列表
   */
  getThemeData(callBack){
    var params={
      'url':'theme?ids=1,2,3',
      'sCallBack':function(res){
        callBack && callBack(res);
      }
    }
    this.request(params);
  }

  /**
   * 获取最近商品
   */
  getRecentProducts(callBack){
    var params={
      'url':'product/recent',
      'sCallBack': function (res) {
        callBack && callBack(res);
      }
    }
    this.request(params);
  }

  /**
   * 获取绑定元素
   */
  getDataSet(event,key){
    return event.currentTarget.dataset[key];
  }








}
export{Index}