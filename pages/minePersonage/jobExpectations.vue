<template>
	<view class="job-expectation-container">
		<!-- 求职期望 -->
		<view class="expectation-title">求职期望的不同，推荐的职位也会不同</view>
		<view class="expectation-main-one">
			<text class="one-type">求职类型</text>
			<view class="one-type-sel">
				<view class="sel-left" @click="typeSelect('全职')"
					:style="{backgroundColor: expectationData.type == '全职' ? '#85dbd0' : '#fff',color: expectationData.type == '全职' ? '#fff' : '#85dbd0'}">
					全职</view>
				<view class="sel-right" @click="typeSelect('兼职')"
					:style="{backgroundColor: expectationData.type == '兼职' ? '#85dbd0' : '#fff',color: expectationData.type == '兼职' ? '#fff' : '#85dbd0'}">
					兼职</view>
			</view>
		</view>
		<navigator :url="'../common/city?cityNow=' + expectationData.city" hover-class="none">
			<view class="expectation-main-every">
				<text class="every-title">工作城市</text>
				<view class="every-context">
					<input class="every-input" placeholder="选择工作城市" placeholder-style="color: #dadada;" type="text"
						v-model="expectationData.city" />
					<image class="right-img" src="../../static/imgs/common/right.png" mode="aspectFill"></image>
				</view>
			</view>
		</navigator>
		<view class="expectation-main-every">
			<view class="every-title">期望薪资</view>
			<view class="every-context" style="display: flex;">
				<view style="display: flex;">
					<input class="every-input" style="text-align: center;" placeholder="最低薪资"
						placeholder-style="color: #dadada;" type="text" v-model="expectationData.lowestSalary" />
					<text>{{expectationData.type == 1 ? '元' : 'K'}}</text>
				</view>
				<view style="display: flex;">
					<input class="every-input" style="text-align: center;" placeholder="最高薪资"
						placeholder-style="color: #dadada;" type="text" v-model="expectationData.highestSalary" />
					<text>{{expectationData.type == 1 ? '元' : 'K'}}</text>
				</view>
			</view>
		</view>
		<view class="expectation-button" @click="expectationSave">保存</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				expectationData: {
					type: '全职',
					city: "成都",
					lowestSalary: "",
					highestSalary: ""
				}

			}
		},
		onLoad(option) {
			console.log('44444444444444');
			console.log(option);
			let data = JSON.parse(option.context);
			this.expectationData.type = data.type;
			this.expectationData.city = data.city;
			this.expectationData.lowestSalary = data.lowestSalary;
			this.expectationData.highestSalary = data.highestSalary;
			// 城市
			uni.$on('selCity', (e) => {
				console.log('选中的城市值');
				console.log(e);
				this.expectationData.city = e;
			});
		},
		methods: {
			// 选择求职类型
			typeSelect(num) {
				this.expectationData.type = num;
			},
			// 保存
			expectationSave() {
				uni.$emit('expectData', this.expectationData);
				uni.navigateBack({
					delta: 1
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
	.job-expectation-container {
		padding: 0 40rpx;

		.expectation-title {
			padding-top: 20rpx;
			font-size: 26rpx;
			color: #808080;
		}

		.expectation-main-one {
			margin-top: 60rpx;
			padding-bottom: 40rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 4rpx solid #f9f9f9;

			.one-type {
				font-size: 36rpx;
			}

			.one-type-sel {
				display: flex;

				.sel-left,
				.sel-right {
					padding: 20rpx 40rpx;
					border: 2rpx solid #85dbd0;
					font-size: 24rpx;
				}

				.sel-left {
					border-top-left-radius: 10rpx;
					border-bottom-left-radius: 10rpx;
				}

				.sel-right {
					border-top-right-radius: 10rpx;
					border-bottom-right-radius: 10rpx;
				}
			}
		}

		.expectation-main-every {
			padding: 40rpx 0;
			border-bottom: 4rpx solid #f9f9f9;

			.every-title {
				font-size: 24rpx;
				color: #808080;
			}

			.every-context {
				margin-top: 20rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.every-input {
					font-size: 30rpx;
					color: #000;
				}

				.right-img {
					width: 32rpx;
					height: 32rpx;
				}
			}
		}

		.expectation-button {
			padding: 20rpx;
			position: absolute;
			left: 40rpx;
			right: 40rpx;
			bottom: 60rpx;
			background-color: #85dbd0;
			border-radius: 12rpx;
			color: #fff;
			font-size: 24rpx;
			text-align: center;
		}
	}
</style>
