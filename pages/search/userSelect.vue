<template>
	<view class="user-select-container">
		<!-- 筛选 -->
		<view class="screen-main-every">
			<view class="every-title">职位类型</view>
			<view class="every-list">
				<view class="list-every"
					:style="{color: typeSel.indexOf(item) == -1  ? '#000' : '#85dbd0',border:  typeSel.indexOf(item) == -1  ? '6rpx solid #f1f1f1' : '4rpx solid #85dbd0',backgroundColor: typeSel.indexOf(item) == -1  ? '#f1f1f1' : '#fff'}"
					v-for="(item,index) in typeList" :key="index" @click="typeClick(item)">
					{{item}}
				</view>
			</view>
		</view>
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
			<view class="every-title">证书要求</view>
			<view class="every-list">
				<view class="list-every"
					:style="{color: certificateNameSel.indexOf(item.name) == -1  ? '#000' : '#85dbd0',border:  certificateNameSel.indexOf(item.name) == -1  ? '6rpx solid #f1f1f1' : '4rpx solid #85dbd0',backgroundColor: certificateNameSel.indexOf(item.name) == -1  ? '#f1f1f1' : '#fff'}"
					v-for="(item,index) in certificateNameList" :key="index" @click="certificateNameClick(item.name)">
					{{item.name}}
				</view>
			</view>
		</view>
		<view class="bottom-container">
			<view class="button" @click="selectSure">确定</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				typeSel: ["不限"],
				typeList: ["不限", "全职", "兼职"],
				educationalRequirementsSel: ["不限"],
				educationalRequirementsList: ["不限", "初中及以下", "中专/中技", "高中", "大专", "本科", "硕士", "博士"], // 学历
				certificateNameSel: ["不限"],
				certificateNameList: [{
					id: 0,
					name: "不限"
				}],
			}
		},
		onLoad() {
			this.getCertificateList();
		},
		methods: {
			// 职位类型
			typeClick(e) {
				console.log(e);
				this.typeSel = e;
				console.log(this.typeSel);
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
				}

				console.log(this.certificateNameSel)
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
		padding-bottom: 200rpx;

		.screen-main-every {
			margin-bottom: 30rpx;

			.every-title {
				margin-top: 60rpx;
				padding-left: 20rpx;
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
					padding: 20rpx 5rpx;
					margin: 30rpx 20rpx;
					margin-bottom: 10rpx;
					text-align: center;
					font-size: 26rpx;
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

		.bottom-container {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			padding: 30rpx 40rpx;
			display: flex;
			justify-content: flex-end;
			background-color: #fff;
			border-top: 2rpx solid #c3c3c3;

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
