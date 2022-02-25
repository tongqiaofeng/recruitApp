<template>
	<view class="commodity">
		<view v-if="haveData == 0" class="no-data">
			<image src="../../static/imgs/common/no.png" mode="aspectFill"></image>
			<text style="font-size: 30rpx">暂无收藏职位，赶紧去收藏心怡的职位吧~</text>
		</view>
		<!-- <view v-else>
			<view class="title">
				<text>{{ "共" + goodsnum + "个职位" }}</text>
				<text style="font-size: 26rpx" @click="isCheckBox">编辑</text>
			</view>
			<checkbox-group @change="checkChange" style="padding-top: 120rpx">
				<view class="commoditybox" v-for="(item, index) in favoriteslist" :key="index">
					<label v-show="isSelect == 1" class="box-check">
						<checkbox :value="item.id" :checked="item.checked" color="#85dbd0"
							style="transform: scale(0.7); border-radius: 50%" />
					</label>
					<view class="box-left" @click="navto(item)">
						<image v-if="item.img" :src="imgUrl + '/' + item.issuerHeadPic" mode="aspectFill">
						</image>
					</view>
					<view class="box-right" @click="navto(item)">
						<view class="name">{{ item.companyName }}</view>
						<view class="price">
							{{item.name}}
						</view>
					</view>
					<view class="delIcon">
						<image src="../../static/imgs/common/delImg.png" mode="aspectFill" @click="bindClick(item)">
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
				<view @click="clickclose">删除</view>
			</view>
		</view> -->
		<view v-else>
			<view class="every" v-for="(item,index) in favoriteslist" :key="index" @longtap="openDelPage(item)"
				@click="goJobDetails(item)">
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
				goodsnum: 0,
				page: 1,
				favoriteslist: [],

				isSelect: 0,
				allFlag: {
					value: "cb",
					checked: false,
				},
				selList: [],

				options: [{
					text: "删除",
					style: {
						backgroundColor: "#dd524d",
					},
				}, ],
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
			// 查看职位详情
			goJobDetails(item) {
				uni.navigateTo({
					url: "../index/jobDetails?jobId=" + item.id
				})
			},
			bindClick(e) {
				console.log(e);
				this.selList = [];
				this.selList.push(e.id);
				this.clickclose();
			},
			// 是否选中
			checkChange(e) {
				console.log("是否选中");
				console.log(e);

				let values = e.detail.value;
				this.selList = [];
				for (let i = 0; i < this.favoriteslist.length; ++i) {
					const item = this.favoriteslist[i];
					if (values.includes(item.id)) {
						this.selList.push(item.id);
						this.$set(item, "checked", true);
					} else {
						this.$set(item, "checked", false);
					}
				}
				//  商品是否全部勾选，判断全选与否状态
				let allChecks = values.length == this.favoriteslist.length;
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
					this.favoriteslist.map((item) => this.$set(item, "checked", false));
					this.$set(this.allFlag, "checked", false);
				} else {
					this.favoriteslist.map((item) => {
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
			// 获取职位收藏列表
			favorites() {
				uni.showLoading({
					title: "加载中...",
				});
				uni.request({
					url: this.$baseUrl + "/favoriteJobList",
					header: {
						"content-type": "application/json",
						token: uni.getStorageSync("token"),
					},
					complete: (res) => {
						uni.hideLoading();

						console.log("职位收藏列表");
						console.log(res);

						this.favoriteslist = res.data.data.list;
						this.goodsnum = res.data.data.total;

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
					url: this.$baseUrl + '/favoriteJobSave',
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
			navto(item) {
				if (this.isSelect == 0) {
					if (item.type == 0) {
						uni.navigateTo({
							url: "../minePackage/details?id=" + item.id,
						});
					} else if (item.type == 1) {
						uni.navigateTo({
							url: "../jewelryPackage/jewelryDetails?id=" + item.id,
						});
					}
				}
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

		// .commoditybox {
		// 	margin-bottom: 40rpx;
		// 	display: flex;
		// 	align-items: center;
		// 	position: relative;
		// 	box-shadow: -1px 5px 10px 2px #f6f6f7;
		// 	border-radius: 30rpx;

		// 	.box-check {
		// 		margin-left: 10rpx;
		// 	}

		// 	.box-left {
		// 		padding: 20rpx 0 20rpx 20rpx;
		// 		display: flex;
		// 		justify-content: center;
		// 		align-items: center;

		// 		image {
		// 			width: 180rpx;
		// 			height: 174rpx;
		// 			border-radius: 30rpx;
		// 		}
		// 	}

		// 	.box-right {
		// 		padding: 25rpx 20rpx 30rpx 20rpx;
		// 		display: flex;
		// 		flex: 1;
		// 		flex-direction: column;
		// 		justify-content: space-between;

		// 		.name {
		// 			margin-bottom: 20rpx;
		// 			font-size: 24rpx;
		// 		}

		// 		.price {
		// 			font-size: 26rpx;
		// 			color: #ff8b62;
		// 		}
		// 	}

		// 	.closeicon {
		// 		position: absolute;
		// 		right: 20rpx;
		// 		bottom: 20rpx;
		// 		color: #ef5b5b;
		// 		font-size: 28rpx;

		// 		image {
		// 			width: 124rpx;
		// 			height: 103rpx;
		// 		}
		// 	}

		// 	.delIcon {
		// 		position: absolute;
		// 		top: 20rpx;
		// 		right: -20rpx;
		// 		color: #ef5b5b;
		// 		font-size: 28rpx;

		// 		image {
		// 			width: 40rpx;
		// 			height: 40rpx;
		// 		}
		// 	}
		// }

		// .bottom {
		// 	padding-bottom: 140rpx;
		// 	font-size: 24rpx;
		// 	color: #e3e3e3;
		// 	text-align: center;
		// 	font-size: 30rpx;
		// }

		// .allCheck {
		// 	height: 100rpx;
		// 	padding: 0 40rpx;
		// 	position: fixed;
		// 	left: 0;
		// 	right: 0;
		// 	bottom: 0;
		// 	display: flex;
		// 	align-items: center;
		// 	justify-content: space-between;
		// 	background-color: #f9f9f9;
		// 	font-size: 28rpx;
		// }
	}
</style>
