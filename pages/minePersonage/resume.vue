<template>
	<view class="resume-container">
		<!-- 个人在线简历 -->
		<view class="resume-main-one">
			<view class="one-left">
				<view class="left-top">
					{{ myMsgData.name }}
				</view>
				<text class="left-bottom">{{ myMsgData.joinWorkTime }}年经验-{{ myMsgData.age }}岁</text>
			</view>
			<view class="one-right">
				<image v-if="myMsgData.headPic" :src="imgUrl + '/' + myMsgData.headPic" mode="aspectFill"></image>
			</view>
		</view>
		<navigator :url="'./skill?context=' + resumeData.skill" hover-class="none">
			<view class="resume-main-every">
				<view class="every-title">
					<text>个人优势</text>
					<image class="update-img" src="../../static/imgs/common/update.png" mode="aspectFill"></image>
				</view>
				<view class="skill">
					<text>{{
            resumeData.skill == "" ? "输入个人优势" : resumeData.skill
          }}</text>
				</view>
			</view>
		</navigator>
		<navigator :url="'./jobExpectations?context=' + JSON.stringify(resumeData.jobWanted)" hover-class="none">
			<view class="resume-main-every">
				<view class="every-title">
					<text>求职期望</text>
					<image class="update-img" src="../../static/imgs/common/update.png" mode="aspectFill"></image>
				</view>
				<view v-if="
            resumeData.jobWanted == null || resumeData.jobWanted == undefined
          " class="every-main">添加求职期望</view>
				<view v-else class="every-main">
					<text>{{ resumeData.jobWanted.type }}</text>
					<text>{{ " " + resumeData.jobWanted.city + " " }}</text>
					<text v-if="
              resumeData.jobWanted.lowestSalary != '' &&
              resumeData.jobWanted.lowestSalary != null
            ">{{
              resumeData.jobWanted.lowestSalary +
              "~" +
              resumeData.jobWanted.highestSalary
            }}{{ resumeData.jobWanted.type == "全职" ? "K" : "元" }}</text>
				</view>
			</view>
		</navigator>
		<view class="resume-main-every">
			<view class="every-title">
				<text>工作经历</text>
				<navigator url="./addWorkHistory" hover-class="none">
					<image class="update-img" src="../../static/imgs/common/add.png" mode="aspectFill"></image>
				</navigator>
			</view>
			<view v-if="resumeData.workHistory.length == 0" class="every-main">添加工作经历</view>
			<view v-else class="every-main" v-for="(item, index) in resumeData.workHistory" :key="index">
				<navigator :url="
            './updateWorkHistory?context=' +
            JSON.stringify(item) +
            '&index=' +
            index
          " hover-class="none">
					<view class="list-one">
						<text class="list-one-left">{{ item.companyName }}</text>
						<view class="list-one-right">
							<text>{{ formatTime(item.startTime) + " - " + formatTime(item.endTime) }}</text>
							<image class="update-img" src="../../static/imgs/common/right.png" mode="aspectFill">
							</image>
						</view>
					</view>
					<view class="list-two">{{ item.jobTitle }}</view>
					<view class="list-three">
						<view class="three-title">内容：</view>
						<view class="three-main">{{ item.content }}</view>
					</view>
				</navigator>
			</view>
		</view>
		<view class="resume-main-every">
			<view class="every-title">
				<text>项目经历</text>
				<navigator url="./addProjectHistory" hover-class="none">
					<image class="update-img" src="../../static/imgs/common/add.png" mode="aspectFill"></image>
				</navigator>
			</view>
			<view v-if="resumeData.projectHistory.length == 0" class="every-main">添加项目经历</view>
			<view v-else class="every-main" v-for="(item, index) in resumeData.projectHistory" :key="index">
				<navigator :url="
            './updateProjectHistory?context=' +
            JSON.stringify(item) +
            '&index=' +
            index
          " hover-class="none">
					<view class="list-one">
						<text class="list-one-left">{{ item.projectName }}</text>
						<view class="list-one-right">
							<text>{{ formatTime(item.startTime) + " - " + formatTime(item.endTime) }}</text>
							<image class="update-img" src="../../static/imgs/common/right.png" mode="aspectFill">
							</image>
						</view>
					</view>
					<view class="list-two">{{ item.role }}</view>
					<view class="list-three">
						<view class="three-title">内容：</view>
						<view class="three-main">{{ item.description }}</view>
					</view>
					<view class="list-three">
						<view class="three-title">业绩：</view>
						<view class="three-main">{{ item.achievement }}</view>
					</view>
				</navigator>
			</view>
		</view>
		<view class="resume-main-every">
			<view class="every-title">
				<text>教育经历</text>
				<navigator url="./addEduHistory" hover-class="none">
					<image class="update-img" src="../../static/imgs/common/add.png" mode="aspectFill"></image>
				</navigator>
			</view>
			<view v-if="resumeData.eduHistory.length == 0" class="every-main">添加教育经历</view>
			<view v-else class="every-main" v-for="(item, index) in resumeData.eduHistory" :key="index">
				<navigator :url="
            './updateEduHistory?context=' +
            JSON.stringify(item) +
            '&index=' +
            index
          " hover-class="none">
					<view class="list-one">
						<text class="list-one-left">{{ item.schoolName }}</text>
						<view class="list-one-right">
							<text>{{ formatTime(item.startTime) + " - " + formatTime(item.endTime)}}</text>
							<image class="update-img" src="../../static/imgs/common/right.png" mode="aspectFill">
							</image>
						</view>
					</view>
					<view class="list-two">{{ item.formalSchool
            }}<text style="margin-left: 10rpx">{{ item.major }}</text>
					</view>
					<view class="list-three" v-if="item.achievement">
						<view class="three-title">在校经历：</view>
						<view class="three-main">{{ item.achievement }}</view>
					</view>
				</navigator>
			</view>
		</view>
		<view class="resume-main-every">
			<view class="every-title">
				<text>资格证书</text>
				<navigator url="./addCertificate" hover-class="none">
					<image class="update-img" src="../../static/imgs/common/add.png" mode="aspectFill"></image>
				</navigator>
			</view>
			<view v-if="resumeData.certificateMsg.length == 0" class="every-main">添加资格证书</view>
			<view v-else style="display: flex; flex-wrap: wrap">
				<view class="every-main" v-for="(item, index) in resumeData.certificateMsg" :key="index">
					<navigator :url="
              './updateCertificate?context=' +
              JSON.stringify(item) +
              '&index=' +
              index
            " hover-class="none">
						<view class="list-one">
							<text class="list-one-left" style="
                  margin-right: 20rpx;
                  padding: 10rpx 30rpx;
                  background-color: #EFF6FF;
                ">{{ item.certificateName }}</text>
						</view>
					</navigator>
				</view>
			</view>
		</view>
		<view class="resume-button" @click="resumeSubmit">提交</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.$baseUrl,
				myMsgData: {
					headPic: "",
					name: "",
					joinWorkTime: "",
					age: "",
				},
				resumeData: {
					skill: "",
					jobWanted: null,
					workHistory: [],
					projectHistory: [],
					eduHistory: [],
					certificateMsg: [],
				},
			};
		},
		onShow() {
			this.myMsgData.headPic = uni.getStorageSync("headPic");
			this.myMsgData.name = uni.getStorageSync("fullName");

			let time = uni.getStorageSync("joinWorkTime").split("-");
			let myDate = new Date();
			let month = myDate.getMonth() + 1;
			let num = myDate.getFullYear() - time[0];
			if (month > time[1]) {
				num++;
			}
			this.myMsgData.joinWorkTime = num;

			this.idNumChange();
		},
		onLoad() {
			this.getResuneMsg();
			// 个人优势
			uni.$on("skill", (e) => {
				console.log(e);
				this.resumeData.skill = e;
			});
			// 求职期望
			uni.$on("expectData", (e) => {
				console.log(e);
				this.resumeData.jobWanted = e;
			});
			// 工作经历  添加
			uni.$on("addWorkData", (e) => {
				console.log(e);
				this.resumeData.workHistory.push(e);
			});
			// 工作经历  修改
			uni.$on("updateWorkData", (e) => {
				console.log(e);
				this.resumeData.workHistory.splice(e.index, 1, e.data);
			});
			// 项目经历  添加
			uni.$on("addProjectData", (e) => {
				console.log(e);
				this.resumeData.projectHistory.push(e);
			});
			// 项目经历  修改
			uni.$on("updateProjectData", (e) => {
				console.log(e);
				this.resumeData.projectHistory.splice(e.index, 1, e.data);
			});
			// 教育经历  添加
			uni.$on("addEduData", (e) => {
				console.log(e);
				this.resumeData.eduHistory.push(e);
			});
			// 教育经历  修改
			uni.$on("updateEduData", (e) => {
				console.log(e);
				this.resumeData.eduHistory.splice(e.index, 1, e.data);
			});
			// 资格证书  添加
			uni.$on("addCertificate", (e) => {
				console.log(e);
				this.resumeData.certificateMsg.push(e);
			});
			// 资格证书  修改
			uni.$on("updateCertificate", (e) => {
				console.log(e);
				this.resumeData.certificateMsg.splice(e.index, 1, e.data);
			});
		},
		methods: {
			// 根据身份证号计算年龄
			idNumChange() {
				let idNumber = uni.getStorageSync("idNumber");
				if (idNumber) {
					let myDate = new Date();
					let month = myDate.getMonth() + 1;
					let day = myDate.getDate();
					let age = myDate.getFullYear() - idNumber.substring(6, 10) - 1;
					if (
						idNumber.substring(10, 12) < month ||
						(idNumber.substring(10, 12) == month &&
							idNumber.substring(12, 14) <= day)
					) {
						age++;
					}
					this.myMsgData.age = age;
				} else {
					this.myMsgData.age = '';
				}
			},
			// 提交简历信息
			resumeSubmit() {
				uni.request({
					url: this.$baseUrl + "/personalResumeSave",
					method: "POST",
					header: {
						"content-type": "application/json",
						token: uni.getStorageSync("token"),
					},
					data: {
						skill: this.resumeData.skill,
						jobWanted: this.resumeData.jobWanted,
						workHistory: this.resumeData.workHistory,
						projectHistory: this.resumeData.projectHistory,
						eduHistory: this.resumeData.eduHistory,
						certificateMsg: this.resumeData.certificateMsg,
					},
					complete: (res) => {
						console.log("提交简历信息");
						console.log(res);
						if (res.statusCode === 200) {
							uni.showToast({
								title: "信息提交成功",
								icon: "none",
								success: () => {
									this.getResuneMsg();
								},
							});
						} else {
							uni.showToast({
								title: res.data.data,
								icon: "none",
							});
						}
					},
				});
			},
			// 获取简历信息
			getResuneMsg() {
				uni.request({
					url: this.$baseUrl + "/personalResumeGet",
					header: {
						"content-type": "application/json",
						token: uni.getStorageSync("token"),
					},
					complete: (res) => {
						console.log("简历信息");
						console.log(res);
						if (res.data.code === 200) {
							this.resumeData = res.data.data;
						} else {
							this.resumeData = [];
						}
					},
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.resume-container {
		padding: 10rpx 40rpx 36rpx;
		background-color: #fff;
		border-top: 10rpx solid #EFF6FF;

		.update-img {
			width: 32rpx;
			height: 32rpx;
		}

		.resume-main-one {
			padding: 30rpx 0;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 2rpx solid #EFF6FF;

			.one-left {
				.left-top {
					margin-bottom: 10rpx;
					font-weight: bold;
					color: #061D4C;
					font-size: 38rpx;
					letter-spacing: 4rpx;
				}

				.left-bottom {
					font-size: 26rpx;
					color: #506383;
				}
			}

			.one-right {
				image {
					width: 120rpx;
					height: 120rpx;
					border-radius: 50%;
				}
			}
		}

		.resume-main-every {
			padding: 50rpx 0;
			border-bottom: 2rpx solid #f9f9f9;

			.every-title {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 30rpx;
				font-weight: bold;
				color: #061D4C;
			}

			.skill {
				max-height: 120rpx;
				margin-top: 50rpx;
				font-size: 28rpx;
				color: #506383;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 3;
				-webkit-box-orient: vertical;
			}

			.every-main {
				margin-top: 50rpx;
				font-size: 28rpx;
				color: #506383;
				text-align: left;

				.list-one {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.list-one-left {
						font-size: 28rpx;
						color: #061D4C;
						font-weight: bold;
					}

					.list-one-right {
						display: flex;
						align-items: center;

						text {
							margin-right: 20rpx;
							font-size: 26rpx;
							color: #506383;
						}
					}
				}

				.list-two {
					margin-top: 9rpx;
					color: #506383;
					font-size: 26rpx;
				}

				.list-three {
					font-size: 26rpx;
					color: #506383;

					.three-title {
						padding: 37rpx 0 10rpx;
					}

					.three-main {
						max-height: 80rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
					}
				}
			}
		}

		.resume-button {
			margin-top: 47rpx;
			padding: 28rpx 0;
			font-size: 30rpx;
			color: #fff;
			background: linear-gradient(to bottom, #5EDAF5, #5EB7F5);
			text-align: center;
			border-radius: 45rpx;
		}
	}
</style>
