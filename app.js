import{ Token } from 'utils/token.js';

App({
  onLaunch: function () {
    var token=new Token();
    token.verify(); //获取token-cao


  }
})
