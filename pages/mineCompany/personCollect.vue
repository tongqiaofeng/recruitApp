<template>
	<view class="commodity">
		<view v-if="haveData == 0" class="no-data">
			<image src="../../static/imgs/common/no.png" mode="aspectFill"></image>
			<text style="font-size: 30rpx">暂无收藏人才，赶紧去收藏心怡的人才吧~</text>
		</view>
		<view v-else>
			<view class="every" v-for="(item,index) in favoriteslist" :key="index" @longtap="openDelPage(item)"
				@click="goUserDetails(item)">
				<view class="every-one">
					<view class="one-left">
						{{item.name}}
					</view>
					<view class="one-right">
						{{item.lowestSalary+ '-'+item.highestSalary}}{{item.type == '实习/兼职' ? '元' : 'K'}}
						<view class="right-con" v-if="item.welfare">
							<view class="circle"></view>
							{{item.welfare + '薪'}}
						</view>
					</view>
				</view>
				<view class="every-two">
					{{item.companyName}}
				</view>
				<view class="every-three">
					<view class="three">
						{{item.workLocation}}
					</view>
					<view class="three">
						{{item.workExperience}}
					</view>
					<view class="three">
						{{item.major}}
					</view>
				</view>
				<view class="every-four">
					<image class="four-img" :src="imgUrl + '/' + item.issuerHeadPic" mode="aspectFill"></image>
					<view class="four-name">
						{{item.issuerFullName}}
					</view>
				</view>
			</view>
			<uni-popup ref="delPopup" type="center">
				<view class="del-popup-container">
					<view class="popup-title">
						温馨提示
					</view>
					<view class="popup-main">
						确认对“{{selName}}”取消感兴趣吗 ？
					</view>
					<view class="popup-button">
						<view class="cancle" @click="cancleDel">
							取消
						</view>
						<view class="sure" @click="sureDel">
							确定
						</view>
					</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.$baseUrl,
				haveData: 1,
				page: 1,
				favoriteslist: [],

				selList: [],

				selName: '',
				
			};
		},
		onLoad() {
			this.favorites();
		},
		onPullDownRefresh() {
			this.favoriteslist = [];
			this.favorites();
			uni.stopPullDownRefresh();
		},
		methods: {
			// 取消
			cancleDel(){
				this.$refs.delPopup.close();
			},
			// 确定
			sureDel(){
				this.clickclose();
				this.$refs.delPopup.close();
			},
			// 长按打开删除页面
			openDelPage(item) {
				console.log(item);
				this.selList = [];
				this.selList.push(item.id);
				this.selName = item.name;
				this.$refs.delPopup.open();
			},
			// 查看人才详情
			goUserDetails(item) {
				uni.navigateTo({
					url: "../index/userDetails?userId=" + item.id
				})
			},

			// 获取人才收藏列表
			favorites() {
				uni.showLoading({
					title: "加载中...",
				});
				uni.request({
					url: this.$baseUrl + "/favoritePersonList",
					header: {
						"content-type": "application/json",
						token: uni.getStorageSync("token"),
					},
					complete: (res) => {
						uni.hideLoading();

						console.log("人才收藏列表");
						console.log(res);

						this.favoriteslist = res.data.data.list;

						if (this.favoriteslist.length == 0) {
							this.haveData = 0;
						} else {
							this.haveData = 1;
						}
					},
				});
			},
			// 删除
			clickclose() {
				console.log(this.selList);
				uni.request({
					method: "POST",
					url: this.$baseUrl + '/favoritePersonSave',
					data: {
						jobIdList: this.selList,
					},
					header: {
						"content-type": "application/json",
						token: uni.getStorageSync("token"),
					},
					success: (res) => {
						console.log(res.data);
						this.selList = [];
						this.favoriteslist = [];
						uni.showToast({
							title: "删除成功",
							icon: "none",
						});
						this.favorites();
					},
					fail: (err) => {
						uni.showToast({
							title: err.data.message,
							icon: "none",
						});
					},
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.commodity {
		padding: 0 40rpx 0 40rpx;
		background-color: #fff;
		position: relative;

		.title {
			height: 100rpx;
			padding: 0 40rpx;
			position: fixed;
			left: 0;
			right: 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 22rpx;
			background-color: #fff;
			z-index: 999;
		}

		.every {
			padding: 20rpx 0;
			border-bottom: 2rpx solid #ccc;

			.every-one {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.one-left {
					font-size: 36rpx;
					font-weight: bold;
				}

				.one-right {
					display: flex;
					align-items: center;
					color: #85dbd0;
					font-size: 30rpx;
					font-weight: bold;

					.right-con {
						display: flex;
						align-items: center;

						.circle {
							width: 6rpx;
							height: 6rpx;
							margin: 0 5rpx;
							background-color: #85dbd0;
							border-radius: 50%;
						}
					}
				}
			}

			.every-two {
				margin-top: 10rpx;
				text-align: left;
				color: #A9A5A0;
				font-size: 24rpx;
			}

			.every-three {
				margin-top: 20rpx;
				display: flex;

				.three {
					padding: 10rpx;
					margin-right: 10rpx;
					background-color: #f9f9f9;
					font-size: 22rpx;
					color: #A9A5A0;
				}
			}

			.every-four {
				margin-top: 20rpx;
				display: flex;
				align-items: center;

				.four-img {
					width: 60rpx;
					height: 60rpx;
					margin-right: 20rpx;
					border-radius: 50%;
				}

				.four-name {
					font-size: 22rpx;
					color: #A9A5A0;
				}
			}
		}

		.del-popup-container {
			width: 580rpx;
			margin: 0 auto;
			padding: 40rpx;
			background-color: #fff;
			border-radius: 10rpx;
			text-align: left;

			.popup-title {
				font-size: 38rpx;
				font-weight: bold;
			}
			
			.popup-main{
				margin-top: 40rpx;
				color: #A9A5A0;
				font-size: 24rpx;
			}
			
			.popup-button{
				margin-top: 80rpx;
				display: flex;
				justify-content: flex-end;
				font-size: 30rpx;
				font-weight: bold;
				
				.cancle{
					color: #A9A5A0;
				}
				
				.sure{
					margin-left: 80rpx;
					color: #85dbd0;
				}
			}
		}
	}
</style>
