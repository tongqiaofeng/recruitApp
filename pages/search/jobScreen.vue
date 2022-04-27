<template>
	<view class="screen-container">
		<!-- 筛选 -->
		<view class="user-select-data">
			<view class="select-data-every" v-for="(item,index) in selDataList" :key="index">
				<view class="name">{{item}}</view>
				<view class="close" @click="delData(item,index)">X</view>
			</view>
		</view>
		<view class="job-screen-main">
			<view class="screen-main-every">
				<view class="every-title">学历要求</view>
				<view class="every-list">
					<view class="list-every"
						:style="{color: educationalRequirementsSel.indexOf(item) == -1  ? '#061D4C' : '#4EB9FA',border:  educationalRequirementsSel.indexOf(item) == -1  ? '6rpx solid #F8F8F8' : '4rpx solid #4EB9FA',backgroundColor: educationalRequirementsSel.indexOf(item) == -1  ? '#F8F8F8' : '#fff'}"
						v-for="(item,index) in educationalRequirementsList" :key="index"
						@click="educationalClick(item)">
						{{item}}
					</view>
				</view>
			</view>
			<view class="screen-main-every">
				<view class="every-title">薪资待遇（单选）</view>
				<view class="every-list">
					<view class="list-every" v-for="(item,index) in moneyList" :key="index" @click="moneyClick(item)"
						:style="{color: moneySel == item  ? '#4EB9FA' : '#061D4C',border: moneySel == item  ? '4rpx solid #4EB9FA' : '6rpx solid #F8F8F8',backgroundColor: moneySel == item ? '#fff' : '#f8f8f8'}">
						{{item}}
					</view>
				</view>
			</view>
			<view class="screen-main-every">
				<view class="every-title">经验要求</view>
				<view class="every-list">
					<view class="list-every"
						:style="{color: experienceSel.indexOf(item) == -1  ? '#061D4C' : '#4EB9FA',border:  experienceSel.indexOf(item) == -1  ? '6rpx solid #F8F8F8' : '4rpx solid #4EB9FA',backgroundColor: experienceSel.indexOf(item) == -1  ? '#F8F8F8' : '#fff'}"
						v-for="(item,index) in experienceList" :key="index" @click="experienceClick(item)">
						{{item}}
					</view>
				</view>
			</view>
			<view class="screen-main-every">
				<view class="every-title">公司规模</view>
				<view class="every-list">
					<view class="list-every"
						:style="{color: companySel.indexOf(item) == -1  ? '#061D4C' : '#4EB9FA',border:  companySel.indexOf(item) == -1  ? '6rpx solid #F8F8F8' : '4rpx solid #4EB9FA',backgroundColor: companySel.indexOf(item) == -1  ? '#F8F8F8' : '#fff'}"
						v-for="(item,index) in companyList" :key="index" @click="companyClick(item)">
						{{item}}
					</view>
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
				selDataList: []
			}
		},
		onLoad(option) {
			console.log(option);
			this.educationalRequirementsSel = JSON.parse(option.major);
			this.moneySel = option.salary;
			this.experienceSel = JSON.parse(option.workExperience);
			this.companySel = JSON.parse(option.teamSize);
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
				this.selDataList = [];
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
				} else {
					if (e != "不限") {
						for (let i in this.educationalRequirementsSel) {
							if (this.educationalRequirementsSel[i] == e) {
								this.educationalRequirementsSel.splice(i, 1)
							}
						}
					}
				}
				if (this.educationalRequirementsSel.length == 0) this.educationalRequirementsSel = ["不限"];
				console.log(this.educationalRequirementsSel);
				this.getSelData();
			},
			// 薪资
			moneyClick(e) {
				console.log(e);
				if (this.moneySel == e) {
					this.moneySel = "不限";
				} else {
					this.moneySel = e;
				}
				this.getSelData();
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
				} else {
					if (e != "不限") {
						for (let i in this.experienceSel) {
							if (this.experienceSel[i] == e) {
								this.experienceSel.splice(i, 1)
							}
						}
					}
				}
				if (this.experienceSel.length == 0) this.experienceSel = ["不限"];
				this.getSelData();
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
				} else {
					if (e != "不限") {
						for (let i in this.companySel) {
							if (this.companySel[i] == e) {
								this.companySel.splice(i, 1)
							}
						}
					}
				}
				if (this.companySel.length == 0) this.companySel = ["不限"];
				this.getSelData();
			},
			// 提取选中的数据
			getSelData() {
				this.selDataList = [];
				for (let index in this.educationalRequirementsSel) {
					if (this.educationalRequirementsSel[index] != '不限') this.selDataList.push(this
						.educationalRequirementsSel[index]);
				};
				if (this.moneySel != "不限") this.selDataList.push(this.moneySel);
				for (let j in this.experienceSel) {
					if (this.experienceSel[j] != '不限') this.selDataList.push(this.experienceSel[j]);
				};
				for (let k in this.companySel) {
					if (this.companySel[k] != '不限') this.selDataList.push(this.companySel[k]);
				};
			},
			// 删除
			delData(item, index) {
				this.selDataList.splice(index, 1);
				if (item == this.moneySel) {
					this.moneySel = "不限";
				};
				for (let i in this.educationalRequirementsSel) {
					if (this.educationalRequirementsSel[i] == item) this.educationalRequirementsSel.splice(i, 1)
				};
				for (let j in this.experienceSel) {
					if (this.experienceSel[j] == item) this.experienceSel.splice(j, 1)
				};
				for (let k in this.companySel) {
					if (this.companySel[k] == item) this.companySel.splice(k, 1)
				};
				
				if (this.educationalRequirementsSel.length == 0) this.educationalRequirementsSel = ["不限"];
				if (this.experienceSel.length == 0) this.experienceSel = ["不限"];
				if (this.companySel.length == 0) this.companySel = ["不限"];
			},
		},
	}
</script>

<style lang="scss" scoped>
	.screen-container {
		background-color: #f3f7fa;

		.user-select-data {
			padding: 20rpx 30rpx;
			display: flex;
			justify-content: flex-start;
			flex-wrap: wrap;

			.select-data-every {
				width: fit-content;
				padding: 16rpx;
				margin: 0 10rpx 10rpx 0;
				display: flex;
				align-items: center;
				border-radius: 4rpx;
				background-color: #fff;

				.name {
					margin-right: 9rpx;
					font-size: 24rpx;
					color: #A3B3CC;
				}

				.close {
					font-size: 24rpx;
					color: #A3B3CC;
				}
			}
		}

		.job-screen-main {
			padding-top: 50rpx;
			padding-bottom: 150rpx;
			background-color: #fff;

			.screen-main-every {
				margin-bottom: 30rpx;

				.every-title {
					padding-left: 29rpx;
					margin-bottom: 29rpx;
					font-size: 30rpx;
					font-weight: bold;
					color: #061D4C;
				}

				.every-list {
					display: flex;
					justify-content: space-between;
					flex-wrap: wrap;
					background-color: #fff;

					.list-every {
						width: 210rpx;
						padding: 14rpx 5rpx;
						margin: 0 21rpx;
						margin-bottom: 20rpx;
						text-align: center;
						font-size: 22rpx;
						box-sizing: border-box;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}

				.every-list::after {
					content: "";
					flex: auto;
				}
			}
		}

		.bottom-container {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			padding: 30rpx 30rpx 40rpx;
			display: flex;
			justify-content: space-between;
			background-color: #fff;
			border-top: 4rpx solid #f3f7fa;

			.cancel {
				width: 230rpx;
				height: 76rpx;
				line-height: 76rpx;
				background-color: #F8F8F8;
				border-radius: 38rpx;
				font-weight: bold;
				color: #A3B3CC;
				font-size: 26rpx;
				text-align: center;
			}

			.button {
				width: 439rpx;
				height: 76rpx;
				line-height: 76rpx;
				background: linear-gradient(to top, #5EB7F5, #5EDAF5);
				color: #FEFEFE;
				font-size: 26rpx;
				text-align: center;
				border-radius: 38rpx;
				font-weight: bold;
			}
		}
	}
</style>
