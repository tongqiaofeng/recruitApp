<template>
	<view class="post-job-container">
		<!-- 发布职位 -->
		<view class="add-project-every">
			<view class="every-title">职位类型</view>
			<picker mode="selector" :range="typeList" @change="typeChange">
				<input class="every-input" placeholder="请选择" placeholder-style="color: #dadada;" type="text"
					v-model="postJobData.type" />
			</picker>
		</view>
		<view class="add-project-every">
			<view class="every-title">职位名称</view>
			<input class="every-input" placeholder="请输入" placeholder-style="color: #dadada;" type="text"
				v-model="postJobData.name" />
		</view>
		<view class="add-project-every">
			<view class="every-title">工作地点</view>
			<input class="every-input" placeholder="请输入" placeholder-style="color: #dadada;" type="text"
				v-model="postJobData.workLocation" />
		</view>
		<view class="add-project-every">
			<view class="every-title">薪资范围</view>
			<view class="every-input" style="display: flex;">
				<view style="display: flex;">
					<input style="text-align: center;" placeholder="最低薪资" placeholder-style="color: #dadada;"
						type="text" v-model="postJobData.lowestSalary" />
					<text>{{postJobData.type == '实习/兼职' ? '元' : 'K'}}</text>
				</view>
				<text style="margin: 0 20rpx;">~</text>
				<view style="display: flex;">
					<input style="text-align: center;" placeholder="最高薪资" placeholder-style="color: #dadada;"
						type="text" v-model="postJobData.highestSalary" />
					<text>{{postJobData.type == '实习/兼职' ? '元' : 'K'}}</text>
				</view>
				<view style="display: flex;">
					<input style="text-align: center;" placeholder="请输入" placeholder-style="color: #dadada;"
						type="text" v-model="postJobData.welfare" />
					<text>薪</text>
				</view>
			</view>
		</view>
		<view class="add-project-every">
			<view class="every-title">结算类型</view>
			<radio-group class="every-input" v-model="postJobData.settleType" @change="settleChange">
				<label>
					<radio value="天" style="transform:scale(0.7)"
						:checked="postJobData.settleType == '天' ? true : false" /><text>天</text>
				</label>
				<label style="margin-left: 30rpx;">
					<radio value="月" style="transform:scale(0.7)"
						:checked="postJobData.settleType == '月' ? true : false" /><text>月</text>
				</label>
			</radio-group>
		</view>
		<view class="add-project-every">
			<view class="every-title">最低学历</view>
			<picker mode="selector" :range="majorList" @change="majorChange">
				<input class="every-input" placeholder="请选择" placeholder-style="color: #dadada;" type="text"
					v-model="postJobData.major" />
			</picker>
		</view>
		<view class="add-project-every">
			<view class="every-title">工作经验</view>
			<view class="every-input" style="display: flex;">
				<view style="display: flex;">
					<input style="text-align: center;" placeholder="最低年限" placeholder-style="color: #dadada;"
						type="text" v-model="postJobData.workExperienceLower" />
					<text>年</text>
				</view>
				<view style="display: flex;">
					<input style="text-align: center;" placeholder="最高年限" placeholder-style="color: #dadada;"
						type="text" v-model="postJobData.workExperienceHigh" />
					<text>年</text>
				</view>
			</view>
		</view>
		<view class="add-project-every">
			<view class="every-title">关键字/主题词</view>
			<input class="every-input" placeholder="福利待遇/技术要求关键字,多个用,隔开" placeholder-style="color: #dadada;" type="text"
				v-model="postJobData.keywords" />
		</view>
		<view class="add-project-every">
			<view class="every-title">是否为急聘</view>
			<switch class="every-input" style="transform:scale(0.7)" :checked="false" @change="isUrgentChange" />
		</view>
		<view class="add-project-every">
			<view class="every-title">详情</view>
			<navigator :url="'./detailsContext?context=' + postJobData.details" hover-class="none">
				<view class="every-input" style="color: #dadada;" v-if="postJobData.details.length == 0">请输入
				</view>
				<view class="every-input every-textarea" v-else>
					{{postJobData.details}}
				</view>
			</navigator>
		</view>
		<view class="add-project-button" @click="postJobClick">发布</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				postJobData: {
					type: "",
					name: "",
					workLocation: "",
					lowestSalary: "",
					highestSalary: "",
					major: "",
					settleType: '月',
					workExperienceLower: "",
					workExperienceHigh: "",
					keywords: "",
					welfare: "",
					isUrgent: false,
					details: ""
				},
				typeList: ['实习/兼职', '社招全职', '校招/应届'],
				majorList: ['初中及以下', '中专/中技', '高中', '大专', '本科', '硕士', '博士'],
			}
		},
		onLoad() {
			// 详情
			uni.$on('detailsContext', (e) => {
				console.log(e);
				this.postJobData.details = e;
			});
		},
		methods: {
			// 职位类型
			typeChange(e) {
				console.log(e);
				this.postJobData.type = this.typeList[Number(e.detail.value)];
			},
			// 薪资范围
			salaryClick() {
				this.$refs.popupSalary.open();
			},
			// 结算类型
			settleChange(e) {
				console.log(e);
				this.postJobData.settleType = e.detail.value;
			},
			// 最低学历
			majorChange(e) {
				this.postJobData.major = this.majorList[Number(e.detail.value)];
			},
			// 是否为急聘
			isUrgentChange(e) {
				console.log(e);
				this.postJobData.isUrgent = e.detail.value;
			},
			// 保存
			postJobClick() {
				uni.request({
					url: this.$baseUrl + '/jobMsgSave',
					method: 'POST',
					header: {
						"content-type": "application/json",
						token: uni.getStorageSync("token"),
					},
					data: {
						type: this.postJobData.type,
						name: this.postJobData.name,
						workLocation: this.postJobData.workLocation,
						lowestSalary: this.postJobData.lowestSalary,
						highestSalary: this.postJobData.highestSalary,
						major: this.postJobData.major,
						settleType: this.postJobData.settleType,
						workExperience: this.postJobData.workExperienceLower + '~' + this.postJobData
							.workExperienceHigh,
						keywords: this.postJobData.keywords,
						welfare: this.postJobData.welfare,
						isUrgent: this.postJobData.isUrgent == false ? 0 : 1,
						details: this.postJobData.details
					},
					complete: (res) => {
						console.log(res);
						if (res.statusCode === 200) {
							uni.showToast({
								title: "发布成功",
								icon: "none",
								success: () => {
									uni.navigateBack({
										delta: 1
									})
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
			},
		},
	}
</script>

<style lang="scss" scoped>
	.post-job-container {
		padding: 0 40rpx;
		padding-bottom: 60rpx;

		.add-project-every {
			padding: 40rpx 0;
			border-bottom: 4rpx solid #f9f9f9;

			.every-title {
				font-size: 26rpx;
				color: #000;
			}

			.every-context {
				display: flex;
				align-items: baseline;
			}

			.every-input {
				margin-top: 20rpx;
				font-size: 30rpx;
				color: #000;
			}

			.salary-container {
				height: 600rpx;
				background-color: #fff;
				border-top-left-radius: 30rpx;
				border-top-right-radius: 30rpx;

				.salary-top {
					padding: 50rpx 40rpx 30rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					border-bottom: 2rpx solid #F1F1F1;

					.top-left {
						font-size: 24rpx;
						color: #c3c3c3;
					}

					.top-center {
						font-size: 30rpx;
						color: #000;
					}

					.top-right {
						font-size: 30rpx;
						color: #85dbd0;
					}
				}
			}

			.every-textarea {
				max-height: 40rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				-webkit-box-orient: vertical;
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
