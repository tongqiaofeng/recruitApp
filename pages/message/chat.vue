<template>
	<view>
		<view class="chat-top">
			<view class="chat-top-left">
				<image @click="goBack" class="left-img" src="../../static/imgs/common/back.png" mode="aspectFill">
				</image>
				<view class="left-main">
					<image v-if="headPic == null || headPic == ''" class="left-main-img"
						src="../../static/imgs/mine/avatar.png" mode="aspectFill">
					</image>
					<image v-else class="left-main-img" :src="baseUrl + '/' + headPic" mode="aspectFill">
					</image>
					<view class="left-main-font">
						<view class="font-name">
							{{userName}}
						</view>
						<!-- <view class="font-company">
							{{companyName}}
						</view> -->
					</view>
				</view>
			</view>
			<view class="chat-top-right">
				<image class="right-img-phone" src="../../static/imgs/message/phone.png" mode="aspectFill"
					@click="callPhone"></image>
				<navigator url="./moreOperations" hover-class="none" style="display: flex;align-items: center;">
					<image class="right-img-more" src="../../static/imgs/message/more.png" mode="aspectFill"></image>
				</navigator>
			</view>
		</view>
		<scroll-view v-if="msgList" scroll-y="true" class="msgLst" :style="{ height: scrollHeight + 'px' }"
			:scroll-into-view="scrollIntoView" scroll-with-animation="true">
			<view v-if="loadMore && msgList.length > 0" class="loadMore" @click="loadMoreMsg">
				查看更多消息
			</view>
			<view class="item" v-for="(msg, index) in msgList" :key="index" :id="'msg_' + index">
				<view style="margin-bottom: 20rpx; font-size: 28rpx">
					<!-- 时间显示 -->
					<view v-if="msg.showTime" class="time">
						{{ msg.showTime }}
					</view>
					<!-- 消息 -->
					<view v-if="isSelf(msg.sender)" style="display: flex">
						<view style="flex: 1"></view>
						<text v-if="msg.contentType == 0" class="msg-right">{{ msg.contentText }}</text>
						<image v-else-if="msg.contentType == 1" class="msgPic" :src="msg.contentPic" mode="widthFix"
							@click="previewImage(msg.contentPic)"></image>
						<!-- <image v-if="msg.contentType == 0" src="../../static/imgs/chat/r.png" mode="aspectFill" style="width: 30rpx; height: 30rpx; margin-left: -8rpx; margin-top: 20rpx;"></image> -->
						<image class="head" style="margin-left: 20rpx" :src="getUserHead(msg.sender)" mode="aspectFill">
						</image>
						<!-- <view v-if="msg.readStatus == -1">发送中</view> -->
						<!-- <view @click="chat_deleteMsgCmd(msg.receiver, msg.id)">撤销</view> -->
					</view>
					<view v-else style="display: flex">
						<image class="head" :src="getUserHead(msg.sender)" mode="aspectFill"></image>
						<!-- <image v-if="msg.contentType == 0" src="../../static/imgs/chat/l.png" mode="aspectFill" style="width: 30rpx; height: 30rpx; margin-right: -8rpx; margin-top: 20rpx;"></image> -->
						<text v-if="msg.contentType == 0" class="msg">{{
              msg.contentText
            }}</text>
						<image v-else-if="msg.contentType == 1" class="msgPic" :src="msg.contentPic" mode="widthFix"
							@click="previewImage(msg.contentPic)"></image>
						<!-- <view v-if="msg.readStatus == -1">发送中</view> -->
					</view>
				</view>
			</view>
			<view style="height: 10rpx"></view>
		</scroll-view>
		<view class="send">
			<textarea class="sendText" type="text" value="" v-model="content" @click="changeMode(0)" />
			<button v-if="content.length > 0" class="sendBtn" type="default" @click="sendMsg(content, 0)">
				发送
			</button>
			<image v-else class="sendBtn2" src="../../static/imgs/chat/add.png" mode="aspectFill" @click="changeMode()">
			</image>
		</view>
		<view v-if="mode == 1" class="picMode">
			<view class="" @click="actionMode(0)">
				<image class="btnPic" src="../../static/imgs/chat/pic.png" mode="aspectFill"></image>
				<view class="btnTxt">相册</view>
			</view>
			<view class="" @click="actionMode(1)">
				<image class="btnPic" src="../../static/imgs/chat/video.png" mode="aspectFill"></image>
				<view class="btnTxt">拍摄</view>
			</view>
		</view>
	</view>
</template>

<script>
	import $T from "@/common/free-lib/time.js";
	export default {
		data() {
			return {
				baseUrl: this.$baseUrl,
				userId: "",
				headPic: '',
				userName: '',
				companyName: '',
				content: "",

				msgList: [],
				msgPicList: [],

				scrollHeight: 500,
				scrollIntoView: "",
				mode: 0,
				loadMore: true,
			};
		},
		onLoad(e) {
			console.log(e)
			this.userId = e.id;
			if (e.headPic != null) this.headPic = e.headPic;
			console.log('4444', this.headPic)
			this.userName = e.name;
			getApp().globalData.chatUserId = this.userId;

			uni.$on("userMsgUpdate", (data) => {
				this.flushData();
			});
		},
		onShow() {
			this.chat_updateUserMsg(this.userId);
		},
		onReady() {
			this.calcHeight();
		},
		methods: {
			// 电话联系
			callPhone() {
				uni.makePhoneCall({
					phoneNumber: this.userName //仅为示例
				});
			},
			// 返回上一层
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			// 发送消息
			sendMsg(txt, type) {
				this.chat_sendMsgToUserCmd(this.userId, txt, type);
				this.content = "";
				this.changeMode(0);
			},
			// 获取聊天记录
			flushData() {
				let userIdx = this.chat_findUser(this.userId);
				if (userIdx > -1) {
					let oldStartMsgId = 0;
					let oldEndMsgId = 0;
					if (this.msgList.length > 0) {
						oldStartMsgId = this.msgList[0].id;
						oldEndMsgId = this.msgList[this.msgList.length - 1].id;
					}
					this.msgList = [];
					this.msgPicList = [];
					let temp = {};
					for (
						let i = 0; i < getApp().globalData.userList[userIdx].msgList.length;
						++i
					) {
						temp = getApp().globalData.userList[userIdx].msgList[i];
						//处理图片
						if (temp.contentType == 1) {
							temp.contentPic = this.baseUrl + "/" + temp.contentText;
							this.msgPicList.push(temp.contentPic);
						}

						this.msgList.push(temp);

						//处理时间
						this.msgList[i].showTime = this.getMsgTime(i);
					}

					if (this.msgList.length > 0) {
						let newStartMsgId = this.msgList[0].id;
						let newEndMsgId = this.msgList[this.msgList.length - 1].id;

						if (oldEndMsgId != newEndMsgId) this.scrollToMsg();

						if (this.msgList[0].isLastHistory) this.loadMore = false;
						else this.loadMore = true;
					} else {
						this.loadMore = false;
					}
				}
				console.log('聊天信息');
				console.log(this.msgList)
			},
			// 消息时间
			getMsgTime(idx) {
				let time1 = 0;
				let time2 = $T.ISO8601DateStr2Date(this.msgList[idx].time);
				if (idx > 0) {
					time1 = $T.ISO8601DateStr2Date(this.msgList[idx - 1].time);
				}
				let ret = $T.getChatTime(time2, time1);
				return ret;
			},
			scrollToMsg() {
				setTimeout(() => {
					this.scrollIntoView = "msg_" + (this.msgList.length - 1);
				}, 200);
			},
			loadMoreMsg() {
				this.chat_getMsgHistoryCmd(this.userId, true);
			},
			calcHeight() {
				let that = this;
				uni.getSystemInfo({
					success(res) {
						let windownHeight = res.windowHeight; //windoHeight为窗口高度，主要使用的是这个
						let svTop = 0;
						let sv = uni.createSelectorQuery().select(".msgLst"); //想要获取高度的元素名（class/id）
						sv.boundingClientRect((data) => {
							svTop = data.top; //计算高度：元素高度=窗口高度-元素距离顶部的距离（data.top）
						}).exec();

						let send = uni.createSelectorQuery().select(".send"); //想要获取高度的元素名（class/id）
						send
							.boundingClientRect((data) => {
								that.scrollHeight = windownHeight - svTop - data.height;
							})
							.exec();

						console.log(that.scrollHeight);
					},
				});
			},
			isSelf(sender) {
				if (getApp().globalData.chatInfo.userId == sender) return true;
				else return false;
			},
			getUserHead(userId) {
				let headPic = "";
				if (getApp().globalData.userInfo.userId == userId) {
					headPic = getApp().globalData.userInfo.userHeadPic;
				} else {
					let userList = getApp().globalData.userList;
					for (let i = 0; i < userList.length; ++i) {
						if (userList[i].userId == userId) {
							headPic = userList[i].head_pic;
							break;
						}
					}
				}

				if (headPic) return this.baseUrl + "/" + headPic;
				else return "../../static/imgs/mine/avatar.png";
			},
			changeMode(mode) {
				if (mode == 0) {
					if (this.mode == 1) {
						this.mode = 0;
						this.scrollHeight += uni.upx2px(300);
					}
				} else if (this.mode == 0) {
					this.mode = 1;
					this.scrollHeight -= uni.upx2px(300);
				} else {
					this.mode = 0;
					this.scrollHeight += uni.upx2px(300);
				}
			},
			actionMode(type) {
				if (type == 0) {
					//图片
					uni.chooseImage({
						count: 9,
						sourceType: ["album"], //从相册选择
						success: (res) => {
							console.log("图片选择成功", res);
							this.sendpic(res);
						},
					});
				} else if (type == 1) {
					//拍摄
					uni.chooseImage({
						count: 9,
						sourceType: ["camera"], //从选择
						success: (res) => {
							this.sendpic(res);
						},
					});
				}
			},
			// 发送图片
			sendpic(res) {
				const tempFilePaths = res.tempFilePaths;
				let promiseWorkList = [];
				for (let i = 0; i < tempFilePaths.length; i++) {
					promiseWorkList.push(
						new Promise((resolve, reject) => {
							console.log("上传项", tempFilePaths[i]);
							uni.uploadFile({
								url: this.baseUrl + "/upload",
								fileType: "image",
								filePath: tempFilePaths[i],
								name: "upload-images",
								success: (res) => {
									console.log("上传成功", res);
									if (res.statusCode === 200) {
										console.log("图片信息", res.data);
										let pic = res.data.split("|")[0];
										this.sendMsg(pic, 1);
									} else {
										console.log()("failt to upload image:", res);
										uni.showToast({
											title: "图片上传失败",
											icon: "none",
											duration: 2000,
										});
									}
								},
								fail: (res) => {
									console.log("failt to upload image:", res);
									uni.showToast({
										title: "网络连接失败",
										icon: "none",
										duration: 2000,
									});
								},
							});
						})
					);
				}
			},
			// 预览图片
			previewImage(url) {
				uni.previewImage({
					current: url,
					urls: this.msgPicList,
					indicator: "default",
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.chat-top {
		padding: 57rpx 30rpx 17rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;
		border-bottom: 4rpx solid #F3F7FA;

		.chat-top-left {
			display: flex;
			align-items: center;

			.left-img {
				width: 17rpx;
				height: 30rpx;
				margin-right: 30rpx;
			}

			.left-main {
				display: flex;
				align-items: center;

				.left-main-img {
					width: 66rpx;
					height: 66rpx;
					margin-right: 20rpx;
					border-radius: 50%;
				}

				.left-main-font {
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					.font-name {
						font-size: 28rpx;
						color: #061D4C;
						font-weight: bold;
					}
				}
			}
		}

		.chat-top-right {
			display: flex;
			align-items: center;

			.right-img-phone {
				width: 27rpx;
				height: 27rpx;
				margin-right: 50rpx;
			}

			.right-img-more {
				width: 30rpx;
				height: 6rpx;
			}
		}
	}

	.msgLst {
		background-color: #fff;

		.loadMore {
			text-align: center;
			font-size: 28rpx;
			color: #444444;
			margin: 20rpx;
		}

		.item {
			margin: 20rpx;
			font-size: 28rpx;

			.head {
				width: 80rpx;
				height: 80rpx;
				border-radius: 80rpx;
				margin-right: 20rpx;
			}

			.time {
				text-align: center;
				font-size: 22rpx;
				color: #888888;
				padding: 20rpx;
			}

			.msg {
				max-width: 450rpx;
				padding: 18rpx 19rpx 18rpx 21rpx;
				word-wrap: break-word;
				background-color: #F5F6FA;
				border-radius: 0 10rpx 10rpx;
				font-size: 28rpx;
				color: #061D4C;
			}

			.msg-right {
				max-width: 450rpx;
				padding: 18rpx 20rpx 18rpx 27rpx;
				word-wrap: break-word;
				font-size: 28rpx;
				background-color: #5EB7F5;
				color: #fff;
				border-radius: 10rpx 0 10rpx 10rpx;
			}

			.msgPic {
				max-width: 250rpx;
				background-color: #ffffff;
				border-radius: 10rpx;
				border: 1rpx solid #cccccc;
			}

			.tip {
				display: flex;
				flex-direction: column;
				align-items: center;
				margin-top: 60rpx;
				margin-bottom: 40rpx;
			}
		}
	}

	.send {
		background-color: #f7f7f7;
		padding: 20rpx;
		display: flex;
		align-items: center;

		.sendText {
			height: 80rpx;
			line-height: 80rpx;
			padding: 0rpx 20rpx;
			font-size: 32rpx;
			flex: 1;
			border-radius: 10rpx;
			background-color: #ffffff;
			margin-right: 20rpx;
		}

		.sendBtn {
			font-size: 30rpx;
			height: 80rpx;
			line-height: 80rpx;
			background-color: #85dbd0;
			color: #ffffff;
		}

		.sendBtn2 {
			width: 50rpx;
			height: 50rpx;
		}
	}

	.picMode {
		height: 300rpx;
		padding: 40rpx 80rpx;
		background-color: #f7f7f7;
		border-top: 1rpx solid #e3e3e3;
		display: flex;

		.btnPic {
			width: 100rpx;
			height: 100rpx;
			margin-right: 80rpx;
		}

		.btnTxt {
			font-size: 26rpx;
			width: 100rpx;
			text-align: center;
		}
	}
</style>
