<template>
	<view class="job-details-container">
		<!-- 职位详情 -->
		<view class="container-top">
			<view class="top-left">
				<image @click="goList" class="top-left-img" src="../../static/imgs/common/back.png" mode="aspectFill">
				</image>
				<text>{{jobDetails.name}}</text>
			</view>
			<view class="top-right">
				<image class="index-img" :src="jobDetails.isCollect == 0 ? collect : collect1" mode="aspectFill"
					@click="isFavorite">
				</image>
			</view>
		</view>
		<view class="container-main">
			<view class="main-title">
				<view class="title-left">
					{{jobDetails.name}}
				</view>
				<view class="title-right">
					{{jobDetails.lowestSalary + '-' + jobDetails.highestSalary}}
					{{jobDetails.type == '实习/兼职' ? '元' : 'K'}}
				</view>
			</view>
			<view class="main-addr">
				<view class="addr">
					{{jobDetails.workLocation}}
				</view>
				<view class="year">
					{{jobDetails.workExperience+'年'}}
				</view>
				<view class="major">
					{{jobDetails.major}}
				</view>
			</view>
			<view class="line"></view>
			<navigator :url="'../message/chat?id=' + jobDetails.userId + '&name=' + jobDetails.issuerFullName + '&headPic=' + jobDetails.issuerHeadPic" hover-class="none">
				<view class="main-people">
					<view class="people-left">
						<image class="headpic" v-if="jobDetails.issuerHeadPic"
							:src="imgUrl + '/' + jobDetails.issuerHeadPic" mode="aspectFill"></image>
						<view class="msg">
							<view class="name">
								{{jobDetails.issuerFullName}}
							</view>
							<view class="company">
								{{jobDetails.companyName}}
							</view>
						</view>
					</view>
					<image class="right" src="../../static/imgs/common/right.png" mode="aspectFill"></image>
				</view>
			</navigator>
			<view class="line"></view>
			<view class="main-container">
				<view class="title">
					职位详情
				</view>
				<view class="keyword">
					<view class="keyword-every" v-for="(item,index) in keywordList" :key="index">
						{{item}}
					</view>
				</view>
				<view class="details" v-if="jobDetails.details != '' && jobDetails.details != null">
					<view v-for="(item,index) in jobDetails.details.split('\n')" :key="index">
						{{item}}
					</view>
				</view>
			</view>
			<view class="line"></view>
			<view class="company-msg">
				<view>
					<view>
						{{jobDetails.companyName}}
					</view>
					<view class="size">
						{{jobDetails.teamSize}}
					</view>
				</view>
				<image class="right" src="../../static/imgs/common/right.png" mode="aspectFill"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.$baseUrl,
				collect: require("../../static/imgs/index/not.png"),
				collect1: require("../../static/imgs/index/yes.png"),
				detailsId: null,
				jobDetails: {},
				keywordList: [],

			}
		},
		onLoad(option) {
			this.detailsId = option.jobId;
			this.getJobMsg();
		},
		methods: {
			// 收藏/取消收藏职位
			isFavorite() {
				let list = [];
				list.push(this.detailsId);
				uni.request({
					url: this.$baseUrl + '/favoriteJobSave',
					method: 'POST',
					data: {
						jobIdList: list
					},
					header: {
						"content-type": "application/json",
						token: uni.getStorageSync("token"),
					},
					complete: (res) => {
						console.log('收藏/取消收藏');
						console.log(res);

						if (this.checkBack(res, true) == false) return;
						else {
							this.getJobMsg();
						}
					}
				})
			},
			// 获取职位详情
			getJobMsg() {
				uni.request({
					url: this.$baseUrl + "/jobInfo?id=" + this.detailsId,
					header: {
						"content-type": "application/json",
						token: uni.getStorageSync("token"),
					},
					complete: (res) => {
						console.log("职位信息");
						console.log(res);
						if (res.data.code === 200) {
							this.jobDetails = res.data.data;
							if (this.jobDetails.keyword !== '' && this.jobDetails.keyword !== null) {
								if (this.jobDetails.keyword.indexOf('，') != -1) {
									this.keywordList = this.jobDetails.keyword.split('，');
								} else {
									this.keywordList.push(this.jobDetails.keyword)
								}
							} else {
								this.keywordList = [];
							};
						}
					},
				});
			},
			// 返回上一层
			goList() {
				uni.navigateBack({
					delta: 1
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
	.job-details-container {
		padding: 60rpx 40rpx;
		background-color: #fff;

		.container-top {
			padding: 40rpx;
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			display: flex;
			justify-content: space-between;

			.top-left {
				display: flex;
				align-items: center;
				font-size: 30rpx;
				color: #061D4C;
				
				.top-left-img {
					width: 17rpx;
					height: 30rpx;
					margin-right: 30rpx;
				}
			}

			.top-right {
				width: 80rpx;
				height: 80rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				background: linear-gradient(to bottom, #5EDAF5, #5EB7F5);
				border-radius: 50%;
				
				.index-img {
					width: 48rpx;
					height: 46rpx;
				}
			}
		}

		.container-main {
			padding: 80rpx 40rpx 60rpx;

			.main-title {
				display: flex;
				justify-content: space-between;

				.title-left {
					flex: 1;
					flex-wrap: wrap;
					font-size: 38rpx;
				}

				.title-right {
					color: #85dbd0;
					font-size: 26rpx;
				}
			}

			.main-addr {
				margin-top: 20rpx;
				display: flex;
				justify-content: space-between;

				.addr,
				.year,
				.major {
					font-size: 24rpx;
				}
			}

			.line {
				width: 100%;
				height: 2rpx;
				margin: 40rpx 0;
				background-color: #f9f9f9;
			}

			.right {
				width: 32rpx;
				height: 32rpx;
			}

			.main-people {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.people-left {
					display: flex;

					.headpic {
						width: 80rpx;
						height: 80rpx;
						margin-right: 20rpx;
						border-radius: 50%;
					}

					.msg {
						display: flex;
						flex-direction: column;
						justify-content: space-around;

						.name,
						.company {
							font-size: 22rpx;
						}
					}
				}
			}

			.main-container {
				.title {
					font-size: 32rpx;
					font-weight: bold;
				}

				.keyword {
					margin-top: 20rpx;
					display: flex;
					justify-content: flex-start;
					flex-wrap: wrap;

					.keyword-every {
						padding: 10rpx 20rpx;
						margin-right: 10rpx;
						background-color: #f9f9f9;
						color: #A9A5A0;
						font-size: 20rpx;
					}
				}

				.details {
					margin-top: 20rpx;
					font-size: 28rpx;
					color: #A9A5A0;
					line-height: 44rpx;
					letter-spacing: 1px;
				}
			}

			.company-msg {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 28rpx;

				.size {
					margin-top: 20rpx;
				}
			}
		}
	}
</style>
