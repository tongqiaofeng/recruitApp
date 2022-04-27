<template>
	<view class="add-project-history-container">
		<!-- 添加资格证书 -->
		<view class="add-project-every">
			<view class="every-title">证书名称</view>
			<picker mode="selector" :range="certificateNameList" @change="certificateChange">
				<input class="every-input" placeholder="请选择" placeholder-style="color: #dadada;" type="text"
					v-model="addCertificate.certificateName" />
			</picker>
		</view>
		<view class="add-project-every">
			<view class="every-title">证书图片</view>
			<view class="instructions-imgs every-input">
				<view class="imgs-upload" @click="uploadImgs">
					<image src="../../static/imgs/common/camera.png" mode="aspectFill"></image>
					<text>上传图片</text>
				</view>
				<view class="imgs-list" v-for="(item,index) in addCertificate.certificateImg" :key="index">
					<image v-if="item" :src="imgUrl + '/' + item" mode="aspectFill"></image>
					<view class="img-del" @click="delImg(index)">x</view>
				</view>
			</view>
		</view>
		<view class="add-project-button" @click="addProjectSave">保存</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.$baseUrl,
				addCertificate: {
					certificateName: "",
					certificateImg: []
				},
				certificateNameList: [],
			}
		},
		onLoad() {
			this.getCertificateList();
		},
		methods: {
			// 证书名称
			certificateChange(e) {
				console.log(e);
				this.addCertificate.certificateName = this.certificateNameList[Number(e.detail.value)];
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
											type: 2,
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
												this.addCertificate.certificateImg.push(
													JSON
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
				this.addCertificate.certificateImg.splice(index, 1);
			},
			// 保存
			addProjectSave() {
				uni.$emit('addCertificate', this.addCertificate);
				uni.navigateBack({
					delta: 1
				})
			},
			// 获取证书列表
			getCertificateList() {
				uni.request({
					url: this.$baseUrl + '/certificateList',
					method: 'POST',
					complete: (res) => {
						console.log('证书列表');
						console.log(res);
						this.certificateNameList = res.data.data.map(item => item.name);
					}
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.add-project-history-container {
		padding: 0 40rpx;

		.add-project-every {
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
