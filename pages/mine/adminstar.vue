<template>
	<view class="page">
		<view class="pagetop p-4">
			<view class=" bg-white usermeasage">
				<view class="flex justify-start align-center p-5">
					<u-avatar src="/static/imgs/demo/tx2.jpg" shape="circle" size="60"></u-avatar>
					<!-- <image src="../../static/imgs/demo/tx2.jpg" style="width: 60px;height: 60px;"></image> -->
					<view class="ml-3">
						<view class="font-weight-bold" style="font-size: 20px;">17325888888</view>
						<view class="flex">
							<u-icon name='level' color='#4080ff'></u-icon><text>管理员</text>
						</view>

					</view>
				</view>
				<view class=" flex justify-between p-1 align-center" >
					<image class="pl-2" style="width: 22px;height: 22px;" src="../../static/imgs/demo/usercard.png">
					</image>
					<view class="flex justify-between align-center border-top mr-2" style="width: 84%;height: 50px;">
						<text class="">个人信息</text>
						<u-icon name="arrow-right"></u-icon>
					</view>
				</view>
			</view>
		</view>
			<view class="pagebotttom pt-2 pb-2 bg-white" style="width: 90%;margin:100px auto 0;">
				<view class="font flex p-1 align-center" v-for="(item,index) in other" 
					:key='index' @click="topage(item.index)"> 
					<image class="pl-2" style="width: 22px;height: 22px;" :src="item.icon"></image>
					<view class="flex justify-between align-center mr-3 ml-3" style="width: 84%;height: 50px;" :class="index<3? 'border-bottom2':''">
						<text class="">{{item.text}}</text>
						<u-icon name="arrow-right"></u-icon>
					</view> 
					
				</view>
			</view>
	
	</view>
</template>

<script>
	export default {

		data() {
			return {
				other: [{
					index:1,
					icon: "../../static/imgs/demo/shh.png",
					text: "企业注册审核"
				}, {
					index:2,
					icon: "../../static/imgs/demo/manage.png",
					text: "注册信息管理"
				}, {
					index:3,
					icon: "../../static/imgs/demo/msg.png",
					text: "系统消息管理"
				},  {
					index:4,
					icon: "../../static/imgs/demo/exit.png",
					text: "退出登录"
				}]
			}
		},
		methods: {
			topage(i){
				console.log(i)
				if(i==1){
					uni.navigateTo({
						url:'../examine/examine',
					})
				}else if(i==2){
					uni.navigateTo({
						url:'../managelist/managelist'
					})
				}else if(i==4){
			// 退出登录
				let userInfo = {};
				userInfo.userId = null;
				userInfo.userRole = '';
				userInfo.userToken = '';
				userInfo.userFullName = '';
				userInfo.userSex = '';
				userInfo.userAge = '';
				userInfo.userHeadPic = '';
				userInfo.phoneNumber = '';

				getApp().globalData.userInfo = userInfo;
				uni.setStorageSync('userId', userInfo.userId);
				uni.setStorageSync("role", userInfo.userRole);
				uni.setStorageSync("token", userInfo.userToken);
				uni.setStorageSync("fullName", userInfo.userFullName);
				uni.setStorageSync("sex", userInfo.userSex);
				uni.setStorageSync("age", userInfo.userAge);
				uni.setStorageSync("headPic", userInfo.userHeadPic);
				uni.setStorageSync("phoneNumber", userInfo.phoneNumber);

				uni.navigateTo({
					url: "./login",
				});
			}
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		width: 100vw;
		position: absolute;

		.pagetop {
			width: 100%;
			background-image: url('../../static/imgs/demo/mybg.png');
			background-size: 100% 100%;
			background-repeat: no-repeat;
			height: 18vh;

			.usermeasage {
				width: 90%;
				border-radius: 12px;
				position: relative;
				top: 8vh;
			}
		}

		.pagebotttom {
			border-radius: 6px;
		
			// border: 1px solid rgb(203, 203, 203);
		
		}
	}
</style>
