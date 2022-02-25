import Vue from 'vue'
import App from './App'
import store from './store';
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)
Vue.config.productionTip = false

Vue.prototype.$baseUrl = 'http://192.168.0.164:8088/app/recruitment/api';
// Vue.prototype.$baseUrl = 'http://192.168.0.99:8088/app/recruitment/api';

Vue.config.ignoredElements.push('wx-open-launch-weapp')

Vue.prototype.checkBack = function(ret, bShwoTip = 1) {
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

Vue.prototype.getUserInfo = () => {
	uni.request({
		url: "http://192.168.0.164:8088/app/recruitment/api/userMsgGet",
		// url: "http://192.168.0.99:8088/app/recruitment/api/userMsgGet",
		header: {
			token: uni.getStorageSync("token"),
		},
		complete: (ret) => {
			console.log('个人信息');
			console.log(ret);
			if (ret.statusCode === 200) {
				let userInfo = {};
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
			}
		}
	})
}

// k分价格
Vue.prototype.formatNumberRgx = function(num) {
	if (num == "" || num == null || num == 0) {
		return 0;
	} else {
		let a = (num / 1e3).toFixed(1) + 'k';
		return a
	}
}

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})

app.$mount()
