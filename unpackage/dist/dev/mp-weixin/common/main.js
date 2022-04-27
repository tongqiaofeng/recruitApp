(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["common/main"],[
/* 0 */
/*!************************************************!*\
  !*** G:/aa-tong/my-project/recruitApp/main.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni, createApp) {__webpack_require__(/*! uni-pages */ 5);var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 3));
var _App = _interopRequireDefault(__webpack_require__(/*! ./App */ 6));
var _store = _interopRequireDefault(__webpack_require__(/*! ./store */ 12));
var _uviewUi = _interopRequireDefault(__webpack_require__(/*! @/uni_modules/uview-ui */ 20));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(Object(source), true).forEach(function (key) {_defineProperty(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(Object(source)).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}wx.__webpack_require_UNI_MP_PLUGIN__ = __webpack_require__;

_vue.default.use(_uviewUi.default);
_vue.default.config.productionTip = false;

_vue.default.prototype.$baseUrl = 'http://192.168.0.164:8088/app/recruitment/api';
_vue.default.prototype.$chatServerUrl = 'ws://192.168.0.164:8089/chat';
// Vue.prototype.$chatServerUrl = 'wss://hk.wistechx.cn:8099/chat';
// Vue.prototype.$baseUrl = 'http://192.168.0.99:8088/app/recruitment/api';

_vue.default.config.ignoredElements.push('wx-open-launch-weapp');

_vue.default.prototype.checkBack = function (ret) {var bShwoTip = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  console.log('状态码判断');
  console.log(ret);
  if (ret.data.code == 200) {
    return true;
  } else if (bShwoTip == 1) {
    if (ret.data.code == 400)
    uni.showToast({
      icon: 'none',
      title: ret.data.data,
      duration: 2000 });else

    if (ret.data.code == 300)
    uni.showToast({
      icon: 'none',
      title: '请登录后再操作',
      duration: 2000 });else


    uni.showToast({
      icon: 'none',
      title: "操作失败，请重试",
      duration: 2000 });

  }

  return false;
};

_vue.default.prototype.$onLaunched = new Promise(function (resolve) {
  console.log('这是啥');
  console.log(resolve);
  _vue.default.prototype.$isResolve = resolve;
});

_vue.default.prototype.getUserInfo = function () {var _this = this;
  var userInfo = {};
  uni.request({
    url: this.$baseUrl + "/userMsgGet",
    header: {
      token: uni.getStorageSync("token") },

    complete: function complete(ret) {
      console.log('个人信息');
      console.log(ret);
      if (ret.statusCode === 200) {
        userInfo.userId = ret.data.data.id;
        userInfo.userRole = ret.data.data.role;
        userInfo.userToken = ret.data.data.token;
        userInfo.userFullName = ret.data.data.fullName;
        userInfo.userSex = ret.data.data.sex;
        userInfo.userAge = ret.data.data.age;
        userInfo.userCity = ret.data.data.residentialCity;
        userInfo.userIdNumber = ret.data.data.idCard;
        userInfo.userTime = ret.data.data.joinWorkTime;
        userInfo.userHeadPic = ret.data.data.headPic;
        userInfo.phoneNumber = ret.data.data.username;
        userInfo.favoriteNum = ret.data.data.favoriteNum;

        getApp().globalData.userInfo = userInfo;
        uni.setStorageSync('userId', userInfo.userId);
        uni.setStorageSync("role", userInfo.userRole);
        uni.setStorageSync("token", userInfo.userToken);
        uni.setStorageSync("fullName", userInfo.userFullName);
        uni.setStorageSync("sex", userInfo.userSex);
        uni.setStorageSync("age", userInfo.userAge);
        uni.setStorageSync("city", userInfo.userCity);
        uni.setStorageSync("idNumber", userInfo.userIdNumber);
        uni.setStorageSync("joinWorkTime", userInfo.userTime);
        uni.setStorageSync("headPic", userInfo.userHeadPic);
        uni.setStorageSync("phoneNumber", userInfo.phoneNumber);
        uni.setStorageSync('favoriteNum', userInfo.favoriteNum);

        //WebSocket
        if (userInfo.userRole != 2) {
          if (getApp().globalData.chatInfo.token != userInfo.userToken) {
            getApp().globalData.chatInfo.userId = userInfo.userId;
            getApp().globalData.chatInfo.token = userInfo.userToken;

            _this.chat_connectServer();
          }
        }

      }
    } });

};

// k分价格
_vue.default.prototype.formatNumberRgx = function (num) {
  if (num == "" || num == null || num == 0) {
    return 0;
  } else {
    var a = (num / 1e3).toFixed(1) + 'k';
    return a;
  }
};

// 日期-替换为.
_vue.default.prototype.formatTime = function (time) {
  if (time) {
    if (time.indexOf('-') !== -1) return time.split('-').join('.');else
    return time;
  }
  return '';
};

_App.default.mpType = 'app';

var app = new _vue.default(_objectSpread({
  store: _store.default },
_App.default));


createApp(app).$mount();

var g_pingpangTimes = null;
var g_firstInit = true;
var g_socketTask = null;
var g_socketLiveTime = 0; //socket最后收到消息时间

//连接服务器
_vue.default.prototype.chat_connectServer = function () {

  var token = getApp().globalData.chatInfo.token;

  if (token == '' || token == null || token == undefined) return;
  /* if(g_pingpangTimes != null){
                                                                  	clearInterval(g_pingpangTimes);
                                                                  	g_pingpangTimes = null;
                                                                  } */
  if (g_socketTask != null) {
    g_socketTask.close();
    g_socketTask = null;
  }
  g_firstInit = true;
  g_socketLiveTime = 0;

  var that = this;


  g_socketTask = uni.connectSocket({
    url: this.$chatServerUrl,
    //url: 'ws://192.168.0.164:8099/chat',
    //url: 'ws://test.wistechx.cn:8089/chat',
    success: function success(res) {
      console.log('success' + res);
    },
    fail: function fail(res) {
      console.log('fail' + res);
    } });


  this.chat_recvFromServer();

  uni.onSocketOpen(function (res) {
    console.log('WebSocket连接成功！', res);
    g_socketLiveTime = new Date().getTime();
    that.chat_checkinServer();

    that.chat_updateUserListCmd();
  });

  uni.onSocketError(function (res) {
    console.log('WebSocket连接失败');
    that.chat_reConnectServer();
  });

  uni.onSocketClose(function () {
    console.log('WebSocket关闭');
    that.chat_reConnectServer();
  });

  if (g_pingpangTimes == null) {
    g_pingpangTimes = setInterval(function () {

      that.chat_checkinServer();
      var curTime = new Date().getTime();
      if ((curTime - g_socketLiveTime) / 1000 > 30) {
        //连续三次没收到心跳包，就重连
        that.chat_connectServer();
      }
    }, 10000);
  }
};

//重连
_vue.default.prototype.chat_reConnectServer = function () {
  g_socketLiveTime = 0;
};

//发送心路包
_vue.default.prototype.chat_checkinServer = function () {
  var msg = {
    type: "checkin",
    token: getApp().globalData.chatInfo.token };

  uni.sendSocketMessage({
    data: JSON.stringify(msg),
    success: function success() {},

    fail: function fail(res) {
      that.chat_reConnectServer();
    } });

};

//处理接收到的消息
_vue.default.prototype.chat_recvFromServer = function () {var _this2 = this;
  uni.onSocketMessage(function (res) {
    g_socketLiveTime = new Date().getTime();
    console.log('收到消息', JSON.parse(res.data));
    var data = JSON.parse(res.data);

    if (data.type == 'historyOverview') {
      console.log('历史消息列表');
      data.msgList = [];
      getApp().globalData.userList.push(data);
      _this2.topMsg();
    } else if (data.type == 'historyAdmin') {
      getApp().globalData.adminList.push(data);

    } else if (data.type == 'history') {
      var userIdx = _this2.chat_findUser(getApp().globalData.chatUserId);
      if (userIdx > -1) {
        getApp().globalData.userList[userIdx].msgList.unshift(data);
      }

    } else if (data.type == 'message') {
      //更新用户列表与消息列表
      _this2.chat_recvNewMsg(data);
      _this2.chat_updatePage('chat');
      _this2.chat_updatePage('list');

    } else if (data.type == 'messageAdmin') {
      getApp().globalData.adminList.push(data);

    } else if (data.type == 'user') {
      //更新用户头像
      _this2.chat_updateUserPic(data);

    } else if (data.type == 'historyOverview-end') {
      _this2.chat_updatePage('list');

      if (g_firstInit == true) {
        var page = _this2.chat_getCurPage();
        if (page == 'chat') {
          _this2.chat_getMsgHistoryCmd(getApp().globalData.chatUserId, false);
        }
      }
      g_firstInit = false;

    } else if (data.type == 'history-end') {
      _this2.chat_updatePage('chat');

      var _userIdx = _this2.chat_findUser(getApp().globalData.chatUserId);
      if (_userIdx > -1) {
        if (getApp().globalData.userList[_userIdx].num > 0)
        _this2.chat_readMsgCmd(getApp().globalData.chatUserId);
        getApp().globalData.userList[_userIdx].msgListSendMark = true;
      }

    } else if (data.type == 'read-success') {
      _this2.chat_readMsgSuccess(data);
      _this2.chat_updatePage('list');

    } else if (data.type == 'delete-success') {
      _this2.chat_updateMsgState(data);
      _this2.chat_updatePage('list');
      _this2.chat_updatePage('chat');

    } else if (data.type == 'deleteAdmin-success') {
      _this2.chat_updateMsgState(data);

    } else if (data.type == 'top-success') {
      _this2.topMsg(data);

    } else if (data.type == 'remove-success') {
      _this2.delMsg(data);
    }
  });
};

//处理新消息
_vue.default.prototype.chat_recvNewMsg = function (data) {
  var page = this.chat_getCurPage();
  if (data.sender == getApp().globalData.chatInfo.userId) {
    //自己发的消息

    //更新用户列表
    var userIdx = this.chat_findUser(data.receiver);
    if (userIdx > -1) {
      //更新该用户
      getApp().globalData.userList[userIdx].contentType = data.contentType;
      getApp().globalData.userList[userIdx].contentText = data.contentText;
      getApp().globalData.userList[userIdx].time = data.time;
      getApp().globalData.userList[userIdx].id = data.id;

      //判断是否是当前客户端发送的消息
      if (this.chat_findMsg(userIdx, data.msgInfo)) {
        //当前登录端发的消息
        //更新消息状态
        this.chat_updateMsgState(data);
      } else {
        //其他登录端发的消息
        //将消息添加到消息列表里
        data.type = 'history';
        data.readStatus = 0;
        getApp().globalData.userList[userIdx].msgList.push(data);
      }

      //把元素移动到前面
      if (userIdx > 0) {
        var user = getApp().globalData.userList[userIdx];
        getApp().globalData.userList.splice(userIdx, 1);
        getApp().globalData.userList.unshift(user);
      }
    }
  } else {
    //别人发给我的消息
    //更新用户列表
    var _userIdx2 = this.chat_findUser(data.sender);
    if (_userIdx2 > -1) {
      //用户列表已有该用户，更新该用户
      getApp().globalData.userList[_userIdx2].contentType = data.contentType;
      getApp().globalData.userList[_userIdx2].contentText = data.contentText;
      getApp().globalData.userList[_userIdx2].time = data.time;
      getApp().globalData.userList[_userIdx2].id = data.id;
      //将消息添加到消息列表里
      data.type = 'history';
      data.readStatus = 0;
      getApp().globalData.userList[_userIdx2].msgList.push(data);

      if (page == 'chat' && data.sender == getApp().globalData.chatUserId) {
        //当前正在与该用户聊天
        //阅读消息
        data.readStatus = 0;
        this.chat_readMsgCmd(getApp().globalData.chatUserId);
        console.log("正在聊天");
        // getApp().globalData.msgbox=false;
        // uni.setStorageSync('msgbox',false)
      } else {
        data.readStatus = 1;
        var pages = getCurrentPages(); // 获取栈实例
        var currentRoute = pages[pages.length - 1].route;
        ++getApp().globalData.userList[_userIdx2].num;
        if (currentRoute == 'pages/message/chat') ;
        console.log("其他用户", getApp().globalData.userList[_userIdx2]);
        // console.log('currentRoute',currentRoute)				

      }

      //把元素移动到前面
      if (_userIdx2 > 0) {
        var _user = getApp().globalData.userList[_userIdx2];
        getApp().globalData.userList.splice(_userIdx2, 1);
        getApp().globalData.userList.unshift(_user);
      }
    } else {
      //用户列表中没有该用户，将用户添加到用户列表中
      var _user2 = {};
      _user2.type = 'historyOverview';
      _user2.userId = data.sender;
      _user2.num = 1;
      _user2.contentType = data.contentType;
      _user2.contentText = data.contentText;
      _user2.receiver = getApp().globalData.chatInfo.userId;
      _user2.time = data.time;
      _user2.username = null;
      _user2.head_pic = null;

      data.readStatus = 1;
      _user2.msgList = [];
      _user2.msgList.push(data);
      getApp().globalData.userList.unshift(_user2);

      //获取用户头像
      this.chat_getUserInfoCmd(data.sender);
    }

    uni.getSystemInfo({
      success: function success(res) {
        if (res.platform == 'ios') {
          uni.vibrateLong({});
        } else {
          uni.vibrateShort({});
        }
      } });


  }
};

//根据msgInfo查找消息
_vue.default.prototype.chat_findMsg = function (userIdx, msgInfo) {
  for (var i = getApp().globalData.userList[userIdx].msgList.length - 1, j = 0; i >= 0 && j < 20; --i, ++j) {
    if (getApp().globalData.userList[userIdx].msgList[i].readStatus == -1) {
      if (getApp().globalData.userList[userIdx].msgList[i].msgInfo == msgInfo) {
        return true;
      }
    }
  }

  return false;
};

//根据userId从UserList中查找用户
_vue.default.prototype.chat_findUser = function (userId) {
  for (var i = 0; i < getApp().globalData.userList.length; ++i) {
    if (getApp().globalData.userList[i].userId == userId)
    return i;
  }
  return -1;
};

_vue.default.prototype.admin_findmsg = function (id) {
  console.log("查找系统id", getApp().globalData.adminList);
  for (var i = 0; i < getApp().globalData.adminList.length; ++i) {
    if (getApp().globalData.adminList[i].id == id)
    return i;
  }
  return -1;
};

//发送消息
_vue.default.prototype.chat_sendToServer = function (msg) {
  console.log('发送消息');
  uni.sendSocketMessage({
    data: JSON.stringify(msg),
    success: function success(res) {
      console.log('消息发送成功', res);
    },
    fail: function fail(err) {
      console.log('消息发送失败', err);
    } });

};

//发送提取用户列表命令
_vue.default.prototype.chat_updateUserListCmd = function () {
  var msg = {
    type: "historyOverview",
    token: getApp().globalData.chatInfo.token };

  console.log('chat_updateUserListCmd');
  getApp().globalData.userList = [];
  this.chat_sendToServer(msg);
};

_vue.default.prototype.chat_updateAdminListCmd = function () {
  var msg = {
    type: "historyAdmin",
    token: getApp().globalData.chatInfo.token };

  console.log('chat_updateadminListCmd', msg);
  getApp().globalData.adminList = [];
  this.chat_sendToServer(msg);
};

_vue.default.prototype.chat_deleteAdminList = function (data) {
  var msg = {
    type: "deleteAdmin",
    token: getApp().globalData.chatInfo.token,
    id: data.id };

  console.log('chat_deleteAdminList', msg);
  var index = this.admin_findmsg(data.id);
  getApp().globalData.adminList.splice(index, 1);
  this.chat_sendToServer(msg);
};

_vue.default.prototype.chat_sendAdminList = function (type, content) {
  var msg = {
    type: "messageAdmin",
    token: getApp().globalData.chatInfo.token,
    receiver: userId,
    contentType: type,
    contentText: content };

  console.log('messageAdmin');
  this.chat_sendToServer(msg);
};

_vue.default.prototype.chat_updateUserMsg = function (userId) {
  var userIdx = this.chat_findUser(userId);
  if (userIdx > -1) {
    if (getApp().globalData.userList[userIdx].msgList.length == 0 || !getApp().globalData.userList[userIdx].
    msgListSendMark)
    this.chat_getMsgHistoryCmd(userId, false);else

    this.chat_updatePage('chat');

    if (getApp().globalData.userList[userIdx].num > 0)
    this.chat_readMsgCmd(userId);
  }
};

//发送提取聊天记录命令:loadMore
_vue.default.prototype.chat_getMsgHistoryCmd = function (userId) {var loadMore = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var msgStartId = 0;
  var userIdx = this.chat_findUser(userId);
  if (userIdx > -1) {
    if (loadMore) {
      if (getApp().globalData.userList[userIdx].msgList.length > 0) {
        msgStartId = getApp().globalData.userList[userIdx].msgList[0].id;
      }
    } else {
      getApp().globalData.userList[userIdx].msgList = [];
    }

  }
  var msg = {
    type: "history",
    token: getApp().globalData.chatInfo.token,
    userId: userId,
    id: msgStartId,
    num: 20 };

  console.log('history');
  this.chat_sendToServer(msg);
};

//给指定用户发送消息
_vue.default.prototype.chat_sendMsgToUserCmd = function (userId, content, type) {
  var msg = {
    type: "message",
    token: getApp().globalData.chatInfo.token,
    receiver: userId,
    contentType: type,
    contentText: content,
    msgInfo: this.chat_getMsgUUID() };

  console.log('message');
  this.chat_sendToServer(msg);

  var userIdx = this.chat_findUser(userId);
  if (userIdx > -1) {
    var curDate = new Date();
    msg.type = 'history';
    msg.sender = getApp().globalData.chatInfo.userId;
    msg.time = curDate.toISOString();
    msg.readStatus = -1; //-1，发送中，-2，已撤销
    getApp().globalData.userList[userIdx].msgList.push(msg);
  } else {
    //与新用户聊天，用户列表中没有该用户，将用户添加到用户列表中
    var _curDate = new Date();
    var user = {};
    user.type = 'historyOverview';
    user.userId = userId;
    user.num = 0;
    user.contentType = 0;
    user.contentText = content;
    user.receiver = userId;
    user.time = _curDate.toISOString();
    user.username = null;
    user.head_pic = null;

    user.msgList = [];
    msg.type = 'history';
    msg.sender = getApp().globalData.chatInfo.userId;
    msg.time = _curDate.toISOString();
    msg.readStatus = -1; //-1，发送中，-2，已撤销
    user.msgList.push(msg);
    getApp().globalData.userList.unshift(user);

    //获取用户头像
    this.chat_getUserInfoCmd(user.receiver);
  }
};

//更新消息状态
_vue.default.prototype.chat_updateMsgState = function (data) {
  if (data.type == 'message') {
    var userIdx = this.chat_findUser(data.receiver);
    if (userIdx > -1) {
      for (var i = getApp().globalData.userList[userIdx].msgList.length - 1; i >= 0; --i) {
        if (getApp().globalData.userList[userIdx].msgList[i].readStatus == -1) {
          if (getApp().globalData.userList[userIdx].msgList[i].msgInfo == data.msgInfo) {
            getApp().globalData.userList[userIdx].msgList[i].readStatus = 0;
            getApp().globalData.userList[userIdx].msgList[i].id = data.id;
            console.log('发送成功');
            break;
          }
        }
      }
    }
  } else if (data.type == 'delete-success') {
    //删除消息
    var _userIdx3 = this.chat_findUser(data.sender);
    if (_userIdx3 > -1) {//别人撤回
      for (var _i = getApp().globalData.userList[_userIdx3].msgList.length - 1; _i >= 0; --_i) {
        if (getApp().globalData.userList[_userIdx3].msgList[_i].id == data.id) {
          getApp().globalData.userList[_userIdx3].msgList[_i].readStatus = -2;
          if (_i == getApp().globalData.userList[_userIdx3].msgList.length - 1) {
            getApp().globalData.userList[_userIdx3].contentText = '[对方撤回了一条消息]';
          }
          break;
        }
      }
    }

    _userIdx3 = this.chat_findUser(data.receiver);
    if (_userIdx3 > -1) {//自己撤回
      for (var _i2 = getApp().globalData.userList[_userIdx3].msgList.length - 1; _i2 >= 0; --_i2) {
        if (getApp().globalData.userList[_userIdx3].msgList[_i2].id == data.id) {
          getApp().globalData.userList[_userIdx3].msgList[_i2].readStatus = -2;
          if (_i2 == getApp().globalData.userList[_userIdx3].msgList.length - 1) {
            getApp().globalData.userList[_userIdx3].contentText = '[你撤回了一条消息]';
          }
          break;
        }
      }
    }
  } else if (data.type == 'deleteAdmin-success') {
    //删除消息
    var _userIdx4 = this.admin_findmsg(data.id);
    getApp().globalData.adminList.splice(_userIdx4, 1);
  }
};

//发送消息已读命令
_vue.default.prototype.chat_readMsgCmd = function (userId) {
  var msg = {
    type: "read",
    token: getApp().globalData.chatInfo.token,
    userId: userId };

  console.log('read');
  this.chat_sendToServer(msg);
};

//已阅读消息
_vue.default.prototype.chat_readMsgSuccess = function (data) {
  var userIdx = this.chat_findUser(data.userId);
  if (userIdx > -1) {
    getApp().globalData.userList[userIdx].num = 0;
  }
};

//删除消息命令
_vue.default.prototype.chat_deleteMsgCmd = function (userId, msgId) {
  var msg = {
    type: "delete",
    token: getApp().globalData.chatInfo.token,
    receiver: userId,
    id: msgId };

  console.log('delete');
  this.chat_sendToServer(msg);
};

//获取用户信息
_vue.default.prototype.chat_getUserInfoCmd = function (userId) {
  var msg = {
    type: "user",
    token: getApp().globalData.chatInfo.token,
    userId: userId };

  console.log('read');
  this.chat_sendToServer(msg);
};

//更新用户头像
_vue.default.prototype.chat_updateUserPic = function (data) {
  var userIdx = this.chat_findUser(data.id);
  if (userIdx > -1) {
    //更新该用户
    getApp().globalData.userList[userIdx].username = data.username;
    getApp().globalData.userList[userIdx].head_pic = data.head_pic;
  }
};

//获取当前页面
_vue.default.prototype.chat_getCurPage = function () {
  var pages = getCurrentPages(); // 获取栈实例
  console.log(pages);
  if (pages.length > 0) {
    var currentRoute = pages[pages.length - 1].route;
    console.log('栈实例', currentRoute);
    if (currentRoute == 'pages/message/message')
    return 'list';else
    if (currentRoute == 'pages/message/chat')
    return 'chat';else

    return '';
  }
};

//刷新页面
_vue.default.prototype.chat_updatePage = function (page) {
  var curPage = this.chat_getCurPage();
  if (curPage == page) {
    if (page == 'list') {
      uni.$emit('user-list-update', {});
    } else if (page == 'chat') {
      uni.$emit('userMsgUpdate', {});
    }
  }
};

_vue.default.prototype.chat_getMsgUUID = function () {
  var s = [];
  var hexDigits = "0123456789abcdefABCDEF";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 22), 1);
  }
  var uuid = s.join("");
  return uuid;
};

// 未读消息红点
_vue.default.prototype.chat_updateReddot = function () {
  var bRed = false;
  for (var i = 0; i < getApp().globalData.userList.length; ++i) {
    if (getApp().globalData.userList[i].num > 0) {
      bRed = true;
      break;
    }
  };
  getApp().globalData.isRed = bRed;
  console.log(getApp().globalData.isRed);
  // if (bRed) {
  // 	uni.showTabBarRedDot({
  // 		index: 1
  // 	});
  // } else {
  // 	uni.hideTabBarRedDot({
  // 		index: 1
  // 	});
  // }
};

// 置顶消息
_vue.default.prototype.topMsg = function (data) {
  console.log('置顶/取消置顶消息');
  console.log(data);
  var list = getApp().globalData.userList;
  if (data) {
    for (var j = 0; j < list.length; j++) {
      if (data.userId == list[j].userId) {
        list[j].top = data.top;
      }
    };
  }

  var arr_temp = [].concat(list);
  for (var i = 0; i < list.length; i++) {
    if (list[i].top == 1) {
      arr_temp.splice(0, 0, arr_temp.splice(i, 1)[0]);
    }
  };

  getApp().globalData.userList = arr_temp;
};

// 删除与该人员的聊天列表
_vue.default.prototype.delMsg = function (data) {
  console.log('删除消息');
  console.log(data);
  var list = getApp().globalData.userList;
  if (data) {
    for (var j = 0; j < list.length; j++) {
      if (data.userId == list[j].userId) {
        list.splice(j, 1);
      }
    };
  }

  getApp().globalData.userList = list;
};
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["createApp"]))

/***/ }),
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/*!************************************************!*\
  !*** G:/aa-tong/my-project/recruitApp/App.vue ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _App_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./App.vue?vue&type=script&lang=js& */ 7);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _App_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _App_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _App_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./App.vue?vue&type=style&index=0&lang=scss& */ 9);
/* harmony import */ var _Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../Download/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 11);
var render, staticRenderFns, recyclableRender, components
var renderjs





/* normalize component */

var component = Object(_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _App_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"],
  render,
  staticRenderFns,
  false,
  null,
  null,
  null,
  false,
  components,
  renderjs
)

component.options.__file = "App.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 7 */
/*!*************************************************************************!*\
  !*** G:/aa-tong/my-project/recruitApp/App.vue?vue&type=script&lang=js& ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Download_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_App_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../Download/HBuilderX/plugins/uniapp-cli/node_modules/babel-loader/lib!../../../Download/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--12-1!../../../Download/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!../../../Download/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../Download/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./App.vue?vue&type=script&lang=js& */ 8);
/* harmony import */ var _Download_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_App_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Download_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_App_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _Download_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_App_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _Download_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_App_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_Download_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_App_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 8 */
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--12-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!G:/aa-tong/my-project/recruitApp/App.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default =
{
  globalData: {
    userInfo: {},
    chatInfo: {
      userId: 0,
      token: '' },

    userList: [], //聊天用户列表
    chatUserId: '', //当前与我聊天的用户的userId
    adminList: [],
    tabBarList: [{
      "pagePath": "/pages/index/personageIndex",
      "text": "找工作",
      "iconPath": "/static/imgs/tabBar/work.png",
      "selectedIconPath": "/static/imgs/tabBar/work01.png" },

    {
      "pagePath": "/pages/message/message",
      "text": "消息",
      "iconPath": "/static/imgs/tabBar/msg.png",
      "selectedIconPath": "/static/imgs/tabBar/msg01.png" },

    {
      "pagePath": "/pages/mine/mine",
      "text": "我的",
      "iconPath": "/static/imgs/tabBar/mine.png",
      "selectedIconPath": "/static/imgs/tabBar/mine01.png" }],


    isRed: false },

  data: function data() {
    return {
      token: uni.getStorageSync('token') };

  },
  onLaunch: function onLaunch() {var _this = this;
    this.token = uni.getStorageSync('token');
    console.log('token的值', this.token);
    if (!this.token) {
      uni.reLaunch({
        url: 'pages/mine/login',
        success: function success() {



        } });

    } else {
      this.getUserInfo();



    }










    // 监听键盘高度变化
    uni.onKeyboardHeightChange(function (res) {
      _this.$store.commit('changeKeyboardHeight', res.height);
    });



































  },
  onShow: function onShow() {
    this.$store.dispatch('reconnect');
    console.log('App Show');
  },
  onHide: function onHide() {
    console.log('App Hide');
  } };exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),
/* 9 */
/*!**********************************************************************************!*\
  !*** G:/aa-tong/my-project/recruitApp/App.vue?vue&type=style&index=0&lang=scss& ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Download_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_Download_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_Download_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_App_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../Download/HBuilderX/plugins/uniapp-cli/node_modules/mini-css-extract-plugin/dist/loader.js??ref--8-oneOf-1-0!../../../Download/HBuilderX/plugins/uniapp-cli/node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!../../../Download/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../Download/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-2!../../../Download/HBuilderX/plugins/uniapp-cli/node_modules/postcss-loader/src??ref--8-oneOf-1-3!../../../Download/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--8-oneOf-1-4!../../../Download/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-5!../../../Download/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../Download/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./App.vue?vue&type=style&index=0&lang=scss& */ 10);
/* harmony import */ var _Download_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_Download_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_Download_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_App_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Download_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_Download_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_Download_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_App_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _Download_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_Download_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_Download_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_App_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _Download_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_Download_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_Download_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_App_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_Download_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_Download_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_Download_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Download_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_App_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 10 */
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--8-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-2!./node_modules/postcss-loader/src??ref--8-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--8-oneOf-1-4!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-5!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!G:/aa-tong/my-project/recruitApp/App.vue?vue&type=style&index=0&lang=scss& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })
],[[0,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/main.js.map