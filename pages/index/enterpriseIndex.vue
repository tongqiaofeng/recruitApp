<template>
	<view class="enterprise-index-container">
		<!-- 企业首页 -->
		<view class="enterprise-index-top">
			<view class="top-title">人才库</view>
			<view class="top-search">
				<view class="search-left">
					<navigator url="../search/userSelect" hover-class="none">
						<view class="left-select">
							<view class="select-key">{{selectKeyword}}</view>
							<view class="select-jiao"></view>
						</view>
					</navigator>
					<view class="left-line"></view>
					<view class="left-input">
						<input type="text" v-model="keyword" placeholder="请输入姓名/工作地点等"
							placeholder-style="color: #c3c3c3;font-size: 22rpx;" />
					</view>
				</view>
				<view class="search-right">搜索</view>
			</view>
		</view>

		<view class="enterprise-index-main-every" v-for="(item,index) in userList" :key="index">
			<navigator :url="'./userDetails?userId=' + item.userId" hover-class="none">
				<view class="every-top">
					<view class="top-headpic">
						<image :src="imgUrl + item.headPic" mode="aspectFill"></image>
					</view>
					<view class="top-info">
						<view class="info-name">{{item.fullName}}</view>
						<view class="info-msg">
							<text>{{item.workingSeniority}}年</text>
							<view class="info-line"></view>
							<text>{{item.formalSchool}}</text>
							<view class="info-line"></view>
							<text>{{item.lowestSalary + '-' + item.highestSalary}}{{item.type == '全职' ? 'K' : '元'}}</text>
							<view class="info-line"></view>
							<text>{{item.age}}岁</text>
						</view>
					</view>
				</view>
				<view class="every-company">
					<view class="company-left">
						<!-- <image src="" mode=""></image> -->
						<text>{{item.companyName}}</text>
						<view class="left-circle"></view>
						<text>{{item.jobTitle}}</text>
					</view>
					<view class="company-right">{{item.startTime + '-' + item.endTime}}</view>
				</view>
				<view class="every-company">
					<view class="company-left">
						<!-- <image src="" mode=""></image> -->
						<text>求职期望：{{item.city}}</text>
					</view>
				</view>
				<view class="every-company">
					<view class="skill-left">
						<text>{{item.skill}}</text>
					</view>
				</view>
			</navigator>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.$baseUrl + '/',
				haveData: 1,
				haveMore: 0,
				page: 1,
				certificateNames: [],
				formalSchools: [],
				type: null,
				keyword: '',
				userList: [],

				selectKeyword: '点击选择'
			}
		},
		onLoad() {
			this.getUserList();

			uni.$on('userSelectData', (option) => {
				console.log(option);
				this.type = option.type;
				this.formalSchools = option.formalSchools;
				this.certificateNames = option.certificateNames;
				this.selectKeyword = this.type + ' ' + this.formalSchools.join(' ') + this.certificateNames.join(
					' ');

				this.page = 1;
				this.userList = [];
				this.haveMore = 0;
				this.getUserList();
			})
		},
		onPullDownRefresh() {
			uni.showLoading({
				title: "正在刷新",
			});
			this.page = 1;
			this.userList = [];
			this.haveMore = 0;

			this.getUserList();
			uni.stopPullDownRefresh();
		},
		onReachBottom() {
			if (this.haveMore == 0) {
				this.page++;
				this.getUserList();
			}
		},
		methods: {
			// 获取人才列表
			getUserList() {
				uni.request({
					url: this.$baseUrl + '/userSearchList?page=' + this.page + '&pageNum=10',
					method: 'POST',
					header: {
						"content-type": "application/json",
						"token": uni.getStorageSync('token')
					},
					data: {
						certificateNames: this.certificateNames.indexOf('不限') != -1 ? null : this.certificateNames,
						formalSchools: this.formalSchools.indexOf('不限') != -1 ? null : this.formalSchools,
						type: this.type == '不限' ? null : this.type,
						keyword: this.keyword
					},
					complete: (res) => {
						console.log('人才列表');
						console.log(res);

						if (res.data.data.list.length == 0) {
							this.haveMore = 1;
						} else {
							let data = this.userList.concat(res.data.data.list);
							this.userList = data;
						}

						if (this.userList.length == 0) {
							this.haveData = 0;
						} else {
							this.haveData = 1;
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.enterprise-index-container {
		min-height: 100vh;
		padding-bottom: 60rpx;
		background-color: #f9f9f9;

		.enterprise-index-top {
			padding: 40rpx;
			background-color: #85dbd0;

			.top-title {
				font-size: 38rpx;
				color: #fff;
			}

			.top-search {
				margin-top: 20rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.search-left {
					padding: 4rpx;
					display: flex;
					flex: 1;
					align-items: center;
					background-color: #fff;
					border-radius: 60rpx;

					.left-select {
						width: 160rpx;
						padding: 10rpx 30rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;
						color: #85dbd0;
						background-color: #f1f1f1;
						border-radius: 60rpx;
						font-size: 24rpx;

						.select-key {
							max-height: 32rpx;
							flex: 1;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 1;
							-webkit-box-orient: vertical;
						}

						.select-jiao {
							width: 0;
							height: 0;
							border-width: 10rpx 10rpx 0;
							border-style: solid;
							border-color: #85dbd0 transparent transparent;
						}
					}

					.left-line {
						width: 2rpx;
						height: 22rpx;
						margin: 0 10rpx;
						background-color: #c3c3c3;
					}

					.left-input {
						font-size: 24rpx;
					}
				}

				.search-right {
					margin-left: 30rpx;
					color: #fff;
					font-size: 28rpx;
				}
			}
		}

		.enterprise-index-main-every {
			padding: 20rpx 40rpx;
			margin-top: 20rpx;
			background-color: #fff;

			.every-top {
				display: flex;
				align-items: center;

				.top-headpic {

					image {
						width: 100rpx;
						height: 100rpx;
						border-radius: 50%;
					}
				}

				.top-info {
					height: 100rpx;
					margin-left: 20rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-around;

					.info-name {
						font-size: 32rpx;
					}

					.info-msg {
						display: flex;
						align-items: center;
						color: #c3c3c3;
						font-size: 22rpx;

						.info-line {
							width: 4rpx;
							height: 20rpx;
							margin: 0 10rpx;
							background-color: #c3c3c3;
						}
					}
				}
			}

			.every-company {
				margin-top: 20rpx;
				display: flex;
				justify-content: space-between;

				.company-left {
					display: flex;
					align-items: center;
					font-size: 24rpx;

					.left-circle {
						width: 4rpx;
						height: 4rpx;
						margin: 0 10rpx;
						background-color: #000;
						border-radius: 50%;
					}
				}

				.company-right {
					color: #808080;
					font-size: 24rpx;
				}

				.skill-left {
					font-size: 24rpx;
					color: #c3c3c3;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
			}

		}
	}
</style>
