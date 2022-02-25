<template>
	<view class="search-container">
		<!-- 搜索页面 -->
		<view class="search-top">
			<view class="search-top-main">
				<navigator :url="'../common/city?cityNow=' + city" hover-class="none">
					<view class="top-main-city">{{city}}</view>
				</navigator>
				<view class="top-main-triangle"></view>
				<view class="top-main-line"></view>
				<uni-easyinput class="top-main-input" type="text" placeholder="搜索职位、公司"
					placeholder-style="color: #c3c3c3;font-size: 26rpx;" :inputBorder="false" v-model="keyword" />
			</view>
			<view class="search-top-button" v-show="keyword" @click="searchKeyword">搜索</view>
		</view>
		<view class="search-line"></view>
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
				searchKeyList: ['前端开发', '后端开发']
			}
		},
		onLoad() {
			// 城市
			uni.$on('selCity', (e) => {
				console.log('选中的城市值');
				console.log(e);
				this.city = e;
			});
		},
		methods: {
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

<style lang="scss" scoped>
	.search-container {
		height: 100vh;

		.search-top {
			padding: 20rpx 30rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.search-top-main {
				padding: 5rpx 30rpx;
				display: flex;
				flex: 1;
				align-items: center;
				background-color: #f9f9f9;
				border-radius: 60rpx;
				font-size: 30rpx;
				color: #c3c3c3;

				.top-main-city,
				.top-main-triangle,
				.top-main-line {
					margin-right: 10rpx;
				}

				.top-main-city {
					color: #7b7b7b;
				}

				.top-main-triangle {
					width: 0;
					height: 0;
					border-width: 10rpx 10rpx 0;
					border-style: solid;
					border-color: #c3c3c3 transparent transparent;
				}

				.top-main-line {
					width: 2rpx;
					height: 25rpx;
					background-color: #c3c3c3;
				}

				.top-main-input {
					flex: 1;
					color: #7b7b7b;
					font-size: 26rpx;
				}
			}

			.search-top-button {
				margin-left: 20rpx;
				font-size: 28rpx;
			}
		}

		.search-line {
			width: 100%;
			height: 2rpx;
			background-color: #ddd;
		}

		.search-history {
			padding: 40rpx 30rpx;

			.search-history-title {
				margin-bottom: 20rpx;
				font-size: 30rpx;
				font-weight: bold;
			}

			.search-history-main {
				display: flex;
				justify-content: flex-start;

				.history-main-every {
					padding: 10rpx 20rpx;
					margin-right: 10rpx;
					background-color: #f9f9f9;
					border-radius: 8rpx;
					font-size: 20rpx;
				}
			}
		}
	}
</style>
