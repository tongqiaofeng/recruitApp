<template>
	<view class="system-msg-add-container">
		<!-- 添加系统消息 -->
		<view class="add-msg-every">
			<view class="every-title">标题</view>
			<input class="every-input" placeholder="请输入" placeholder-style="color: #dadada;" type="text"
				v-model="addMsgData.title" />
		</view>
		<view class="add-msg-every">
			<view class="every-title">内容</view>
			<textarea class="every-input" placeholder="请输入" placeholder-style="color: #dadada;"
				v-model="addMsgData.content" />
		</view>
		<view class="add-project-button" @click="postMsgClick">发布</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				addMsgData: {
					title: '',
					content: ''
				}
			}
		},
		methods: {
			// 发布系统消息
			postMsgClick() {
				if (this.addMsgData.title == '' || this.addMsgData.content == '') {
					uni.showToast({
						icon: null,
						title: '请填写信息'
					})
				} else {
					uni.request({
						url: '',
						method: "POST",
						data: {},
						complete: (res) => {
							console.log('发布系统消息');
							console.log(res);
						}
					})
				}
			},
		},
	}
</script>

<style lang="scss" scoped>
	.system-msg-add-container {
		padding: 0 40rpx;
		padding-bottom: 60rpx;

		.add-msg-every {
			padding: 40rpx 0;
			border-bottom: 4rpx solid #f9f9f9;

			.every-title {
				font-size: 26rpx;
				color: #000;
			}

			.every-input {
				margin-top: 20rpx;
				font-size: 30rpx;
				color: #000;
			}
		}

		.add-project-button {
			padding: 20rpx;
			margin-top: 120rpx;
			font-size: 30rpx;
			color: #fff;
			background: linear-gradient(to bottom, #5EDAF5, #5EB7F5);
			text-align: center;
			border-radius: 45rpx;
		}
	}
</style>
