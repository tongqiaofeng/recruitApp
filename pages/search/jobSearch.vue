<template>
	<view class="search-container">
		<!-- 搜索页面 -->
		<view class="search-top">
			<view class="search-top-main">
				<navigator style="display: flex;align-items: center;" :url="'../common/city?cityNow=' + city" hover-class="none">
					<view class="top-main-city">{{city}}</view>
					<image class="top-main-triangle" src="../../static/imgs/index/to_bottom.png" mode="aspectFill">
					</image>
				</navigator>
				<uni-easyinput prefixIcon="search" class="top-main-input" type="text" placeholder="搜索职位、公司"
					placeholder-style="color: #ADBBD1;font-size: 26rpx;" :inputBorder="false" v-model="keyword" />
			</view>
			<view class="search-top-button" @click="searchKeyword">确定</view>
		</view>
		<view class="search-history">
			<view class="search-history-title">历史搜索</view>
			<view class="search-history-main">
				<view class="history-main-every" v-for="(item, index) in searchKeyList" :key="index"
					@click="selHistory(item)">
					{{item}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				city: "成都",
				keyword: "",
				searchKeyList: []
			}
		},
		onLoad() {
			this.getKeywordHistory();
			// 城市
			uni.$on('selCity', (e) => {
				console.log('选中的城市值');
				console.log(e);
				this.city = e;
			});
		},
		methods: {
			// 获取模糊搜索记录
			getKeywordHistory(){
				uni.request({
					url: this.$baseUrl + '/jobSearchKeywordList',
					header: {
						"content-type": "application/json",
						"token": uni.getStorageSync('token')
					},
					complete: (res) => {
						console.log('历史搜索');
						console.log(res);
						this.searchKeyList = res.data.data;
					}
				})
			},
			// 模糊搜索
			searchKeyword() {
				uni.$emit('searchKeyword', {
					city: this.city,
					keyword: this.keyword
				});
				uni.navigateBack({
					delta: 1
				})
			},
			// 选择历史搜索进行搜索
			selHistory(item) {
				this.keyword = item;
				this.searchKeyword();
			}
		},
	}
</script>

<style lang="scss">
	.uni-easyinput {
		color: #ADBBD1 !important;
	}
</style>
<style lang="scss" scoped>
	.search-container {
		height: 100vh;
		padding: 30rpx 29rpx 0;
		background-color: #f3f7fa;

		.search-top {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.search-top-main {
				display: flex;
				flex: 1;
				align-items: center;

				.top-main-city {
					color: #061D4C;
					font-size: 26rpx;
				}

				.top-main-triangle {
					width: 20rpx;
					height: 12rpx;
					margin: 0 16rpx;
				}

				.top-main-input {
					flex: 1;
					color: #ADBBD1;
					font-size: 26rpx;
					background-color: #fff;
					border-radius: 33rpx;
				}
			}

			.search-top-button {
				margin-left: 20rpx;
				font-size: 28rpx;
			}
		}
		
		.search-history {
			margin-top: 20rpx;
			padding: 29rpx 29rpx 37rpx;
			background-color: #fff;
			border-radius: 20rpx;

			.search-history-title {
				margin-bottom: 37rpx;
				font-size: 30rpx;
				font-weight: bold;
				color: #061D4C;
			}

			.search-history-main {
				display: flex;
				justify-content: flex-start;

				.history-main-every {
					padding: 7rpx 10rpx;
					margin-right: 30rpx;
					background-color: #f3f7fa;
					border-radius: 8rpx;
					font-size: 22rpx;
					color: #061D4C;
				}
			}
		}
	}
</style>
