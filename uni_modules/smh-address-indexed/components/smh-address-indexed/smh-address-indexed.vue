<template>
	<view>
		<view class="container690 cont">
			<view class="cont1">
				<scroll-view :scroll-into-view="scrollview" class="scroll-view1" :scroll-y="true" enable-flex="true">
					<view class="left">
						<view class="add1" v-for="(item,index) in list" :id="item.letter" :key="index">
							<text class="title">{{item.letter}}</text>
							<view @click="changeCity(item1)" class="city" v-for="(item1,index1) in item.citylist" :key="index1">
								{{item1.text}}
							</view>
						</view>
					</view>
				</scroll-view>
				<scroll-view class="scroll-view2" :scroll-y="true" enable-flex="true">
					<view class="right">
						<text @click="changeLetter(item)" v-for="(item,index) in letters" :key="index">{{item}}</text>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			letter:{
				type:String,
				default:'A'
			}
		},
		watch:{
			letter:function(){
				this.scrollview=this.letter
			}
		},
		data() {
			return {
				cityName:'重庆',
				scrollview:this.letter,
				list:[
					{
						letter:'A',
						citylist:[
							{text:'阿坝藏族羌族自治州',id:123},
							{text:'阿克苏地区',id:123},
							{text:'阿拉尔市',id:123},
							{text:'阿拉善盟',id:123},
							{text:'阿勒泰地区',id:123},
							{text:'阿里地区',id:123},
							{text:'安康',id:123},
							{text:'阿坝藏族羌族自治州',id:123},
							{text:'阿克苏地区',id:123},
							{text:'阿拉尔市',id:123},
							{text:'阿拉善盟',id:123},
							{text:'阿勒泰地区',id:123},
							{text:'阿里地区',id:123},
							{text:'安康',id:123},
							{text:'阿坝',id:123},
							{text:'安庆',id:123},
							{text:'阿拉尔',id:123}
						]
					},
					{
						letter:"B",
						citylist:[
							{text:'保定',id:123},
							{text:'包头',id:123},
							{text:'滨州',id:123},
							{text:'宝鸡',id:123},
							{text:'亳州',id:123},
							{text:'巴中',id:123},
							{text:'百色',id:123},
							{text:'保亭',id:123},
							{text:'蚌埠',id:123},
							{text:'保山',id:123},
							{text:'巴彦淖尔市',id:123},
							{text:'北海',id:123},
							{text:'本溪',id:123},
							{text:'巴音郭楞',id:123},
							{text:'白山',id:123},
							{text:'毕节',id:123},
							{text:'白城',id:123},
							{text:'博尔塔拉',id:123}
						]
					}
				],
				letters:[]
			}
		},
		created() {
			for (var i = 0; i < 26; i++) {
				this.letters.push(String.fromCharCode((65 + i)))
			}
		},
		methods: {
			changeLetter(id){
				this.scrollview=id
			},
			changeCity(obj){
				this.$emit('confirm',obj)
			}
		}
	}
</script>

<style lang="scss">
.container690{
	width:690rpx;
	margin: 0 auto;
}
.cont{
	height: 100vh;
	overflow: hidden;
	.cont1{
		padding-top: 20rpx;
		display: flex;
		justify-content: space-between;
	}
	.scroll-view1{
		width: 650rpx;
		height:100vh;
		display: flex;
		justify-content: space-between;
		.left{
			width: 100%;
			.add1{
				margin-top: 30rpx;
				.title{
					display: block;
					color: #000000;
					font-size: 32rpx;
				}
				.city{
					width: 100%;
					height: 100rpx;
					line-height: 100rpx;
					border-bottom: 1px solid #F2F2F2;
				}
			}
		}
	}
	.scroll-view2{
		width: 40rpx;
		height:100vh;
		padding-bottom: 30rpx;
		.right{
			width: 100%;
			text{
				text-align: right;
				display: block;
				color: #666666;
				font-size: 24rpx;
				padding: 6rpx 0;
			}
		}
	}
}
</style>
