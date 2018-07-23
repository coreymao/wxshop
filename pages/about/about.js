Page({
  data: {
    intro:['公司简介','地理位置','联系我们'],
    currentTabsIndex:0,
    introduce:'常州刘隆电子商务有限公司是保温杯、玻璃杯、保温奶瓶、咖啡杯、奶瓶配件等产品专业生产加工的公司，拥有完整、科学的质量管理体系。欢迎各界朋友莅临参观、指导和业务洽谈。',
    tel: 15295178102,
    addressInfo:'地址：江苏省常州市武进区湖塘镇创业大夏5F',
    markers: [{
      iconPath: "../../images/icon/maps.png",
      id: 0,
      latitude: 31.733126,
      longitude: 119.968122,
      width: 50,
      height: 50
    }],
    polyline: [{
      points: [{
        longitude: 119.968122,
        latitude: 31.733126
      }, {
        longitude: 119.968122,
        latitude: 31.733126
      }],
      color: "#FF0000DD",
      width: 2,
      dottedLine: true
    }],
    controls: [{
      id: 1,
      iconPath: '../../images/icon/maps.png',
      position: {
        left: 0,
        top: 300 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }]
    
  },
  onLoad:function(){

  },
  onTabsItemTab: function (event){
    console.log(event);
    var index = event.currentTarget.dataset.index; 
    this.setData({
      currentTabsIndex:index,
    })

  },
  contact:function(){
    wx.makePhoneCall({
      phoneNumber: '15295178102' 
    })
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  }






})