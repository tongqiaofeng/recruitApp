<template>
	<view class="enterprise-index-container">
		<!-- 企业首页 -->
		<view class="enterprise-index-top">
			<view class="top-title">人才库</view>
		</view>
		<view class="top-search">
			<view class="search-left">
				<view class="left-img">
					<image src="../../static/imgs/common/search.png" mode="aspectFill"></image>
				</view>
				<view style="flex: 1;">
					<input class="left-input" type="text" v-model="keyword" @input="inputChange"
						placeholder="请输入姓名/工作地点等" placeholder-style="color: #ADBBD1;" />
				</view>
			</view>
			<navigator
				:url="'../search/userSelect?type=' + type + '&formalSchools=' + JSON.stringify(formalSchools) + '&certificateNames=' + JSON.stringify(certificateNames)"
				hover-class="none">
				<view class="search-right">
					<image src="../../static/imgs/common/filter.png" mode="aspectFill"></image>
				</view>
			</navigator>
		</view>
		<view v-if="haveData == 0" class="no-data">
			<image src="../../static/imgs/common/no.png" mode="aspectFill"></image>
			<text style="font-size: 30rpx">暂无相关数据~</text>
		</view>
		<view v-else style="padding: 0 30rpx;">
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
						<view class="company-name">
							<text>{{item.companyName}}</text>
						</view>
						<view class="company-right">{{item.startTime + '-' + item.endTime}}</view>
					</view>
					<view class="every-company">
						<view class="skill-left">
							<text>{{item.skill}}</text>
						</view>
					</view>
					<view class="every-hope">
						<view class="hope">
							<view class="top">
								{{item.jobTitle}}
							</view>
							<view class="bottom">
								求职职位
							</view>
						</view>
						<view class="hope">
							<view class="top">
								{{item.city}}
							</view>
							<view class="bottom">
								求职期望
							</view>
						</view>
					</view>
				</navigator>
			</view>
		</view>
		<view class="uni-p-b-98"></view>
		<!-- <u-tabbar :list="tabbar" :mid-button="false"></u-tabbar> -->
		<tabBar :pagePath="'/pages/index/enterpriseIndex'"></tabBar>
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
				imgUrl: this.$baseUrl + '/',
				haveData: 1,
				haveMore: 0,
				page: 1,
				certificateNames: ["不限"],
				formalSchools: ["不限"],
				type: "不限",
				keyword: '',
				userList: [],

				selectKeyword: '点击选择',
				timer: null,
				tabbar: getApp().globalData.tabBarList
			}
		},
		onShow() {
			this.chat_updateReddot();
		},
		onLoad() {
			uni.hideTabBar()
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
			inputChange() {
				clearTimeout(this.timer) // 清除以前触发的定时器，相当于清除以前的输入框内容（1  11  111等）
				this.timer = setTimeout(() => {
					this.userList = [];
					this.getUserList();
				}, 500)
			},
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
		background-color: #f3f7fa;

		.enterprise-index-top {
			height: 259rpx;
			padding: 0 30rpx 0;
			background-image: url(../../static/imgs/index/index_bg.png);
			background-size: 100% 100%;

			.top-title {
				padding-top: 129rpx;
				font-size: 44rpx;
				color: #fff;
				font-weight: bold;
				text-align: left;
			}
		}

		.top-search {
			margin-top: -37.5rpx;
			margin-bottom: 40rpx;
			padding: 0 30rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.search-left {
				height: 75rpx;
				display: flex;
				align-items: center;
				padding: 0 31rpx;
				margin-right: 29rpx;
				background-color: #fff;
				border-radius: 18.75px;
				flex: 1;
				box-shadow: 0 12rpx 12rpx -4rpx rgba(94, 183, 245, 0.11);

				.left-img {
					margin-right: 20rpx;

					image {
						width: 24rpx;
						height: 24rpx;
					}
				}

				.left-input {
					font-size: 24rpx;
					color: #ADBBD1;
				}
			}

			.search-right {
				width: 75rpx;
				height: 75rpx;
				background-color: #fff;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				box-shadow: 0 12rpx 12rpx -4rpx rgba(94, 183, 245, 0.11);

				image {
					width: 27rpx;
					height: 30rpx;
				}
			}
		}

		.enterprise-index-main-every {
			padding: 28rpx 30rpx;
			margin-bottom: 20rpx;
			background-color: #fff;
			border-radius: 20rpx;
			box-shadow: 0 6rpx 6rpx -3rpx rgba(147, 169, 182, 0.11);

			.every-top {
				display: flex;
				align-items: center;

				.top-headpic {

					image {
						width: 76rpx;
						height: 76rpx;
						border-radius: 50%;
					}
				}

				.top-info {
					height: 76rpx;
					margin-left: 20rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-around;

					.info-name {
						font-size: 30rpx;
						font-weight: bold;
					}

					.info-msg {
						display: flex;
						align-items: center;
						color: #A3B3CC;
						font-size: 24rpx;

						.info-line {
							width: 4rpx;
							height: 20rpx;
							margin: 0 10rpx;
							background-color: #A3B3CC;
						}
					}
				}
			}

			.every-company {
				margin-top: 27rpx;
				display: flex;
				justify-content: space-between;

				.company-name {
					color: #061D4C;
					font-size: 26rpx;
					font-weight: bold;
				}

				.company-right {
					color: #A3B3CC;
					font-size: 20rpx;
				}

				.skill-left {
					font-size: 20rpx;
					color: #A3B3CC;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
			}

			.every-hope {
				margin-top: 27rpx;
				padding: 31rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				background-color: #F7F9FA;
				border-radius: 20rpx;

				.hope {

					.top {
						font-weight: bold;
						font-size: 26rpx;
						color: #061D4C;
					}

					.bottom {
						margin-top: 23rpx;
						font-size: 20rpx;
						color: #A3B3CC;
					}
				}
			}
		}
	}
</style>
