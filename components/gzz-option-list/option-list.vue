<template>
	<view class="list-box">
		<view v-for="(item,index) in dataList" :key="index" class="item"
			:style="{'background-color': item.top == 1 ? '#f1f1f1' : '#fff'}" @tap="tap(item)"
			@touchstart="touchstart(item,$event)" @touchmove="touchmove" @touchend="touchend()">
			<view class="option-box">
				<view v-for="oItem in options" :key="oItem.text">
					<view v-if="item.top == 0 && oItem.text == '置顶'" class="option-item"
						@tap.stop="optionClick(item,oItem)"
						:style="{ color: oItem.color || '#ffffff',width: oItem.width ? oItem.width + 'rpx' : '100rpx',backgroundColor: oItem.bgColor || '#409EFF'}">
						{{ oItem.text }}
					</view>
					<view v-else-if="item.top == 1 && oItem.text == '取消置顶'" class="option-item"
						@tap.stop="optionClick(item,oItem)"
						:style="{ color: oItem.color || '#ffffff',width: oItem.width ? oItem.width + 'rpx' : '100rpx',backgroundColor: oItem.bgColor || '#409EFF'}">
						{{ oItem.text }}
					</view>
					<view v-if="oItem.text == '删除'" class="option-item" @tap.stop="optionClick(item,oItem)"
						:style="{ color: oItem.color || '#ffffff',width: oItem.width ? oItem.width + 'rpx' : '100rpx',backgroundColor: oItem.bgColor || '#409EFF'}">
						{{ oItem.text }}
					</view>
				</view>
			</view>
			<view class="item-container"
				:style="{ 
					transform: item.transformVal,transition: item.transitionVal,'background-color': item.top == 1 ? '#f1f1f1' : '#fff' }">
				<view class="user-list">
					<view class="user">
						<view>
							<image class="head"
								:src="item.head_pic ? baseFileUrl + '/' + item.head_pic : '../../static/imgs/mine/avatar.png'"
								mode="aspectFill"></image>
						</view>
						<view class="user-main">
							<view style="display: flex; justify-content: space-between">
								<view class="name">{{
				        item.username ? item.username : "Huser" + item.userId
				      }}</view>
								<view class="time">{{
				        formatTime(item.time)
				      }}</view>
							</view>
							<view class="msg-and-num">
								<view class="msg">
									{{ item.contentType == 0 ? item.contentText : "[图片]" }}
								</view>
								<view class="num" v-show="item.num > 0">
									<view class="num-red" v-if="item.num < 6">
										{{item.num}}
									</view>
									<view class="num-coll" v-else>
										<view class="circle"></view>
										<view class="circle"></view>
										<view class="circle"></view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import $Time from "@/common/free-lib/time.js";
	export default {
		props: {
			list: {
				type: Array,
				default: () => ([])
			},
			options: {
				type: Array,
				default: () => ([])
			},
			threshold: {
				type: [Number],
				default: 50
			}
		},
		data() {
			return {
				baseFileUrl: this.$baseUrl,
				dataList: [],
				dragTargetX: 0,
				offsetWidth: 0,
				activeItem: null,
				translateX: 0,
			}
		},
		watch: {
			list: {
				immediate: true,
				deep: true,
				handler(list) {
					this.setList(list)
				}
			}
		},
		methods: {
			formatTime(value) {
				return $Time.gettime(value);
			},
			touchstart(item, e) {
				if (this.translateX != 0 && this.activeItem.item_id != item.item_id) {
					this.tap();
				}
				this.dragTargetX = e.touches[0].pageX;
				this.activeItem = item;
				if (!this.offsetWidth) {
					const res = uni.getSystemInfoSync();
					let screenWidth = res.screenWidth;
					this.offsetWidth = 0;
					this.options.forEach(item => {
						this.offsetWidth += screenWidth / 750 * item.width;
					})

				}
			},
			touchmove(e) {
				let newX = e.touches[0].pageX;
				let d = newX - this.dragTargetX;

				if ((this.translateX < -this.offsetWidth && d < 0) || (this.translateX > 0 && d > 0)) {
					if (this.translateX > 0) {
						d = d * 1 / this.translateX;
					} else {
						d = d * 1 / (Math.abs(this.translateX) - this.offsetWidth);
					}
				}

				this.translateX += d;
				this.setBounceTransition(true);

				this.dragTargetX = newX;
			},
			touchend() {
				if (this.translateX >= 0 || Math.abs(this.translateX) < this.threshold) {
					this.translateX = 0;
					this.setBounceTransition();
				} else {
					this.translateX = -this.offsetWidth;
					this.setBounceTransition();
				}
			},
			tap(item) {
				this.translateX = 0;
				this.setBounceTransition();
				this.$emit('click', item)
			},
			setBounceTransition(flag) {
				if (flag) {
					this.activeItem.transitionVal = 'none';
				} else {
					this.activeItem.transitionVal = 'all 0.4s cubic-bezier(.62,1.69,.7,1)';
				}
				this.activeItem.transformVal = 'translateX(' + this.translateX + 'px)';
			},
			setList(list) {
				this.dataList = [];
				this.dataList = list.map((item, index) => {
					return {
						...item,
						transformVal: '',
						transitionVal: '',
						item_id: index
					}
				});
				console.log(this.dataList)
			},
			optionClick(item, oitem) {
				this.translateX = 0;
				this.setBounceTransition();
				this.$emit("optionClick", item, oitem);
			},
		}
	}
</script>

<style lang="scss" scoped>
	.list-box {
		width: 100%;

		.item {
			width: 100%;
			background-color: #ffffff;
			position: relative;

			.item-container {
				width: 100%;
				height: 100%;
				position: relative;
				// background-color: #ffffff;
			}

			.option-box {
				height: 100%;
				position: absolute;
				top: 0;
				right: 0;
				display: flex;

				.option-item {
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 28rpx;
				}
			}
		}

		.user-list {
			padding: 20rpx 30rpx;

			.user {
				display: flex;
				align-items: center;

				.head {
					width: 100rpx;
					height: 100rpx;
					margin-right: 30rpx;
					border-radius: 80rpx;
				}

				.user-main {
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: space-around;

					.name {
						font-size: 28rpx;
						color: #061D4C;
						font-weight: bold;
					}

					.time {
						font-size: 22rpx;
						color: #516483;
					}

					.msg {
						font-size: 22rpx;
						color: #97A9C6;
					}

					.msg-and-num {
						margin-top: 12rpx;
						display: flex;
						justify-content: space-between;

						.num {
							margin-top: -8rpx;

							.num-red {
								width: 36rpx;
								height: 36rpx;
								line-height: 36rpx;
								text-align: center;
								background-color: #FF4533;
								color: #fff;
								font-size: 24rpx;
								border-radius: 50%;
							}

							.num-coll {
								width: 64rpx;
								height: 36rpx;
								display: flex;
								align-items: center;
								justify-content: center;
								background-color: #C1CEE3;
								border-radius: 18rpx;

								.circle {
									width: 4rpx;
									height: 4rpx;
									margin: 0 4rpx;
									background-color: #fff;
									border-radius: 50%;
								}
							}
						}
					}
				}
			}
		}
	}
</style>
