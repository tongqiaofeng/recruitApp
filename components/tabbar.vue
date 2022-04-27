<template>
	<view class="uni-tabbar">
		<view class="uni-tabbar__item" v-for="(item,index) in tabbar" :key="index" @tap="changeTab(item)">
			<!-- <view class="icon" :class="[item.fontIcon , item.pagePath == pagePath?'uni-active':'']"></view> -->
			<!-- 上面使用的是字体图标，解决切换页面的时候图标会闪的效果，毕竟每切换一个页面都会闪一下不太好看，可以切换使用下面的图片方式 -->
			<view class="uni-tabbar__bd">
				<view class="uni-tabbar__icon">
					<image class="uni-w-42" mode="aspectFit"
						:src="item.pagePath == pagePath ? item.selectedIconPath : item.iconPath"></image>
					</image>
				</view>
			</view>
			<view class="red-circle" v-if="bRed == true && item.text=='消息'"></view>
			<view class="uni-tabbar__label" :class="{'active': item.pagePath == pagePath}">
				{{item.text}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			pagePath: null
		},
		data() {
			return {
				page: null,
				tabbar: getApp().globalData.tabBarList,
				bRed: getApp().globalData.isRed
			};
		},
		onShow() {
			this.bRed = getApp().globalData.isRed;
		},
		methods: {
			changeTab(item) {
				this.page = item.pagePath; // 这里使用reLaunch关闭所有的页面，打开新的栏目页面
				// uni.reLaunch({
				// 	url: this.page
				// });
				uni.switchTab({
					url: this.page
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	[nvue] uni-scroll-view,
	[nvue] uni-swiper-item,
	[nvue] uni-view {
		flex-direction: unset;
	}

	[nvue-dir-column] uni-swiper-item,
	[nvue-dir-column] uni-view {
		flex-direction: unset;
	}

	.uni-tabbar {
		position: fixed;
		bottom: 0;
		z-index: 999;
		width: 100%;
		display: flex;
		justify-content: space-around;
		height: 100rpx;
		padding: 10rpx 0 20rpx;
		box-sizing: border-box;
		border-top: solid 2rpx #ccc;
		background-color: #fff;
		box-shadow: 0px 0px 17upx 1upx rgba(206, 206, 206, 0.32);

		.uni-tabbar__item {
			display: block;
			text-align: center;
			position: relative;
		}

		.red-circle {
			width: 16rpx;
			height: 16rpx;
			position: absolute;
			top: -8rpx;
			right: -14rpx;
			background-color: red;
			border-radius: 50%;
		}

		.uni-tabbar__icon {
			height: 42upx;
			text-align: center;

			.uni-w-42 {
				width: 46rpx;
				height: 46rpx;
			}
		}

		.icon {
			display: inline-block;
		}

		.uni-tabbar__label {
			margin-top: 11rpx;
			font-size: 20rpx;
			color: #7a7a7a;

			&.active {
				color: #5EB7F5;
			}
		}
	}
</style>
