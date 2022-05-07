<script>
	export default {
		globalData: {
			userInfo: {},
			chatInfo: {
				userId: 0,
				token: ''
			},
			userList: [], //聊天用户列表
			chatUserId: '', //当前与我聊天的用户的userId
			adminList: [],
			tabBarList: [{
					"pagePath": "/pages/index/personageIndex",
					"text": "找工作",
					"iconPath": "/static/imgs/tabBar/work.png",
					"selectedIconPath": "/static/imgs/tabBar/work01.png"
				},
				{
					"pagePath": "/pages/message/message",
					"text": "消息",
					"iconPath": "/static/imgs/tabBar/msg.png",
					"selectedIconPath": "/static/imgs/tabBar/msg01.png"
				},
				{
					"pagePath": "/pages/mine/mine",
					"text": "我的",
					"iconPath": "/static/imgs/tabBar/mine.png",
					"selectedIconPath": "/static/imgs/tabBar/mine01.png"
				}
			],
			isRed: false,
			cid: null
		},
		data() {
			return {
				token: uni.getStorageSync('token'),
			}
		},
		onLaunch() {
			this.token = uni.getStorageSync('token');
			console.log('token的值', this.token);

			if (!this.token) {
				uni.reLaunch({
					url: 'pages/mine/login',
					success: () => {
						//#ifdef APP-PLUS  
						plus.navigator.closeSplashscreen();
						//#endif
					}
				})
			} else {
				this.getUserInfo();
				//#ifdef APP-PLUS  

				setTimeout(() => {
					/*在应用安装后第一次运行时应该调用5+ API的plus.push.getClientInfo方法获取客户端标识，
					并将此标识提交到开发者的业务服务器进行注册设备，以便在用户登录时可绑定设备，实现向登录用户推送专属消息。*/
					//#ifdef APP-PLUS
					let pinf = plus.push.getClientInfo();
					let cid = pinf.clientid; //客户端标识
					console.log('客户端标识', cid);
					getApp().globalData.cid = cid;
					//#endif

					this.chat_connectServer();
				}, 1000)


				plus.navigator.closeSplashscreen();
				//#endif
			}

			// #ifdef APP-PLUS-NVUE
			// 加载公共图标库
			const domModule = weex.requireModule('dom')
			domModule.addRule('fontFace', {
				'fontFamily': "iconfont",
				'src': "url('https://at.alicdn.com/t/font_2961319_02fxlfneetwr.ttf?t=1637726330205') ";
			});
			// #endif

			// 监听键盘高度变化
			uni.onKeyboardHeightChange(res => {
				this.$store.commit('changeKeyboardHeight', res.height)
			})

			//#ifdef APP-PLUS  
			console.log('APP升级更新');
			let type = uni.getSystemInfoSync().platform;
			let version = plus.runtime.version.split('.').join('');

			let req = { //升级检测数据
				type: type
			};

			uni.request({
				url: this.$baseUrl + "/versionGet",
				data: req,
				success: (res) => {
					console.log('APP升级更新信息获取成功');
					console.log(res);
					if (res.data.version != version) {
						uni.showModal({ //提醒用户更新  
							title: "更新提示",
							content: "新版本已经准备好，是否立即更新？",
							cancelText: "稍后进行",
							confirmText: "立即更新",
							confirmColor: "#85dbd0",
							success: (ret) => {
								if (ret.confirm) {
									plus.runtime.openURL(res.data.url);
								}
							}
						})
					}
				}
			})

			// 监听点击通知栏消息事件
			plus.push.addEventListener("click", (message) => {
				console.log('点击通知栏消息进行对应跳转', message);

				// 清空系统通知栏中该应用的所有通知消息
				plus.push.clear();
			});
			// 透传消息： 即自定义消息，UniPush推送服务只负责消息传递，不做任何处理，客户端在接收到透传消息后需要自己去处理消息的展示方式或后续动作。
			// 监听接收透传消息事件，透传消息在系统通知栏中不显示，前端要进行显示处理
			plus.push.addEventListener("receive", (message) => {
				console.log('透传消息');
				console.log(message);

				// 判断不在app内，应用后台运行，创建本地消息并添加到系统通知栏
				if (plus.os.name != 'iOS') {
					if (getApp().globalData.isWithinProgram == false) {
						console.log('正式透传消息要不在应用内进行消息显示');
						// content: ( String ) 必选
						// 消息显示的内容，在系统通知中心中显示的文本内容。
						// payload: ( String ) 可选
						// 消息承载的数据，可根据业务逻辑自定义数据格式。
						// options: ( MessageOptions ) 可选
						// 创建消息的额外参数，参考MessageOptions。
						// (content, payload, option);

						let msg = JSON.parse(message.content).contentText;
						let options = {
							cover: false, // 不覆盖上一次提示的消息
							sound: 'system', // 使用系统提示音
							title: message.title
						};

						plus.push.createMessage(msg, message.payload, options);
					}
				}


				// if (message.aps) {
				//   // Apple APNS message
				//   // APNS下发的消息，应用在前台,要是要显示消息，要通过plus.push.createMessage创建本地消息，应用在后台未离线会自动创建
				// } else if ("LocalMSG" == message.payload) {
				//   // 特殊payload标识本地创建的消息
				//   // 本地创建的消息，通常不需要处理
				//   // 注意：不要在这种情况下在此调用plus.push.createMessage，从而引起循环创建本地消息
				// } else {
				//   // 接收到在线透传消息
				// }
			});

			//#endif  
		},
		onShow() {
			this.$store.dispatch('reconnect')
			console.log('App Show');
			if (!this.token) {
				uni.reLaunch({
					url: 'pages/mine/login',
					success: () => {
						//#ifdef APP-PLUS  
						plus.navigator.closeSplashscreen();
						//#endif
					}
				})
			}
		},
		onHide() {
			console.log('App Hide');
		}
	}
</script>

<style lang="scss">
	@import "@/uni_modules/uview-ui/index.scss";
	@import "./common/free.css";
	@import "./common/common.css";
	/* #infdef APP-PLUS-NVUE */
	@import "./common/free-icon.css";

	/*每个页面公共css */
	.page-container {
		height: 100vh;
		background-color: #f3f7fa;
	}

	.uni-p-b-98 {
		padding-bottom: 100rpx;
	}

	.no-data {
		padding-top: 250rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		image {
			width: 222rpx;
			height: 152rpx;
		}

		text {
			margin-top: 40rpx;
			font-size: 26rpx;
			color: #c8c8c8;
		}
	}
</style>
