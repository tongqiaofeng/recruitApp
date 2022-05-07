<template>
	<view class="pagefind">
		<view class="pagesearch bg-white flex" @click="searchXY">
			<u-icon name="arrow-left" @click="backto"></u-icon>
			<view class="pagesearchitem">
				<u-search v-model="keyword" :label=searchlabel shape="round" searchIcon="arrow-down-fill" clearabled
					bgColor="#eeeeee" borderColor="#f2f2f2" @search="search" @custom="custom">
				</u-search>
			</view>
		</view>
		<view class="subsection bg-white">
			<view style="width: 90%;margin: auto;letter-spacing:12rpx ;height: 68rpx;"
				class=" flex justify-start align-center">
				<text style="width: 20%;text-align: center;" @click="changtype('company')">企业</text><text
					style="width: 20%;text-align: center;" @click="changtype('person')">个人</text>
			</view>
		</view>
		<!-- 弹框 -->
		<view class="cell" v-if="cellshow">
			<view class="arrowicon">
				<u-icon name="arrow-up-fill" color="#ffffff" size="18"></u-icon>
			</view>
			<view class="bg-white" style="box-shadow: 1px 1px 3px #d2d0d0;border-radius: 4px;">
				<u-cell-group :border='false'>
					<u-cell title="企业" name="company" @click="changtype()"></u-cell>
					<u-cell title="个人" name="person" :border='false' @click="changtype()"></u-cell>
				</u-cell-group>
			</view>
		</view>
		<view class="itemlist">
			<view v-if="haveData == 0" class="no-data">
				<image src="/static/imgs/common/no.png" mode="aspectFill"></image>
				<text style="font-size: 30rpx">暂无相关数据~</text>
			</view>
			<view v-else>
				<view class="item bg-white p-3" v-for="(item,index) in companyList" :key="index" @click="toitem(item)">
					<view class="flex align-center">
						<image :src="baseurl+'/'+item.headPic" style="width: 140rpx;height: 140rpx;border-radius: 8px;">
						</image>
						<!-- 企业 -->
						<view class="ml-2 flex flex-column justify-center" style="height: 140rpx;" v-if="type==1">
							<text class="font-weight-bold font-lg">{{item.companyName}}</text>
							<view style="margin-left: 430rpx;">
								<u-icon name="arrow-right"></u-icon>
							</view>
							<view class="flex align-center ">
								<view class="flex align-center mr-3">
									<u-icon name="map-fill"></u-icon>
									<text
										class="ml- font">{{item.companyAddress.slice(4,item.companyAddress.indexOf('市'))}}</text>
								</view>
								<view class="flex align-center ">
									<u-icon name="map-fill"></u-icon>
									<text class="ml-1 font">{{item.teamSize}}</text>
								</view>
							</view>
						</view>
						<!-- 个人 -->
						<view v-else class="ml-2 flex flex-column justify-center" style="height: 140rpx;">
							<text class="font-weight-bold font-lg">{{item.fullName}}</text>
							<view style="margin-left: 430rpx;">
								<u-icon name="arrow-right"></u-icon>
							</view>
							<view class="flex align-center ">
								<view class="flex align-center mr-3">
									<u-icon name="map-fill"></u-icon>
									<text class="ml-1 font">{{item.type}}</text>
								</view>
								<view class="flex align-center ">
									<u-icon name="map-fill"></u-icon>
									<text class="ml-1 font">{{item.age}}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="rounded2 flex justify-between align-center mt-2 p-2"
						style="background-color: #f8f8f8;box-sizing: border-box;" v-if="type==2">
						<view class="flex flex-column">
							<text class="text-hover-light font-small">工作年限</text>
							<view><text class="font font-weight-bold">{{item.workingSeniority}}</text>
								<text class="ml-1 text-hover-light font-small">年</text>
							</view>
						</view>
						<view class="flex flex-column">
							<text class="text-hover-light font-small">薪资</text>
							<view><text
									class="font font-weight-bold">{{item.lowestSalary+"-"+item.highestSalary}}</text>
								<text class="ml-1 text-hover-light font-small">K</text>
							</view>

						</view>
						<view class="flex flex-column">
							<text class="text-hover-light font-small">城市</text>
							<text class="font font-weight-bold">{{item.city}}</text>
						</view>
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				baseurl: this.$baseUrl,
				keyword: '',
				endTime: '',
				startTime: '',
				companyList: [],
				imageList: '',
				page: 1,
				searchlabel: '企业',
				cellshow: false,
				userList: [],
				type: 1,
				haveMore: 0,
				haveData: 1,
				urlName: ''
			}
		},
		onLoad() {
			this.getcompanyList('companyList')
		},
		onPullDownRefresh() {
			uni.showLoading({
				title: "正在刷新",
			});
			this.page = 1;
			this.companyList = [];
			this.haveMore = 0;

			this.getcompanyList('companyList');
			uni.stopPullDownRefresh();
		},
		onReachBottom() {
			if (this.haveMore == 0) {
				this.page++;
				this.getcompanyList(this.urlName);
			}
		},
		methods: {
			getcompanyList(str) {
				this.urlName = str;
				let companymsg = {
					endTime: "",
					keyword: this.keyword,
					startTime: "",
					status: 1
				}
				let usermsg = {
					certificateNames: [],
					formalSchools: [],
					keyword: this.keyword,
					type: ""
				}
				uni.request({
					url: this.baseurl + '/' + str + '/?page=' + this.page + '&pageNum=10',
					data: str == 'companyList' ? companymsg : usermsg,
					method: 'POST',
					header: {
						'token': uni.getStorageSync("token")
					},
					success: (res) => {
						console.log('获取注册信息');
						console.log(res)
						this.type = str == 'companyList' ? 1 : 2;


						if (res.data.data.list.length == 0) {
							this.haveMore = 1;
						} else {
							let data = this.companyList.concat(res.data.data.list);
							this.companyList = data;
						}

						if (this.companyList.length == 0) {
							this.haveData = 0;
						} else {
							this.haveData = 1;

							let arr = []
							this.imageList = []
							if (str == 'companyList') {
								this.companyList.forEach((e, i) => {
									arr = e.license.split('|')
									arr.forEach((item) => {
										let obj = {
											url: '',
											current: ''
										}
										obj.url = this.baseurl + '/' + item
										obj.current = i
										this.imageList.push(obj)
									})
								})
							}
						};
					},
					fail: (res) => {
						console.log(res)
					}
				});
			},
			searchXY(e) {
				console.log(e.detail, this.cellshow)
				if (e.detail.y > 35 && e.detail.x > 38 && e.detail.y < 72 && e.detail.x < 100) {
					this.cellshow = !this.cellshow
				}
			},
			changtype(type) {
				this.cellshow = false;
				this.page = 1;
				this.companyList = [];
				this.haveMore = 0;

				// console.log(tag.name,type)
				if (type.name == undefined && type == 'company') {
					this.searchlabel = '企业'
					this.getcompanyList('companyList')
				} else if (type.name == undefined && type == 'person') {
					this.searchlabel = '个人'
					this.getcompanyList('userSearchList')
				} else if (type.name != undefined && type.name == 'company') {
					this.searchlabel = '企业'

				} else if (type.name != undefined && type.name == 'person') {
					this.searchlabel = '个人'

				}
			},
			toitem(item) {
				console.log(item)
				if (this.searchlabel == '企业') {
					uni.navigateTo({
						url: './listitem?params=' + encodeURIComponent(JSON.stringify(item)),
					})
				} else {
					uni.navigateTo({
						url: './listitem?params=' + encodeURIComponent(JSON.stringify(item)),
					})
				}
			},
			backto() {
				uni.navigateBack({
					delta: 1
				})
			},
			search() {
				this.page = 1;
				this.companyList = [];
				this.haveMore = 0;

				let val = this.searchlabel == '企业' ? 'companyList' : 'userSearchList'
				this.getcompanyList('userSearchList')
			},
			custom() {
				this.page = 1;
				this.companyList = [];
				this.haveMore = 0;

				let val = this.searchlabel == '企业' ? 'companyList' : 'userSearchList'
				this.getcompanyList('userSearchList')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pagefind {
		width: 100vw;
		background-color: #eeeeee;
		height: 100vh;
		overflow: scroll;
		position: absolute;
		margin-top: 68rpx;

		.pagesearch {
			width: 100vw;
			background-color: #ffffff;
			padding-left: 16rpx;
			box-sizing: border-box;

			.pagesearchitem {
				padding-top: 10rpx;
				width: 90%;
				margin: 0 auto 0;
				height: 68rpx;
			}

			.u-search {
				.u-search__content {
					.u-search__content__icon {
						.u-icon {
							.u-icon__icon {
								font-size: 16px !important;
							}
						}
					}
				}

			}

		}

		.cell {
			position: relative;
			top: -10rpx;
			left: 40rpx;
			width: 136rpx;
			z-index: 99;

			.arrowicon {
				position: relative;
				left: 50rpx;
				height: 36rpx;
				top: 82rpx;
			}
		}

		.subsection {
			position: fixed;
			width: 100vw;
			top: 142rpx;
			// height: 68rpx;
			padding: 20rpx 0 10rpx;
		}

		.itemlist {
			position: fixed;
			width: 100vw;
			top: 244rpx;

			.item {
				border-radius: 10px;
				width: 90vw;
				margin: 20rpx auto;
				box-sizing: border-box;
			}
		}

	}
</style>
