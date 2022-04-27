<template>
	<view class="return-type-container">
		<!-- 选择认证类型 -->
		<navigator url="./personMsg" hover-class="none">
			<view class="return-type-every person">
				<view class="left-main">
					<view class="main-top">
						<text>个人认证</text>
					</view>
					<view class="main-bottom">
						<text>职场牛人</text>
					</view>
				</view>
			</view>
		</navigator>
		<navigator url="./companyMsg" hover-class="none">
			<view class="return-type-every company">
				<view class="left-main">
					<view class="main-top">
						<text>企业认证</text>
					</view>
					<view class="main-bottom">
						<text>企业BOSS</text>
					</view>
				</view>
			</view>
		</navigator>
	</view>
</template>

<style lang="scss" scoped>
	.return-type-container {
		padding: 10rpx 30rpx 0;
		border-top: 10rpx solid #EFF6FF;

		.person {
			background: url(../../static/imgs/mine/person.png);
			background-size: 100% 100%;
		}

		.company {
			background: url(../../static/imgs/mine/company.png);
			background-size: 100% 100%;
		}

		.return-type-every {
			padding: 36rpx 0 30rpx;
			margin-bottom: 20rpx;

			.left-main {
				margin-left: 124rpx;
				color: #fff;

				.main-top {
					font-size: 30rpx;
					font-weight: bold;
				}

				.main-bottom {
					margin-top: 15rpx;
					font-size: 20rpx;
					font-weight: bold;
				}
			}
		}
	}
</style>
