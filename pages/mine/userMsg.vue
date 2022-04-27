<template>
	<!-- 个人信息 -->
	<view class="person-msg-container">
		<uni-forms ref="userMsg" :rules="userMsgRules" :modelValue="userMsgData">
			<uni-forms-item name="headPic">
				<view class="msg-every" style="display: flex;justify-content: space-between;align-items: center;">
					<view class="every-title">
						<text>头像</text>
						<view class="head-pic-hont">
							！上传真实头像更容易赢得好感哦
						</view>
					</view>
					<view v-if="userMsgData.headPic" class="head-pic" @click="uploadClick">
						<image :src="imgUrl+'/'+userMsgData.headPic" mode="aspectFill"></image>
					</view>
					<view v-else class="head-pic" @click="uploadClick">
						<image src="../../static/imgs/mine/avatar.png" mode="aspectFill"></image>
					</view>
				</view>
			</uni-forms-item>
			<uni-forms-item name="name">
				<view class="msg-every">
					<view class="every-title">姓名</view>
					<input class="every-input" placeholder="请输入姓名" placeholder-style="color: #506383;" type="text"
						v-model="userMsgData.name" />
				</view>
			</uni-forms-item>
			<uni-forms-item name="sex">
				<view class="msg-every">
					<view class="every-title">性别</view>
					<radio-group class="every-input" v-model="userMsgData.sex" @change="sexChange">
						<label>
							<radio value="男" style="transform:scale(0.6)" color="#5E97F5"
								:checked="userMsgData.sex == '男' ? true : false" /><text>男</text>
						</label>
						<label style="margin-left: 30rpx;">
							<radio value="女" style="transform:scale(0.6)" color="#5E97F5"
								:checked="userMsgData.sex == '女' ? true : false" /><text>女</text>
						</label>
					</radio-group>
				</view>
			</uni-forms-item>
		</uni-forms>
		<view class="msg-button" @click="personalDataSubmit">提 交</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.$baseUrl,
				userMsgData: {
					headPic: '',
					name: "",
					sex: "男"
				},
				userMsgRules: {
					name: {
						rules: [{
							required: true,
							errorMessage: "请输入姓名"
						}]
					}
				}
			}
		},
		onShow() {
			this.userMsgData.headPic = uni.getStorageSync('headPic');
			this.userMsgData.name = uni.getStorageSync('fullName');
			this.userMsgData.sex = uni.getStorageSync('sex');
			console.log(this.userMsgData.sex)
		},
		methods: {
			// 上传头像
			uploadClick() {
				uni.chooseImage({
					count: 1,
					sizeType: ["original", "compressed"], //指定是原图还是压缩图，默认二者都有
					sourceType: ["album"], //从相册选择
					success: (res) => {
						console.log("成功", res);
						const tempFilePaths = res.tempFilePaths;

						uni.uploadFile({
							url: this.$baseUrl + "/upload", //post请求的地址
							fileType: "image",
							filePath: tempFilePaths[0],
							formData: {
								type: 0,
							},
							name: "files",
							header: {
								"content-type": "application/json",
								token: uni.getStorageSync("token"),
							},
							complete: (ret) => {
								console.log(ret);
								if (ret.statusCode === 200) {
									this.userMsgData.headPic = JSON.parse(ret.data).data;
									uni.showToast({
										title: "头像上传成功",
										icon: "none",
									});
								} else {
									uni.showToast({
										title: JSON.parse(ret.data).data,
									});
								}
							},
						});
					},
					fail: (err) => {
						console.log(err);
					},
				});
			},
			// 性别变化
			sexChange(e) {
				console.log(e);
				this.userMsgData.sex = e.detail.value;
				console.log(this.userMsgData.sex);
			},
			// 提交个人信息
			personalDataSubmit() {
				uni.request({
					url: this.$baseUrl + "/basicMsgSave",
					method: "POST",
					header: {
						"content-type": "application/json",
						token: uni.getStorageSync("token"),
					},
					data: {
						headPic: this.userMsgData.headPic,
						fullName: this.userMsgData.name,
						sex: this.userMsgData.sex
					},
					complete: (res) => {
						console.log(res);
						if (res.statusCode === 200) {
							uni.showToast({
								title: "信息提交成功",
								icon: "none",
								success: (ret) => {
									this.getUserInfo();
									this.$isResolve();

									uni.switchTab({
										url: "./mine",
									});
								}
							});
						} else {
							uni.showToast({
								title: res.data.message,
							});
						}
					},
				})
			}
		},
	}
</script>
<style lang="scss">
	.uni-forms-item__inner {
		padding-bottom: 30rpx !important;
	}
</style>
<style scoped lang="scss">
	.person-msg-container {
		padding: 0 30rpx;
		padding-top: 30rpx;
		background-color: #fff;
		border-top: 10rpx solid #EFF6FF;

		.msg-every {
			padding-bottom: 30rpx;
			border-bottom: 2rpx solid #EFF6FF;

			.every-title {
				font-size: 30rpx;
				font-weight: bold;
				color: #061D4C;

				.head-pic-hont {
					margin-top: 19rpx;
					color: #FCA039;
					font-size: 20rpx;
				}
			}

			.head-pic {
				flex: 1;
				text-align: right;

				image {
					width: 120rpx;
					height: 120rpx;
					border-radius: 50%;
				}
			}

			.every-input {
				margin-top: 19rpx;
				font-size: 26rpx;
				color: #506383;
			}
		}

		.msg-button {
			padding: 31rpx 0;
			position: absolute;
			bottom: 80rpx;
			left: 30rpx;
			right: 30rpx;
			font-size: 30rpx;
			color: #fff;
			background: linear-gradient(to bottom, #5EDAF5, #5EB7F5);
			text-align: center;
			border-radius: 45rpx;
		}
	}
</style>
