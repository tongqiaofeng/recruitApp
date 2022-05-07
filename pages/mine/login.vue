<template>
	<view class="login-container">
		<view class="login-title"> 手机号登录/注册 </view>
		<view class="login-main">
			<uni-forms ref="loginFormPhone" :modelValue="userData" :rules="loginPhoneRules">
				<uni-forms-item name="phoneNumber">
					<view class="phone-main">
						<view class="phone-left"> +86 </view>
						<input type="text" class="phone-input" v-model="userData.phoneNumber" placeholder="请输入您的手机号码"
							placeholder-style="color:#B2BDC5;" />
					</view>
				</uni-forms-item>
				<uni-forms-item name="code">
					<view class="phone-main code-main">
						<view class="phone-main-left" style="flex: 1">
							<input type="text" class="phone-input" v-model="userData.code" placeholder="请输入验证码"
								placeholder-style="color:#B2BDC5;" />
						</view>
						<view class="phone-main-left">
							<view class="login-line"></view>
							<button type="text" size="mini" :plain="true" style="
                  border: none;
                  padding: 0;
                  height: 17px;
                  line-height: 17px;
                " @click="getCode" class="phone-num" :disabled="disable" :class="{ codeGeting: isGeting }">
								{{ time }}
							</button>
						</view>
					</view>
				</uni-forms-item>
			</uni-forms>
			<view class="login-button" @click="userLoginPhone"> 登录 </view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userData: {
					phoneNumber: "17781769731", // 15129702336  18892893691
					code: "",
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
				time: "获取验证码",
				count: 59,
				isGeting: false,
				disable: false,
				countDown: null,
			};
		},
		mounted() {
			// #ifdef APP-PLUS || H5
			// let a = document.getElementsByClassName('uni-page-head-hd')[0];
			// console.log(a)
			// a.style.display = 'none';
			// #endif
		},
		methods: {
			// 获取验证码
			getCode() {
				console.log("7777777777");
				if (this.userData.phoneNumber == "") {
					uni.showToast({
						title: "请输入手机号",
						icon: "none",
					});
				} else {
					uni.showLoading({
						title: "验证码获取中...",
					});
					uni.request({
						method: "GET",
						url: this.$baseUrl + "/smsCodeGet",
						header: {
							"content-type": "application/json",
						},
						data: {
							number: this.userData.phoneNumber,
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
						},
					});
				}
			},
			// 手机登录
			userLoginPhone() {
				console.log("55555555");
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
								code: this.userData.code,
							},
							complete: (ret) => {
								console.log("登录啦", ret);

								if (this.checkBack(ret, true) == false) {
									this.$isResolve();
									return;
								}

								console.log("212344");

								if (ret.data.code === 200) {
									uni.setStorageSync("token", ret.data.data.token);
									this.getUserInfo();
									this.$isResolve();

									if (ret.data.data.role == 1) {
										getApp().globalData.tabBarList.splice(0, 1, {
											pagePath: "/pages/index/enterpriseIndex",
											text: "人才库",
											iconPath: "/static/imgs/tabBar/work.png",
											selectedIconPath: "/static/imgs/tabBar/work01.png",
										});
										console.log("登录页角色", ret.data.data.role);
									}
									setTimeout(() => {
										uni.hideLoading();
										console.log('看看是什么角色',uni.getStorageSync('role'))
										uni.navigateTo({
											url: "../index/index",
										});
									}, 500)
									// if (getApp().globalData.userInfo.userRole == 0) {
									// 	uni.switchTab({
									// 		url: "../index/personageIndex",
									// 	});
									// } else if (getApp().globalData.userInfo.userRole == 1) {
									// 	uni.switchTab({
									// 		url: "../index/enterpriseIndex",
									// 	});
									// }
								} else {
									uni.showToast({
										title: ret.data.data,
									});
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
		padding: 40rpx;
		padding-top: 160rpx;
		background-color: #fff;

		.login-title {
			color: #343a54;
			font-size: 40rpx;
			font-weight: bold;
		}

		.login-main {
			margin-top: 98rpx;

			.phone-num {
				color: #5eb9f5;
				font-size: 26rpx;
			}

			.codeGeting {
				color: #b2bdc5;
			}

			.phone-main {
				// height: 40rpx;
				padding: 30rpx;
				display: flex;
				align-items: center;
				background-color: #f6fbff;
				border-radius: 20rpx;

				.phone-left {
					margin-right: 40rpx;
					font-size: 30rpx;
					color: #5eb9f5;
				}

				.login-line {
					width: 2rpx;
					height: 40rpx;
					margin-right: 30rpx;
					background-color: #d0d3df;
				}

				.phone-input {
					flex: 1;
					font-size: 28rpx;
					color: #b2bdc5;
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
				margin: 0 auto;
				padding: 30rpx 0;
				margin-top: 108rpx;
				background: linear-gradient(to top, #5eb7f5, #5edaf5);
				border-radius: 20rpx;
				color: #fff;
				font-size: 30rpx;
				text-align: center;
			}
		}
	}
</style>
