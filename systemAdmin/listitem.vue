<template>
	<view class="page" style="height: 100vh;">
		<view class="bg-white rounded2 m-2 p-4" v-if="companyList.license!=undefined">
			<view class="pb-3 flex justify-between border-bottom2">
				<view>
					<view class="font-weight-bolder font-lg">{{companyList.companyName}}</view>
					<!-- <view class="font-md pt-2">{{companyList.companyAddress}}</view> -->
				</view>
			</view>
			<view class="flex justify-start align-center mb-2 mt-3">
				<view class="font-weight-normal font-m text-light-muted" style="width: 30%;">真实姓名</view>
				<view class="font-md" style="width: 70%;">{{companyList.fullName}}</view>
			</view>
			<view class="flex justify-start align-center mb-2">
				<view class="font-weight-normal font-m text-light-muted" style="width: 30%;">联系电话</view>
				<view class="font-md" style="width: 70%;">{{companyList.username}}</view>
			</view>
			<view class="flex justify-start align-center mb-2">
				<view class="font-weight-normal font-m text-light-muted" style="width: 30%;">公司规模</view>
				<view class="font-md" style="width: 70%;">{{companyList.teamSize}}</view>
			</view>
			<view class="flex justify-start align-center mb-2">
				<view class="font-weight-normal font-m text-light-muted" style="width: 30%;" v-if="curNow<2">申请原因</view>
				<view class="font-weight-normal font-m text-light-muted" style="width: 30%;" v-else>拒绝原因</view>
				<view class="font-md" style="width: 70%;">{{companyList.reason==unll?'暂无':companyList.reason}}</view>
			</view>
			<view class="flex justify-start align-center mb-2">
				<view class="font-weight-normal font-m text-light-muted" style="width: 30%;">公司地址</view>
				<view class="font-m" style="width: 70%;">{{companyList.companyAddress}}</view>
			</view>
			<view class="flex justify-start align-center mb-2">
				<view class="font-weight-normal font-m text-light-muted" style="width: 30%;">申请时间</view>
				<view class="font-md" style="width: 70%;">{{companyList.createTime}}</view>
			</view>
			<view class="flex justify-start align-top mb-2">
				<view class="font-weight-normal font-m text-light-muted" style="width: 30%;">营业执照</view>
				<view v-for="(imgitem,n) in imageList" :key="n" style="width: 70%;" class="flex justify-start">
					<image :src="imgitem.url" mode="aspectFit" @click="license(imgitem.url,index)"
						style="width: 180rpx;height: 180rpx;margin-right: 15rpx;">
					</image>
				</view>
			</view>
			<!-- <view>{{companyList.formalSchool!=undefined}}</view> -->
			<view class="flex justify-end align-center  m-2" v-if="companyList.status!=0">
				<view class="font font-m text-light-muted mr-1 ">审核人员：</view>
				<view class="font text-light-muted">{{companyList.checkerName==null?'暂无':companyList.checkerName}}
				</view>
			</view>
		</view>
		<view class="bg-white rounded2 m-2 p-4" v-else>
			<view class="pb-3 flex justify-between align-center border-bottom2">
				<view class="font-weight-bolder font-lg">{{companyList.fullName}}</view>
				<view class="font-md">{{companyList.sex}}</view>
				<view class="font-md">{{companyList.formalSchool}}</view>
			</view>
			<view class="flex justify-start align-center mb-2 mt-3">
				<view class="font-weight-normal font-m text-light-muted" style="width: 30%;">薪资范围</view>
				<view class="font-md" style="width: 70%;">
					{{companyList.lowestSalary+"-"+companyList.highestSalary}}{{companyList.type == '实习/兼职' ? '元' : 'K'}}
				</view>
			</view>
			<view class="flex justify-start align-center mb-2">
				<view class="font-weight-normal font-m text-light-muted" style="width: 30%;">工作年限</view>
				<view class="font-md" style="width: 70%;">{{companyList.workingSeniority+'年'}}</view>
			</view>
			<view class="flex justify-start align-center mb-2">
				<view class="font-weight-normal font-m text-light-muted" style="width: 30%;">工作时间</view>
				<view class="font-md" style="width: 70%;">{{companyList.startTime+"-"+companyList.endTime}}</view>
			</view>
			<view class="font-weight-lighter font-sm text-light-muted border-bottom2 mb-2 pb-2">最后一次工作经历 </view>
			<view class="flex justify-start align-center mb-2">
				<view class="font-weight-normal font-m text-light-muted" style="width: 30%;">工作岗位</view>
				<view class="font-m" style="width: 70%;">{{companyList.jobTitle}}</view>
			</view>
			<view class="flex justify-start align-center mb-2">
				<view class="font-weight-normal font-m text-light-muted" style="width: 30%;">公司名称</view>
				<view class="font-md" style="width: 70%;">{{companyList.companyName}}</view>
			</view>
			<view class="flex justify-start align-top mb-2">
				<view class="font-weight-normal font-m text-light-muted" style="width: 30%;">个人优势</view>
				<view class="font-md" style="width: 70%;">{{companyList.skill}}</view>
			</view>
			<view class="flex justify-start align-top mb-2">
				<view class="font-weight-normal font-m text-light-muted" style="width: 30%;">学历列表</view>
				<view class="font-md" style="width: 70%;">{{companyList.formalSchools}}</view>
			</view>
			<!-- <view class="flex justify-end align-center  m-2" v-if="companyList.status!=0">
				<view class="font font-m text-light-muted mr-1 ">审核人员：</view>
				<view class="font text-light-muted">{{companyList.checkerName==null?'暂无':companyList.checkerName}}</view>
			</view> -->
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				baseurl: this.$baseUrl,
				companyList: [],
				imageList: []
			}
		},
		onLoad(e) {
			this.companyList = JSON.parse(decodeURIComponent(e.params))
			if (this.companyList.license != undefined) {
				let arr = []
				this.imageList = []
				arr = this.companyList.license.split('|')
				arr.forEach((item, i) => {
					let obj = {
						url: '',
						current: ''
					}
					obj.url = this.baseurl + '/' + item
					obj.current = i
					this.imageList.push(obj)
				})

			}
			console.log(this.companyList)
			// console.log(this.imageList)
		}
	}
</script>

<style>
</style>
