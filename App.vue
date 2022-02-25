<script>
	export default {
		data() {
			return {
				token: uni.getStorageSync('token')
			}
		},
		onLaunch() {
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
			
			this.token = uni.getStorageSync('token');
			if (this.token == '' || this.token == null) {
				uni.navigateTo({
					url: "pages/mine/login"
				})
			} else {
				this.getUserInfo();
			}
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
		background-color: #f9f9f9;
	}

	.no-data {
		padding-top: 450rpx;
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
