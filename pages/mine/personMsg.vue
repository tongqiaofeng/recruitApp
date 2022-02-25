<template>
	<view class="page-container">
		<!-- 个人信息 -->
		<!-- 个人信息及企业认证分别为个人和企业的模块，个人涉及在线简历（包括证书等的上传），企业涉及发布职位等 -->
		<view class="person-msg-container">
			<uni-forms class="msg-main" ref="personMsg" :rules="personMsgRules" :modelValue="personMsgData">
				<uni-forms-item name="idNumber">
					<view class="msg-every">
						<!-- <text style="margin-right: 4rpx;color: red;">*</text> -->
						<view class="every-title">身份证号</view>
						<input class="every-input" placeholder="请输入身份证号" placeholder-style="color: #dadada;" type="text"
							v-model="personMsgData.idNumber" @change="idNumChange" />
					</view>
				</uni-forms-item>
				<uni-forms-item name="age">
					<view class="msg-every">
						<view class="every-title">年龄</view>
						<input class="every-input" placeholder="请输入年龄" placeholder-style="color: #dadada;" type="text"
							v-model="personMsgData.age" />
					</view>
				</uni-forms-item>
				<uni-forms-item name="joinWorkTime">
					<view class="msg-every">
						<view class="every-title">参加工作时间</view>
						<!-- <uni-datetime-picker class="every-input" type="date" :border="false" :clear-icon="false"
							v-model="personMsgData.joinWorkTime" /> -->
						<picker mode="date" fields="month" @change="workTimeChange">
							<input class="every-input" placeholder="点击选择时间" placeholder-style="color: #dadada;"
								type="text" v-model="personMsgData.joinWorkTime" />
						</picker>
					</view>
				</uni-forms-item>
				<uni-forms-item name="city">
					<view class="msg-every">
						<view class="every-title">现居住城市</view>
						<pick-regions @getRegion="handleGetRegion">
							<input class="every-input" placeholder="点击选择居住城市" placeholder-style="color: #dadada;"
								type="text" v-model="personMsgData.city" />
						</pick-regions>
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
				personMsgData: {
					idNumber: "",
					age: "",
					joinWorkTime: "",
					city: "",
				},
				personMsgRules: {
					idNumner: {
						rules: [{
							required: true,
							errorMessage: "请输入身份证号"
						}]
					},
					joinWorkTime: {
						rules: [{
							required: true,
							errorMessage: "请选择参加工作时间"
						}]
					},
					city: {
						rules: [{
							required: true,
							errorMessage: "请选择居住城市"
						}]
					},
				}
			}
		},
		onShow() {
			this.personMsgData.idNumber = uni.getStorageSync('idNumber');
			this.personMsgData.joinWorkTime = uni.getStorageSync('joinWorkTime');
			this.personMsgData.city = uni.getStorageSync('city');
			if(this.personMsgData.idNumber.length > 0){
				this.idNumChange();
			}
		},
		methods: {
			// 根据身份证号计算年龄
			idNumChange() {
				let myDate = new Date();
				let month = myDate.getMonth() + 1;
				let day = myDate.getDate();
				let age = myDate.getFullYear() - this.personMsgData.idNumber.substring(6, 10) - 1;
				if (this.personMsgData.idNumber.substring(10, 12) < month || this.personMsgData.idNumber.substring(10,
						12) == month && this.personMsgData.idNumber.substring(12,
						14) <= day) {
					age++;
				};
				this.personMsgData.age = age;
			},
			// 参加工作时间
			workTimeChange(e) {
				console.log(e);
				this.personMsgData.joinWorkTime = e.detail.value;
			},
			// 选择城市
			handleGetRegion(e) {
				console.log(e);
				this.personMsgData.city = e.map(item => item.name).join(' ');
			},
			// 提交个人信息
			personalDataSubmit() {
				uni.request({
					url: this.$baseUrl + "/personalDataSave",
					method: "POST",
					header: {
						"content-type": "application/json",
						token: uni.getStorageSync("token"),
					},
					data: {
						idCard: this.personMsgData.idNumber,
						age: this.personMsgData.age,
						joinWorkTime: this.personMsgData.joinWorkTime,
						residentialCity: this.personMsgData.city
					},
					complete: (res) => {
						console.log(res);
						if (res.statusCode === 200) {
							uni.showToast({
								title: "信息提交成功",
								icon: "none",
								success: () => {
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
