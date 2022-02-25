<template>
	<view class="screen-container">
		<!-- 筛选 -->
		<view class="screen-main-every">
			<view class="every-title">学历要求</view>
			<view class="every-list">
				<view class="list-every"
					:style="{color: educationalRequirementsSel.indexOf(item) == -1  ? '#000' : '#85dbd0',border:  educationalRequirementsSel.indexOf(item) == -1  ? '6rpx solid #f1f1f1' : '4rpx solid #85dbd0',backgroundColor: educationalRequirementsSel.indexOf(item) == -1  ? '#f1f1f1' : '#fff'}"
					v-for="(item,index) in educationalRequirementsList" :key="index" @click="educationalClick(item)">
					{{item}}
				</view>
			</view>
		</view>
		<view class="screen-main-every">
			<view class="every-title">薪资待遇（单选）</view>
			<view class="every-list">
				<view class="list-every" v-for="(item,index) in moneyList" :key="index" @click="moneyClick(item)"
					:style="{color: moneySel == item  ? '#85dbd0' : '#000',border: moneySel == item  ? '4rpx solid #85dbd0' : '6rpx solid #f1f1f1',backgroundColor: moneySel == item ? '#fff' : '#f1f1f1'}">
					{{item}}
				</view>
			</view>
		</view>
		<view class="screen-main-every">
			<view class="every-title">经验要求</view>
			<view class="every-list">
				<view class="list-every"
					:style="{color: experienceSel.indexOf(item) == -1  ? '#000' : '#85dbd0',border:  experienceSel.indexOf(item) == -1  ? '6rpx solid #f1f1f1' : '4rpx solid #85dbd0',backgroundColor: experienceSel.indexOf(item) == -1  ? '#f1f1f1' : '#fff'}"
					v-for="(item,index) in experienceList" :key="index" @click="experienceClick(item)">
					{{item}}
				</view>
			</view>
		</view>
		<view class="screen-main-every" style="padding-bottom: 120rpx;">
			<view class="every-title">公司规模</view>
			<view class="every-list">
				<view class="list-every"
					:style="{color: companySel.indexOf(item) == -1  ? '#000' : '#85dbd0',border:  companySel.indexOf(item) == -1  ? '6rpx solid #f1f1f1' : '4rpx solid #85dbd0',backgroundColor: companySel.indexOf(item) == -1  ? '#f1f1f1' : '#fff'}"
					v-for="(item,index) in companyList" :key="index" @click="companyClick(item)">
					{{item}}
				</view>
			</view>
		</view>
		<view class="bottom-container">
			<view class="cancel" @click="selectCancel">取消</view>
			<view class="button" @click="selectSure">确定</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				educationalRequirementsSel: ["不限"],
				educationalRequirementsList: ["不限", "初中及以下", "中专/中技", "高中", "大专", "本科", "硕士", "博士"], // 学历
				moneySel: "不限",
				moneyList: ['不限', '8K以下', '8-12K', '12-16K', '16-20K', '20-25K', '25K以上'],
				experienceSel: ["不限"],
				experienceList: ['不限', '在校生', '应届生', '1年以内', '1-3年', '3-5年', '5-10年', '10年以上'],
				companySel: ["不限"],
				companyList: ['不限', '0-20人', '20-99人', '100-499人', '500-999人', '1000-9999人', '10000以上'],

			}
		},
		methods: {
			// 确定筛选
			selectSure() {
				uni.$emit('jobScreenData', {
					major: this.educationalRequirementsSel,
					salary: this.moneySel,
					workExperience: this.experienceSel,
					teamSize: this.companySel
				});

				uni.navigateBack({
					delta: 1
				})
			},
			// 取消筛选
			selectCancel() {
				this.educationalRequirementsSel = ['不限'];
				this.moneySel = '不限';
				this.experienceSel = ['不限'];
				this.companySel = ['不限'];
			},
			// 学历
			educationalClick(e) {
				console.log(e);
				if (this.educationalRequirementsSel.indexOf(e) == -1) {
					if (e == "不限") {
						this.educationalRequirementsSel = [];
						this.educationalRequirementsSel = ["不限"];
					} else {
						this.educationalRequirementsSel.push(e);
						for (let i in this.educationalRequirementsSel) {
							if (this.educationalRequirementsSel[i] == "不限") {
								this.educationalRequirementsSel.splice(i, 1)
							}
						}
					};
				}
				console.log(this.educationalRequirementsSel)
			},
			// 薪资
			moneyClick(e) {
				console.log(e);
				this.moneySel = e;
			},
			// 经验
			experienceClick(e) {
				if (this.experienceSel.indexOf(e) == -1) {
					if (e == "不限") {
						this.experienceSel = [];
						this.experienceSel = ["不限"];
					} else {
						this.experienceSel.push(e);
						for (let i in this.experienceSel) {
							if (this.experienceSel[i] == "不限") {
								this.experienceSel.splice(i, 1)
							}
						}
					};
				}
			},
			// 公司规模
			companyClick(e) {
				if (this.companySel.indexOf(e) == -1) {
					if (e == "不限") {
						this.companySel = [];
						this.companySel = ["不限"];
					} else {
						this.companySel.push(e);
						for (let i in this.companySel) {
							if (this.companySel[i] == "不限") {
								this.companySel.splice(i, 1)
							}
						}
					};
				}
			},
		},
	}
</script>

<style lang="scss" scoped>
	.screen-container {
		padding: 40rpx 0;

		.screen-main-every {
			margin-bottom: 30rpx;

			.every-title {
				padding-left: 20rpx;
				margin-bottom: 30rpx;
				font-size: 30rpx;
				font-weight: bold;
			}

			.every-list {
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				background-color: #fff;

				.list-every {
					width: 210rpx;
					padding: 20rpx 0;
					margin: 30rpx 20rpx;
					margin-bottom: 10rpx;
					text-align: center;
					font-size: 26rpx;
					box-sizing: border-box;
				}
			}

			.every-list::after {
				content: "";
				flex: auto;
			}
		}

		.bottom-container {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			padding: 30rpx 40rpx;
			display: flex;
			justify-content: space-between;
			background-color: #fff;
			border-top: 2rpx solid #c3c3c3;

			.cancel {
				width: 80rpx;
				padding: 20rpx 60rpx;
				background-color: #f1f1f1;
				color: #A9A5A0;
				font-size: 24rpx;
				text-align: center;
				border-radius: 10rpx;
			}

			.button {
				width: 120rpx;
				padding: 20rpx 60rpx;
				background-color: #85dbd0;
				color: #fff;
				font-size: 24rpx;
				text-align: center;
				border-radius: 10rpx;
			}
		}
	}
</style>
