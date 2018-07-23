import {Base} from 'base.js';
import {Config} from 'config.js';

class Address extends Base
{
  constructor(){
    super();
  }
  //设置地址 整合 省+市+县
  setAddressInfo(res){
    var province=res.provinceName || res.province,
        city=res.cityName || res.city,
        country=res.countyName || res.country,
        detail=res.detailInfo ||res.detail;
    var totalDetail=city+country+detail;
    if (!this.isCenterCity(province)){
      totalDetail = province + totalDetail;
    }
    return totalDetail;

  }
  // 是否为直辖市
  isCenterCity(name){
    var centerCitys=['北京市','天津市','上海市','重庆市'];
    var flag=centerCitys.indexOf(name)>=0;
    return flag;

  }
  //保存地址到服务器
  submitAddress(data,callBack){
    var data=this._setUpAddress(data);
    var params={
      url:'address',
      type:'POST',
      data:data,
      sCallBack:function(res){
        callBack && callBack(true,res);
      },
      eCallBack:function(res){
        callBack && callBack(false,res);
      }
    }
    this.request(params);

  }

  //组装地址 数据库需要字段
  _setUpAddress(data){
      var addressData={
        name: data.userName,
        mobile: data.telNumber,  //
        province: data.provinceName,
        city: data.cityName,
        country: data.countyName,
        detail: data.detailInfo
      }
      return addressData;
  }

  /*从服务器获得用户的收货地址*/
  getAddress(callback) {
    var that = this;
    var param = {
      url: 'address',
      sCallBack: function (res) {
        if (res) {
          res.totalDetail = that.setAddressInfo(res);
          callback && callback(res);
        }
      }
    };
    this.request(param);
  }






}
export { Address }
