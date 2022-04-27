<template>
  <view class="page" style="height: 100vh">
    <u-subsection
      :list="navlist"
      :current="curNow"
      @change="sectionChange"
    ></u-subsection>
    <view
      class="bg-white rounded2 m-2 p-4"
      v-for="(item, index) in companyList"
      :key="index"
    >
      <view class="pb-3 flex justify-between border-bottom2">
        <view>
          <view class="font-weight-bolder font-lg">{{ item.companyName }}</view>
          <!-- <view class="font-md pt-2">{{item.companyAddress}}</view> -->
        </view>
      </view>
      <!-- 弹框 -->
      <u-popup :show="show" @close="close" @open="open" mode="center">
        <view class="rounded" style="border-radius: 10px; width: 590rpx">
          <view class="p-2 text-center">
            <text class="font-md font-weight-bold">拒绝理由</text>
          </view>
          <view class="p-3">
            <textarea
              placeholder="请简洁说明拒绝理由"
              :auto-height="autoheight"
              placeholder-style="font-size:12px;color:##cbd3da;"
              style="
                height: 86rpx;
                max-width: 95%;
                background-color: #ffffff;
                border-radius: 8px;
                box-sizing: border-box;
              "
              class="p-2 border m-auto text-hover-secondary"
              v-model="reason"
              @linechange="linechange"
            ></textarea>
          </view>
          <view
            class="px-2 py-1 main-bg-color text-center"
            style="
              border-radius: 40px;
              height: 26px;
              width: 54px;
              margin: 10px auto;
              border-radius: 6px;
            "
            @click="isok(item.id)"
          >
            <text class="font text-white">确定</text>
          </view>
        </view>
      </u-popup>
      <view class="flex justify-start align-center mb-2 mt-3">
        <view
          class="font-weight-normal font-m text-light-muted"
          style="width: 30%"
          >真实姓名</view
        >
        <view class="font-md" style="width: 70%">{{ item.fullName }}</view>
      </view>
      <view class="flex justify-start align-center mb-2">
        <view
          class="font-weight-normal font-m text-light-muted"
          style="width: 30%"
          >联系电话</view
        >
        <view class="font-md" style="width: 70%">{{ item.username }}</view>
      </view>
      <view class="flex justify-start align-center mb-2">
        <view
          class="font-weight-normal font-m text-light-muted"
          style="width: 30%"
          >公司规模</view
        >
        <view class="font-md" style="width: 70%">{{ item.teamSize }}</view>
      </view>
      <view class="flex justify-start align-center mb-2">
        <view
          class="font-weight-normal font-m text-light-muted"
          style="width: 30%"
          v-if="curNow < 2"
          >申请原因</view
        >
        <view
          class="font-weight-normal font-m text-light-muted"
          style="width: 30%"
          v-else
          >拒绝原因</view
        >
        <view class="font-md" style="width: 70%">{{
          item.reason == unll ? "暂无" : item.reason
        }}</view>
      </view>
      <view class="flex justify-start align-center mb-2">
        <view
          class="font-weight-normal font-m text-light-muted"
          style="width: 30%"
          >公司地址</view
        >
        <view class="font-m" style="width: 70%">{{ item.companyAddress }}</view>
      </view>
      <view class="flex justify-start align-center mb-2">
        <view
          class="font-weight-normal font-m text-light-muted"
          style="width: 30%"
          >申请时间</view
        >
        <view class="font-md" style="width: 70%">{{ item.createTime }}</view>
      </view>
      <view class="flex justify-start align-top mb-2">
        <view
          class="font-weight-normal font-m text-light-muted"
          style="width: 30%"
          >营业执照</view
        >
        <view
          v-for="(imgitem, n) in imageList"
          :key="n"
          style="width: 70%"
          class="flex justify-start"
        >
          <image
            v-if="imgitem.current == index"
            :src="imgitem.url"
            mode="aspectFit"
            @click="license(imgitem.url, index)"
            style="width: 180rpx; height: 180rpx; margin-right: 15rpx"
          >
          </image>
        </view>
      </view>
      <view class="flex justify-end mt-5" v-if="curNow == 0">
        <view
          class="mr-2 px-5 py-1 main-bg-color"
          style="border-radius: 8px; height: 26px; background-color: #5ad899"
          @click="pass(item.id)"
        >
          <text class="font text-white">通过</text>
        </view>
        <view
          class="mr-2 px-5 py-1"
          style="border-radius: 8px; height: 26px; background-color: #dc7a7f"
          @click="out(item.id)"
        >
          <text class="font text-white">拒绝</text>
        </view>
      </view>
      <view class="flex justify-end align-center m-2" v-if="item.status != 0">
        <view class="font font-m text-light-muted mr-1">审核人员：</view>
        <view class="font text-light-muted">{{
          item.checkerName == null ? "暂无" : item.checkerName
        }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      companyList: [],
      // baseurl: "http://192.168.0.164:8088/app/recruitment/api/",
      baseurl: this.$baseUrl,
      show: false,
      reason: "",
      navlist: ["未审核", "已审核", "已拒绝"],
      curNow: 0,
      autoheight: false,
      imageList: [],
      page: 1,
    };
  },
  mounted() {
    this.getcompanyList(0);
    // this.passorout(1, '', 1)
  },
  methods: {
    getcompanyList(val) {
      // console.log(this.baseurl)
      // console.log(this.baseurl2)
      uni.request({
        url: this.baseurl + "/companyList/?page=" + this.page + "&pageNum=10",
        data: {
          endTime: "",
          keyword: "",
          startTime: "",
          status: val,
        },
        method: "POST",
        header: {
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoyLCJjcmVhdGVUaW1lIjoxNjM3ODk4NDE5LCJpZCI6ImE0N2NiZDdhZWNhNGFlYzU0OGIxMTk4NTI0Nzc2ODlhIiwidXNlcm5hbWUiOiIxNzc4MTc2OTczMSJ9.ktIa1o-XSt_7nZbv0pOL4tAH_YWO6_fE2Z4smzIxVP8", //自定义请求头信息
        },
        success: (res) => {
          this.companyList = res.data.data.list;
          console.log(res);
          let arr = [];
          this.imageList = [];
          this.companyList.forEach((e, i) => {
            arr = e.license.split("|");
            arr.forEach((item) => {
              let obj = {
                url: "",
                current: "",
              };
              obj.url = this.baseurl + "/" + item;
              obj.current = i;
              this.imageList.push(obj);
            });
          });
          // console.log('imgurl', this.imageList)
        },
        fail: (res) => {
          console.log(res);
        },
      });
    },
    sectionChange(index) {
      this.curNow = index;
      // console.log(index)
      this.getcompanyList(index >= 2 ? -1 : index);
    },
    // popup() {
    // 	this.show = true
    // },
    open() {
      // console.log('open');
    },
    close() {
      this.show = false;
      // console.log('close');
    },
    isok(id) {
      this.show = false;
      this.passorout(id, this.reason, -1);
      console.log(id, this.reason, -1);
    },
    pass(id) {
      //审核通过
      this.passorout(id, "", 1);
    },
    out() {
      this.show = true;
      this.autoheight = false; //关闭输入框自动增高
      this.reason = ""; //输入框内容赋空
    },
    passorout(id, reason, status) {
      console.log(id, reason, status);
      uni.request({
        url: this.baseurl + "/companyMsgCheck",
        data: {
          id: id,
          reason: reason,
          status: status,
        },
        method: "POST",
        header: {
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoyLCJjcmVhdGVUaW1lIjoxNjM3ODk4NDE5LCJpZCI6ImE0N2NiZDdhZWNhNGFlYzU0OGIxMTk4NTI0Nzc2ODlhIiwidXNlcm5hbWUiOiIxNzc4MTc2OTczMSJ9.ktIa1o-XSt_7nZbv0pOL4tAH_YWO6_fE2Z4smzIxVP8", //自定义请求头信息
        },
        success: (res) => {
          this.show = false;
          console.log(res.data);
        },
      });
    },
    linechange() {
      this.autoheight = true; //输入框自动增高
      // console.log(e)
    },
    license(url, index) {
      console.log(url, index);
      let arr = [];
      this.companyList.forEach((item, i) => {
        if (index == i) {
          arr.push(this.baseurl + item.license);
        }
      });
      uni.previewImage({
        urls: arr, //预览图片的地址，必须要数组形式，如果不是数组形式就转换成数组形式就可以
      });
    },
  },
};
</script>

<style>
textarea {
  min-height: 36px;
  /* 设置 min-height 是为了设置 textarea 的高度 */
  /* 因为行内样式优先级比较高，所以曲线救国 */
}
</style>
