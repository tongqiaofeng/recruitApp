<template>
	<view class="return-type-container">
		<!-- 选择认证类型 -->
		<navigator url="./personMsg" hover-class="none">
			<view class="return-type-every">
				<view class="every-left">
					<image class="left-img" src="../../static/imgs/mine/right.png" mode="aspectFill"></image>
					<view class="left-main">
						<view class="main-top">
							<text>个人认证</text>
						</view>
						<view class="main-bottom">
							<text>职场牛人</text>
						</view>
					</view>
				</view>
				<view class="every-right">
					<image src="../../static/imgs/common/right.png" mode="aspectFill"></image>
				</view>
			</view>
		</navigator>
		<navigator url="./companyMsg" hover-class="none">
			<view class="return-type-every">
				<view class="every-left">
					<image class="left-img" src="../../static/imgs/mine/right.png" mode="aspectFill"></image>
					<view class="left-main">
						<view class="main-top">
							<text>企业认证</text>
						</view>
						<view class="main-bottom">
							<text>企业BOSS</text>
						</view>
					</view>
				</view>
				<view class="every-right">
					<image src="../../static/imgs/common/right.png" mode="aspectFill"></image>
				</view>
			</view>
		</navigator>
	</view>
</template>

<style lang="scss" scoped>
	.return-type-container {
		height: 100vh;
		padding-top: 10rpx;
		background-color: #f9f9f9;

		.return-type-every {
			margin: 40rpx;
			padding: 50rpx 30rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			background-color: #fff;
			border-radius: 10rpx;

			.every-left {
				display: flex;

				.left-img {
					width: 44rpx;
					height: 44rpx;
				}

				.left-main {
					margin-left: 40rpx;

					.main-top {
						font-size: 32rpx;
					}

					.main-bottom {
						margin-top: 20rpx;
						font-size: 24rpx;
						color: #c3c3c3;
					}
				}
			}

			.every-right {
				image {
					width: 32rpx;
					height: 32rpx;
				}
			}
		}
	}
</style>
