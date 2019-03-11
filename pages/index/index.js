const WXAPI = require('../../wxapi/main')
const CONFIG = require('../../config.js')
//获取应用实例
var app = getApp()
Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    loadingHidden: false, // loading
    userInfo: {},
    swiperCurrent: 0,
    selectCurrent: 0,
    categories: [],
    activeCategoryId: 0,
    goods: [],
    scrollTop: 0,
    loadingMoreHidden: true,

    hasNoCoupons: true,
    coupons: [],
    searchInput: '',

    curPage: 1,
    pageSize: 20
  },

  tabClick: function(e) {
    this.setData({
      activeCategoryId: e.currentTarget.id,
      curPage: 1
    });
    this.getGoodsList(this.data.activeCategoryId);
  },
  //事件处理函数
  swiperchange: function(e) {
    //console.log(e.detail.current)
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  toDetailsTap: function(e) {
    wx.navigateTo({
      url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
    })
  },
  tapBanner: function(e) {
    if (e.currentTarget.dataset.id != 0) {
      wx.navigateTo({
        url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
      })
    }
  },
  bindTypeTap: function(e) {
    this.setData({
      selectCurrent: e.index
    })
  },
  onLoad: function() {
    var that = this
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName')
    })
    /**
     * 示例：
     * 调用接口封装方法
     */

    // var bannerArr = [{"businessId":4036,"dateAdd":"2017 - 09 - 15 08: 29: 50","dateUpdate":"2019 - 02 - 25 14: 49: 36","id":1148,"linkUrl":"","paixu":0,"picUrl":"https://cdn.it120.cc/apifactory/2017/09/15/145c582252a7a20f21ad9a025ae8c9be.png","remark":"","status":0,"statusStr":"显示","title":"1","type":"index","userId":951},{"businessId":0,"dateAdd":"2017-09-15 08:37:04","dateUpdate":"2019-02-25 14:49:39","id":1150,"linkUrl":"","paixu":2,"picUrl":"https://cdn.it120.cc/apifactory/2017/09/15/73560c511f554eb4afd1dcade9d8ef67.png","remark":"","status":0,"statusStr":"显示","title":"3","type":"index","userId":951},{"businessId":3776,"dateAdd":"2017-09-15 08:34:33","dateUpdate":"2019-02-25 14:49:44","id":1149,"linkUrl":"","paixu":3,"picUrl":"https://cdn.it120.cc/apifactory/2017/09/15/5acdd8f65ec85b413ee642dda795d835.png","remark":"","status":0,"statusStr":"显示","title":"2","type":"index","userId":951}];

    
    // WXAPI.banners({
    //   type: 'index'
    // }).then(function(res) {
    //   if (res.code == 700) {
    //     wx.showModal({
    //       title: '提示',
    //       content: '请在后台添加 banner 轮播图片，自定义类型填写 index',
    //       showCancel: false
    //     })
    //   } else {
    //     that.setData({
    //       banners: res.data
    //     });
    //   }
    // }).catch(function(e) {
    //   wx.showToast({
    //     title: res.msg,
    //     icon: 'none'
    //   })
    // })

    this.setBnner();
    this.setCate();

    // WXAPI.goodsCategory().then(function(res) {
    //   var categories = [{
    //     id: 0,
    //     name: "全部"
    //   }];
    //   if (res.code == 0) {
    //     for (var i = 0; i < res.data.length; i++) {
    //       categories.push(res.data[i]);
    //     }
    //   }
    //   that.setData({
    //     categories: categories,
    //     activeCategoryId: 0,
    //     curPage: 1
    //   });
    //   that.getGoodsList(0);
    // })
    that.getCoupons();
    // that.getNotice();
  },
  onPageScroll(e) {
    let scrollTop = this.data.scrollTop
    this.setData({
      scrollTop: e.scrollTop
    })
  },
  getGoodsList: function(categoryId, append) {
    if (categoryId == 0) {
      categoryId = "";
    }
    // var that = this;
    // wx.showLoading({
    //   "mask": true
    // })

  this.setGood();

    // WXAPI.goods({
    //   categoryId: categoryId,
    //   nameLike: that.data.searchInput,
    //   page: this.data.curPage,
    //   pageSize: this.data.pageSize
    // }).then(function(res) {
    //   wx.hideLoading()
    //   if (res.code == 404 || res.code == 700) {
    //     let newData = {
    //       loadingMoreHidden: false
    //     }
    //     if (!append) {
    //       newData.goods = []
    //     }
    //     that.setData(newData);
    //     return
    //   }
    //   let goods = [];
    //   if (append) {
    //     goods = that.data.goods
    //   }
    //   for (var i = 0; i < res.data.length; i++) {
    //     goods.push(res.data[i]);
    //   }
    //   that.setData({
    //     loadingMoreHidden: true,
    //     goods: goods,
    //   });
    // })
  },
  getCoupons: function() {
    var that = this;
    WXAPI.coupons().then(function (res) {
      if (res.code == 0) {
        that.setData({
          hasNoCoupons: false,
          coupons: res.data
        });
      }
    })
  },
  gitCoupon: function(e) {
    const that = this
    if (e.currentTarget.dataset.pwd) {
      wx.navigateTo({
        url: "/pages/fetch-coupon/index?id=" + e.currentTarget.dataset.id
      })
      return
    }
    WXAPI.fetchCoupons({
      id: e.currentTarget.dataset.id,
      token: wx.getStorageSync('token')
    }).then(function (res) {
      if (res.code == 20001 || res.code == 20002) {
        wx.showModal({
          title: '错误',
          content: '来晚了',
          showCancel: false
        })
        return;
      }
      if (res.code == 20003) {
        wx.showModal({
          title: '错误',
          content: '你领过了，别贪心哦~',
          showCancel: false
        })
        return;
      }
      if (res.code == 30001) {
        wx.showModal({
          title: '错误',
          content: '您的积分不足',
          showCancel: false
        })
        return;
      }
      if (res.code == 20004) {
        wx.showModal({
          title: '错误',
          content: '已过期~',
          showCancel: false
        })
        return;
      }
      if (res.code == 0) {
        wx.showToast({
          title: '领取成功，赶紧去下单吧~',
          icon: 'success',
          duration: 2000
        })
      } else {
        wx.showModal({
          title: '错误',
          content: res.msg,
          showCancel: false
        })
      }
    })
  },
  onShareAppMessage: function() {
    return {
      title: wx.getStorageSync('mallName') + '——' + CONFIG.shareProfile,
      path: '/pages/index/index',
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  getNotice: function() {
    var that = this;
    WXAPI.noticeList({pageSize: 5}).then(function (res) {
      if (res.code == 0) {
        that.setData({
          noticeList: res.data
        });
      }
    })
  },
  listenerSearchInput: function(e) {
    this.setData({
      searchInput: e.detail.value
    })

  },
  toSearch: function() {
    this.setData({
      curPage: 1
    });
    this.getGoodsList(this.data.activeCategoryId);
  },
  onReachBottom: function() {
    this.setData({
      curPage: this.data.curPage + 1
    });
    this.getGoodsList(this.data.activeCategoryId, true)
  },
  onPullDownRefresh: function() {
    this.setData({
      curPage: 1
    });
    this.getGoodsList(this.data.activeCategoryId)
  },

  setBnner:function(){
    var bannerArr = [{ "businessId": 3776, "dateAdd": "2017-09-15 08:34:33", "dateUpdate": "2019-02-25 14:49:44", "id": 1149, "linkUrl": "", "paixu": 3, "picUrl": "images/demo/WechatIMG6011.png", "remark": "", "status": 0, "statusStr": "显示", "title": "2", "type": "index", "userId": 951 }, { "businessId": 4036, "dateAdd": "2017 - 09 - 15 08: 29: 50", "dateUpdate": "2019 - 02 - 25 14: 49: 36", "id": 1148, "linkUrl": "", "paixu": 0, "picUrl": "images/demo/WechatIMG5711.png", "remark": "", "status": 0, "statusStr": "显示", "title": "1", "type": "index", "userId": 951 }, { "businessId": 3776, "dateAdd": "2017-09-15 08:34:33", "dateUpdate": "2019-02-25 14:49:44", "id": 1149, "linkUrl": "", "paixu": 3, "picUrl": "images/demo/WechatIMG5911.png", "remark": "", "status": 0, "statusStr": "显示", "title": "2", "type": "index", "userId": 951 }, { "businessId": 0, "dateAdd": "2017-09-15 08:37:04", "dateUpdate": "2019-02-25 14:49:39", "id": 1150, "linkUrl": "", "paixu": 2, "picUrl": "images/demo/WechatIMG5811.png", "remark": "", "status": 0, "statusStr": "显示", "title": "3", "type": "index", "userId": 951 }];

    this.setData({
      banners: bannerArr
    });
  },

  setCate:function(){
    var categories = [{ "id": 0, "name": "全部" }, { "dateAdd": "2017-09-12 11:07:32", "icon": "", "id": 1872, "isUse": true, "key": "1", "level": 1, "name": "客房用品", "paixu": 0, "pid": 0, "type": "", "userId": 951 }, { "dateAdd": "2017-09-12 11:07:48", "icon": "", "id": 1873, "isUse": true, "key": "2", "level": 1, "name": "餐饮用品", "paixu": 0, "pid": 0, "type": "", "userId": 951 }, { "dateAdd": "2017-09-12 11:08:02", "icon": "", "id": 1874, "isUse": true, "key": "3", "level": 1, "name": "清洁用品", "paixu": 0, "pid": 0, "type": "", "userId": 951 }, { "dateAdd": "2017-09-12 11:08:14", "icon": "", "id": 1875, "isUse": true, "key": "4", "level": 1, "name": "娱乐设备", "paixu": 0, "pid": 0, "type": "", "userId": 951 }, { "dateAdd": "2017-09-13 09:37:53", "icon": "", "id": 1906, "isUse": true, "key": "5", "level": 1, "name": "卫浴用品", "paixu": 0, "pid": 0, "type": "", "userId": 951 }, { "dateAdd": "2017-09-13 10:06:52", "icon": "", "id": 1907, "isUse": true, "key": "6", "level": 1, "name": "大堂用品", "paixu": 0, "pid": 0, "type": "", "userId": 951 }, { "dateAdd": "2017-09-16 14:03:08", "icon": "", "id": 2016, "isUse": true, "key": "7", "level": 1, "name": "陶瓷制品", "paixu": 0, "pid": 0, "type": "", "userId": 951 }, { "dateAdd": "2017-09-17 19:55:09", "icon": "", "id": 2054, "isUse": true, "key": "8", "level": 1, "name": "玻璃制品", "paixu": 0, "pid": 0, "type": "", "userId": 951 }, { "dateAdd": "2017-09-25 09:07:38", "icon": "", "id": 2245, "isUse": true, "key": "9", "level": 1, "name": "酒店服饰", "paixu": 0, "pid": 0, "type": "", "userId": 951 }, { "dateAdd": "2017-09-25 09:07:58", "icon": "", "id": 2246, "isUse": true, "key": "10", "level": 1, "name": "酒店软件类", "paixu": 0, "pid": 0, "type": "", "userId": 951 }, { "dateAdd": "2017-10-18 11:13:56", "icon": "", "id": 2787, "isUse": true, "key": "11", "level": 1, "name": "其它用品", "paixu": 0, "pid": 0, "type": "", "userId": 951 }];
    this.setData({
      categories: categories,
      activeCategoryId: 0,
      curPage: 1
    });
    this.getGoodsList(0);

  }
  ,
  setList:function(){
    Math.ceil(Math.random() * 10); 
  },
  setGood:function(){

    var goods = [{ "barCode": "", "categoryId": 2246, "characteristic": "尼多熊袜子，适合秋冬", "commission": 5, "commissionType": 2, "dateAdd": "2017-10-30 10:51:08", "dateStart": "2017-10-30 10:44:34", "dateUpdate": "2019-03-10 11:42:42", "gotScore": 0, "gotScoreType": 0, "id": 6765, "kanjia": false, "kanjiaPrice": 0, "logisticsId": 386, "minPrice": 80, "minScore": 0, "name": "1-3岁袜子", "numberFav": 0, "numberGoodReputation": 2, "numberOrders": 2, "numberSells": 1, "originalPrice": 0, "paixu": 0, "pic": "https://cdn.it120.cc/apifactory/2017/10/30/b07ee85fa64f0c68aa9a45fba20ec689.jpg", "pingtuan": false, "pingtuanPrice": 0, "recommendStatus": 0, "recommendStatusStr": "普通", "shopId": 0, "status": 0, "statusStr": "上架", "stores": 699999, "userId": 951, "videoId": "c4c6e38eeb3a428e80f1a8b32c6de587", "views": 65711, "weight": 0 }, { "barCode": "", "categoryId": 2246, "characteristic": "尼多熊袜子，适合秋冬天", "commission": 5, "commissionType": 2, "dateAdd": "2017-10-30 00:00:00", "dateStart": "2017-10-30 00:00:00", "dateUpdate": "2019-03-10 11:30:41", "gotScore": 0, "gotScoreType": 0, "id": 6761, "kanjia": false, "kanjiaPrice": 0, "logisticsId": 386, "minPrice": 90, "minScore": 0, "name": "10-12岁袜子", "numberFav": 0, "numberGoodReputation": 12, "numberOrders": 17, "numberSells": 12, "originalPrice": 0, "paixu": 0, "pic": "https://cdn.it120.cc/apifactory/2017/10/30/bc15e96f20fb13cc7d35f90d743ccb17.jpg", "pingtuan": true, "pingtuanPrice": 80, "recommendStatus": 0, "recommendStatusStr": "普通", "shopId": 0, "status": 0, "statusStr": "上架", "stores": 9999974, "userId": 951, "videoId": "", "views": 38189, "weight": 0 }, { "barCode": "", "categoryId": 2246, "characteristic": "尼多熊袜子，适合秋冬天", "commission": 5, "commissionType": 2, "dateAdd": "2017-10-30 10:44:16", "dateStart": "2017-10-30 10:39:02", "dateUpdate": "2019-03-10 01:39:22", "gotScore": 0, "gotScoreType": 0, "id": 6760, "kanjia": false, "kanjiaPrice": 0, "logisticsId": 386, "minPrice": 90, "minScore": 0, "name": "10-12岁袜子", "numberFav": 0, "numberGoodReputation": 2, "numberOrders": 6, "numberSells": 2, "originalPrice": 0, "paixu": 0, "pic": "https://cdn.it120.cc/apifactory/2017/10/30/bc15e96f20fb13cc7d35f90d743ccb17.jpg", "pingtuan": false, "pingtuanPrice": 0, "recommendStatus": 0, "recommendStatusStr": "普通", "shopId": 0, "status": 0, "statusStr": "上架", "stores": 4, "userId": 951, "views": 14541, "weight": 0 }, { "barCode": "", "categoryId": 2246, "characteristic": "尼多熊袜子，适合3-5岁宝宝", "commission": 5, "commissionType": 2, "dateAdd": "2017-10-30 10:36:44", "dateStart": "2017-10-30 10:34:01", "dateUpdate": "2019-03-10 11:15:40", "gotScore": 0, "gotScoreType": 0, "id": 6748, "kanjia": false, "kanjiaPrice": 0, "logisticsId": 386, "minPrice": 85, "minScore": 0, "name": "3-5岁可爱袜子", "numberFav": 0, "numberGoodReputation": 0, "numberOrders": 2, "numberSells": 0, "originalPrice": 0, "paixu": 0, "pic": "https://cdn.it120.cc/apifactory/2017/10/30/706ce9a593eafa29f2ded527553dbec9.jpg", "pingtuan": false, "pingtuanPrice": 0, "recommendStatus": 0, "recommendStatusStr": "普通", "shopId": 0, "status": 0, "statusStr": "上架", "stores": 8, "userId": 951, "views": 13849, "weight": 0 }, { "barCode": "", "categoryId": 2246, "characteristic": "纯色袜子，适合5-7岁宝宝", "commission": 5, "commissionType": 2, "dateAdd": "2017-10-30 10:33:41", "dateStart": "2017-10-30 10:31:37", "dateUpdate": "2019-03-10 05:49:27", "gotScore": 0, "gotScoreType": 0, "id": 6747, "kanjia": false, "kanjiaPrice": 0, "logisticsId": 386, "minPrice": 85, "minScore": 0, "name": "5-7岁袜子", "numberFav": 0, "numberGoodReputation": 0, "numberOrders": 0, "numberSells": 0, "originalPrice": 0, "paixu": 0, "pic": "https://cdn.it120.cc/apifactory/2017/10/30/cc9fd5d1d2ed58ab963561ab1fa39f89.jpg", "pingtuan": false, "pingtuanPrice": 0, "recommendStatus": 0, "recommendStatusStr": "普通", "shopId": 0, "status": 0, "statusStr": "上架", "stores": 0, "userId": 951, "views": 5166, "weight": 0 }, { "barCode": "", "categoryId": 2246, "characteristic": "纯色袜子，适合5-7岁宝宝", "commission": 5, "commissionType": 2, "dateAdd": "2017-10-30 10:33:36", "dateStart": "2017-10-30 10:31:37", "dateUpdate": "2019-03-10 10:28:37", "gotScore": 0, "gotScoreType": 0, "id": 6746, "kanjia": false, "kanjiaPrice": 0, "logisticsId": 386, "minPrice": 85, "minScore": 0, "name": "5-7岁袜子", "numberFav": 0, "numberGoodReputation": 0, "numberOrders": 0, "numberSells": 0, "originalPrice": 0, "paixu": 0, "pic": "https://cdn.it120.cc/apifactory/2017/10/30/cc9fd5d1d2ed58ab963561ab1fa39f89.jpg", "pingtuan": false, "pingtuanPrice": 0, "recommendStatus": 0, "recommendStatusStr": "普通", "shopId": 0, "status": 0, "statusStr": "上架", "stores": 0, "userId": 951, "views": 5303, "weight": 0 }, { "barCode": "", "categoryId": 1872, "characteristic": "尼多熊袜子，适合秋冬天", "commission": 5, "commissionType": 2, "dateAdd": "2017-10-30 10:31:27", "dateStart": "2017-10-30 10:24:54", "dateUpdate": "2019-03-10 11:36:42", "gotScore": 0, "gotScoreType": 0, "id": 6745, "kanjia": false, "kanjiaPrice": 0, "logisticsId": 386, "minPrice": 90, "minScore": 0, "name": "10-12岁袜子", "numberFav": 0, "numberGoodReputation": 2, "numberOrders": 5, "numberSells": 3, "paixu": 0, "pic": "https://cdn.it120.cc/apifactory/2017/10/30/94ed2ab19dc0ed01e65ac2fbd9e87147.jpg", "pingtuan": false, "pingtuanPrice": 0, "recommendStatus": 0, "recommendStatusStr": "普通", "shopId": 0, "status": 0, "statusStr": "上架", "stores": 5, "userId": 951, "views": 9290, "weight": 0 }, { "barCode": "", "categoryId": 2787, "characteristic": "保暖雨鞋", "commission": 5, "commissionType": 2, "dateAdd": "2017-10-18 00:00:00", "dateStart": "2017-10-18 00:00:00", "dateUpdate": "2019-03-10 11:22:10", "gotScore": 11, "gotScoreType": 0, "id": 5781, "kanjia": false, "kanjiaPrice": 0, "logisticsId": 386, "minPrice": 45, "minScore": 3, "name": "雨鞋", "numberFav": 0, "numberGoodReputation": 6, "numberOrders": 6, "numberSells": 3, "originalPrice": 0, "paixu": 0, "pic": "https://cdn.it120.cc/apifactory/2017/10/13/2d52b35375e8f0f13990e1443ebdaeed.jpg", "pingtuan": false, "pingtuanPrice": 0, "recommendStatus": 0, "recommendStatusStr": "普通", "shopId": 0, "status": 0, "statusStr": "上架", "stores": 9999995, "userId": 951, "videoId": "", "views": 8274, "weight": 0 }, { "categoryId": 2246, "characteristic": "拼色打底袜", "commission": 0, "commissionType": 0, "dateAdd": "2017-09-25 09:26:09", "dateStart": "2017-09-25 09:22:26", "dateUpdate": "2019-03-10 01:17:21", "gotScore": 0, "gotScoreType": 0, "id": 4517, "kanjia": false, "kanjiaPrice": 0, "logisticsId": 459, "minPrice": 12, "minScore": 0, "name": "可爱拼色打底袜", "numberFav": 0, "numberGoodReputation": 0, "numberOrders": 3, "numberSells": 1, "originalPrice": 25, "paixu": 0, "pic": "https://cdn.it120.cc/apifactory/2017/09/23/3e87985e0f2f34db607ad5658bd57e18.jpg", "pingtuan": false, "pingtuanPrice": 0, "propertyIds": ",871,", "recommendStatus": 0, "recommendStatusStr": "普通", "shopId": 0, "status": 0, "statusStr": "上架", "stores": 100, "userId": 951, "views": 6842, "weight": 0 }, { "categoryId": 2246, "characteristic": "可开档的小童打底袜，中童尺码也有，小童6个月到24个月，中童4岁到8岁", "commission": 0, "commissionType": 0, "dateAdd": "2017-09-25 09:19:24", "dateStart": "2017-09-25 09:15:10", "dateUpdate": "2019-03-10 07:49:30", "gotScore": 0, "gotScoreType": 0, "id": 4512, "kanjia": false, "kanjiaPrice": 0, "logisticsId": 459, "minPrice": 20, "minScore": 0, "name": "打底袜", "numberFav": 0, "numberGoodReputation": 1, "numberOrders": 1, "numberSells": 0, "originalPrice": 30, "paixu": 0, "pic": "https://cdn.it120.cc/apifactory/2017/09/23/a3ec4d35dea62ad4de39a786b6d11393.jpg", "pingtuan": false, "pingtuanPrice": 0, "propertyIds": ",871,", "recommendStatus": 0, "recommendStatusStr": "普通", "shopId": 0, "status": 0, "statusStr": "上架", "stores": 100, "userId": 951, "views": 6039, "weight": 0 }, { "categoryId": 2246, "characteristic": "可爱打底袜", "commission": 0, "commissionType": 0, "dateAdd": "2017-09-25 09:14:55", "dateStart": "2017-09-25 09:10:58", "dateUpdate": "2019-03-09 17:06:44", "gotScore": 0, "gotScoreType": 0, "id": 4510, "kanjia": false, "kanjiaPrice": 0, "logisticsId": 459, "minPrice": 12, "minScore": 0, "name": "可爱打底袜", "numberFav": 0, "numberGoodReputation": 2, "numberOrders": 2, "numberSells": 0, "originalPrice": 25, "paixu": 0, "pic": "https://cdn.it120.cc/apifactory/2017/09/23/2bc18370e8ed865d34371fe3e80f8dd7.jpg", "pingtuan": false, "pingtuanPrice": 0, "propertyIds": ",871,", "recommendStatus": 0, "recommendStatusStr": "普通", "shopId": 0, "status": 0, "statusStr": "上架", "stores": 100, "userId": 951, "views": 4266, "weight": 0 }, { "categoryId": 1872, "characteristic": "中小童毛衣", "commission": 0, "commissionType": 0, "dateAdd": "2017-09-24 09:47:58", "dateStart": "2017-09-24 09:43:08", "dateUpdate": "2019-03-10 11:20:40", "gotScore": 0, "gotScoreType": 0, "id": 4470, "kanjia": false, "kanjiaPrice": 0, "logisticsId": 386, "minPrice": 49, "minScore": 0, "name": "毛衣", "numberFav": 0, "numberGoodReputation": 1, "numberOrders": 4, "numberSells": 1, "originalPrice": 89, "paixu": 0, "pic": "https://cdn.it120.cc/apifactory/2017/09/23/2b17c4d23cb83824eb4362052831ab8e.jpg", "pingtuan": false, "pingtuanPrice": 0, "propertyIds": ",870,871,", "recommendStatus": 0, "recommendStatusStr": "普通", "shopId": 0, "status": 0, "statusStr": "上架", "stores": 100, "userId": 951, "views": 8853, "weight": 0 }, { "categoryId": 1872, "characteristic": "小狗图案毛衣", "commission": 0, "commissionType": 0, "dateAdd": "2017-09-24 09:40:52", "dateStart": "2017-09-24 09:33:38", "dateUpdate": "2019-03-09 18:12:50", "gotScore": 0, "gotScoreType": 0, "id": 4469, "kanjia": false, "kanjiaPrice": 0, "logisticsId": 386, "minPrice": 49, "minScore": 0, "name": "小狗图案毛衣", "numberFav": 0, "numberGoodReputation": 1, "numberOrders": 1, "numberSells": 1, "originalPrice": 89, "paixu": 0, "pic": "https://cdn.it120.cc/apifactory/2017/09/23/0b9a26c787908ff4ea98c58056a90736.jpg", "pingtuan": false, "pingtuanPrice": 0, "propertyIds": ",870,871,", "recommendStatus": 0, "recommendStatusStr": "普通", "shopId": 0, "status": 0, "statusStr": "上架", "stores": 100, "userId": 951, "views": 6254, "weight": 0 }, { "categoryId": 1872, "characteristic": "小童毛衣背心", "commission": 0, "commissionType": 0, "dateAdd": "2017-09-24 09:31:59", "dateStart": "2017-09-24 09:24:49", "dateUpdate": "2019-03-10 11:58:43", "gotScore": 0, "gotScoreType": 0, "id": 4468, "kanjia": false, "kanjiaPrice": 0, "logisticsId": 386, "minPrice": 49, "minScore": 0, "name": "毛衣背心", "numberFav": 0, "numberGoodReputation": 0, "numberOrders": 0, "numberSells": 0, "originalPrice": 89, "paixu": 0, "pic": "https://cdn.it120.cc/apifactory/2017/09/23/f677962d23a374576c837730a60d1a0b.jpg", "pingtuan": false, "pingtuanPrice": 0, "propertyIds": ",870,871,", "recommendStatus": 0, "recommendStatusStr": "普通", "shopId": 0, "status": 0, "statusStr": "上架", "stores": 100, "userId": 951, "views": 4650, "weight": 0 }, { "categoryId": 1872, "characteristic": "小童爆款马甲，这个天气刚刚好穿", "commission": 0, "commissionType": 0, "dateAdd": "2017-09-24 09:23:34", "dateStart": "2017-09-24 09:14:00", "dateUpdate": "2019-03-10 11:07:40", "gotScore": 0, "gotScoreType": 0, "id": 4467, "kanjia": false, "kanjiaPrice": 0, "logisticsId": 386, "minPrice": 49, "minScore": 0, "name": "爆款背心", "numberFav": 0, "numberGoodReputation": 0, "numberOrders": 0, "numberSells": 0, "originalPrice": 89, "paixu": 0, "pic": "https://cdn.it120.cc/apifactory/2017/09/23/6a4edc9261c8042e9caf6fb82e0ccf37.jpg", "pingtuan": false, "pingtuanPrice": 0, "propertyIds": ",870,871,", "recommendStatus": 0, "recommendStatusStr": "普通", "shopId": 0, "status": 0, "statusStr": "上架", "stores": 100, "userId": 951, "views": 2519, "weight": 0 }, { "categoryId": 1872, "characteristic": "多色可选的马甲", "commission": 0, "commissionType": 0, "dateAdd": "2017-09-24 09:12:20", "dateStart": "2017-09-24 08:55:13", "dateUpdate": "2019-03-09 19:17:55", "gotScore": 0, "gotScoreType": 0, "id": 4466, "kanjia": false, "kanjiaPrice": 0, "logisticsId": 386, "minPrice": 49, "minScore": 0, "name": "马甲", "numberFav": 0, "numberGoodReputation": 2, "numberOrders": 2, "numberSells": 0, "originalPrice": 89, "paixu": 0, "pic": "https://cdn.it120.cc/apifactory/2017/09/23/45d3f6f9bd2ad159b7860f307f158456.jpg", "pingtuan": false, "pingtuanPrice": 0, "propertyIds": ",870,871,", "recommendStatus": 0, "recommendStatusStr": "普通", "shopId": 0, "status": 0, "statusStr": "上架", "stores": 100, "userId": 951, "views": 5784, "weight": 0 }, { "categoryId": 1872, "characteristic": "可爱毛衣", "commission": 0, "commissionType": 0, "dateAdd": "2017-09-24 08:53:48", "dateStart": "2017-09-24 08:48:14", "dateUpdate": "2019-03-09 18:34:52", "gotScore": 0, "gotScoreType": 0, "id": 4464, "kanjia": false, "kanjiaPrice": 0, "logisticsId": 386, "minPrice": 59, "minScore": 0, "name": "毛衣", "numberFav": 0, "numberGoodReputation": 1, "numberOrders": 1, "numberSells": 0, "originalPrice": 89, "paixu": 0, "pic": "https://cdn.it120.cc/apifactory/2017/09/23/8ef3567c8ab7073843577cd8f866cabf.jpg", "pingtuan": false, "pingtuanPrice": 0, "propertyIds": ",870,871,", "recommendStatus": 0, "recommendStatusStr": "普通", "shopId": 0, "status": 0, "statusStr": "上架", "stores": 100, "userId": 951, "views": 2168, "weight": 0 }, { "categoryId": 1872, "characteristic": "女孩子喜欢的圈圈毛衣，加绒", "commission": 0, "commissionType": 0, "dateAdd": "2017-09-24 08:41:37", "dateStart": "2017-09-24 08:35:52", "dateUpdate": "2019-03-09 11:17:17", "gotScore": 0, "gotScoreType": 0, "id": 4463, "kanjia": false, "kanjiaPrice": 0, "logisticsId": 386, "minPrice": 59, "minScore": 0, "name": "毛衣", "numberFav": 0, "numberGoodReputation": 0, "numberOrders": 0, "numberSells": 0, "originalPrice": 89, "paixu": 0, "pic": "https://cdn.it120.cc/apifactory/2017/09/23/51555eb514558df4ec7b5beb3e33b463.jpg", "pingtuan": false, "pingtuanPrice": 0, "propertyIds": ",870,871,", "recommendStatus": 0, "recommendStatusStr": "普通", "shopId": 0, "status": 0, "statusStr": "上架", "stores": 50, "userId": 951, "views": 2276, "weight": 0 }, { "categoryId": 1872, "characteristic": "加绒毛衣，性价比高", "commission": 0, "commissionType": 0, "dateAdd": "2017-09-22 16:10:49", "dateStart": "2017-09-22 16:06:03", "dateUpdate": "2019-03-08 13:59:46", "gotScore": 0, "gotScoreType": 0, "id": 4411, "kanjia": false, "kanjiaPrice": 0, "logisticsId": 386, "minPrice": 59, "minScore": 0, "name": "加绒毛衣", "numberFav": 0, "numberGoodReputation": 0, "numberOrders": 0, "numberSells": 0, "originalPrice": 89, "paixu": 0, "pic": "https://cdn.it120.cc/apifactory/2017/09/21/a580f88b6a9393d3e8f1e6dbc056e297.jpg", "pingtuan": false, "pingtuanPrice": 0, "propertyIds": ",870,871,", "recommendStatus": 0, "recommendStatusStr": "普通", "shopId": 0, "status": 0, "statusStr": "上架", "stores": 50, "userId": 951, "views": 1827, "weight": 0 }, { "categoryId": 1872, "characteristic": "加绒毛衣，中大童", "commission": 0, "commissionType": 0, "dateAdd": "2017-09-22 16:05:19", "dateStart": "2017-09-22 16:00:25", "dateUpdate": "2019-03-10 10:42:38", "gotScore": 0, "gotScoreType": 0, "id": 4410, "kanjia": false, "kanjiaPrice": 0, "logisticsId": 386, "minPrice": 59, "minScore": 0, "name": "加绒毛衣", "numberFav": 0, "numberGoodReputation": 0, "numberOrders": 0, "numberSells": 0, "originalPrice": 89, "paixu": 0, "pic": "https://cdn.it120.cc/apifactory/2017/09/21/91d7bcf6e72eba3df144c997971d50f5.jpg", "pingtuan": false, "pingtuanPrice": 0, "propertyIds": ",870,871,", "recommendStatus": 0, "recommendStatusStr": "普通", "shopId": 0, "status": 0, "statusStr": "上架", "stores": 50, "userId": 951, "views": 2133, "weight": 0 }];

    for (var i = 0; i < goods.length;i++){
      goods[i].pic = "/images/demo/" + Math.ceil(Math.random() * 28)+'.png';
  }

    this.setData({
      loadingMoreHidden: true,
      goods: goods,
    });
  }
})