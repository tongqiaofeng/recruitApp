# smh-address-indexed

拼音首字母城市索引列表插件。

### 安装方式

本组件符合[easycom](https://uniapp.dcloud.io/collocation/pages?id=easycom)规范，`HBuilderX 2.5.5`起，只需将本组件导入项目，在页面`template`中即可直接使用，无需在页面中`import`和注册`components`。

### 基本用法

在 ``template`` 中使用组件

```html
<smh-address-indexed :letter="'B'" @confirm="confrim"></smh-address-indexed>

methods: {
	confrim(e){
		console.log(e)//=>{id:123,name:'北京'}
	}
}
```


## API

### smh-address-indexed  Props

|属性名	|类型		|默认值	|说明				|
|letter	|String		|A	|默认定位到哪个字母的城市			|

### smh-address-indexed Events
|事件名	|说明			|返回值|
|:-:	|:-:			|:-:  |
|@confirm|选中城市事件|Object|
