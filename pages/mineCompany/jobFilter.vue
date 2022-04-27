<template>
	<view class="job-filter-container">
		<uni-forms ref="form">
			<uni-forms-item label="发布时间">
				<uni-datetime-picker v-model="time" type="daterange" rangeSeparator="至" @change="timeChange" />
			</uni-forms-item>
			<uni-forms-item label="职位类型">
				<view class="type-style">
					<picker style="flex: 1;" mode="selector" :range="statusList" @change="statusChange">
						<input placeholder="请选择" placeholder-style="color: #dadada;" type="text" v-model="status" />
					</picker>
				</view>
			</uni-forms-item>
		</uni-forms>
		<view class="add-project-button" @click="searchJob">查询</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				time: [],
				status: "全部",
				statusList: ['全部', '招聘中', '已停止招聘'],
			}
		},
		methods: {
			timeChange(e) {
				console.log(e);
				this.time = e;
			},
			statusChange(e) {
				console.log(e);
				this.status = this.statusList[Number(e.detail.value)];
			},
			searchJob() {
				uni.$emit('jobFilter', {
					time: this.time,
					status: this.status
				});
				uni.navigateBack({
					delta: 1
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
	.job-filter-container {
		padding: 60rpx 40rpx;

		.type-style {
			height: 100%;
			padding: 0 10px;
			display: flex;
			align-items: center;
			box-sizing: border-box;
			border-radius: 4px;
			border: 1px solid #dcdfe6;
		}

		.add-project-button {
			padding: 20rpx;
			position: absolute;
			left: 40rpx;
			right: 40rpx;
			bottom: 60rpx;
			font-size: 30rpx;
			color: #fff;
			background: linear-gradient(to bottom, #5EDAF5, #5EB7F5);
			text-align: center;
			border-radius: 45rpx;
		}
	}
</style>
