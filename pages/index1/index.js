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
    var that = this;
    wx.showLoading({
      "mask": true
    })
    WXAPI.goods({
      categoryId: categoryId,
      nameLike: that.data.searchInput,
      page: this.data.curPage,
      pageSize: this.data.pageSize
    }).then(function(res) {
      wx.hideLoading()
      if (res.code == 404 || res.code == 700) {
        let newData = {
          loadingMoreHidden: false
        }
        if (!append) {
          newData.goods = []
        }
        that.setData(newData);
        return
      }
      let goods = [];
      if (append) {
        goods = that.data.goods
      }
      for (var i = 0; i < res.data.length; i++) {
        goods.push(res.data[i]);
      }
      that.setData({
        loadingMoreHidden: true,
        goods: goods,
      });
    })
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
      path: '/pages/index1/index',
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
})