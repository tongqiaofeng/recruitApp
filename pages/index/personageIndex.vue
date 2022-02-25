<template>
	<view class="person-index-container">
		<!-- 个人首页 -->
		<view class="index-top" style="padding-top: 60rpx;">
			<navigator url="../search/jobSearch" hover-class="none">
				<view class="top-main">
					<image src="../../static/imgs/common/search.png" mode="aspectFill"></image>
					<view class="index-top-input"> 搜索商品 </view>
				</view>
			</navigator>
		</view>
		<view class="index-top">
			<navigator url="../search/jobScreen" hover-class="none">
				<view class="index-top-input" style="text-align: right;"> 筛选 </view>
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
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.$baseUrl,
				haveData: 1,
				haveMore: 0,
				page: 1,
				jobList: [],
				city: "",
				keyword: "",
				major: [],
				salary: "",
				workExperience: [],
				teamSize: [],

			}
		},
		onShow() {
			let role = uni.getStorageSync("role");
			console.log(role);
			if (role == 1) {
				uni.setTabBarItem({
					index: 0,
					text: "人才库",
					pagePath: "/pages/index/enterpriseIndex",
					success: (res) => {
						console.log(res);
						uni.switchTab({
							url: './enterpriseIndex',
							success: (ret) => {
								console.log(ret)
							}
						});
					}
				})
			} else {
				this.getJobList();
			}
		},
		onLoad() {
			uni.$on('jobScreenData', e => {
				this.major = e.major;
				this.salary = e.salary;
				this.workExperience = e.workExperience;
				this.teamSize = e.teamSize;
				this.city = '';
				this.keyword = '';
				this.getJobList();
			});
			uni.$on('searchKeyword', e => {
				this.city = e.city;
				this.keyword = e.keyword;
				this.major = [];
				this.salary = '';
				this.workExperience = [];
				this.teamSize = [];
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
		background-color: #f1f1f1;

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
			padding-bottom: 40rpx;

			.main-every {
				margin-bottom: 20rpx;
				padding: 40rpx;
				background-color: #fff;

				.every-top {
					display: flex;
					justify-content: space-between;
					font-size: 32rpx;
					font-weight: bold;

					.top-name {

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
						color: #85dbd0;

						.welfare {
							display: flex;
							align-items: center;

							.circle {
								width: 6rpx;
								height: 6rpx;
								margin: 0 10rpx;
								background-color: #85DBD0;
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
						padding: 10rpx 20rpx;
						margin-right: 20rpx;
						background-color: #f1f1f1;
						color: #A9A5A0;
						font-size: 22rpx;
						text-align: center;
					}
				}

				.second-third {
					margin-top: 20rpx;
					font-size: 28rpx;
					color: #0E151D;
				}

				.second-four {
					margin-top: 30rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					font-size: 26rpx;
					color: #c3c3c3;

					.four-left {
						display: flex;
						align-items: center;

						.four-img {
							width: 60rpx;
							height: 60rpx;
							border-radius: 50%;
						}

						.four-name {
							margin-left: 20rpx;
							color: #0E151D;
						}
					}
				}
			}
		}
	}
</style>
