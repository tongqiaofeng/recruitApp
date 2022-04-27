<template>
	<view class="user-select-container">
		<!-- 筛选 -->
		<view class="user-select-data">
			<view class="select-data-every" v-for="(item,index) in selDataList" :key="index">
				<view class="name">{{item}}</view>
				<view class="close" @click="delData(item,index)">X</view>
			</view>
		</view>
		<view class="user-select-main">
			<view class="screen-main-every">
				<view class="every-title">职位类型（单选）</view>
				<view class="every-list">
					<view class="list-every"
						:style="{color: typeSel.indexOf(item) == -1  ? '#061D4C' : '#4EB9FA',border:  typeSel.indexOf(item) == -1  ? '6rpx solid #F8F8F8' : '4rpx solid #4EB9FA',backgroundColor: typeSel.indexOf(item) == -1  ? '#F8F8F8' : '#fff'}"
						v-for="(item,index) in typeList" :key="index" @click="typeClick(item)">
						{{item}}
					</view>
				</view>
			</view>
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
				<view class="every-title">证书要求</view>
				<view class="every-list">
					<view class="list-every"
						:style="{color: certificateNameSel.indexOf(item.name) == -1  ? '#061D4C' : '#4EB9FA',border:  certificateNameSel.indexOf(item.name) == -1  ? '6rpx solid #F8F8F8' : '4rpx solid #4EB9FA',backgroundColor: certificateNameSel.indexOf(item.name) == -1  ? '#F8F8F8' : '#fff'}"
						v-for="(item,index) in certificateNameList" :key="index"
						@click="certificateNameClick(item.name)">
						{{item.name}}
					</view>
				</view>
			</view>
		</view>
		<view class="bottom-container">
			<view class="cancel" @click="selCancel">
				取消
			</view>
			<view class="button" @click="selectSure">确定</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				typeSel: "不限",
				typeList: ["不限", "全职", "兼职"],
				educationalRequirementsSel: ["不限"],
				educationalRequirementsList: ["不限", "初中及以下", "中专/中技", "高中", "大专", "本科", "硕士", "博士"], // 学历
				certificateNameSel: ["不限"],
				certificateNameList: [{
					id: 0,
					name: "不限"
				}],
				selDataList: []
			}
		},
		onLoad(option) {
			console.log(option);
			this.typeSel = option.type;
			this.educationalRequirementsSel = JSON.parse(option.formalSchools);
			this.certificateNameSel = JSON.parse(option.certificateNames);
			this.getCertificateList();
		},
		methods: {
			// 职位类型
			typeClick(e) {
				console.log(e);
				if (this.typeSel == e) {
					this.typeSel = "不限";
				} else {
					this.typeSel = e;
				}

				console.log(this.typeSel);
				this.getSelData();
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
			// 证书
			certificateNameClick(e) {
				console.log(e);
				if (this.certificateNameSel.indexOf(e) == -1) {
					if (e == '不限') {
						this.certificateNameSel = [];
						this.certificateNameSel = ['不限'];
					} else {
						this.certificateNameSel.push(e);
						for (let i in this.certificateNameSel) {
							if (this.certificateNameSel[i] == '不限') {
								this.certificateNameSel.splice(i, 1)
							}
						}
					};
				} else {
					if (e != "不限") {
						for (let i in this.certificateNameSel) {
							if (this.certificateNameSel[i] == e) {
								this.certificateNameSel.splice(i, 1)
							}
						}
					}
				}
				if (this.certificateNameSel.length == 0) this.certificateNameSel = ["不限"];
				console.log(this.certificateNameSel);
				this.getSelData();
			},
			// 提取选中的数据
			getSelData() {
				this.selDataList = [];
				if (this.typeSel != "不限") this.selDataList.push(this.typeSel);
				for (let index in this.educationalRequirementsSel) {
					if (this.educationalRequirementsSel[index] != '不限') this.selDataList.push(this
						.educationalRequirementsSel[index]);
				};
				for (let j in this.certificateNameSel) {
					if (this.certificateNameSel[j] != '不限') this.selDataList.push(this.certificateNameSel[j]);
				};
			},
			// 删除
			delData(item, index) {
				this.selDataList.splice(index, 1);
				if (item == this.typeSel) {
					this.typeSel = "不限";
				};
				for (let i in this.educationalRequirementsSel) {
					if (this.educationalRequirementsSel[i] == item) this.educationalRequirementsSel.splice(i, 1)
				};
				for (let j in this.certificateNameSel) {
					if (this.certificateNameSel[j] == item) this.certificateNameSel.splice(j, 1)
				};

				if (this.educationalRequirementsSel.length == 0) this.educationalRequirementsSel = ["不限"];
				if (this.certificateNameSel.length == 0) this.certificateNameSel = ["不限"];
			},
			// 确定筛选
			selectSure() {
				uni.$emit('userSelectData', {
					type: this.typeSel,
					formalSchools: this.educationalRequirementsSel,
					certificateNames: this.certificateNameSel
				});

				uni.navigateBack({
					delta: 1
				})
			},
			// 取消筛选
			selCancel() {
				this.selDataList = [];
				this.typeSel = "不限";
				this.educationalRequirementsSel = ["不限"];
				this.certificateNameSel = ["不限"];
			},
			// 获取证书列表
			getCertificateList() {
				uni.request({
					url: this.$baseUrl + '/certificateList',
					method: 'POST',
					complete: (res) => {
						console.log('证书列表');
						console.log(res);
						this.certificateNameList = this.certificateNameList.concat(res.data.data);
					}
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.user-select-container {
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

		.user-select-main {
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
