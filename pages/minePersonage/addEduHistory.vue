<template>
  <view class="add-project-history-container">
    <!-- 添加教育经历 -->
    <view class="add-project-every">
      <view class="every-title">学校</view>
      <input
        class="every-input"
        placeholder="请输入"
        placeholder-style="color: #dadada;"
        type="text"
        v-model="addEduData.schoolName"
      />
    </view>
    <view class="add-project-every">
      <view class="every-title">学历</view>
      <input
        class="every-input"
        placeholder="请选择"
        placeholder-style="color: #dadada;"
        type="text"
        v-model="addEduData.formalSchool"
        @click="formalClick"
      />
      <uni-data-picker
        ref="formalRef"
        class="every-input"
        placeholder="请选择"
        placeholder-style="color: #dadada;"
        :localdata="formalSchoolList"
        popup-title="学历"
        @change="onchange"
      >
      </uni-data-picker>
    </view>
    <view class="add-project-every">
      <view class="every-title">专业</view>
      <input
        class="every-input"
        placeholder="请填写专业名称"
        placeholder-style="color: #dadada;"
        type="text"
        v-model="addEduData.major"
      />
    </view>
    <view class="add-project-every">
      <view class="every-title">时间段</view>
      <view class="every-context">
        <picker mode="date" fields="year" @change="startTimeChange">
          <input
            class="every-input"
            style="text-align: center"
            placeholder="入学时间"
            placeholder-style="color: #dadada;"
            type="text"
            v-model="addEduData.startTime"
          />
        </picker>
        <text>至</text>
        <picker mode="date" fields="year" @change="endTimeChange">
          <input
            class="every-input"
            style="text-align: center"
            placeholder="毕业时间"
            placeholder-style="color: #dadada;"
            type="text"
            v-model="addEduData.endTime"
          />
        </picker>
      </view>
    </view>
    <view class="add-project-every">
      <view class="every-title">在校经历</view>
      <navigator
        :url="'./experienceInSchoolContext?context=' + addEduData.achievement"
        hover-class="none"
      >
        <view
          class="every-input"
          style="color: #dadada"
          v-if="addEduData.achievement.length == 0"
          >请输入
        </view>
        <view class="every-input every-textarea" v-else>
          {{ addEduData.achievement }}
        </view>
      </navigator>
    </view>
    <view class="add-project-button" @click="addProjectSave">保存</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      addEduData: {
        schoolName: "",
        formalSchool: "",
        major: "",
        startTime: "",
        endTime: "",
        achievement: "",
      },
      formalSchoolList: [
        {
          text: "初中及以下",
          value: "初中及以下",
        },
        {
          text: "中专/中技",
          value: "中专/中技",
        },
        {
          text: "高中",
          value: "高中",
        },
        {
          text: "大专",
          value: "大专",
          children: [
            {
              text: "全日制",
              value: "全日制",
            },
            {
              text: "非全日制",
              value: "非全日制",
            },
          ],
        },
        {
          text: "本科",
          value: "本科",
          children: [
            {
              text: "全日制",
              value: "全日制",
            },
            {
              text: "非全日制",
              value: "非全日制",
            },
          ],
        },
        {
          text: "硕士",
          value: "硕士",
          children: [
            {
              text: "全日制",
              value: "全日制",
            },
            {
              text: "非全日制",
              value: "非全日制",
            },
          ],
        },
        {
          text: "博士",
          value: "博士",
          children: [
            {
              text: "全日制",
              value: "全日制",
            },
            {
              text: "非全日制",
              value: "非全日制",
            },
          ],
        },
      ],
    };
  },
  onLoad() {
    // 在校经历
    uni.$on("achievementContext", (e) => {
      console.log(e);
      this.addEduData.achievement = e;
    });
  },
  methods: {
    formalClick() {
      this.$refs.formalRef.show();
    },
    onchange(e) {
      console.log(e);
      console.log(e.detail.value.map((item) => item.value));
      this.addEduData.formalSchool = e.detail.value
        .map((item) => item.value)
        .join("/");
      console.log(this.addEduData.formalSchool);
    },
    // 开始时间
    startTimeChange(e) {
      console.log(e);
      this.addEduData.startTime = e.detail.value;
    },
    // 结束时间
    endTimeChange(e) {
      console.log(e);
      this.addEduData.endTime = e.detail.value;
    },
    // 保存
    addProjectSave() {
      uni.$emit("addEduData", this.addEduData);
      uni.navigateBack({
        delta: 1,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.add-project-history-container {
  padding: 0 40rpx;

  .add-project-every {
    padding: 40rpx 0;
    border-bottom: 4rpx solid #f9f9f9;

    .every-title {
      font-size: 26rpx;
      color: #000;
    }

    .every-context {
      display: flex;
      align-items: baseline;
    }

    .every-input {
      margin-top: 20rpx;
      font-size: 30rpx;
      color: #000;
    }

    .every-textarea {
      max-height: 40rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }

  .add-project-button {
    padding: 20rpx;
    margin-top: 120rpx;
    background-color: #85dbd0;
    border-radius: 12rpx;
    color: #fff;
    font-size: 24rpx;
    text-align: center;
  }
}
</style>
<style lang="scss">
.uni-data-tree {
  position: relative;
  top: 20rpx;
}

.placeholder {
  color: #dadada !important;
}

.input-value-border {
  border: none !important;
}

.input-value {
  padding: 0 !important;
  line-height: 0 !important;
}

.selected-list {
  padding: 0 !important;
}

.arrow-area.data-v-3ed22fe0 {
  display: none !important;
}
</style>
