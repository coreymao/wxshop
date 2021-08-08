import{ Token } from 'utils/token.js';

App({
  onLaunch: function () {
    var token=new Token();
    token.verify(); //获取token的操作(4.0操作)
    token.getUtils(); //test1


  }
})
