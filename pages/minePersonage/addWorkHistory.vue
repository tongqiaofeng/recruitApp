<template>
	<view class="add-work-history-container">
		<!-- 添加工作经历 -->
		<view class="add-work-every">
			<view class="every-title">公司名称</view>
			<input class="every-input" placeholder="请输入" placeholder-style="color: #dadada;" type="text"
				v-model="addWorkData.companyName" />
		</view>
		<view class="add-work-every">
			<view class="every-title">在职时间</view>
			<view class="every-context">
				<picker mode="date" fields="month" @change="startTimeChange">
					<input class="every-input" style="text-align: center;" placeholder="开始时间"
						placeholder-style="color: #dadada;" type="text" v-model="addWorkData.startTime" />
				</picker>
				<text>至</text>
				<picker mode="date" fields="month" @change="endTimeChange">
					<input class="every-input" style="text-align: center;" placeholder="结束时间"
						placeholder-style="color: #dadada;" type="text" v-model="addWorkData.endTime" />
				</picker>
			</view>
		</view>
		<view class="add-work-every">
			<view class="every-title">职位名称</view>
			<input class="every-input" placeholder="请输入" placeholder-style="color: #dadada;" type="text"
				v-model="addWorkData.jobTitle" />
		</view>
		<view class="add-work-every">
			<view class="every-title">工作内容</view>
			<navigator :url="'./jobContext?context=' + addWorkData.content" hover-class="none">
				<view class="every-input" style="color: #dadada;" v-if="addWorkData.content.length == 0">请输入</view>
				<view class="every-input every-textarea" v-else>
					{{addWorkData.content}}
				</view>
			</navigator>
		</view>
		<view class="add-work-every">
			<view class="every-title">所属部门</view>
			<input class="every-input" placeholder="请输入" placeholder-style="color: #dadada;" type="text"
				v-model="addWorkData.dept" />
		</view>
		<view class="add-work-button" @click="addWorkSave">保存</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				addWorkData: {
					companyName: "",
					startTime: "",
					endTime: "",
					jobTitle: "",
					content: "",
					dept: ""
				}
			}
		},
		onLoad() {
			// 工作内容
			uni.$on('jobContext', (e) => {
				console.log(e);
				this.addWorkData.content = e;
			})
		},
		methods: {
			// 开始时间
			startTimeChange(e) {
				console.log(e);
				this.addWorkData.startTime = e.detail.value;
			},
			// 结束时间
			endTimeChange(e) {
				console.log(e);
				this.addWorkData.endTime = e.detail.value;
			},
			// 保存
			addWorkSave() {
				uni.$emit('addWorkData', this.addWorkData);
				uni.navigateBack({
					delta: 1
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
	.add-work-history-container {
		padding: 0 40rpx;

		.add-work-every {
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

			.every-textarea {
				max-height: 120rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 3;
				-webkit-box-orient: vertical;
			}
		}

		.add-work-button {
			padding: 20rpx;
			margin-top: 120rpx;
			background-color: #85dbd0;
			border-radius: 12rpx;
			color: #fff;
			font-size: 24rpx;
			text-align: center;
		}
	}
</style>
