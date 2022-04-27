<template>
	<view class="person-index-container">
		<!-- 个人首页 -->
		<view class="top-search">
			<navigator url="../search/jobSearch" hover-class="none" class="search-left">
				<view class="left-img">
					<image src="../../static/imgs/common/search.png" mode="aspectFill"></image>
				</view>
				<view style="flex: 1;" class="left-input">
					{{keyword ? keyword : '搜索商品'}}
				</view>
			</navigator>
			<navigator
				:url="'../search/jobScreen?major=' + JSON.stringify(major) + '&salary=' + salary + '&workExperience=' + JSON.stringify(workExperience) + '&teamSize=' + JSON.stringify(teamSize)"
				hover-class="none">
				<view class="search-right">
					<image src="../../static/imgs/common/filter.png" mode="aspectFill"></image>
				</view>
			</navigator>
		</view>
		<view v-if="haveData == 0" class="no-data">
			<image src="../../static/imgs/common/no.png" mode="aspectFill"></image>
			<text style="font-size: 30rpx">暂无职位~</text>
		</view>
		<view v-else class="person-index-main">
			<view class="main-every" v-for="(item,index) in jobList" :key="index">
				<navigator :url="'./jobDetails?jobId='+item.id" hover-class="none">
					<view class="every-top">
						<view class="top-name">{{item.name}}<text class="top-urg" v-if="item.isUrgent == 1">急聘</text>
						</view>
						<view class="top-money">
							{{item.lowestSalary + '-' + item.highestSalary}}{{item.type == '实习/兼职' ? '元' : 'K'}}
							<view v-if="item.welfare" class="welfare">
								<view class="circle"></view>{{item.welfare}}薪
							</view>
						</view>
					</view>
					<view class="every-second" v-if="item.keywords !== ''">
						<view class="second-every" v-if="item.keywords.indexOf('，') == -1">
							{{item.keywords}}
						</view>
						<view v-else style="display: flex;flex-wrap: wrap;">
							<view class="second-every" v-for="(items,index) in item.keywords.split('，')" :key="index">
								{{items}}
							</view>
						</view>
					</view>
					<view class="second-third">
						<text>{{item.companyName}}</text>
						<text style="margin-left: 30rpx;">{{item.teamSize}}</text>
					</view>
					<view class="second-four">
						<view class="four-left">
							<image class="four-img" :src="imgUrl + '/' + item.issuerHeadPic" mode="aspectFill"></image>
							<text class="four-name">{{item.issuerFullName}}</text>
						</view>
						<text>{{item.workLocation}}</text>
					</view>
				</navigator>
			</view>
		</view>
		<view class="uni-p-b-98"></view>　
		<tabBar :pagePath="'/pages/index/personageIndex'"></tabBar>
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
				haveData: 1,
				haveMore: 0,
				page: 1,
				jobList: [],
				city: "",
				keyword: "",
				major: ["不限"],
				salary: "不限",
				workExperience: ["不限"],
				teamSize: ["不限"],
			}
		},
		// onShow() {
		// 	if (uni.getStorageSync('role') == 1) {
		// 		uni.setTabBarItem({
		// 			index: 0,
		// 			pagePath: "/pages/index/enterpriseIndex",
		// 			text: "人才库",
		// 			iconPath: "/static/imgs/tabBar/work.png",
		// 			selectedIconPath: "/static/imgs/tabBar/work01.png"
		// 		})
		// 	}
		// },
		onShow() {
			this.chat_updateReddot();
		},
		onLoad() {
			uni.hideTabBar()
			this.getJobList();
			uni.$on('jobScreenData', e => {
				this.major = e.major;
				this.salary = e.salary;
				this.workExperience = e.workExperience;
				this.teamSize = e.teamSize;
				this.city = '';
				this.keyword = '';
				this.jobList = [];
				this.page = 1;
				this.getJobList();
			});
			uni.$on('searchKeyword', e => {
				this.city = e.city;
				this.keyword = e.keyword;
				this.major = [];
				this.salary = '';
				this.workExperience = [];
				this.teamSize = [];
				this.jobList = [];
				this.page = 1;
				this.getJobList();
			})
		},
		onPullDownRefresh() {
			this.page = 1;
			this.jobList = [];
			this.haveMore = 0;
			this.getJobList();
			uni.stopPullDownRefresh();
		},
		onReachBottom() {
			if (this.haveMore == 0) {
				this.page++;
				this.getJobList();
			}
		},
		methods: {
			// 获取职位列表
			getJobList() {
				let highestSalary = null;
				let lowestSalary = null;
				if (this.salary != '不限' && this.salary != '') {
					if (this.salary.indexOf('以下') != -1) {
						lowestSalary = null;
						highestSalary = this.salary.split('K')[0];
					} else if (this.salary.indexOf('以上') != -1) {
						lowestSalary = this.salary.split('K')[0];
						highestSalary = null;
					} else {
						lowestSalary = this.salary.split('-')[0];
						highestSalary = this.salary.split('-')[1].split('K')[0];
					}
				}

				uni.request({
					url: this.$baseUrl + '/jobSearchList?page=' + this.page + '&pageNum=10',
					method: 'POST',
					header: {
						"content-type": "application/json",
						"token": uni.getStorageSync('token')
					},
					data: {
						city: this.city,
						keyword: this.keyword,
						highestSalary: highestSalary,
						lowestSalary: lowestSalary,
						major: this.major.indexOf('不限') == -1 ? this.major.join('|') : null,
						teamSize: this.teamSize.indexOf('不限') == -1 ? this.teamSize.join('|') : null,
						workExperience: this.workExperience.indexOf('不限') == -1 ? this.workExperience.join('|') :
							null,
					},
					complete: (res) => {
						console.log('职位列表');
						console.log(res);

						if (res.data.data.list.length == 0) {
							this.haveMore = 1;
						} else {
							let data = this.jobList.concat(res.data.data.list);
							this.jobList = data;
						}

						if (this.jobList.length == 0) {
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
	.person-index-container {
		min-height: 100vh;
		background-color: #f3f7fa;

		.top-search {
			padding: 125rpx 30rpx 30rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			background: linear-gradient(to bottom, #5EB7F5, #5EDAF5);

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

		.index-top {
			padding: 20rpx 52rpx;
			background-color: #85dbd0;

			.top-main {
				padding: 20rpx 30rpx;
				display: flex;
				align-items: center;
				background-color: #fff;
				border-radius: 30px;
				font-size: 32rpx;
				color: #c3c3c3;

				image {
					width: 31rpx;
					height: 30rpx;
					margin-right: 20rpx;
				}
			}

			.index-top-input {
				flex: 1;
				font-size: 28rpx;
			}
		}

		.person-index-main {
			margin-top: 28rpx;
			padding: 0 30rpx;

			.main-every {
				margin-bottom: 20rpx;
				padding: 30rpx;
				background-color: #fff;
				box-shadow: 0 6rpx 6rpx -3rpx rgba(147, 169, 182, 0.11);
				border-radius: 20rpx;

				.every-top {
					display: flex;
					justify-content: space-between;
					font-size: 30rpx;
					font-weight: bold;

					.top-name {
						color: #061D4C;

						.top-urg {
							margin-left: 10rpx;
							padding: 0 5rpx;
							font-size: 22rpx;
							border: 2rpx solid #0062CC;
							border-radius: 5rpx;
						}
					}

					.top-money {
						display: flex;
						align-items: center;
						color: #FF4F3E;

						.welfare {
							display: flex;
							align-items: center;

							.circle {
								width: 6rpx;
								height: 6rpx;
								margin: 0 10rpx;
								background-color: #FF4F3E;
								border-radius: 50%;
							}
						}
					}
				}

				.every-second {
					margin-top: 20rpx;
					display: flex;
					flex-wrap: wrap;

					.second-every {
						padding: 11rpx;
						margin-right: 20rpx;
						background-color: rgb(228, 248, 246);
						color: #42CFBC;
						font-size: 20rpx;
						text-align: center;
						border-radius: 6rpx;
						font-weight: bold;
					}
				}

				.second-third {
					margin-top: 20rpx;
					font-size: 24rpx;
					color: #A3B3CC;
				}

				.second-four {
					margin-top: 30rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					font-size: 20rpx;
					color: #98AAC6;

					.four-left {
						display: flex;
						align-items: center;

						.four-img {
							width: 40rpx;
							height: 40rpx;
							border-radius: 50%;
						}

						.four-name {
							margin-left: 9rpx;
							color: #061D4C;
							font-size: 22rpx;
						}
					}
				}
			}
		}
	}
</style>
