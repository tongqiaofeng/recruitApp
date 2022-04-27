<template>
	<view class="admin-post-job-main">
		<view v-for="(item,index) in dataList" :key="index" class="commoditybox" @tap="tap(item)"
			@touchstart="touchstart(item,$event)" @touchmove="touchmove" @touchend="touchend()">
			<view class="option-box">
				<view v-for="oItem in options" :key="oItem.text" class="option-item" @tap.stop="optionClick(item,oItem)"
					:style="{ color: oItem.color || '#ffffff',
								  width: oItem.width?oItem.width+'rpx': '100rpx',
								  backgroundColor: oItem.bgColor || '#409EFF'}">{{ oItem.text }}</view>
			</view>
			<view class="item-container" :style="{ 
					transform: item.transformVal,transition: item.transitionVal }">
				<view class="every-top">
					<view class="closeicon">
						{{item.status == -1 ? '已停止招聘' : '正在招聘'}}
					</view>
					<view class="top-img"></view>
				</view>
				<view class="every-main">
					<view class="name">
						<text class="title">职位：</text>
						<text>{{ item.name + '（' + item.type +'）' }}</text>
					</view>
					<view class="name">
						<text class="title">地点：</text>
						<text>{{ item.workLocation}}</text>
					</view>
					<view class="name">
						<text class="title">薪资：</text>
						<text
							style="color: #FF4F3E;">{{ item.lowestSalary + '~' + item.highestSalary}}{{item.type == '实习/兼职' ? '元' : 'K'}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
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
				})
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
	.admin-post-job-main {
		margin-top: 10rpx;

		.commoditybox {
			width: 100%;
			margin-bottom: 20rpx;
			box-shadow: -1px 5px 10px 2px #f6f6f7;
			border-radius: 20rpx;
			background-color: #fff;
			position: relative;

			.every-top {
				padding: 38rpx 39rpx 30rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 2rpx solid #F6F9FF;

				.closeicon {
					font-weight: bold;
					color: #A3B3CC;
					font-size: 30rpx;
				}

				.top-img {
					display: inline-block;
					width: 12rpx;
					height: 12rpx;
					border-top: 2rpx solid #061D4C;
					border-right: 2rpx solid #061D4C;
					transform: rotate(45deg);
				}
			}

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

			.every-main {
				padding: 25rpx 20rpx 30rpx 40rpx;

				.name {
					margin-bottom: 29rpx;
					font-size: 30rpx;
					font-weight: bold;
					color: #061D4C;

					.title {
						color: #A3B3CC;
						font-size: 24rpx;
					}
				}
			}
		}
	}

	.item-container {
		width: 100%;
		height: 100%;
		position: relative;
		background-color: #ffffff;
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
			font-size: 34rpx;
		}
	}
</style>
