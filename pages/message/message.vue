<template>
	<view class="message-container">
		<view class="message-top">
			<view class="top-one">
				<view class="one-title">
					消息中心
				</view>
				<navigator url="./allNotifications" hover-class="none">
					<image class="one-img" src="../../static/imgs/message/msg_show.png" mode="aspectFill"></image>
				</navigator>
			</view>
			<view class="top-two" v-if="!notificationIsOpen">
				<view class="two-left">
					<image class="left-img" src="../../static/imgs/message/close.png" mode="aspectFill"></image>
					<view class="left-font">
						打开系统通知，信息不错过
					</view>
				</view>
				<view class="two-right">
					开启
				</view>
			</view>
		</view>
		<view class="user-list">
			<view class="user">
				<view style="position: relative">
					<image class="head" src="../../static/imgs/message/big_show.png" mode="aspectFill"></image>
				</view>
				<view class="user-main">
					<view style="display: flex; justify-content: space-between">
						<view class="name">系统消息</view>
						<view class="time">{{symbolMsg.title}}</view>
					</view>
					<view class="msg">
						<view>{{ symbolMsg.time }}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="userList.length > 0">
			<option-list :list="userList" :threshold="threshold" @click="rowClick" @optionClick="optionClick"
				:options="options">
			</option-list>
		</view>
		<!-- <view v-if="userList.length == 0">
			<view style="font-size: 30rpx; text-align: center; margin-top: 300rpx">暂无聊天记录</view>
		</view> -->
		<view class="uni-p-b-98"></view>
		<tabBar :pagePath="'/pages/message/message'"></tabBar>
	</view>
</template>

<script>
	import tabBar from "../../components/tabbar.vue";
	import optionList from '@/components/gzz-option-list/option-list.vue';
	export default {
		components: {
			tabBar,
			optionList
		},
		data() {
			return {
				userId: "",
				userList: [],
				adminMsgList: [],
				symbolMsg: {
					title: '系统消息',
					time: '08:30'
				},

				options: [ //左滑的操作列表
					{
						color: '#ffffff',
						bgColor: '#D7DFEC',
						text: '置顶',
						width: 120,
					},
					{
						color: '#ffffff',
						bgColor: '#D7DFEC',
						text: '取消置顶',
						width: 180,
					},
					{
						color: '#ffffff', //字体颜色，非必须，默认 #ffffff
						bgColor: '#FF4533', //背景颜色，非必须，默认 #409EFF
						text: '删除', //展示文字
						width: 120, //按钮宽度 默认120rpx 适合两个字的宽度 这个宽度按需调整
					}
				],
				threshold: 50,

				notificationIsOpen: true,
			};
		},
		onShow() {
			//this.chat_updateUserMsg(0);

			//#ifdef APP-PLUS
			console.log('是否已开启消息通知')
			var main = plus.android.runtimeMainActivity();
			var pkName = main.getPackageName();
			var NotificationManagerCompat = plus.android.importClass("android.support.v4.app.NotificationManagerCompat");
			var packageNames = NotificationManagerCompat.from(main);
			console.log(JSON.stringify(packageNames));

			if (packageNames.areNotificationsEnabled()) {
				console.log('已开启通知权限');
				this.notificationIsOpen = true;
			} else {
				this.notificationIsOpen = false;
				console.log('未开启通知权限');
				uni.showModal({
					title: '提示',
					content: '请先打开APP通知权限',
					showCancel: false,
					success: (res) => {
						if (res.confirm) {
							var Intent = plus.android.importClass('android.content.Intent');
							var intent = new Intent(
								'android.settings.APP_NOTIFICATION_SETTINGS'); //可设置表中所有Action字段  
							intent.putExtra('android.provider.extra.APP_PACKAGE', pkName);
							main.startActivity(intent);
						}
					}
				});
			}

			var UIApplication = plus.ios.import("UIApplication");
			var app = UIApplication.sharedApplication();
			var enabledTypes = 0;
			if (app.currentUserNotificationSettings) {
				var settings = app.currentUserNotificationSettings();
				enabledTypes = settings.plusGetAttribute("types");
			} else {
				//针对低版本ios系统  
				enabledTypes = app.enabledRemoteNotificationTypes();
			}
			plus.ios.deleteObject(app);

			if (0 == enabledTypes) {
				this.notificationIsOpen = false;
				console.log('未开启通知权限');
				uni.showModal({
					title: '提示',
					content: '请先打开APP通知权限',
					showCancel: false,
					success: (res) => {
						if (res.confirm) {
							var UIApplication = plus.ios.import("UIApplication");
							var NSURL = plus.ios.import("NSURL");
							var setting = NSURL.URLWithString("app-settings:");
							var application = UIApplication.sharedApplication();
							application.openURL(setting);
							plus.ios.deleteObject(setting);
							plus.ios.deleteObject(application);
						}
					}
				});
			} else {
				console.log('已开启通知权限');
				this.notificationIsOpen = true;
			};
			//#endif
			
			this.flushData();
			this.chat_updateReddot();
		},
		onLoad() {

		},
		methods: {
			listDelete(item, index) {
				console.log('删除');
				console.log(item);
				uni.showModal({
					content: '删除后，将清空该聊天的消息记录',
					cancelText: '取消',
					cancelColor: '#061D4C',
					confirmText: '删除',
					confirmColor: '#FF4533',
					success: (res) => {
						if (res.confirm) {
							let msg = {
								type: "remove",
								token: getApp().globalData.chatInfo.token,
								userId: item.userId
							};
							this.chat_sendToServer(msg);
							this.delMsg(item);
							this.userList = getApp().globalData.userList;
						}
					}
				})
			},
			listEdit(item) {
				console.log('置顶');
				console.log(item);

				let msg = {
					type: "top",
					token: getApp().globalData.chatInfo.token,
					userId: item.userId,
					top: 1
				};
				this.chat_sendToServer(msg);
				item.top = 1;
				this.topMsg(item);
				this.userList = getApp().globalData.userList;
			},
			// 取消置顶
			cancelEdit(item) {
				console.log('取消置顶');
				console.log(item);

				let msg = {
					type: "top",
					token: getApp().globalData.chatInfo.token,
					userId: item.userId,
					top: 0
				};
				this.chat_sendToServer(msg);
				item.top = 0;
				this.topMsg(item);
				this.userList = getApp().globalData.userList;
			},
			rowClick(item) {
				console.log('点击某一行');
				console.log(item);
				if (item) {
					uni.navigateTo({
						url: './chat?id=' + item.userId + '&name=' + item.username + '&headPic=' + item.head_pic
					})
				}
			},
			optionClick(item, oitem) {
				console.log('点击某个操作按钮');
				console.log(item, oitem)
				if (oitem.text == '删除') { //这里直接根据text判断点击了哪个按钮，也可自自己增加唯一标识key，当然也可以自己在组件按需定义对应事件
					this.listDelete(item);
				} else if (oitem.text == '置顶') {
					this.listEdit(item);
				} else if (oitem.text == '取消置顶') {
					this.cancelEdit(item);
				}
			},
			// 获取聊天列表
			flushData() {
				// this.topMsg();
				this.userList = getApp().globalData.userList;
				this.adminMsgList = getApp().globalData.adminList;
				console.log("userList数据");
				console.log(this.userList);
				console.log('adminMsgList数据', this.adminMsgList)

				// this.chat_updateReddot();
			},
		},
	};
</script>

<style lang="scss" scoped>
	.item {
		// width: 100%;
		padding: 0 20px;
		height: 100%;
		display: flex;
		align-items: center;

		.item-img {
			width: 40px;
			height: 40px;
		}
	}

	.message-container {
		.message-top {
			padding-top: 85rpx;
			// padding-top: 120rpx;
			padding-bottom: 20rpx;
			background-color: #F3F7FA;

			.top-one {
				padding: 0 29rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.one-title {
					color: #061D4C;
					font-size: 36rpx;
					font-weight: bold;
				}

				.one-img {
					width: 30rpx;
					height: 32rpx;
				}
			}

			.top-two {
				margin: 40rpx 0 0;
				padding: 18rpx 29rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				background: linear-gradient(to right, rgba(94, 218, 245, 0.12), rgba(94, 183, 245, 0.12));

				.two-left {
					display: flex;
					align-items: center;

					.left-img {
						width: 20rpx;
						height: 20rpx;
						margin-right: 30rpx;
					}

					.left-font {
						font-size: 20rpx;
						color: #5EB7F5;
					}
				}

				.two-right {
					padding: 6rpx 20rpx;
					border-radius: 18rpx;
					background: linear-gradient(to right, #5EDAF5, #5EB7F5);
					color: #fff;
					font-size: 20rpx;
				}
			}
		}

		.user-list {
			padding: 20rpx 30rpx;

			.user {
				display: flex;
				align-items: center;

				.head {
					width: 100rpx;
					height: 100rpx;
					margin-right: 30rpx;
					border-radius: 80rpx;
				}

				.user-main {
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: space-around;

					.name {
						font-size: 28rpx;
						color: #061D4C;
						font-weight: bold;
					}

					.time {
						font-size: 22rpx;
						color: #516483;
					}

					.msg {
						font-size: 22rpx;
						color: #97A9C6;
					}

					.msg-and-num {
						margin-top: 12rpx;
						display: flex;
						justify-content: space-between;

						.num {
							margin-top: -8rpx;

							.num-red {
								width: 36rpx;
								height: 36rpx;
								line-height: 36rpx;
								text-align: center;
								background-color: #FF4533;
								color: #fff;
								font-size: 24rpx;
								border-radius: 50%;
							}

							.num-coll {
								width: 64rpx;
								height: 36rpx;
								display: flex;
								align-items: center;
								justify-content: center;
								background-color: #C1CEE3;
								border-radius: 18rpx;

								.circle {
									width: 4rpx;
									height: 4rpx;
									margin: 0 4rpx;
									background-color: #fff;
									border-radius: 50%;
								}
							}
						}
					}
				}
			}
		}
	}
</style>
