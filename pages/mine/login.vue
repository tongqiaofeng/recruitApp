<template>
	<view class="login-container">
		<view class="login-main">
			<uni-forms ref="loginFormPhone" :modelValue="userData" :rules="loginPhoneRules">
				<uni-forms-item name="phoneNumber">
					<view>
						<text class="phone-num"> 手机号 </text>
						<view class="phone-main">
							<image class="phone-img" src="../../static/imgs/mine/login/phone.png" mode="aspectFill">
							</image>
							<view class="login-line"></view>
							<input type="text" class="phone-input" v-model="userData.phoneNumber"
								placeholder="请输入手机号" />
						</view>
					</view>
				</uni-forms-item>
				<uni-forms-item name="code">
					<view>
						<text class="phone-num code-code"> 验证码 </text>
						<view class="phone-main code-main">
							<view class="phone-main-left" style="flex: 1;">
								<image style="width: 27rpx; margin-right: 3rpx" class="phone-img"
									src="../../static/imgs/mine/login/code.png" mode="aspectFill">
								</image>
								<view class="login-line"></view>
								<input type="text" class="phone-input" v-model="userData.code" placeholder="请输入验证码" />
							</view>
							<view class="phone-main-left">
								<view class="login-line"></view>
								<button type="text" size="mini" :plain="true"
									style="border: none;padding: 0;height: 17px;line-height: 17px;" @click="getCode"
									class="phone-num" :disabled="disable"
									:class="{ codeGeting: isGeting }">{{time}}</button>
							</view>
						</view>
					</view>
				</uni-forms-item>
			</uni-forms>
			<view class="login-button">
				<image src="../../static/imgs/mine/login/login.png" mode="aspectFill" @click="userLoginPhone">
				</image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userData: {
					phoneNumber: "18892893691", // 15129702336
					code: ""
				},
				loginPhoneRules: {
					phoneNumber: {
						rules: [{
							required: true,
							errorMessage: "请输入手机号",
							trigger: "blur",
						}, ],
					},
					code: {
						rules: [{
							required: true,
							errorMessage: "请输入验证码",
							trigger: "blur",
						}, ],
					},
				},
				time: '获取验证码',
				count: 59,
				isGeting: false,
				disable: false,
				countDown: null,

			};
		},
		mounted() {
			// #ifdef APP-PLUS || H5
			let a = document.getElementsByClassName('uni-page-head-hd')[0]
			a.style.display = 'none';
			// #endif
		},
		methods: {
			// 获取验证码
			getCode() {
				if (this.userData.phoneNumber == '') {
					uni.showToast({
						title: '请输入手机号',
						icon: 'none'
					})
				} else {
					uni.showLoading({
						title: "验证码获取中..."
					})
					uni.request({
						method: 'GET',
						url: this.$baseUrl + '/smsCodeGet',
						header: {
							"content-type": "application/json"
						},
						data: {
							number: this.userData.phoneNumber
						},
						complete: (res) => {
							uni.hideLoading();
							if (res.statusCode == 200) {
								this.countDown = setInterval(() => {
									if (this.count < 1) {
										this.isGeting = false;
										this.disable = false;
										this.time = "获取验证码";
										this.count = 59;
										console.log(this.time);
										clearInterval(this.countDown);
										this.countDown = null;
									} else {
										this.isGeting = true;
										this.disable = true;
										this.time = this.count-- + "s后可重发";
									}
								}, 1000);
							}
							if (this.checkBack(res, true) == false) return;

							this.$isResolve();
						}
					})
				}
			},
			// 手机登录
			userLoginPhone() {
				this.$refs.loginFormPhone
					.validate()
					.then((res) => {
						console.log("表单数据", res);
						uni.showLoading({
							title: "登录中......",
						});
						uni.request({
							method: "POST",
							url: this.$baseUrl + "/login",
							header: {
								"content-type": "application/json",
							},
							data: {
								username: this.userData.phoneNumber,
								code: this.userData.code
							},
							complete: (ret) => {
								console.log("登录啦",ret);
								// let msg1={
								// 			type: "checkin",
								// 			token: uni.getStorageSync("token")
								// 		}
								// uni.connectSocket({
								// 	url: 'ws://192.168.0.99:8089/chat',
								// 	success: (res) => {
								// 		console.log('Socket连接成功')
								// 		console.log(res)
								// 	},
								// 	fail: (res) => {
								// 		console.log(res)
								// 	}
								// });
								// uni.onSocketOpen(function(res) {
								// 	console.log('WebSocket连接已打开！', res);
								// 	uni.sendSocketMessage({
								// 		data: JSON.stringify(msg1), 
								// 		success: function() {
								// 			console.log("checkin数据发送成功" );
									
								// 			console.log("checkin数据发送结束，开始接收");
								// 			uni.onSocketMessage(function(res) {
								// 				console.log('收到服务器内容：' + res.data);
								// 			})
								// 		},
									   
								// 		fail: function(res) {
								// 			console.log("checkin数据发送失败",res)
								// 		}
								// 	});
								// });
								uni.hideLoading();

								if (ret.data.code === 200) {
									let userInfo = {};
									userInfo.userId = ret.data.data.id;
									userInfo.userRole = ret.data.data.role;
									userInfo.userToken = ret.data.data.token;
									userInfo.userFullName = ret.data.data.fullName;
									userInfo.userSex = ret.data.data.sex;
									userInfo.userAge = ret.data.data.age;
									userInfo.userHeadPic = ret.data.data.headPic;
									userInfo.phoneNumber = ret.data.data.username;

									getApp().globalData.userInfo = userInfo;
									uni.setStorageSync('userId', userInfo.userId);
									uni.setStorageSync("role", userInfo.userRole);
									uni.setStorageSync("token", userInfo.userToken);
									uni.setStorageSync("fullName", userInfo.userFullName);
									uni.setStorageSync("sex", userInfo.userSex);
									uni.setStorageSync("age", userInfo.userAge);
									uni.setStorageSync("headPic", userInfo.userHeadPic);
									uni.setStorageSync("phoneNumber", userInfo.phoneNumber);

									uni.switchTab({
										url: "../index/personageIndex",
									});
									// uni.switchTab({
									// 	url: "../index/enterpriseIndex",
									// });
								}else{
									uni.showToast({
										title: ret.data.data
									})
								}
							},
						});
					})
					.catch((err) => {
						console.log("表单错误", err);
					});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.login-container {
		height: 100vh;
		padding: 20rpx;
		background-color: #fbfbfb;

		.login-main {

			.phone-num {
				color: #000;
				font-size: 26rpx;
			}

			.codeGeting {
				color: #c3c3c3;
			}

			.code-code {
				margin-top: 40rpx;
			}

			.phone-main {
				// height: 40rpx;
				padding: 20rpx;
				margin-top: 26rpx;
				display: flex;
				align-items: center;
				background-color: #fff;
				border-radius: 20rpx;

				.phone-img {
					width: 30rpx;
					height: 30rpx;
				}

				.login-line {
					width: 2rpx;
					height: 40rpx;
					margin: 0 20rpx;
					background-color: #c3c3c3;
				}

				.phone-input {
					flex: 1;
					font-size: 26rpx;
					color: #c3c3c3;
				}
			}

			.code-main {
				justify-content: space-between;

				.phone-main-left {
					display: flex;
					align-items: center;
				}
			}

			.login-button {
				width: 630rpx;
				margin: 0 auto;
				margin-top: 70rpx;

				image {
					width: 630rpx;
					height: 125rpx;
				}
			}

			.login-bottom {
				width: fit-content;

				text {
					font-size: 24rpx;
					color: #85dbd0;
				}
			}

			.register-psw {
				display: flex;
				justify-content: space-between;
			}
		}
	}
</style>
