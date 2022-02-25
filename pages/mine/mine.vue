<template>
	<view class="page-container">
		<!-- 我的 -->
		<view v-if="role==2">
			<adminstar></adminstar>
			<!-- <text>管理员</text> -->
		</view>
		<view v-else>
			<navigator url="./userMsg" hover-class="none">
				<view class="mine-top">
					<view class="top-left">{{name == '' || name == null ? '欢迎使用~' : name}}</view>
					<view class="top-right">
						<image v-if="headPic == '' || headPic == null" src="../../static/imgs/mine/avatar.png"
							mode="aspectFill"></image>
						<image v-else :src="imgUrl + '/' + headPic" mode="aspectFill"></image>
					</view>
				</view>
			</navigator>
			<view class="mine-main">
				<view class="main-top">
					<navigator url="./userMsg" hover-class="none">
						<view class="top-one">
							<view class="one-font">
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
								<text>账号认证</text>
							</view>
							<view class="one-img">
								<image src="../../static/imgs/mine/right.png" mode="aspectFill"></image>
							</view>
						</view>
					</navigator>
				</view>
			</view>
			<view class="mine-main" v-if="role == 0 || role == 1">
				<view class="main-top">
					<view class="top-one" @click="resumeClick" v-if="role == 0">
						<view class="one-font">
							<text>在线简历</text>
						</view>
						<view class="one-img">
							<image src="../../static/imgs/mine/right.png" mode="aspectFill"></image>
						</view>
					</view>
					<navigator url="../minePersonage/jobCollect" hover-class="none" v-if="role == 0">
						<view class="top-one">
							<view class="one-font">
								<text>我的收藏</text>
							</view>
							<view class="one-img">
								<image src="../../static/imgs/mine/right.png" mode="aspectFill"></image>
							</view>
						</view>
					</navigator>
					<navigator url="../mineCompany/adminPostJob" hover-class="none" v-if="role == 1">
						<view class="top-one">
							<view class="one-font">
								<text>职位管理</text>
							</view>
							<view class="one-img">
								<image src="../../static/imgs/mine/right.png" mode="aspectFill"></image>
							</view>
						</view>
					</navigator>
					<navigator url="../mineCompany/personCollect" hover-class="none" v-if="role == 1">
						<view class="top-one">
							<view class="one-font">
								<text>我的收藏</text>
							</view>
							<view class="one-img">
								<image src="../../static/imgs/mine/right.png" mode="aspectFill"></image>
							</view>
						</view>
					</navigator>
				</view>
			</view>
			<view class="mine-main">
				<view class="main-top">
					<view class="top-one" @click="logoutClick">
						<view class="one-font">
							<text>退出登录</text>
						</view>
						<view class="one-img">
							<image src="../../static/imgs/mine/right.png" mode="aspectFill"></image>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import adminstar from '@/pages/mine/adminstar.vue'
	export default {
		components: {
			adminstar
		},
		data() {
			return {
				imgUrl: this.$baseUrl,
				name: '',
				role: null,
				headPic: '',

			}
		},
		onShow() {
			this.headPic = uni.getStorageSync('headPic');
			this.name = uni.getStorageSync('fullName');
			this.role = uni.getStorageSync('role');
		},
		methods: {
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

				uni.navigateTo({
					url: "./login",
				});
			},
		},
	}
</script>

<style lang="scss" scoped>
	.mine-top {
		padding: 40rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #85dbd0;

		.top-left {
			flex: 1;
			font-size: 32rpx;
			color: #fff;
		}

		.top-right {
			image {
				width: 150rpx;
				height: 150rpx;
				border-radius: 50%;
			}
		}
	}

	.mine-main {
		padding: 20rpx 40rpx 20rpx;
		background-color: #f9f9f9;

		.main-top {
			padding: 0 30rpx;
			background-color: #fff;
			border-radius: 10px;

			.top-one {
				height: 129rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.one-font {
					font-size: 28rpx;
					color: #565656;
					font-weight: bold;
				}

				.one-img {
					width: 44rpx;
					height: 44rpx;
					display: flex;
					justify-content: center;
					align-items: center;

					image {
						width: 44rpx;
						height: 44rpx;
					}
				}
			}
		}
	}
</style>
