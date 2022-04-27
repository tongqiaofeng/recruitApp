<template>
	<view class="resume-container">
		<!-- 用户详细信息 -->
		<view class="container-top" id="user-details-top">
			<view class="top-left">
				<image @click="goList" class="top-left-img" src="../../static/imgs/common/back.png" mode="aspectFill">
				</image>
				<text>{{ myMsgData.name }}</text>
			</view>
			<view class="top-right">
				<image class="index-img" :src="resumeData.isCollect == 0 ? collect : collect1" mode="aspectFill"
					@click="isFavorite">
				</image>
			</view>
		</view>
		<view class="top-line" :style="{ 'padding-top': topConHeight + 'px' }"></view>
		<navigator
			:url="'../message/chat?id=' + myMsgData.userId + '&name=' + myMsgData.name + '&headPic=' + myMsgData.headPic"
			hover-class="none">
			<view class="resume-main-one">
				<view class="one-left">
					<view class="left-top">
						<text class="name">{{ myMsgData.name }}</text>
					</view>
					<text class="left-bottom">
						{{ myMsgData.joinWorkTime }}年经验
						<text v-show="myMsgData.age">-{{ myMsgData.age }}岁</text>
					</text>
				</view>
				<view class="one-right">
					<image v-if="myMsgData.headPic" :src="imgUrl + '/' + myMsgData.headPic" mode="aspectFill"></image>
				</view>
			</view>
		</navigator>
		<view class="resume-main-every">
			<view class="every-title">
				<text>个人优势</text>
			</view>
			<view class="every-main">
				<text>{{resumeData.skill}}</text>
			</view>
		</view>
		<view class="resume-main-every">
			<view class="every-title">
				<text>求职期望</text>
			</view>
			<view v-if="resumeData.jobWanted == null || resumeData.jobWanted == undefined" class="every-main">添加求职期望
			</view>
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
		<view class="resume-main-every">
			<view class="every-title">
				<text>工作经历</text>
			</view>
			<view v-if="resumeData.workHistory.length == 0" class="every-main">添加工作经历</view>
			<view v-else class="every-main" v-for="(item, index) in resumeData.workHistory" :key="index">
				<view class="list-one">
					<text class="list-one-left">{{ item.companyName }}</text>
					<view class="list-one-right">
						<text>{{ formatTime(item.startTime) + " - " + formatTime(item.endTime) }}</text>
					</view>
				</view>
				<view class="list-two">{{ item.jobTitle }}</view>
				<view class="list-three">
					<view class="three-title">内容：</view>
					<view class="three-main">{{ item.content }}</view>
				</view>
			</view>
		</view>
		<view class="resume-main-every">
			<view class="every-title">
				<text>项目经历</text>
			</view>
			<view v-if="resumeData.projectHistory.length == 0" class="every-main">添加项目经历</view>
			<view v-else class="every-main" v-for="(item, index) in resumeData.projectHistory" :key="index">
				<view class="list-one">
					<text class="list-one-left">{{ item.projectName }}</text>
					<view class="list-one-right">
						<text>{{ formatTime(item.startTime) + " - " + formatTime(item.endTime )}}</text>
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
			</view>
		</view>
		<view class="resume-main-every">
			<view class="every-title">
				<text>教育经历</text>
			</view>
			<view v-if="resumeData.eduHistory.length == 0" class="every-main">添加教育经历</view>
			<view v-else class="every-main" v-for="(item, index) in resumeData.eduHistory" :key="index">
				<view class="list-one">
					<text class="list-one-left">{{ item.schoolName }}</text>
					<view class="list-one-right">
						<text>{{ formatTime(item.startTime ) + " - " + formatTime(item.endTime) }}</text>
					</view>
				</view>
				<view class="list-two">{{ item.formalSchool
          }}<text style="margin-left: 10rpx">{{ item.major }}</text>
				</view>
				<view class="list-three" v-if="item.achievement">
					<view class="three-title">在校经历：</view>
					<view class="three-main">{{ item.achievement }}</view>
				</view>
			</view>
		</view>
		<view class="resume-main-every">
			<view class="every-title">
				<text>资格证书</text>
			</view>
			<view v-if="resumeData.certificateMsg.length == 0" class="every-main">添加资格证书</view>
			<view v-else style="display: flex; flex-wrap: wrap">
				<view class="every-main" v-for="(item, index) in resumeData.certificateMsg" :key="index">
					<view class="list-one">
						<text class="list-one-left" style="
                margin-right: 20rpx;
                padding: 10rpx 30rpx;
                background-color: #EFF6FF;
              ">{{ item.certificateName }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.$baseUrl,
				collect: require("../../static/imgs/index/not.png"),
				collect1: require("../../static/imgs/index/yes.png"),
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
				detailsId: null,
				topConHeight: null,
			};
		},
		onLoad(option) {
			console.log(option)
			this.detailsId = option.userId;
			this.getUserMsg();
		},
		mounted() {
			const query = uni.createSelectorQuery().in(this);
			query
				.select("#user-details-top")
				.boundingClientRect((data) => {
					console.log(data);
					this.topConHeight = data.height;
				})
				.exec();
		},
		methods: {
			// 收藏/取消收藏个人
			isFavorite() {
				let list = [];
				list.push(this.detailsId);
				uni.request({
					url: this.$baseUrl + "/favoritePersonSave",
					method: "POST",
					data: {
						userIdList: list,
					},
					header: {
						"content-type": "application/json",
						token: uni.getStorageSync("token"),
					},
					complete: (res) => {
						console.log("收藏/取消收藏");
						console.log(res);

						if (this.checkBack(res, true) == false) return;
						else {
							if (this.resumeData.isCollect == 0) {
								uni.showToast({
									title: '已收藏',
									icon: 'none'
								})
							} else {
								uni.showToast({
									title: '已取消收藏',
									icon: 'none'
								})
							};
							this.getUserMsg();
						}
					},
				});
			},
			// 根据身份证号计算年龄
			idNumChange() {
				if (this.resumeData.birthday) {
					let idNumber = this.resumeData.birthday.split("-");
					let myDate = new Date();
					let month = myDate.getMonth() + 1;
					let day = myDate.getDate();
					let age = myDate.getFullYear() - idNumber[0] - 1;
					if (idNumber[1] < month || (idNumber[1] == month && idNumber[2] <= day)) {
						age++;
					}
					this.myMsgData.age = age;
				} else {
					this.myMsgData.age = '';
				}
			},

			// 获取简历信息
			getUserMsg() {
				uni.request({
					url: this.$baseUrl + "/userMsgInfo",
					method: "POST",
					header: {
						"content-type": "application/json",
						token: uni.getStorageSync("token"),
					},
					data: {
						userId: this.detailsId,
					},
					complete: (res) => {
						console.log("用户信息");
						console.log(res);
						if (res.data.code === 200) {
							this.resumeData = res.data.data;

							this.myMsgData.headPic = this.resumeData.headPic;
							this.myMsgData.name = this.resumeData.fullName;

							let time = this.resumeData.joinWorkTime.split("-");
							let myDate = new Date();
							let month = myDate.getMonth() + 1;
							let num = myDate.getFullYear() - time[0];
							// if (month > time[1]) {
							// 	num++;
							// }
							this.myMsgData.joinWorkTime = num;

							this.idNumChange();
						} else {
							this.resumeData = [];
						}
					},
				});
			},
			// 返回列表页
			goList() {
				uni.navigateBack({
					delta: 1,
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.resume-container {
		padding: 10rpx 0 36rpx;
		background-color: #fff;

		.container-top {
			padding: 40rpx;
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			display: flex;
			justify-content: space-between;
			background-color: #fff;
			z-index: 99;

			.top-left {
				display: flex;
				align-items: center;
				font-size: 30rpx;
				color: #061D4C;

				.top-left-img {
					width: 17rpx;
					height: 30rpx;
					margin-right: 30rpx;
				}
			}

			.top-right {
				width: 80rpx;
				height: 80rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				background: linear-gradient(to bottom, #5EDAF5, #5EB7F5);
				border-radius: 50%;

				.index-img {
					width: 48rpx;
					height: 46rpx;
				}
			}
		}

		.update-img {
			width: 32rpx;
			height: 32rpx;
		}

		.top-line {
			width: 100vw;
			// height: 10rpx;
			background-color: #EFF6FF;
		}

		.resume-main-one {
			padding: 30rpx 0;
			margin: 0 40rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			// border-top: 10rpx solid #EFF6FF;
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
			margin: 0 40rpx;
			border-bottom: 2rpx solid #f9f9f9;

			.every-title {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 30rpx;
				font-weight: bold;
				color: #061D4C;
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
				}
			}
		}
	}
</style>
