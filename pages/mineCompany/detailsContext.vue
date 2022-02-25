<template>
	<view class="descContext-container">
		<!-- 职位详情 -->
		<view :style="{ height: height + 'px' }"></view>
		<view class="descContext-tab">
			<image src="../../static/imgs/common/back.png" mode="aspectFill" @click="goBack"></image>
			<view class="tab-button" @click="descContextSure">保存</view>
		</view>
		<view class="descContext-main">
			<view class="main-title">
				职位详情
			</view>
			<view class="main-input">
				<textarea class="input-style" :placeholder="placeContext" placeholder-style="color: #dadada;"
					:focus="isFocus" v-model="descContext" @input="descContextInput" />
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
				descContext: "",
				isFocus: false,
				fontNum: 0,
				placeContext: "描述对于该职位的具体要求"
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

			this.descContext = option.context;

			this.$nextTick(() => {
				this.isFocus = true;
				this.descContextInput();
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
			descContextInput() {
				this.fontNum = 1600 - this.descContext.length;
			},
			// 提交优势
			descContextSure() {
				uni.navigateBack({
					delta: 1,
				});
				// 传输的数据
				uni.$emit('detailsContext', this.descContext);
			},
		},
	}
</script>

<style lang="scss" scoped>
	.descContext-container {
		padding: 0 40rpx;

		.descContext-tab {
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

		.descContext-main {
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

				textarea::-webkit-input-placeholder:after {
					display: block;
					content: "line \A line";/*  \A 表示换行  */
					color: red;
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
