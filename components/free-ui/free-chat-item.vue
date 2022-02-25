<template>
	<div @longpress="long">
		<!-- 时间显示 -->
		<view v-if="showTime" 
		class="flex align-center justify-center pb-4 pt-2">
			<text class="font-sm text-light-muted">{{showTime}}</text>
		</view>
		<!-- 撤回消息 -->
		<view v-if="item.isremove" ref="isremove"
		class="flex align-center justify-center pb-4 pt-1">
			<text class="font-sm text-light-muted">{{ isself ? '你' : '对方' }}撤回了一条信息</text>
		</view>
		<!-- 系统消息 -->
		<view v-if="item.type === 'system'" ref="isremove"
		class="flex align-center justify-center pb-4 pt-1">
			<text class="font-sm text-light-muted">{{item.data}}</text>
		</view>
		<!-- 气泡 -->
		<view v-if="item.type !== 'system' && !item.isremove" class="flex align-start position-relative mb-3"
		:class="!isself ? 'justify-start' : 'justify-end'">
			<!-- 好友 -->
			<template v-if="!isself">
				<free-avater size="70" :src="item.from_avatar" @click="openUser"></free-avater>
				<image v-if="hasLabelClass" class="position-absolute chat-left-icon" :style="shownickname ? 'top:45rpx;':'top:20rpx;'" style="width:16px ;height: 16px;" src="../../static/imgs/demo/l.png"></image>
				<!-- <text v-if="hasLabelClass" class="iconfont text-white font-md position-absolute chat-left-icon" :style="shownickname ? 'top:45rpx;':'top:20rpx;'">&#xe645;</text> -->
			</template>
			
			<view class="flex flex-column">
				<!-- 昵称 -->
				<view v-if="shownickname" class="flex" :class="nicknameClass" style="max-width:500rpx;background-color: rgba(0,0,0,0);" :style="labelStyle">
					<text class="font-sm text-muted">{{item.from_name}}</text>
				</view>
				
				<div class="p-2 rounded" :class="labelClass" style="max-width:500rpx;" :style="labelStyle">
					<!-- 文字 -->
					<text v-if="item.type === 'text'" class="font-md">{{item.data}}</text>
					<!-- 图片-->
					<free-image @longpress="stop" v-else-if="item.type === 'image'" :src="item.data" @click="preview(item.data)" imageClass="rounded" :maxWidth="500" :maxHeight="350"></free-image>
							
				</div>
			</view>
			<!-- 本人 -->
			<template v-if="isself">
				<image src="../../static/imgs/demo/r.png" v-if="hasLabelClass" class="position-absolute chat-right-icon" style="width:16px;height: 16px;" :style="shownickname ?'top:45rpx;':'top:20rpx;'"></image>
				<!-- <text v-if="hasLabelClass" class="iconfont text-chat-item font-md position-absolute chat-right-icon" :style="shownickname ? 'top:45rpx;':'top:20rpx;'">&#xe644;</text> -->
				<free-avater size="70" :src="item.from_avatar"
				@click="openUser"></free-avater>
			</template>
		</view>
		
		
		<view v-if="item.sendStatus && item.sendStatus !== 'success'" class="flex align-center justify-end px-4">
			<text class="font-sm" :class="item.sendStatus === 'fail' ? 'text-danger' : 'text-muted'">{{item.sendStatus === 'fail' ? '发送失败' : '发送中...'}}</text>
		</view>
		
		
	</div>
</template>

<script>
	import freeAvater from "@/components/free-ui/free-avater.vue"
	import freeImage from './free-image.vue';
	import $T from "@/common/free-lib/time.js"
	import { mapState} from 'vuex'
	
	export default {
		components: {
			freeAvater,
			freeImage
		},
		props: {
			item: Object,
			index:Number,
			// 上一条消息的时间戳
			pretime:[Number,String],
			shownickname:{
				type:Boolean,
				default:false
			}
		},
		data() {
			return {
				innerAudioContext:null,
				audioPlaying:false,
				// 默认封面的宽高
				poster:{
					w:100,
					h:100
				}
			}
		},
		computed: {
			...mapState({
				user:state=>state.user.user
			}),
			// 是否是本人
			isself() {
				// 获取本人id
				let id = this.user.id ? this.user.id : 0
				return this.item.from_id === id 
			},
			// 显示的时间
			showTime(){
				return $T.getChatTime(this.item.create_time,this.pretime)
			},
			// 是否需要气泡样式
			hasLabelClass(){
				return this.item.type === 'text'  
			},
			// 气泡的样式
			labelClass(){
				let label = this.hasLabelClass ? 'bg-chat-item mr-3' : 'mr-3'
				return this.isself ? label : 'bg-white ml-3'
			},
			nicknameClass(){
				let c = this.isself ? 'justify-end' : ''
				return c +' '+ this.labelClass
			},
			labelStyle(){
				if (this.item.type === 'audio') {
					let time = this.item.options.time || 0
					let width = parseInt(time) / (60/500)
					width = width < 150 ? 150 : width
					return `width:${width}rpx;`
				}
			},
		},
		mounted() {
			// 注册全局事件

			// 监听是否撤回消息
			// #ifdef APP-PLUS-NVUE
			this.$watch('item.isremove',(newVal,oldVal)=>{
				if (newVal) {
					const animation = weex.requireModule('animation')
					this.$nextTick(()=>{
						animation.transition(this.$refs.isremove, {
						    styles: {
								opacity:1
						    },
						    duration: 100, //ms
						    timingFunction: 'ease',
						    }, function () {
						       console.log('动画执行结束');
						    })
					})
				}
			})
			// #endif
		},
		// 组件销毁
		destroyed() {

			// 销毁音频
			if (this.innerAudioContext) {
				this.innerAudioContext.destroy()
				this.innerAudioContext = null
			}
		},
		methods:{
			stop(){},
			openUser(){
				uni.navigateTo({
					url: '/pages/mail/user-base/user-base?user_id='+this.item.from_id,
				});
			},

			// 预览图片
			preview(url){
				this.$emit('preview',url)
			},
			// 长按事件
			long(e){
				if(this.item.type === 'system' || this.item.isremove){
					return;
				}
				let x = 0
				let y = 0
				// #ifdef APP-PLUS-NVUE
				if (Array.isArray(e.changedTouches) && e.changedTouches.length > 0) {
					x = e.changedTouches[0].screenX
					y = e.changedTouches[0].screenY
				}
				// #endif
				// #ifdef H5
				x = e.changedTouches[0].pageX
				y = e.changedTouches[0].pageY
				// #endif
				// #ifdef MP
				x = e.detail.x
				y = e.detail.y
				// #endif
				this.$emit('long',{
					x,
					y,
					index:this.index
				})
			},

		}
	}
</script>

<style scoped>
	.chat-left-icon{
		left: 80rpx;
	}
	.chat-right-icon{
		right: 80rpx;
	}
	.chat-animate{
		/* #ifndef APP-PLUS-NVUE */
		opacity: 0;
		/* #endif */
	}
</style>
