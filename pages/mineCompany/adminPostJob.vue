<template>
	<view class="admin-post-job-container">
		<!-- 职位管理 -->
		<view class="admin-post-job-top">
			<navigator url="./jobFilter" hover-class="none">
				<view class="add-job">筛选</view>
			</navigator>
			<navigator url="addPostJob" hover-class="none">
				<view class="add-job">发布职位</view>
			</navigator>
		</view>

		<!--   名字，工作地点， 筛选（证书名称，学历，类型）     求职期望：薪资 -->
		<view class="admin-post-job-main">
			<view v-if="haveData == 0" class="no-data">
				<image src="../../static/imgs/common/no.png" mode="aspectFill"></image>
				<text style="font-size: 30rpx">暂无发布职位~</text>
			</view>
			<view v-else>
				<view class="title">
					<text>{{ "共" + goodsnum + "个职位" }}</text>
					<text style="font-size: 26rpx;" @click="isCheckBox">编辑</text>
				</view>
				<checkbox-group @change="checkChange" style="padding-top: 100rpx;">
					<view class="commoditybox" v-for="(item, index) in jobList" :key="index">
						<label v-show="isSelect == 1" class="box-check">
							<checkbox :value="item.id" :checked="item.checked" color="#85dbd0"
								style="transform: scale(0.7)" />
						</label>
						<navigator :url="'./updatePostJob?data=' + JSON.stringify(item)" hover-class="none"
							style="flex: 1;">
							<view class="box-right">
								<view class="name">{{ item.name + '（' + item.type +'）' }}</view>
								<view class="price">
									{{ item.workLocation + ' ' + item.lowestSalary + '~' + item.highestSalary}}{{item.type == '实习/兼职' ? '元' : 'K'}}
								</view>
							</view>
							<view class="closeicon" v-if="item.status == -1">
								已停止招聘
							</view>
						</navigator>
						<view class="delIcon">
							<image src="../../static/imgs/common/delImg.png" mode="aspectFill"
								@click="bindClick(item.id)">
							</image>
						</view>
					</view>
				</checkbox-group>
				<view class="bottom">没有更多了~</view>
				<view class="allCheck" v-if="isSelect == 1">
					<checkbox-group @change="changeBook">
						<label>
							<view>
								<checkbox color="#85dbd0" style="transform: scale(0.7)" :checked="allFlag.checked"
									:value="allFlag.cb" />
								全选
							</view>
						</label>
					</checkbox-group>
					<view @click="delJob">删除</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				haveData: 1,
				haveMore: 0,
				goodsnum: 0,
				time: [],
				status: null,

				page: 1,
				jobList: [],

				isSelect: 0,
				allFlag: {
					value: "cb",
					checked: false,
				},
				selList: [],

			}
		},
		async onShow() {
			this.page = 1;
			this.jobList = [];
			this.haveMore = 0;
			await uni.$on('jobFilter', (e) => {
				this.time = e.time;
				this.status = e.status;
				this.page = 1;
				this.jobList = [];
				this.haveMore = 0;
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
			// 单个删除
			bindClick(e) {
				console.log(e);
				this.selList = [];
				this.selList.push(e);
				this.delJob();
			},
			// 是否选中
			checkChange(e) {
				console.log("是否选中");
				console.log(e);

				let values = e.detail.value;
				this.selList = values;
				for (let i = 0; i < this.jobList.length; ++i) {
					const item = this.jobList[i];
					if (values.includes(item.id)) {
						this.$set(item, "checked", true);
					} else {
						this.$set(item, "checked", false);
					}
				}
				//  商品是否全部勾选，判断全选与否状态
				let allChecks = values.length == this.jobList.length;
				allChecks
					?
					this.$set(this.allFlag, "checked", true) :
					this.$set(this.allFlag, "checked", false);
			},
			// 全选或者反选 checkbox
			changeBook(e) {
				console.log("全选否");
				console.log(e);
				this.selList = [];
				if (e.detail.value.length == 0) {
					this.jobList.map((item) => this.$set(item, "checked", false));
					this.$set(this.allFlag, "checked", false);
				} else {
					this.jobList.map((item) => {
						this.$set(item, "checked", true);
						this.selList.push(item.id);
					});
					this.$set(this.allFlag, "checked", true);
				}
				console.log(this.selList);
			},
			// 是否显示多选框
			isCheckBox() {
				if (this.isSelect == 0) {
					this.isSelect = 1;
				} else if (this.isSelect == 1) {
					this.isSelect = 0;
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
		background-color: #fff;

		.admin-post-job-top {
			height: 100rpx;
			padding: 0 40rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			position: fixed;
			top: var(--window-top);
			left: 0;
			right: 0;
			background-color: #fff;
			z-index: 1;

			.add-job {
				width: 100rpx;
				padding: 10rpx 30rpx;
				background-color: #85dbd0;
				color: #fff;
				font-size: 24rpx;
				border-radius: 10rpx;
				text-align: center;
			}
		}

		.popup-container {
			min-height: 300rpx;
			padding: 40rpx;
			background-color: #fff;
		}

		.admin-post-job-main {
			margin-top: 80rpx;
			padding: 0 40rpx;

			.main-every {
				margin-bottom: 20rpx;
				position: relative;
			}

			.title {
				height: 80rpx;
				padding: 0 40rpx;
				position: fixed;
				top: var(--window-top)+80;
				left: 0;
				right: 0;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 22rpx;
				background-color: #fff;
				z-index: 1;
			}

			.commoditybox {
				margin-bottom: 60rpx;
				display: flex;
				align-items: center;
				position: relative;
				box-shadow: -1px 5px 10px 2px #f6f6f7;
				border-radius: 30rpx;

				.box-check {
					margin-left: 10rpx;
				}

				.box-left {
					width: 180rpx;
					height: 174rpx;
					padding: 20rpx 0 20rpx 20rpx;
					display: flex;
					justify-content: center;
					align-items: center;

					image {
						width: 100%;
						height: 100%;
						border-radius: 30rpx;
					}
				}

				.box-right {
					padding: 25rpx 20rpx 30rpx 40rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					.name {
						margin-bottom: 20rpx;
						font-size: 24rpx;
					}

					.price {
						font-size: 26rpx;
						color: #ff8b62;
					}
				}

				.closeicon {
					position: absolute;
					right: 20rpx;
					bottom: 20rpx;
					color: #ef5b5b;
					font-size: 28rpx;

					image {
						width: 124rpx;
						height: 103rpx;
					}
				}

				.delIcon {
					position: absolute;
					top: 20rpx;
					right: -20rpx;
					color: #ef5b5b;
					font-size: 28rpx;

					image {
						width: 40rpx;
						height: 40rpx;
					}
				}
			}

			.bottom {
				padding-bottom: 140rpx;
				font-size: 24rpx;
				color: #e3e3e3;
				text-align: center;
				font-size: 30rpx
			}

			.allCheck {
				height: 100rpx;
				padding: 0 40rpx;
				position: fixed;
				left: 0;
				right: 0;
				bottom: 0;
				display: flex;
				align-items: center;
				justify-content: space-between;
				background-color: #f9f9f9;
				font-size: 28rpx;
			}
		}
	}
</style>
