<template>
	<view class="page-container">
		<!-- 企业认证 -->
		<view class="person-msg-container">
			<!--  :rules="personMsgRules" :modelValue="companyMsgData" -->
			<uni-forms class="msg-main" ref="personMsg">
				<uni-forms-item name="companyName">
					<view class="msg-every">
						<view class="every-title">公司名称</view>
						<input class="every-input" placeholder="请输入公司名称" placeholder-style="color: #dadada;" type="text"
							v-model="companyMsgData.companyName" />
					</view>
				</uni-forms-item>
				<uni-forms-item name="businessPhoto">
					<view class="msg-every">
						<view class="every-title">营业执照</view>
						<view class="instructions-imgs every-input">
							<view class="imgs-upload" @click="uploadImgs">
								<image src="../../static/imgs/common/camera.png" mode="aspectFill"></image>
								<text>上传图片</text>
							</view>
							<view class="imgs-list" v-for="(item,index) in companyMsgData.businessPhoto" :key="index">
								<image v-if="item" :src="imgUrl + '/' + item" mode="aspectFill"></image>
								<view class="img-del" @click="delImg(index)">x</view>
							</view>
						</view>
					</view>
				</uni-forms-item>
				<uni-forms-item>
					<view class="msg-every">
						<view class="every-title">公司地址（省市区）</view>
						<pick-regions @getRegion="handleGetRegion">
							<input class="every-input" placeholder="点击选择公司地址" placeholder-style="color: #dadada;"
								type="text" v-model="companyMsgData.companyAddress.provinces" />
						</pick-regions>
					</view>
				</uni-forms-item>
				<uni-forms-item>
					<view class="msg-every">
						<view class="every-title">详细地址</view>
						<input class="every-input" placeholder="请输入详细地址" placeholder-style="color: #dadada;" type="text"
							v-model="companyMsgData.companyAddress.detail" />
					</view>
				</uni-forms-item>
				<uni-forms-item>
					<view class="msg-every">
						<view class="every-title">团队规模</view>
						<view class="number-input">
							<input class="every-input" style="text-align: center;" placeholder="请输入"
								placeholder-style="color: #dadada;" type="text"
								v-model="companyMsgData.scaleNumber.start" />
							<text> 至 </text>
							<input class="every-input" style="text-align: center;" placeholder="请输入"
								placeholder-style="color: #dadada;" type="text"
								v-model="companyMsgData.scaleNumber.end" />
							<text> 人</text>
						</view>
					</view>
				</uni-forms-item>
			</uni-forms>
			<view class="msg-button" @click="personalDataSubmit">提 交</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.$baseUrl,
				companyMsgData: {
					companyName: "",
					businessPhoto: [],
					companyAddress: {
						provinces: "",
						detail: ""
					},
					scaleNumber: {
						start: "",
						end: ""
					}
				},
				personMsgRules: {
					companyName: {
						rules: [{
							required: true,
							errorMessage: "请输入公司名称"
						}]
					},
					companyAddress: {
						rules: [{
							required: true,
							errorMessage: "请选择公司地址"
						}]
					},
				}
			}
		},
		onLoad() {
			this.getCompanyMsg();
		},
		methods: {
			// 获取公司认证信息
			getCompanyMsg() {
				uni.request({
					url: this.$baseUrl + '/companyAuthMsgGet',
					header: {
						"content-type": "application/json",
						token: uni.getStorageSync("token"),
					},
					complete: (res) => {
						console.log('公司认证信息');
						console.log(res);
						if (res.data.data != null) {
							let msg = res.data.data;
							this.companyMsgData.companyName = msg.companyName;
							if (msg.license !== null && msg.license !== "") {
								if (msg.license.indexOf("|") !== -1) {
									this.companyMsgData.businessPhoto = msg.license.split("|");
								} else {
									this.companyMsgData.businessPhoto.push(msg.license);
								}
							} else {
								this.companyMsgData.businessPhoto = [];
							};
							this.companyMsgData.companyAddress.provinces = msg.companyAddress;
							this.companyMsgData.companyAddress.detail = msg.detailAddress;
							this.companyMsgData.scaleNumber.start = msg.teamSize.split('-')[0];
							this.companyMsgData.scaleNumber.end = msg.teamSize.split('-')[1].split('人')[0];
						}
					}
				})
			},
			// 上传图片
			uploadImgs() {
				uni.chooseImage({
					count: 9,
					success: (ret) => {
						console.log("图片选择成功", ret);
						const tempFilePaths = ret.tempFilePaths;

						let promiseWorkList = [];
						let completeImages = 0;
						let iRight = 0;

						for (let i = 0; i < tempFilePaths.length; i++) {

							promiseWorkList.push(
								new Promise((resolve, reject) => {
									console.log('上传项');
									console.log(tempFilePaths[i]);
									uni.uploadFile({
										url: this.$baseUrl + "/upload",
										fileType: "image",
										filePath: tempFilePaths[i],
										formData: {
											type: 1,
										},
										name: "files",
										header: {
											"content-type": "application/json",
											token: uni.getStorageSync("token")
										},
										success: (res) => {
											console.log('上传成功');
											console.log(res);
											if (res.statusCode === 200) {
												console.log(res.data);
												this.companyMsgData.businessPhoto.push(JSON
													.parse(res.data).data
												);
												completeImages++;

												uni.showToast({
													title: "上传进度：" +
														completeImages +
														"/" +
														tempFilePaths.length,
													icon: "none",
													mask: false,
													duration: 1000,
												});

												++iRight;
												resolve("success to upload image:");
											} else {
												resolve("failt to upload image:");
												uni.showToast({
													title: "图片上传失败",
													icon: "none",
													duration: 2000,
												});
											}
										},
										fail: (res) => {
											resolve("failt to upload image:");
											uni.showToast({
												title: "网络连接失败",
												icon: "none",
												duration: 2000,
											});
										},
									})
								})
							)
						};

						Promise.all(promiseWorkList).then((result) => {
							uni.showToast({
								title: "上传成功" + iRight + "张图片",
								icon: "none",
								duration: 2000,
							});
						});
					},
					fail: (err) => {
						console.log(err);
					},
				});
			},
			// 删除图片
			delImg(index) {
				this.companyMsgData.businessPhoto.splice(index, 1);
			},
			// 选择城市
			handleGetRegion(e) {
				console.log(e);
				this.companyMsgData.companyAddress.provinces = e.map(item => item.name).join(' ');
			},
			// 提交个人信息
			personalDataSubmit() {
				uni.request({
					url: this.$baseUrl + "/companyDataSave",
					method: "POST",
					header: {
						"content-type": "application/json",
						token: uni.getStorageSync("token"),
					},
					data: {
						companyName: this.companyMsgData.companyName,
						companyAddress: this.companyMsgData.companyAddress.provinces,
						detailAddress: this.companyMsgData.companyAddress.detail,
						license: this.companyMsgData.businessPhoto.join('|'),
						teamSize: this.companyMsgData.scaleNumber.start + '-' + this.companyMsgData.scaleNumber
							.end + '人'
					},
					complete: (res) => {
						console.log(res);
						if (res.statusCode === 200) {
							uni.showToast({
								title: "信息提交成功，等待审核",
								icon: "none",
								success: () => {
									uni.switchTab({
										url: "./mine",
									});
								}
							});
						} else {
							uni.showToast({
								title: res.data.data,
								icon: "none",
							});
						}
					},
				})
			}
		},
	}
</script>

<style scoped lang="scss">
	.person-msg-container {
		height: 100vh;
		padding: 0 40rpx;
		padding-bottom: 40rpx;
		background-color: #fff;
		border-top: 2rpx solid #f9f9f9;

		.msg-main {
			padding: 20rpx;

			.msg-every {
				padding-bottom: 20rpx;
				border-bottom: 2rpx solid #f9f9f9;

				.every-title {
					font-size: 26rpx;
					color: #aaa;
				}

				.number-input {
					display: flex;
					align-items: baseline;
				}

				.every-input {
					margin-top: 20rpx;
					font-size: 30rpx;
					color: #000;

					image {
						width: 100rpx;
						height: 100rpx;
						border-radius: 50%;
					}
				}

				.instructions-imgs {
					display: flex;
					flex-wrap: wrap;

					.imgs-upload {
						width: 160rpx;
						height: 160rpx;
						display: flex;
						flex-direction: column;
						justify-content: center;
						text-align: center;
						border: 1px dashed #c3c3c3;

						image {
							width: 64rpx;
							height: 64rpx;
							margin: 0 auto;
						}

						text {
							font-size: 22rpx;
							color: #aaa;
						}
					}

					.imgs-list {
						margin-left: 20rpx;
						margin-bottom: 40rpx;
						position: relative;

						image {
							width: 160rpx;
							height: 160rpx;
							border-radius: 10rpx;
						}

						.img-del {
							position: absolute;
							left: 130rpx;
							top: -20rpx;
							width: 40rpx;
							height: 40rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							border-radius: 50%;
							background-color: #f9f9f9;
							color: #aaa;
							font-size: 28rpx;
						}
					}
				}
			}
		}

		.msg-button {
			padding: 20rpx 0;
			margin: 0 40rpx;
			font-size: 26rpx;
			color: #fff;
			background-color: #85dbd0;
			text-align: center;
			border-radius: 60rpx;
		}
	}
</style>
