import { Base } from '../../utils/base.js';
class Product extends Base {
  constructor() {
    super();

  }
  getProduct(id, callBack) {
    var params = {
      'url': 'product/' + id,
      'sCallBack': function (res) {
        callBack && callBack(res);
      }
    }
    this.request(params);
  }







}
export { Product }