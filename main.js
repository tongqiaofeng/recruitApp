import Vue from 'vue'
import App from './App'
import store from './store';
import uView from '@/uni_modules/uview-ui'

Vue.use(uView)
Vue.config.productionTip = false

Vue.prototype.$baseUrl = 'http://192.168.0.164:8088/app/recruitment/api';
Vue.prototype.$chatServerUrl = 'ws://192.168.0.164:8089/chat'
// Vue.prototype.$chatServerUrl = 'wss://hk.wistechx.cn:8099/chat';
// Vue.prototype.$baseUrl = 'http://192.168.0.99:8088/app/recruitment/api';

Vue.config.ignoredElements.push('wx-open-launch-weapp')

Vue.prototype.checkBack = function (ret, bShwoTip = 1) {
	console.log('状态码判断')
	console.log(ret)
	if (ret.data.code == 200) {
		return true;
	} else if (bShwoTip == 1) {
		if (ret.data.code == 400)
			uni.showToast({
				icon: 'none',
				title: ret.data.data,
				duration: 2000
			});
		else if (ret.data.code == 300)
			uni.showToast({
				icon: 'none',
				title: '请登录后再操作',
				duration: 2000
			});
		else
			uni.showToast({
				icon: 'none',
				title: "操作失败，请重试",
				duration: 2000
			});
	}

	return false;
}

Vue.prototype.$onLaunched = new Promise(resolve => {
	console.log('这是啥')
	console.log(resolve);
	Vue.prototype.$isResolve = resolve;
})

Vue.prototype.getUserInfo = function () {
	let userInfo = {};
	uni.request({
		url: this.$baseUrl + "/userMsgGet",
		header: {
			token: uni.getStorageSync("token"),
		},
		complete: (ret) => {
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
				uni.setStorageSync('favoriteNum', userInfo.favoriteNum)

				//WebSocket
				if (userInfo.userRole != 2) {
					if (getApp().globalData.chatInfo.token != userInfo.userToken) {
						getApp().globalData.chatInfo.userId = userInfo.userId;
						getApp().globalData.chatInfo.token = userInfo.userToken;

						this.chat_connectServer();
					}
				}

			}
		}
	})
}

// k分价格
Vue.prototype.formatNumberRgx = function (num) {
	if (num == "" || num == null || num == 0) {
		return 0;
	} else {
		let a = (num / 1e3).toFixed(1) + 'k';
		return a
	}
}

// 日期-替换为.
Vue.prototype.formatTime = function (time) {
	if (time) {
		if (time.indexOf('-') !== -1) return time.split('-').join('.')
		else return time
	}
	return ''
}

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})

app.$mount()

let g_pingpangTimes = null;
let g_firstInit = true;
let g_socketTask = null;
let g_socketLiveTime = 0; //socket最后收到消息时间

//连接服务器
Vue.prototype.chat_connectServer = function () {

	let token = getApp().globalData.chatInfo.token;

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

	let that = this;


	g_socketTask = uni.connectSocket({
		url: this.$chatServerUrl,
		//url: 'ws://192.168.0.164:8099/chat',
		//url: 'ws://test.wistechx.cn:8089/chat',
		success: (res) => {
			console.log('success' + res)
		},
		fail: (res) => {
			console.log('fail' + res)
		}
	});

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
	})

	if (g_pingpangTimes == null) {
		g_pingpangTimes = setInterval(() => {

			that.chat_checkinServer();
			let curTime = new Date().getTime();
			if ((curTime - g_socketLiveTime) / 1000 > 30) {
				//连续三次没收到心跳包，就重连
				that.chat_connectServer();
			}
		}, 10000)
	}
}

//重连
Vue.prototype.chat_reConnectServer = function () {
	g_socketLiveTime = 0;
}

//发送心路包
Vue.prototype.chat_checkinServer = function () {
	let msg = {
		type: "checkin",
		token: getApp().globalData.chatInfo.token
	}
	uni.sendSocketMessage({
		data: JSON.stringify(msg),
		success: function () {},

		fail: function (res) {
			that.chat_reConnectServer();
		}
	});
}

//处理接收到的消息
Vue.prototype.chat_recvFromServer = function () {
	uni.onSocketMessage((res) => {
		g_socketLiveTime = new Date().getTime();
		console.log('收到消息', JSON.parse(res.data));
		let data = JSON.parse(res.data);

		if (data.type == 'historyOverview') {
			console.log('历史消息列表')
			data.msgList = [];
			getApp().globalData.userList.push(data);
			this.topMsg();
		} else if (data.type == 'historyAdmin') {
			getApp().globalData.adminList.push(data);

		} else if (data.type == 'history') {
			let userIdx = this.chat_findUser(getApp().globalData.chatUserId);
			if (userIdx > -1) {
				getApp().globalData.userList[userIdx].msgList.unshift(data);
			}

		} else if (data.type == 'message') {
			//更新用户列表与消息列表
			this.chat_recvNewMsg(data);
			this.chat_updatePage('chat');
			this.chat_updatePage('list');

		} else if (data.type == 'messageAdmin') {
			getApp().globalData.adminList.push(data);

		} else if (data.type == 'user') {
			//更新用户头像
			this.chat_updateUserPic(data);

		} else if (data.type == 'historyOverview-end') {
			this.chat_updatePage('list');

			if (g_firstInit == true) {
				let page = this.chat_getCurPage();
				if (page == 'chat') {
					this.chat_getMsgHistoryCmd(getApp().globalData.chatUserId, false);
				}
			}
			g_firstInit = false;

		} else if (data.type == 'history-end') {
			this.chat_updatePage('chat');

			let userIdx = this.chat_findUser(getApp().globalData.chatUserId);
			if (userIdx > -1) {
				if (getApp().globalData.userList[userIdx].num > 0)
					this.chat_readMsgCmd(getApp().globalData.chatUserId);
				getApp().globalData.userList[userIdx].msgListSendMark = true;
			}

		} else if (data.type == 'read-success') {
			this.chat_readMsgSuccess(data);
			this.chat_updatePage('list');

		} else if (data.type == 'delete-success') {
			this.chat_updateMsgState(data);
			this.chat_updatePage('list');
			this.chat_updatePage('chat');

		} else if (data.type == 'deleteAdmin-success') {
			this.chat_updateMsgState(data);

		} else if (data.type == 'top-success') {
			this.topMsg(data);

		} else if (data.type == 'remove-success') {
			this.delMsg(data)
		}
	})
}

//处理新消息
Vue.prototype.chat_recvNewMsg = function (data) {
	let page = this.chat_getCurPage();
	if (data.sender == getApp().globalData.chatInfo.userId) {
		//自己发的消息

		//更新用户列表
		let userIdx = this.chat_findUser(data.receiver);
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
				let user = getApp().globalData.userList[userIdx];
				getApp().globalData.userList.splice(userIdx, 1);
				getApp().globalData.userList.unshift(user);
			}
		}
	} else {
		//别人发给我的消息
		//更新用户列表
		let userIdx = this.chat_findUser(data.sender);
		if (userIdx > -1) {
			//用户列表已有该用户，更新该用户
			getApp().globalData.userList[userIdx].contentType = data.contentType;
			getApp().globalData.userList[userIdx].contentText = data.contentText;
			getApp().globalData.userList[userIdx].time = data.time;
			getApp().globalData.userList[userIdx].id = data.id;
			//将消息添加到消息列表里
			data.type = 'history';
			data.readStatus = 0;
			getApp().globalData.userList[userIdx].msgList.push(data);

			if (page == 'chat' && data.sender == getApp().globalData.chatUserId) {
				//当前正在与该用户聊天
				//阅读消息
				data.readStatus = 0;
				this.chat_readMsgCmd(getApp().globalData.chatUserId);
				console.log("正在聊天")
				// getApp().globalData.msgbox=false;
				// uni.setStorageSync('msgbox',false)
			} else {
				data.readStatus = 1;
				let pages = getCurrentPages() // 获取栈实例
				let currentRoute = pages[pages.length - 1].route;
				++getApp().globalData.userList[userIdx].num;
				if (currentRoute == 'pages/message/chat');
				console.log("其他用户", getApp().globalData.userList[userIdx])
				// console.log('currentRoute',currentRoute)				

			}

			//把元素移动到前面
			if (userIdx > 0) {
				let user = getApp().globalData.userList[userIdx];
				getApp().globalData.userList.splice(userIdx, 1);
				getApp().globalData.userList.unshift(user);
			}
		} else {
			//用户列表中没有该用户，将用户添加到用户列表中
			let user = {};
			user.type = 'historyOverview';
			user.userId = data.sender;
			user.num = 1;
			user.contentType = data.contentType;
			user.contentText = data.contentText;
			user.receiver = getApp().globalData.chatInfo.userId;
			user.time = data.time;
			user.username = null;
			user.head_pic = null;

			data.readStatus = 1
			user.msgList = [];
			user.msgList.push(data);
			getApp().globalData.userList.unshift(user);

			//获取用户头像
			this.chat_getUserInfoCmd(data.sender);
		}

		uni.getSystemInfo({
			success(res) {
				if (res.platform == 'ios') {
					uni.vibrateLong({});
				} else {
					uni.vibrateShort({});
				}
			}
		})

	}
}

//根据msgInfo查找消息
Vue.prototype.chat_findMsg = function (userIdx, msgInfo) {
	for (let i = getApp().globalData.userList[userIdx].msgList.length - 1, j = 0; i >= 0 && j < 20; --i, ++j) {
		if (getApp().globalData.userList[userIdx].msgList[i].readStatus == -1) {
			if (getApp().globalData.userList[userIdx].msgList[i].msgInfo == msgInfo) {
				return true;
			}
		}
	}

	return false;
}

//根据userId从UserList中查找用户
Vue.prototype.chat_findUser = function (userId) {
	for (let i = 0; i < getApp().globalData.userList.length; ++i) {
		if (getApp().globalData.userList[i].userId == userId)
			return i;
	}
	return -1;
}

Vue.prototype.admin_findmsg = function (id) {
	console.log("查找系统id", getApp().globalData.adminList)
	for (let i = 0; i < getApp().globalData.adminList.length; ++i) {
		if (getApp().globalData.adminList[i].id == id)
			return i;
	}
	return -1;
}

//发送消息
Vue.prototype.chat_sendToServer = function (msg) {
	console.log('发送消息');
	uni.sendSocketMessage({
		data: JSON.stringify(msg),
		success: (res) => {
			console.log('消息发送成功', res)
		},
		fail: (err) => {
			console.log('消息发送失败', err)
		}
	});
}

//发送提取用户列表命令
Vue.prototype.chat_updateUserListCmd = function () {
	let msg = {
		type: "historyOverview",
		token: getApp().globalData.chatInfo.token,
	}
	console.log('chat_updateUserListCmd');
	getApp().globalData.userList = [];
	this.chat_sendToServer(msg);
}

Vue.prototype.chat_updateAdminListCmd = function () {
	let msg = {
		type: "historyAdmin",
		token: getApp().globalData.chatInfo.token,
	}
	console.log('chat_updateadminListCmd', msg);
	getApp().globalData.adminList = [];
	this.chat_sendToServer(msg);
}

Vue.prototype.chat_deleteAdminList = function (data) {
	let msg = {
		type: "deleteAdmin",
		token: getApp().globalData.chatInfo.token,
		id: data.id
	}
	console.log('chat_deleteAdminList', msg);
	let index = this.admin_findmsg(data.id)
	getApp().globalData.adminList.splice(index, 1)
	this.chat_sendToServer(msg);
}

Vue.prototype.chat_sendAdminList = function (type, content) {
	let msg = {
		type: "messageAdmin",
		token: getApp().globalData.chatInfo.token,
		receiver: userId,
		contentType: type,
		contentText: content,
	}
	console.log('messageAdmin')
	this.chat_sendToServer(msg);
}

Vue.prototype.chat_updateUserMsg = function (userId) {
	let userIdx = this.chat_findUser(userId);
	if (userIdx > -1) {
		if (getApp().globalData.userList[userIdx].msgList.length == 0 || !getApp().globalData.userList[userIdx]
			.msgListSendMark)
			this.chat_getMsgHistoryCmd(userId, false);
		else
			this.chat_updatePage('chat');

		if (getApp().globalData.userList[userIdx].num > 0)
			this.chat_readMsgCmd(userId);
	}
}

//发送提取聊天记录命令:loadMore
Vue.prototype.chat_getMsgHistoryCmd = function (userId, loadMore = true) {
	let msgStartId = 0;
	let userIdx = this.chat_findUser(userId);
	if (userIdx > -1) {
		if (loadMore) {
			if (getApp().globalData.userList[userIdx].msgList.length > 0) {
				msgStartId = getApp().globalData.userList[userIdx].msgList[0].id;
			}
		} else {
			getApp().globalData.userList[userIdx].msgList = [];
		}

	}
	let msg = {
		type: "history",
		token: getApp().globalData.chatInfo.token,
		userId: userId,
		id: msgStartId,
		num: 20,
	}
	console.log('history')
	this.chat_sendToServer(msg);
}

//给指定用户发送消息
Vue.prototype.chat_sendMsgToUserCmd = function (userId, content, type) {
	let msg = {
		type: "message",
		token: getApp().globalData.chatInfo.token,
		receiver: userId,
		contentType: type,
		contentText: content,
		msgInfo: this.chat_getMsgUUID()
	}
	console.log('message')
	this.chat_sendToServer(msg);

	let userIdx = this.chat_findUser(userId);
	if (userIdx > -1) {
		let curDate = new Date();
		msg.type = 'history';
		msg.sender = getApp().globalData.chatInfo.userId;
		msg.time = curDate.toISOString();
		msg.readStatus = -1; //-1，发送中，-2，已撤销
		getApp().globalData.userList[userIdx].msgList.push(msg);
	} else {
		//与新用户聊天，用户列表中没有该用户，将用户添加到用户列表中
		let curDate = new Date();
		let user = {};
		user.type = 'historyOverview';
		user.userId = userId;
		user.num = 0;
		user.contentType = 0;
		user.contentText = content;
		user.receiver = userId;
		user.time = curDate.toISOString();
		user.username = null;
		user.head_pic = null;

		user.msgList = [];
		msg.type = 'history';
		msg.sender = getApp().globalData.chatInfo.userId;
		msg.time = curDate.toISOString();
		msg.readStatus = -1; //-1，发送中，-2，已撤销
		user.msgList.push(msg);
		getApp().globalData.userList.unshift(user);

		//获取用户头像
		this.chat_getUserInfoCmd(user.receiver);
	}
}

//更新消息状态
Vue.prototype.chat_updateMsgState = function (data) {
	if (data.type == 'message') {
		let userIdx = this.chat_findUser(data.receiver);
		if (userIdx > -1) {
			for (let i = getApp().globalData.userList[userIdx].msgList.length - 1; i >= 0; --i) {
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
		let userIdx = this.chat_findUser(data.sender);
		if (userIdx > -1) { //别人撤回
			for (let i = getApp().globalData.userList[userIdx].msgList.length - 1; i >= 0; --i) {
				if (getApp().globalData.userList[userIdx].msgList[i].id == data.id) {
					getApp().globalData.userList[userIdx].msgList[i].readStatus = -2;
					if (i == getApp().globalData.userList[userIdx].msgList.length - 1) {
						getApp().globalData.userList[userIdx].contentText = '[对方撤回了一条消息]';
					}
					break;
				}
			}
		}

		userIdx = this.chat_findUser(data.receiver);
		if (userIdx > -1) { //自己撤回
			for (let i = getApp().globalData.userList[userIdx].msgList.length - 1; i >= 0; --i) {
				if (getApp().globalData.userList[userIdx].msgList[i].id == data.id) {
					getApp().globalData.userList[userIdx].msgList[i].readStatus = -2;
					if (i == getApp().globalData.userList[userIdx].msgList.length - 1) {
						getApp().globalData.userList[userIdx].contentText = '[你撤回了一条消息]';
					}
					break;
				}
			}
		}
	} else if (data.type == 'deleteAdmin-success') {
		//删除消息
		let userIdx = this.admin_findmsg(data.id);
		getApp().globalData.adminList.splice(userIdx, 1)
	}
}

//发送消息已读命令
Vue.prototype.chat_readMsgCmd = function (userId) {
	let msg = {
		type: "read",
		token: getApp().globalData.chatInfo.token,
		userId: userId
	}
	console.log('read')
	this.chat_sendToServer(msg);
}

//已阅读消息
Vue.prototype.chat_readMsgSuccess = function (data) {
	let userIdx = this.chat_findUser(data.userId);
	if (userIdx > -1) {
		getApp().globalData.userList[userIdx].num = 0;
	}
}

//删除消息命令
Vue.prototype.chat_deleteMsgCmd = function (userId, msgId) {
	let msg = {
		type: "delete",
		token: getApp().globalData.chatInfo.token,
		receiver: userId,
		id: msgId
	}
	console.log('delete')
	this.chat_sendToServer(msg);
}

//获取用户信息
Vue.prototype.chat_getUserInfoCmd = function (userId) {
	let msg = {
		type: "user",
		token: getApp().globalData.chatInfo.token,
		userId: userId
	}
	console.log('read')
	this.chat_sendToServer(msg);
}

//更新用户头像
Vue.prototype.chat_updateUserPic = function (data) {
	let userIdx = this.chat_findUser(data.id);
	if (userIdx > -1) {
		//更新该用户
		getApp().globalData.userList[userIdx].username = data.username;
		getApp().globalData.userList[userIdx].head_pic = data.head_pic;
	}
}

//获取当前页面
Vue.prototype.chat_getCurPage = function () {
	let pages = getCurrentPages(); // 获取栈实例
	console.log(pages);
	if (pages.length > 0) {
		let currentRoute = pages[pages.length - 1].route;
		console.log('栈实例', currentRoute);
		if (currentRoute == 'pages/message/message')
			return 'list';
		else if (currentRoute == 'pages/message/chat')
			return 'chat';
		else
			return '';
	}
}

//刷新页面
Vue.prototype.chat_updatePage = function (page) {
	let curPage = this.chat_getCurPage();
	if (curPage == page) {
		if (page == 'list') {
			uni.$emit('user-list-update', {});
		} else if (page == 'chat') {
			uni.$emit('userMsgUpdate', {});
		}
	}
}

Vue.prototype.chat_getMsgUUID = function () {
	let s = [];
	let hexDigits = "0123456789abcdefABCDEF";
	for (let i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 22), 1);
	}
	let uuid = s.join("");
	return uuid;
}

// 未读消息红点
Vue.prototype.chat_updateReddot = function () {
	let bRed = false;
	for (let i = 0; i < getApp().globalData.userList.length; ++i) {
		if (getApp().globalData.userList[i].num > 0) {
			bRed = true;
			break;
		}
	};
	getApp().globalData.isRed = bRed;
	console.log(getApp().globalData.isRed)
	// if (bRed) {
	// 	uni.showTabBarRedDot({
	// 		index: 1
	// 	});
	// } else {
	// 	uni.hideTabBarRedDot({
	// 		index: 1
	// 	});
	// }
}

// 置顶消息
Vue.prototype.topMsg = function (data) {
	console.log('置顶/取消置顶消息');
	console.log(data)
	let list = getApp().globalData.userList;
	if (data) {
		for (let j = 0; j < list.length; j++) {
			if (data.userId == list[j].userId) {
				list[j].top = data.top;
			}
		};
	}

	let arr_temp = [].concat(list);
	for (let i = 0; i < list.length; i++) {
		if (list[i].top == 1) {
			arr_temp.splice(0, 0, arr_temp.splice(i, 1)[0]);
		}
	};

	getApp().globalData.userList = arr_temp;
}

// 删除与该人员的聊天列表
Vue.prototype.delMsg = function (data) {
	console.log('删除消息');
	console.log(data)
	let list = getApp().globalData.userList;
	if (data) {
		for (let j = 0; j < list.length; j++) {
			if (data.userId == list[j].userId) {
				list.splice(j, 1)
			}
		};
	}

	getApp().globalData.userList = list;
}