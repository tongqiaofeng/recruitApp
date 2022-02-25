<template>
  <view class="resume-container">
    <!-- 个人在线简历 -->
    <view class="resume-main-one">
      <view class="one-left">
        <view class="left-top">
          <text class="name">{{ myMsgData.name }}</text>
        </view>
        <text class="left-bottom"
          >{{ myMsgData.joinWorkTime }}年经验-{{ myMsgData.age }}岁</text
        >
      </view>
      <view class="one-right">
        <image
          v-if="myMsgData.headPic"
          :src="imgUrl + '/' + myMsgData.headPic"
          mode="aspectFill"
        ></image>
      </view>
    </view>
    <navigator :url="'./skill?context=' + resumeData.skill" hover-class="none">
      <view class="resume-main-every">
        <view class="every-title">
          <text>个人优势</text>
          <image
            class="update-img"
            src="../../static/imgs/common/update.png"
            mode="aspectFill"
          ></image>
        </view>
        <view class="every-main">
          <text>{{
            resumeData.skill == "" ? "输入个人优势" : resumeData.skill
          }}</text>
        </view>
      </view>
    </navigator>
    <navigator
      :url="'./jobExpectations?context=' + JSON.stringify(resumeData.jobWanted)"
      hover-class="none"
    >
      <view class="resume-main-every">
        <view class="every-title">
          <text>求职期望</text>
          <image
            class="update-img"
            src="../../static/imgs/common/update.png"
            mode="aspectFill"
          ></image>
        </view>
        <view
          v-if="
            resumeData.jobWanted == null || resumeData.jobWanted == undefined
          "
          class="every-main"
          >添加求职期望</view
        >
        <view v-else class="every-main">
          <text>{{ resumeData.jobWanted.type }}</text>
          <text>{{ " " + resumeData.jobWanted.city + " " }}</text>
          <text
            v-if="
              resumeData.jobWanted.lowestSalary != '' &&
              resumeData.jobWanted.lowestSalary != null
            "
            >{{
              resumeData.jobWanted.lowestSalary +
              "~" +
              resumeData.jobWanted.highestSalary
            }}{{ resumeData.jobWanted.type == "全职" ? "K" : "元" }}</text
          >
        </view>
      </view>
    </navigator>
    <view class="resume-main-every">
      <view class="every-title">
        <text>工作经历</text>
        <navigator url="./addWorkHistory" hover-class="none">
          <image
            class="update-img"
            src="../../static/imgs/common/add.png"
            mode="aspectFill"
          ></image>
        </navigator>
      </view>
      <view v-if="resumeData.workHistory.length == 0" class="every-main"
        >添加工作经历</view
      >
      <view
        v-else
        class="every-main"
        v-for="(item, index) in resumeData.workHistory"
        :key="index"
      >
        <navigator
          :url="
            './updateWorkHistory?context=' +
            JSON.stringify(item) +
            '&index=' +
            index
          "
          hover-class="none"
        >
          <view class="list-one">
            <text class="list-one-left">{{ item.companyName }}</text>
            <view class="list-one-right">
              <text>{{ item.startTime + "至" + item.endTime }}</text>
              <image
                class="update-img"
                src="../../static/imgs/common/right.png"
                mode="aspectFill"
              >
              </image>
            </view>
          </view>
          <view class="list-two">{{ item.jobTitle }}</view>
          <view class="list-three">
            <view class="three-title">内容：</view>
            <view class="three-main">{{ item.content }}</view>
          </view>
        </navigator>
      </view>
    </view>
    <view class="resume-main-every">
      <view class="every-title">
        <text>项目经历</text>
        <navigator url="./addProjectHistory" hover-class="none">
          <image
            class="update-img"
            src="../../static/imgs/common/add.png"
            mode="aspectFill"
          ></image>
        </navigator>
      </view>
      <view v-if="resumeData.projectHistory.length == 0" class="every-main"
        >添加项目经历</view
      >
      <view
        v-else
        class="every-main"
        v-for="(item, index) in resumeData.projectHistory"
        :key="index"
      >
        <navigator
          :url="
            './updateProjectHistory?context=' +
            JSON.stringify(item) +
            '&index=' +
            index
          "
          hover-class="none"
        >
          <view class="list-one">
            <text class="list-one-left">{{ item.projectName }}</text>
            <view class="list-one-right">
              <text>{{ item.startTime + "至" + item.endTime }}</text>
              <image
                class="update-img"
                src="../../static/imgs/common/right.png"
                mode="aspectFill"
              >
              </image>
            </view>
          </view>
          <view class="list-two">{{ item.role }}</view>
          <view class="list-three">
            <view class="three-title">内容：</view>
            <view class="three-main">{{ item.description }}</view>
          </view>
          <view class="list-three">
            <view class="three-title">业绩：</view>
            <view class="three-main">{{ item.achievement }}</view>
          </view>
        </navigator>
      </view>
    </view>
    <view class="resume-main-every">
      <view class="every-title">
        <text>教育经历</text>
        <navigator url="./addEduHistory" hover-class="none">
          <image
            class="update-img"
            src="../../static/imgs/common/add.png"
            mode="aspectFill"
          ></image>
        </navigator>
      </view>
      <view v-if="resumeData.eduHistory.length == 0" class="every-main"
        >添加教育经历</view
      >
      <view
        v-else
        class="every-main"
        v-for="(item, index) in resumeData.eduHistory"
        :key="index"
      >
        <navigator
          :url="
            './updateEduHistory?context=' +
            JSON.stringify(item) +
            '&index=' +
            index
          "
          hover-class="none"
        >
          <view class="list-one">
            <text class="list-one-left">{{ item.schoolName }}</text>
            <view class="list-one-right">
              <text>{{ item.startTime + "至" + item.endTime }}</text>
              <image
                class="update-img"
                src="../../static/imgs/common/right.png"
                mode="aspectFill"
              >
              </image>
            </view>
          </view>
          <view class="list-two"
            >{{ item.formalSchool
            }}<text style="margin-left: 10rpx">{{ item.major }}</text>
          </view>
          <view class="list-three" v-if="item.achievement">
            <view class="three-title">在校经历：</view>
            <view class="three-main">{{ item.achievement }}</view>
          </view>
        </navigator>
      </view>
    </view>
    <view class="resume-main-every">
      <view class="every-title">
        <text>资格证书</text>
        <navigator url="./addCertificate" hover-class="none">
          <image
            class="update-img"
            src="../../static/imgs/common/add.png"
            mode="aspectFill"
          ></image>
        </navigator>
      </view>
      <view v-if="resumeData.certificateMsg.length == 0" class="every-main"
        >添加资格证书</view
      >
      <view v-else style="display: flex; flex-wrap: wrap">
        <view
          class="every-main"
          v-for="(item, index) in resumeData.certificateMsg"
          :key="index"
        >
          <navigator
            :url="
              './updateCertificate?context=' +
              JSON.stringify(item) +
              '&index=' +
              index
            "
            hover-class="none"
          >
            <view class="list-one">
              <text
                class="list-one-left"
                style="
                  margin-right: 20rpx;
                  padding: 10rpx 40rpx;
                  background-color: #f9f9f9;
                "
                >{{ item.certificateName }}</text
              >
            </view>
          </navigator>
        </view>
      </view>
    </view>
    <view class="resume-button" @click="resumeSubmit">提交</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      imgUrl: this.$baseUrl,
      myMsgData: {
        headPic: "",
        name: "",
        joinWorkTime: "",
        age: "",
      },
      resumeData: {
        skill: "",
        jobWanted: null,
        workHistory: [],
        projectHistory: [],
        eduHistory: [],
        certificateMsg: [],
      },
    };
  },
  onShow() {
    this.myMsgData.headPic = uni.getStorageSync("headPic");
    this.myMsgData.name = uni.getStorageSync("fullName");

    let time = uni.getStorageSync("joinWorkTime").split("-");
    let myDate = new Date();
    let month = myDate.getMonth() + 1;
    let num = myDate.getFullYear() - time[0];
    if (month > time[1]) {
      num++;
    }
    this.myMsgData.joinWorkTime = num;

    this.idNumChange();
  },
  onLoad() {
    // this.getResuneMsg();
    // 个人优势
    uni.$on("skill", (e) => {
      console.log(e);
      this.resumeData.skill = e;
    });
    // 求职期望
    uni.$on("expectData", (e) => {
      console.log(e);
      this.resumeData.jobWanted = e;
    });
    // 工作经历  添加
    uni.$on("addWorkData", (e) => {
      console.log(e);
      this.resumeData.workHistory.push(e);
    });
    // 工作经历  修改
    uni.$on("updateWorkData", (e) => {
      console.log(e);
      this.resumeData.workHistory.splice(e.index, 1, e.data);
    });
    // 项目经历  添加
    uni.$on("addProjectData", (e) => {
      console.log(e);
      this.resumeData.projectHistory.push(e);
    });
    // 项目经历  修改
    uni.$on("updateProjectData", (e) => {
      console.log(e);
      this.resumeData.projectHistory.splice(e.index, 1, e.data);
    });
    // 教育经历  添加
    uni.$on("addEduData", (e) => {
      console.log(e);
      this.resumeData.eduHistory.push(e);
    });
    // 教育经历  修改
    uni.$on("updateEduData", (e) => {
      console.log(e);
      this.resumeData.eduHistory.splice(e.index, 1, e.data);
    });
    // 资格证书  添加
    uni.$on("addCertificate", (e) => {
      console.log(e);
      this.resumeData.certificateMsg.push(e);
    });
    // 资格证书  修改
    uni.$on("updateCertificate", (e) => {
      console.log(e);
      this.resumeData.certificateMsg.splice(e.index, 1, e.data);
    });
  },
  methods: {
    // 根据身份证号计算年龄
    idNumChange() {
      let idNumber = uni.getStorageSync("idNumber");
      let myDate = new Date();
      let month = myDate.getMonth() + 1;
      let day = myDate.getDate();
      let age = myDate.getFullYear() - idNumber.substring(6, 10) - 1;
      if (
        idNumber.substring(10, 12) < month ||
        (idNumber.substring(10, 12) == month &&
          idNumber.substring(12, 14) <= day)
      ) {
        age++;
      }
      this.myMsgData.age = age;
    },
    // 提交简历信息
    resumeSubmit() {
      uni.request({
        url: this.$baseUrl + "/personalResumeSave",
        method: "POST",
        header: {
          "content-type": "application/json",
          token: uni.getStorageSync("token"),
        },
        data: {
          skill: this.resumeData.skill,
          jobWanted: this.resumeData.jobWanted,
          workHistory: this.resumeData.workHistory,
          projectHistory: this.resumeData.projectHistory,
          eduHistory: this.resumeData.eduHistory,
          certificateMsg: this.resumeData.certificateMsg,
        },
        complete: (res) => {
          console.log("提交简历信息");
          console.log(res);
          if (res.statusCode === 200) {
            uni.showToast({
              title: "信息提交成功",
              icon: "none",
              success: () => {
                this.getResuneMsg();
              },
            });
          } else {
            uni.showToast({
              title: res.data.data,
              icon: "none",
            });
          }
        },
      });
    },
    // 获取简历信息
    getResuneMsg() {
      uni.request({
        url: this.$baseUrl + "/personalResumeGet",
        header: {
          "content-type": "application/json",
          token: uni.getStorageSync("token"),
        },
        complete: (res) => {
          console.log("简历信息");
          console.log(res);
          if (res.data.code === 200) {
            this.resumeData = res.data.data;
          } else {
            this.resumeData = [];
          }
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.resume-container {
  padding: 0 40rpx;
  padding-bottom: 60rpx;

  .update-img {
    width: 32rpx;
    height: 32rpx;
  }

  .resume-main-one {
    padding: 40rpx 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 4rpx solid #f9f9f9;

    .one-left {
      .left-top {
        display: flex;
        align-items: center;
        font-size: 32rpx;
        font-weight: bold;

        .name {
          margin-right: 10rpx;
          letter-spacing: 4rpx;
        }
      }

      .left-bottom {
        margin-top: 20rpx;
        font-size: 22rpx;
        color: #808080;
      }
    }

    .one-right {
      image {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
      }
    }
  }

  .resume-main-every {
    padding: 40rpx 0;
    border-bottom: 4rpx solid #f9f9f9;

    .every-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 28rpx;
      font-weight: bold;
    }

    .every-main {
      margin-top: 40rpx;
      font-size: 24rpx;
      color: #808080;
      text-align: left;

      .list-one {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .list-one-left {
          font-size: 24rpx;
          color: #000;
        }

        .list-one-right {
          display: flex;
          align-items: center;

          text {
            margin-right: 20rpx;
            font-size: 22rpx;
            color: #c3c3c3;
          }
        }
      }

      .list-two {
        margin-top: 20rpx;
        color: #c3c3c3;
      }

      .list-three {
        .three-title {
          padding: 40rpx 0 20rpx;
        }

        .three-main {
          max-height: 80rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }
  }

  .resume-button {
    padding: 20rpx;
    margin-top: 80rpx;
    background-color: #85dbd0;
    border-radius: 12rpx;
    color: #fff;
    font-size: 24rpx;
    text-align: center;
  }
}
</style>
