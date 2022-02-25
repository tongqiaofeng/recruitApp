<template>
	<view class="achievementContext-container">
		<!-- 项目业绩-->
		<view :style="{ height: height + 'px' }"></view>
		<view class="achievementContext-tab">
			<image src="../../static/imgs/common/back.png" mode="aspectFill" @click="goBack"></image>
			<view class="tab-button" @click="achievementContextSure">保存</view>
		</view>
		<view class="achievementContext-main">
			<view class="main-title">
				项目业绩
			</view>
			<view class="main-input">
				<textarea class="input-style" :placeholder="placeContext" placeholder-style="color: #dadada;"
					:focus="isFocus" v-model="achievementContext" @input="achievementContextInput" />
				<view class="main-total">
					<text style="color: #85dbd0;">{{fontNum}}</text>/300
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
				achievementContext: "",
				isFocus: false,
				fontNum: 0,
				placeContext: "描述您的项目业绩，向Boss展示您的工作能力\n;例如：\n1.项目收益...\n2.我的贡献...\n3.我的收获"
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

			this.achievementContext = option.context;

			this.$nextTick(() => {
				this.isFocus = true;
				this.achievementContextInput();
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
			achievementContextInput() {
				this.fontNum = 300 - this.achievementContext.length;
			},
			// 提交优势
			achievementContextSure() {
				uni.navigateBack({
					delta: 1,
				});
				// 传输的数据
				uni.$emit('achievementContext', this.achievementContext);
			},
		},
	}
</script>

<style lang="scss" scoped>
	.achievementContext-container {
		padding: 0 40rpx;

		.achievementContext-tab {
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

		.achievementContext-main {
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
					content: "line \A line";
					/*  \A 表示换行  */
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
