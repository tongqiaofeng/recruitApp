<template>
	<view class="jobContext-container">
		<!-- 工作内容 -->
		<view :style="{ height: height + 'px' }"></view>
		<view class="jobContext-tab">
			<image src="../../static/imgs/common/back.png" mode="aspectFill" @click="goBack"></image>
			<view class="tab-button" @click="jobContextSure">确定</view>
		</view>
		<view class="jobContext-main">
			<view class="main-title">
				工作内容
			</view>
			<view class="main-input">
				<textarea class="input-style" placeholder="等待输入内容" placeholder-style="color: #dadada;" :focus="isFocus"
					v-model="jobContext" @input="jobContextInput" />
				<view class="main-total">
					<text style="color: #85dbd0;">{{fontNum}}</text>/1600
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				height: null,
				jobContext: "",
				isFocus: false,
				fontNum: 0
			}
		},
		onLoad(option) {
			// 获取手机状态栏高度
			uni.getSystemInfo({
				success: (data) => {
					// 将其赋值给this
					this.height = data.statusBarHeight + 30;
					console.log(this.height)
				},
			});

			this.jobContext = option.context;

			this.$nextTick(() => {
				this.isFocus = true;
				this.jobContextInput();
			})
		},
		methods: {
			// 返回上一层
			goBack() {
				uni.navigateBack({
					delta: 1,
				});
			},
			// 计算字数
			jobContextInput() {
				this.fontNum = 1600 - this.jobContext.length;
			},
			// 提交优势
			jobContextSure() {
				uni.navigateBack({
					delta: 1,
				});
				// 传输的数据
				uni.$emit('jobContext', this.jobContext);
			},
		},
	}
</script>

<style lang="scss" scoped>
	.jobContext-container {
		padding: 0 40rpx;

		.jobContext-tab {
			padding: 30rpx 0;
			display: flex;
			justify-content: space-between;

			image {
				width: 17rpx;
				height: 30rpx;
			}

			.tab-button {
				font-size: 24rpx;
			}
		}

		.jobContext-main {
			padding-top: 60rpx;

			.main-title {
				font-size: 40rpx;
				font-weight: bold;
			}

			.main-input {
				margin-top: 40rpx;

				.input-style {
					font-size: 30rpx;
					color: #808080;
				}

				.main-total {
					display: flex;
					justify-content: flex-end;
					font-size: 24rpx;
				}
			}
		}
	}
</style>
