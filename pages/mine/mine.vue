<template>
	<view class="mine-container">
		<!-- 我的 -->
		<view class="mine-header">
			<navigator :url="role != 2 ? './userMsg' : ''" hover-class="none">
				<view class="mine-top">
					<view class="top-left">
						<view class="left-name">
							{{name == '' || name == null ? '欢迎使用~' : name}}
						</view>
						<view class="left-font">
							你想成为怎样的人，你就会离这个目标不会太远
						</view>
					</view>
					<image class="top-right" v-if="headPic == '' || headPic == null"
						src="../../static/imgs/mine/avatar.png" mode="aspectFill"></image>
					<image class="top-right" v-else :src="imgUrl + '/' + headPic" mode="aspectFill"></image>
				</view>
			</navigator>
			<view class="header-main" v-if="role != 2">
				<view class="header-main-every" @click="goMessage">
					<view class="num">
						{{communicationNum}}
					</view>
					<view class="font">
						沟通过
					</view>
				</view>
				<view class="line"></view>
				<navigator hover-class="none"
					:url="role == 0 ? '../minePersonage/jobCollect' : (role == 1 ? '../mineCompany/personCollect' : '')">
					<view class="header-main-every">
						<view class="num">
							{{favoriteNum}}
						</view>
						<view class="font">
							收藏
						</view>
					</view>
				</navigator>
			</view>
		</view>
		<view class="mine-main" v-if="role != 2">
			<navigator url="./userMsg" hover-class="none">
				<view class="top-one">
					<view class="one-font">
						<image class="font-img" style="width: 30rpx;height: 29rpx;" src="../../static/imgs/mine/my.png"
							mode="aspectFill"></image>
						<text>个人信息</text>
					</view>
					<view class="one-img">
						<image src="../../static/imgs/mine/right.png" mode="aspectFill"></image>
					</view>
				</view>
			</navigator>
			<navigator url="./accountType" hover-class="none">
				<view class="top-one">
					<view class="one-font">
						<image class="font-img" src="../../static/imgs/mine/user.png" mode="aspectFill"></image>
						<text>账号认证</text>
					</view>
					<view class="one-img">
						<image src="../../static/imgs/mine/right.png" mode="aspectFill"></image>
					</view>
				</view>
			</navigator>
		</view>
		<view class="mine-main" v-if="role == 0 || role == 1">
			<view class="top-one" @click="resumeClick" v-if="role == 0">
				<view class="one-font">
					<image class="font-img" style="width: 28rpx;height: 30rpx;" src="../../static/imgs/mine/resume.png"
						mode="aspectFill"></image>
					<text>在线简历</text>
				</view>
				<view class="one-img">
					<image src="../../static/imgs/mine/right.png" mode="aspectFill"></image>
				</view>
			</view>
			<navigator url="../mineCompany/adminPostJob" hover-class="none" v-if="role == 1">
				<view class="top-one">
					<view class="one-font">
						<image class="font-img" src="../../static/imgs/mine/position_admin.png" mode="aspectFill">
						</image>
						<text>职位管理</text>
					</view>
					<view class="one-img">
						<image src="../../static/imgs/mine/right.png" mode="aspectFill"></image>
					</view>
				</view>
			</navigator>
		</view>
		<view class="mine-main" v-if="role == 2">
			<navigator url="/systemAdmin/examine" hover-class="none">
				<view class="top-one">
					<view class="one-font">
						<image class="font-img" src="../../static/imgs/mine/position_admin.png" mode="aspectFill">
						</image>
						<text>企业注册审核</text>
					</view>
					<view class="one-img">
						<image src="../../static/imgs/mine/right.png" mode="aspectFill"></image>
					</view>
				</view>
			</navigator>
			<navigator url="/systemAdmin/managelist" hover-class="none">
				<view class="top-one">
					<view class="one-font">
						<image class="font-img" src="../../static/imgs/mine/position_admin.png" mode="aspectFill">
						</image>
						<text>注册信息管理</text>
					</view>
					<view class="one-img">
						<image src="../../static/imgs/mine/right.png" mode="aspectFill"></image>
					</view>
				</view>
			</navigator>
			<navigator url="/systemAdmin/systemMsgAdmin" hover-class="none">
				<view class="top-one">
					<view class="one-font">
						<image class="font-img" src="../../static/imgs/mine/position_admin.png" mode="aspectFill">
						</image>
						<text>系统消息管理</text>
					</view>
					<view class="one-img">
						<image src="../../static/imgs/mine/right.png" mode="aspectFill"></image>
					</view>
				</view>
			</navigator>
		</view>
		<view class="mine-main">
			<view class="top-one" @click="logoutClick">
				<view class="one-font">
					<image class="font-img" style="width: 28rpx;height: 30rpx;" src="../../static/imgs/mine/logout.png"
						mode="aspectFill"></image>
					<text>退出登录</text>
				</view>
				<view class="one-img">
					<image src="../../static/imgs/mine/right.png" mode="aspectFill"></image>
				</view>
			</view>
		</view>
		<view class="uni-p-b-98"></view>
		<tabBar v-if="role != 2" :pagePath="'/pages/mine/mine'"></tabBar>
	</view>
</template>

<script>
	import tabBar from '../../components/tabbar.vue'
	export default {
		components: {
			tabBar
		},
		data() {
			return {
				imgUrl: this.$baseUrl,
				name: '',
				role: null,
				headPic: '',
				communicationNum: 0,
				favoriteNum: 0,

			}
		},
		onShow() {
			this.getUserInfo();
			this.chat_updateReddot();
		},
		onLoad() {
			uni.hideTabBar();
			this.favoriteNum = uni.getStorageSync('favoriteNum');
			this.communicationNum = getApp().globalData.userList.length;
			this.headPic = uni.getStorageSync('headPic');
			this.name = uni.getStorageSync('fullName');
			this.role = uni.getStorageSync('role');
		},
		methods: {
			// 去聊天列表页
			goMessage() {
				uni.switchTab({
					url: '../message/message'
				})
			},
			// 在线简历
			resumeClick() {
				console.log(uni.getStorageSync('joinWorkTime'))
				if (uni.getStorageSync('joinWorkTime') == null || uni.getStorageSync('joinWorkTime') == '') {
					uni.showToast({
						title: "请进行个人账号认证",
						icon: 'none',
						duration: 3000
					});
				} else {
					uni.navigateTo({
						url: '../minePersonage/resume'
					})
				}
			},
			// 退出登录
			logoutClick() {
				let userInfo = {};
				userInfo.userId = null;
				userInfo.userRole = '';
				userInfo.userToken = '';
				userInfo.userFullName = '';
				userInfo.userSex = '';
				userInfo.userAge = '';
				userInfo.userHeadPic = '';
				userInfo.phoneNumber = '';

				getApp().globalData.userInfo = userInfo;
				uni.setStorageSync('userId', userInfo.userId);
				uni.setStorageSync("role", userInfo.userRole);
				uni.setStorageSync("token", userInfo.userToken);
				uni.setStorageSync("fullName", userInfo.userFullName);
				uni.setStorageSync("sex", userInfo.userSex);
				uni.setStorageSync("age", userInfo.userAge);
				uni.setStorageSync("headPic", userInfo.userHeadPic);
				uni.setStorageSync("phoneNumber", userInfo.phoneNumber);

				// uni.navigateTo({
				// 	url: "./login",
				// });
				uni.reLaunch({
					url: './login'
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
	.mine-container {
		.mine-header {
			padding: 0 29rpx;
			padding-bottom: 57rpx;
			background-image: url(../../static/imgs/demo/mybg.png);
			background-size: 100% 100%;
			overflow: hidden;

			.mine-top {
				margin-top: 151rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.top-left {
					flex: 1;

					.left-name {
						font-size: 40rpx;
						font-weight: bold;
						color: #fff;
					}

					.left-font {
						margin-top: 24rpx;
						font-size: 20rpx;
						color: #C2E9FF;
					}
				}

				.top-right {
					width: 150rpx;
					height: 150rpx;
					border-radius: 50%;
				}
			}

			.header-main {
				margin-top: 74rpx;
				display: flex;
				align-items: center;

				.header-main-every {
					margin-left: 38rpx;
					color: #fff;

					.num {
						font-size: 30rpx;
					}

					.font {
						margin-top: 15rpx;
						font-size: 20rpx;
					}
				}

				.line {
					width: 4rpx;
					height: 50rpx;
					margin-left: 38rpx;
					background-color: #E8E8E8;
				}
			}
		}

		.mine-main {
			padding: 0 35rpx;
			background-color: #fff;

			.top-one {
				margin-top: 70rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.one-font {
					display: flex;
					align-items: center;
					font-size: 28rpx;
					color: #061D4C;

					.font-img {
						width: 30rpx;
						height: 30rpx;
						margin-right: 25rpx;
					}
				}

				.one-img {
					display: flex;
					justify-content: center;
					align-items: center;

					image {
						width: 10rpx;
						height: 18rpx;
					}
				}
			}
		}
	}
</style>
