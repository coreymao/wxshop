import { Base } from '../../utils/base.js';
class Cart extends Base {
  constructor() {
    super();
    this.storageKeyName='cart';
  }
  /**
   * @params item 商品object  counts商品数量
   * 加入购物车
   * 购物车商品从缓存读取，新添加的商品 缓存中没有则添加 若 缓存中有则更新数量
   * 
   */
    add(item,counts){
      var cartData= this.getCartDataFromLocal(); //读取缓存商品
      var isHasInfo = this._isHasThatOne(item.id, cartData) //判断
      if (isHasInfo.index==-1 )
      {
        item.counts = counts
        item.selectStatus=true; //设置选中状态
        cartData.push(item);    //追加商品
      }else{
         cartData[isHasInfo.index].counts += counts; //商品存在更新数量
      }
      wx.setStorageSync(this.storageKeyName, cartData);  //更新缓存

    }
    /**
     * 缓存读取数据
     */
    getCartDataFromLocal(flag){
       
      var res=wx.getStorageSync(this.storageKeyName);
      if(!res){
        res=[];
      }
      //商品处于选中状态
      if(flag){
        var newRes=[];
        for(let i=0;i<res.length;i++){
          if(res[i].selectStatus){
              newRes.push(res[i]);
          }
        }
        res=newRes;
      }
      return res;
    }
   /**
    * @param flage=true 选中商品数量
    * 购物车内计算商品总数量  重写了
    */
    getCartTotalCounts(flag){
      var data=this.getCartDataFromLocal();
      var counts=0;
      for(var i=0;i<data.length;i++){
        if(flag){
          if(data[i].selectStatus){
            counts += data[i].counts;
          }
          
        }else{
          counts += data[i].counts;
        }
        
      }
      return counts;
    }

    /**
     * 商品id 与 缓存商品进行对比 获取存在商品索引
     */
    _isHasThatOne(id, arr){
      var item,
        result = { index: -1 };
      for (let i=0; i <arr.length;i++){
        item=arr[i];
        if (item.id ==id){
            result = {
              index: i,
              data:item
            };
            break;
        }
      }
      return result;
    }
    /**
     * private function
     * 修改商品数量
     */
    _changeCounts(id,counts){
      var cartData=this.getCartDataFromLocal(),
          hasInfo = this._isHasThatOne(id, cartData);
      if(hasInfo.index != -1){
          cartData[hasInfo.index].counts += counts;
          if (cartData[hasInfo.index].counts<1){
            cartData[hasInfo.index].counts =1;
          }
        
      }
      //更新缓存
      wx.setStorageSync(this.storageKeyName, cartData);

    }
    /**
     * add商品数量
     */
    addCounts(id){
      this._changeCounts(id,1);
    }
    /**
     * 减去商品数量
     */
    cutCounts(id){
      this._changeCounts(id,-1);
    }
    /**
     * @param ids(array) 商品id
     * 通用删除可以批量删除 也可以删除单个商品
     * 
     */
    deletes(ids){
      if(!(ids instanceof Array)){
        ids=[ids];  //转化为数组
      }
      var cartData=this.getCartDataFromLocal();
      for(let i=0;i<ids.length;i++){
        var hasInfo = this._isHasThatOne(ids[i],cartData);
        if(hasInfo!=-1){
          cartData.splice(hasInfo.index,1);
        }
      }
      wx.setStorageSync(this.storageKeyName, cartData); //更新缓存

    }
    /**
     * 更新 保存本地缓存
     */
    execSetStorage(data){
      wx.setStorageSync(this.storageKeyName, data);
    }









}
export { Cart }