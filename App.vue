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
			isRed: false
		},
		data() {
			return {
				token: uni.getStorageSync('token'),
			}
		},
		onLaunch() {
			this.token = uni.getStorageSync('token');
			console.log('token的值', this.token)
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
					} //else {

					// }
				}
			})
			//#endif  
		},
		onShow() {
			this.$store.dispatch('reconnect')
			console.log('App Show');
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
