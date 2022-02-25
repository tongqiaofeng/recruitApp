<template>
	<view>
		<view v-if="chatlist.length>0">
			<!-- :noreadnum="totalNoreadnum" -->
			<!-- 导航栏 -->
			<!-- 	<free-nav-bar >
		</free-nav-bar> -->


			<!-- 置顶列表 -->
			<block v-for="(item,index) in chatlist" :key="index" v-if="chatlist">
				<free-media-list  :item="item" :index="index" @long="long"
					@jumpWebSocket="chatWebSocket"></free-media-list>
			</block>

			<!-- 非置顶列表 -->
		<!-- 	<block v-for="(item,index) in chatlist" :key="index">
				<free-media-list v-if="!item.istop" :item="item" :index="index" @long="long"></free-media-list>
			</block> -->


			<!-- 弹出层 -->
			<free-popup ref="extend" :bodyWidth="240" :bodyHeight="getMenusHeight">
				<view class="flex flex-column" style="width: 240rpx;" :style="getMenusStyle">
					<view class="flex-1 flex align-center  border-bottom" hover-class="bg-light"
						v-for="(item,index) in menus" :key="index" @click="clickEvent(item.event)">
						<text class="font-md pl-3">{{item.name}}</text>
					</view>
				</view>
			</free-popup>
		</view>
		<view v-else style="width:100vw;height:100vh;display: flex;" class="justify-center">
			<text class="text-center">暂无聊天列表哦~</text>
		</view>
	</view>
</template>

<script>
	import freeNavBar from "@/components/free-ui/free-nav-bar.vue"
	import freeMediaList from "@/components/free-ui/free-media-list.vue"

	import freePopup from "@/components/free-ui/free-popup.vue"
	// import auth from '@/common/mixin/auth.js';
	import {
		mapState
	} from 'vuex'
	export default {
		// mixins:[auth],
		components: {
			freeNavBar,
			freeMediaList,
			freePopup
		},
		data() {
			return {
				propIndex: -1,
				arr1: [],
				arr2: [],
				chatlist:[],
				token:uni.getStorageSync("token"),
				list: [{
					id: 0,
					avatar: "/static/imgs/demo/tx.jpg",
					name: "summer",
					update_time: "1637221276",
					data: "聊天内容xxxxxx",
					noreadnum: 0,
					chat_type: 'user', //接收类型 user单聊 group群聊
					istop: true,
				}, {
					id: 1,
					avatar: "/static/imgs/demo/tx.jpg",
					name: "summer",
					update_time: "1637221276",
					data: "聊天内容xxxxxx",
					noreadnum: 2,
					chat_type: 'user',
					istop: false,
				}],
				menus: [{
						name: "设为置顶",
						event: "setTop"
					},
					{
						name: "删除该聊天",
						event: "delChat"
					}
				],
			}
		},
		onLoad() {
			let msg1 = {
				type: "history",
				token: this.token
			}
			let msg2 = {
				type: "user",
				token: this.token
			}
			uni.connectSocket({
				url: 'ws://192.168.0.99:8089/chat',
			});
			uni.onSocketOpen(function(res) {
				console.log('chat,WebSocket连接已打开！');
				uni.sendSocketMessage({
					data: JSON.stringify(msg1),
					success: function() {

						// console.log("history,数据发送成功，数据为：");
						// console.log("history,数据发送结束，开始接收");
					},
					fail: function(res) {
						console.log("chat,数据发送失败", res)
					}
				});

				uni.sendSocketMessage({
					data: JSON.stringify(msg2),
					success: function() {
						// console.log("user,数据发送成功，数据为：");
						// console.log("user,数据发送结束，开始接收");
					}
				});
			});
			uni.onSocketMessage(function(res) {
				// console.log('收到服务器history内容：'+res.data);
				let obj1 = JSON.parse(res.data)
				func1(obj1)
			})
			let func2 = function func3(obj1) {
				// console.log(obj1.type)
				if (obj1.type === 'history') {
					this.arr1.push(obj1)
				} else if (obj1.type === 'user') {
					this.arr2.push(obj1)
				}
				this.getlist()
			}
			let func1 = func2.bind(this)
		},
		// onLoad(){
		// 		let msg = {
		// 			type: "message",
		// 			token: uni.getStorageSync("token"),
		// 			receiver: 'b35b420140e0d52348886773c3ba04bf',
		// 			contentText: "第二条2"
		// 		}
		// 			uni.connectSocket({
		// 				url: 'ws://192.168.0.99:8089/chat',
		// 			});
		// 			uni.onSocketOpen(function(res) {
		// 				console.log('chat,WebSocket连接已打开！');
		// 				uni.sendSocketMessage({
		// 					data: JSON.stringify(msg), 
		// 					success: function() {
		// 						console.log("chat,数据发送成功，数据为：" );
						
		// 						console.log("chat,数据发送结束，开始接收");
		// 						uni.onSocketMessage(function(res) {
		// 							console.log('收到服务器内容：' + res.data);
		// 						})
		// 					},
						   
		// 					fail: function(res) {
		// 						console.log("chat,数据发送失败",res)
		// 					}
		// 				});
		// 			});
				
		// },
		computed: {

			// 动态获取菜单高度
			getMenusHeight() {
				let H = 100
				return this.menus.length * H
			},
			// 获取菜单的样式
			getMenusStyle() {
				return `height: ${this.getMenusHeight}rpx;`
			}
		},
		methods: {
			getlist(){
				// console.log(this.arr1,this.arr2)
				this.chatlist=[]
				let temp={}
				let arr1temp={}
				let arr2temp={}
				this.arr1.forEach((item,index)=>{
					if(item.receiver!=this.token||item.sender!=this.token){
						arr1temp={
							"contentText":item.contentText,
							"id":item.id,
							"receiver": item.receiver,
							"sender": item.sender,
							"status": item.status,
							"time": item.time
						}
						this.arr2.forEach((e,i)=>{
							arr2temp={
								'userid':e.id,
								"head_pic": e.head_pic,
								"username": e.username
							}
							if(e.id==item.receiver||e.id==item.sender){
							 temp={...arr1temp, ...arr2temp}
							 this.chatlist.push(temp)
							 // console.log(this.chatlist)
							}
				
						})
					}
				})
				console.log(this.chatlist)
			
			},
			chatWebSocket(val) {
				console.log(val)
				// uni.closeSocket();
				// uni.onSocketClose(function (res) {
				//   console.log('WebSocket 已关闭！');
				// });
			},
			long({
				x,
				y,
				index
			}) {
				// 初始化 索引
				this.propIndex = index
				// 拿到当前对象
				let item = this.list[index]
				// 判断之前是否处于置顶状态
				this.menus[0].name = item.istop ? '取消置顶' : '设为置顶'
				//展示弹框
				this.$refs.extend.show(x, y)
				
			},
			// 分发菜单事件
			clickEvent(event) {
				switch (event) {
					case "setTop": // 置顶/取消置顶会话
						this.setTop()
						break;
					case "delChat": // 删除当前会话
						this.delChat()
						break;
				}
				this.$refs.extend.hide() //取消弹框
			},
			// 删除当前会话
			delChat() {
				let del = {
					type: "delete",
					id:this.chatlist[this.propIndex].id,
					token: this.token
				}
				console.log('删除'+this.chatlist[this.propIndex].id)
				uni.sendSocketMessage({
					data: JSON.stringify(del),
					success: function() {
						console.log("del,数据发送成功，数据为：");
						console.log("del,数据发送结束，开始接收");
					},
					fail: (res) => {
						console.log("del,shibai，数据为：");
						console.log("del,失败，开始接收");
					}
				})
			},
			// 置顶/取消置顶会话
			setTop() {
				let item = this.list[this.propIndex]
				item.istop = !item.istop
			}
		}
	}
</script>

<style>

</style>
