<template>
	<view class="">
		<!-- 城市选择 -->
		<lhSelectCity :value="value" :windowHeight="windowHeight" :hotCitys="hotCitys" @onSelect="cityClick" />
	</view>
</template>

<script>
	import lhSelectCity from '@/js_sdk/lh-select-city/index.nvue'
	export default {
		components: {
			lhSelectCity
		},
		data() {
			return {
				hotCitys: [
					'杭州',
					'天津',
					'北京',
					'上海',
					'深圳',
					'广州',
					'成都',
					'重庆',
					'厦门'
				],
				value: '',
				windowHeight: ""
			}
		},
		onLoad(option) {
			// 计算出可用高度
			this.windowHeight = uni.getSystemInfoSync().windowHeight - 20 + "px";
			console.log(option);
			this.value = option.cityNow;
		},
		methods: {
			// 选中事件
			cityClick(city) {
				console.log('选择城市222');
				console.log(city);
				this.value = city; 
				uni.$emit('selCity', this.value);
				uni.navigateBack({
					delta: 1
				});
			}
		}
	}
</script>

<style>
</style>
