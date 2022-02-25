## 参数说明
# hotCitys  热门城市(array)
# value 当前选中城市(string)
# windowHeight  scroll的高 也是滑块的高 记得带单位!!! px rpx upx都支持(string)
# @onSelect   点击切换城市事件 参数为城市名称
# sliding 是否开始滑动选择 不传默认开启(Boolean)

## 使用说明

```javascript
<lhSelectCity
  :value="value"
  :windowHeight="windowHeight"
  :hotCitys="hotCitys"
  @onSelect="onSelectCity"
/>


import lhSelectCity from '@/components/lh-select-city/index.nvue'
	export default {
		components:{lhSelectCity},
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
				value: '杭州',
				windowHeight:""
			}
		},
		onLoad(){
			// 计算出可用高度
			 this.windowHeight = uni.getSystemInfoSync().windowHeight-100+"px";
		},
		methods: {
			onSelectCity(city) {
				console.log(city)
			}
		}
	}
```