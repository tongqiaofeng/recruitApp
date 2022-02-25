<template>
	<view class="add-project-history-container">
		<!-- 添加项目经历 -->
		<view class="add-project-every">
			<view class="every-title">项目名称</view>
			<input class="every-input" placeholder="请输入" placeholder-style="color: #dadada;" type="text"
				v-model="addProjectData.projectName" />
		</view>
		<view class="add-project-every">
			<view class="every-title">担任角色</view>
			<input class="every-input" placeholder="请输入" placeholder-style="color: #dadada;" type="text"
				v-model="addProjectData.role" />
		</view>
		<view class="add-project-every">
			<view class="every-title">项目时间</view>
			<view class="every-context">
				<picker mode="date" fields="month" @change="startTimeChange">
					<input class="every-input" style="text-align: center;" placeholder="开始时间"
						placeholder-style="color: #dadada;" type="text" v-model="addProjectData.startTime" />
				</picker>
				<text>至</text>
				<picker mode="date" fields="month" @change="endTimeChange">
					<input class="every-input" style="text-align: center;" placeholder="结束时间"
						placeholder-style="color: #dadada;" type="text" v-model="addProjectData.endTime" />
				</picker>
			</view>
		</view>
		<view class="add-project-every">
			<view class="every-title">项目描述</view>
			<navigator :url="'./descriptionContext?context=' + addProjectData.description" hover-class="none">
				<view class="every-input" style="color: #dadada;" v-if="addProjectData.description.length == 0">请输入
				</view>
				<view class="every-input every-textarea" v-else>
					{{addProjectData.description}}
				</view>
			</navigator>
		</view>
		<view class="add-project-every">
			<view class="every-title">项目业绩</view>
			<navigator :url="'./achievementContext?context=' + addProjectData.achievement" hover-class="none">
				<view class="every-input" style="color: #dadada;" v-if="addProjectData.achievement.length == 0">请输入
				</view>
				<view class="every-input every-textarea" v-else>
					{{addProjectData.achievement}}
				</view>
			</navigator>
		</view>
		<view class="add-project-button" @click="addProjectSave">保存</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				addProjectData: {
					projectName: "",
					startTime: "",
					endTime: "",
					role: "",
					description: "",
					achievement: ""
				}
			}
		},
		onLoad() {
			// 项目描述
			uni.$on('descriptionContext', (e) => {
				console.log(e);
				this.addProjectData.description = e;
			});
			// 项目业绩
			uni.$on('achievementContext', (e) => {
				console.log(e);
				this.addProjectData.achievement = e;
			});
		},
		methods: {
			// 开始时间
			startTimeChange(e) {
				console.log(e);
				this.addProjectData.startTime = e.detail.value;
			},
			// 结束时间
			endTimeChange(e) {
				console.log(e);
				this.addProjectData.endTime = e.detail.value;
			},
			// 保存
			addProjectSave() {
				uni.$emit('addProjectData', this.addProjectData);
				uni.navigateBack({
					delta: 1
				})
			},
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
			background-color: #85dbd0;
			border-radius: 12rpx;
			color: #fff;
			font-size: 24rpx;
			text-align: center;
		}
	}
</style>
