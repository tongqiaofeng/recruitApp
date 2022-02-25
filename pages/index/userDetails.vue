<template>
	<view class="resume-container">
		<!-- 用户详细信息 -->
		<view class="container-top" id="user-details-top">
			<view class="top-left">
				<image @click="goList" class="top-left-img" src="../../static/imgs/common/back.png" mode="aspectFill">
				</image>
				<text>{{myMsgData.name}}</text>
			</view>
			<view class="top-right">
				<image class="index-img" :src="myMsgData.isCollect == 0 ? collect : collect1" mode="aspectFill"
					@click="isFavorite">
				</image>
			</view>
		</view>
		<view class="resume-main-one" :style="{'padding-top': topConHeight+'px'}">
			<view class="one-left">
				<view class="left-top">
					<text class="name">{{ myMsgData.name }}</text>
				</view>
				<text class="left-bottom">{{ myMsgData.joinWorkTime }}年经验-{{ myMsgData.age }}岁</text>
			</view>
			<view class="one-right">
				<image v-if="myMsgData.headPic" :src="imgUrl + '/' + myMsgData.headPic" mode="aspectFill"></image>
			</view>
		</view>
		<view class="resume-main-every">
			<view class="every-title">
				<text>个人优势</text>
			</view>
			<view class="every-main">
				<text>{{
            resumeData.skill == "" ? "输入个人优势" : resumeData.skill
          }}</text>
			</view>
		</view>
		<view class="resume-main-every">
			<view class="every-title">
				<text>求职期望</text>
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
		<view class="resume-main-every">
			<view class="every-title">
				<text>工作经历</text>
			</view>
			<view v-if="resumeData.workHistory.length == 0" class="every-main">添加工作经历</view>
			<view v-else class="every-main" v-for="(item, index) in resumeData.workHistory" :key="index">
				<view class="list-one">
					<text class="list-one-left">{{ item.companyName }}</text>
					<view class="list-one-right">
						<text>{{ item.startTime + "至" + item.endTime }}</text>
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
						<text>{{ item.startTime + "至" + item.endTime }}</text>
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
						<text>{{ item.startTime + "至" + item.endTime }}</text>
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
                  padding: 10rpx 40rpx;
                  background-color: #f9f9f9;
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
				collect: require("../../static/imgs/common/collect.png"),
				collect1: require("../../static/imgs/common/collect01.png"),
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
				topConHeight: null
			};
		},
		onLoad(option) {
			this.detailsId = option.userId;
			this.getUserMsg();
		},
		mounted() {
			const query = uni.createSelectorQuery().in(this);
			query.select('#user-details-top').boundingClientRect(data => {
				console.log(data);
				this.topConHeight = data.height;
			}).exec();
		},
		methods: {
			// 收藏/取消收藏职位
			isFavorite() {
				let list = [];
				list.push(this.detailsId);
				uni.request({
					url: this.$baseUrl + '/favoritePersonSave',
					method: 'POST',
					data: {
						userIdList: list
					},
					header: {
						"content-type": "application/json",
						token: uni.getStorageSync("token"),
					},
					complete: (res) => {
						console.log('收藏/取消收藏');
						console.log(res);

						if (this.checkBack(res, true) == false) return;
						else {
							this.getUserMsg();
						}
					}
				})
			},
			// 根据身份证号计算年龄
			idNumChange() {
				let idNumber = this.resumeData.birthday.split('-');
				let myDate = new Date();
				let month = myDate.getMonth() + 1;
				let day = myDate.getDate();
				let age = myDate.getFullYear() - idNumber[0] - 1;
				if (
					idNumber[1] < month ||
					(idNumber[1] == month &&
						idNumber[2] <= day)
				) {
					age++;
				}
				this.myMsgData.age = age;
			},

			// 获取简历信息
			getUserMsg() {
				uni.request({
					url: this.$baseUrl + "/userMsgInfo",
					method: 'POST',
					header: {
						"content-type": "application/json",
						token: uni.getStorageSync("token"),
					},
					data: {
						userId: this.detailsId
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
					delta: 1
				})
			},
		},
	};
</script>

<style lang="scss" scoped>
	.resume-container {
		padding: 0 40rpx;
		padding-bottom: 60rpx;

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
				font-size: 28rpx;

				.top-left-img {
					width: 17rpx;
					height: 30rpx;
					margin-right: 20rpx;
				}
			}

			.top-right {
				image {
					width: 40rpx;
					height: 38rpx;
				}
			}
		}


		.update-img {
			width: 32rpx;
			height: 32rpx;
		}

		.resume-main-one {
			padding: 40rpx 0;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 4rpx solid #f9f9f9;

			.one-left {
				.left-top {
					display: flex;
					align-items: center;
					font-size: 32rpx;
					font-weight: bold;

					.name {
						margin-right: 10rpx;
						letter-spacing: 4rpx;
					}
				}

				.left-bottom {
					margin-top: 20rpx;
					font-size: 22rpx;
					color: #808080;
				}
			}

			.one-right {
				image {
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
				}
			}
		}

		.resume-main-every {
			padding: 40rpx 0;
			border-bottom: 4rpx solid #f9f9f9;

			.every-title {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 28rpx;
				font-weight: bold;
			}

			.every-main {
				margin-top: 40rpx;
				font-size: 24rpx;
				color: #808080;
				text-align: left;

				.list-one {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.list-one-left {
						font-size: 24rpx;
						color: #000;
					}

					.list-one-right {
						display: flex;
						align-items: center;

						text {
							margin-right: 20rpx;
							font-size: 22rpx;
							color: #c3c3c3;
						}
					}
				}

				.list-two {
					margin-top: 20rpx;
					color: #c3c3c3;
				}

				.list-three {
					.three-title {
						padding: 40rpx 0 20rpx;
					}

					// .three-main {
					// 	max-height: 80rpx;
					// 	overflow: hidden;
					// 	text-overflow: ellipsis;
					// 	display: -webkit-box;
					// 	-webkit-line-clamp: 2;
					// 	-webkit-box-orient: vertical;
					// }
				}
			}
		}

		.resume-button {
			padding: 20rpx;
			margin-top: 80rpx;
			background-color: #85dbd0;
			border-radius: 12rpx;
			color: #fff;
			font-size: 24rpx;
			text-align: center;
		}
	}
</style>
