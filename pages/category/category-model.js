import {Base} from '../../utils/base.js';
class Category extends Base
{
  constructor(){
    super();

  }
  getCategories(callBack){
    var params={
      'url':'category/all',
      'sCallBack':function(res){
        callBack && callBack(res);
      }
    }
    this.request(params);
  }
  getProductsByCategory(id,callBack){
    var params={
      'url':'product/by_category?id='+id,
      'sCallBack': function (res) {
        callBack && callBack(res);
      }
    }
    this.request(params);
  }








}
export{Category}