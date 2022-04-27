<template>
	<view class="">
		<view class="uni-p-b-98"></view>
		<tabBar v-if="role != 2" :pagePath="pagePath"></tabBar>
	</view>
</template>

<script>
	import tabBar from '../../components/tabbar.vue'
	export default {
		components: {
			tabBar
		},
		data() {
			return {
				pagePath: getApp().globalData.tabBarList[0].pagePath,
				role: uni.getStorageSync('role')
			}
		},
		created() {
			this.role = uni.getStorageSync('role');
			console.log(this.role);
			if (this.role != 2) {
				// uni.reLaunch({
				// 	url: this.pagePath
				// });
				uni.switchTab({
					url: this.pagePath
				})
			} else if(this.role == 2){
				uni.reLaunch({
					url: '../mine/mine'
				})
			}
		}
	}
</script>

<style>
</style>
