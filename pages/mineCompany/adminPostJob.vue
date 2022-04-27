<template>
	<view class="admin-post-job-container">
		<view class="admin-post-job-header">
			<image class="header-left" src="../../static/imgs/common/back.png" mode="aspectFill" @click="goBack">
			</image>
			<view class="header-title">
				职位管理
			</view>
			<navigator url="./jobFilter" hover-class="none">
				<image class="header-right" src="../../static/imgs/common/filter.png" mode="aspectFill"></image>
			</navigator>
		</view>
		<view class="admin-post-job-add">
			<navigator url="addPostJob" hover-class="none">
				<image class="add-img" src="../../static/imgs/mine/add.png" mode="aspectFill"></image>
			</navigator>
		</view>
		<!--   名字，工作地点， 筛选（证书名称，学历，类型）     求职期望：薪资 -->
		<view v-if="haveData == 0" class="no-data">
			<image src="../../static/imgs/common/no.png" mode="aspectFill"></image>
			<text style="font-size: 30rpx">暂无发布职位~</text>
		</view>
		<view v-else>
			<view class="title">
				<text>{{ "共" + goodsnum + "个职位" }}</text>
			</view>
			<slide-list :list="jobList" :threshold="threshold" @click="rowClick" @optionClick="optionClick"
				:options="options">
			</slide-list>
			<view class="bottom">没有更多了~</view>
		</view>
	</view>
</template>

<script>
	import slideList from '@/components/left-slide/left-slide-list.vue';
	export default {
		components: {
			slideList
		},
		data() {
			return {
				haveData: 1,
				haveMore: 0,
				goodsnum: 0,
				time: [],
				status: null,

				page: 1,
				jobList: [],

				selList: [],

				options: [ //左滑的操作列表
					{
						color: '#ffffff', //字体颜色，非必须，默认 #ffffff
						bgColor: '#FF4533', //背景颜色，非必须，默认 #409EFF
						text: '删除', //展示文字
						width: 120, //按钮宽度 默认120rpx 适合两个字的宽度 这个宽度按需调整
					}
				],
				threshold: 50,
			}
		},
		onLoad() {
			uni.$on('jobFilter', (e) => {
				this.time = e.time;
				this.status = e.status;
				this.page = 1;
				this.jobList = [];
				this.haveMore = 0;
				this.getJobList();
			});
			uni.$on('updateJob', () => {
				this.page = 1;
				this.jobList = [];
				this.haveMore = 0;
				this.getJobList();
			})

			this.getJobList();
		},
		onPullDownRefresh() {
			uni.showLoading({
				title: "正在刷新",
			});
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
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			rowClick(item) {
				console.log('点击某一行');
				console.log(item);
				if (item) {
					uni.navigateTo({
						url: './updatePostJob?data=' + JSON.stringify(item)
					})
				}
			},
			optionClick(item, oitem) {
				console.log('点击某个操作按钮');
				console.log(item, oitem)
				if (oitem.text == '删除') {
					this.selList = [];
					this.selList.push(item.id);
					console.log(this.selList);
					this.delJob();
				}
			},
			// 删除职位
			delJob() {
				uni.request({
					url: this.$baseUrl + '/jobDelete',
					method: 'POST',
					header: {
						"content-type": "application/json",
						token: uni.getStorageSync("token"),
					},
					data: {
						idList: this.selList
					},
					success: (res) => {
						console.log(res.data);
						this.jobList = [];
						uni.showToast({
							title: "删除成功",
							icon: "none",
						});
						this.getJobList();
					},
					fail: (err) => {
						uni.showToast({
							title: err.data.data,
							icon: "none",
						});
					},
				})
			},
			// 获取职位列表
			getJobList() {
				uni.request({
					url: this.$baseUrl + '/companyReleaseJobList?page=' + this.page + '&pageNum=10',
					method: 'POST',
					header: {
						"content-type": "application/json",
						token: uni.getStorageSync("token"),
					},
					data: {
						startTime: this.time[0],
						endTime: this.time[1],
						status: this.status == '招聘中' ? 0 : (this.status == '已停止招聘' ? -1 : null)
					},
					complete: (res) => {
						console.log('职位列表');
						console.log(res);
						this.goodsnum = res.data.data.total;

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
			}
		},
	}
</script>

<style lang="scss" scoped>
	.admin-post-job-container {
		min-height: 100vh;
		padding: 0 30rpx;
		background-color: #f6f9ff;

		.admin-post-job-header {
			padding-top: 90rpx;
			display: flex;
			justify-content: space-between;

			.header-left {
				width: 17rpx;
				height: 30rpx;
			}

			.header-title {
				font-size: 30rpx;
				color: #061D4C;
				font-weight: bold;
			}

			.header-right {
				width: 27rpx;
				height: 30rpx;
			}
		}

		.admin-post-job-add {
			position: fixed;
			bottom: 92rpx;
			right: 43rpx;
			z-index: 1;

			.add-img {
				width: 110rpx;
				height: 110rpx;
			}
		}

		.title {
			margin-top: 49rpx;
			font-size: 22rpx;
			color: #A3B3CC;
		}

		.bottom {
			padding-bottom: 40rpx;
			font-size: 24rpx;
			color: #e3e3e3;
			text-align: center;
			font-size: 30rpx
		}
	}
</style>
