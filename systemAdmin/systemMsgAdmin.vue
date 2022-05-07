<template>
	<view class="admin-post-job-container">
		<view class="admin-post-job-add">
			<navigator url="systemMsgAdd" hover-class="none">
				<image class="add-img" src="/static/imgs/mine/add.png" mode="aspectFill"></image>
			</navigator>
		</view>
		
		<view v-if="haveData == 0" class="no-data">
			<image src="/static/imgs/common/no.png" mode="aspectFill"></image>
			<text style="font-size: 30rpx">暂无系统消息~</text>
		</view>
		<view v-else>
			<view class="title">
				<text>{{ "共" + goodsnum + "条消息" }}</text>
			</view>
			
			<view class="bottom">没有更多了~</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				haveData: 0,
				haveMore: 0,
				goodsnum: 0,
				time: [],

				page: 1,
				msgList: [],
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
			this.getMsgList();
		},
		onPullDownRefresh() {
			uni.showLoading({
				title: "正在刷新",
			});
			this.page = 1;
			this.msgList = [];
			this.haveMore = 0;

			this.getMsgList();
			uni.stopPullDownRefresh();
		},
		onReachBottom() {
			if (this.haveMore == 0) {
				this.page++;
				this.getMsgList();
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
						this.msgList = [];
						uni.showToast({
							title: "删除成功",
							icon: "none",
						});
						this.getMsgList();
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
			getMsgList() {
				// uni.request({
				// 	url: this.$baseUrl + '/companyReleasemsgList?page=' + this.page + '&pageNum=10',
				// 	method: 'POST',
				// 	header: {
				// 		"content-type": "application/json",
				// 		token: uni.getStorageSync("token"),
				// 	},
				// 	data: {
				// 		startTime: this.time[0],
				// 		endTime: this.time[1],
				// 		status: this.status == '招聘中' ? 0 : (this.status == '已停止招聘' ? -1 : null)
				// 	},
				// 	complete: (res) => {
				// 		console.log('职位列表');
				// 		console.log(res);
				// 		this.goodsnum = res.data.data.total;

				// 		if (res.data.data.list.length == 0) {
				// 			this.haveMore = 1;
				// 		} else {
				// 			let data = this.msgList.concat(res.data.data.list);
				// 			this.msgList = data;
				// 		}

				// 		if (this.msgList.length == 0) {
				// 			this.haveData = 0;
				// 		} else {
				// 			this.haveData = 1;
				// 		}
				// 	}
				// })
			}
		},
	}
</script>

<style lang="scss" scoped>
	.admin-post-job-container {
		min-height: 100vh;
		padding: 0 30rpx;
		background-color: #f6f9ff;

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
