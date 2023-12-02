<template>
  <view class="index">
    <nut-tabs v-model="curTab" auto-height>
      <nut-tab-pane title="36 存单法" pane-key="0">
        <thirty-six-calc ref="thirtySixPaneRef" @date-picker="dateModule.methods.show" />
      </nut-tab-pane>
      <nut-tab-pane title="12 存单法" pane-key="1">
        <twelve-calc ref="twelvePaneRef" @date-picker="dateModule.methods.show" />
      </nut-tab-pane>
    </nut-tabs>
    <view @click="overlayModule.methods.show" class="desc-btn">
      <Ask />{{descTexts.title}}介绍</view>
    <nut-popup
      round
      closeable
      :style="popupStyle"
      class="decs-popup"
      v-model:visible="overlayModule.state.show"
    >
      <view class="decs-cell-title">{{descTexts.title}}操作</view>
      <view class="decs-cell-item" v-for="item in descTexts.steps">
        <Checklist color="#2c68ff" />{{item}}</view>
      <view class="decs-cell-title">优缺点</view>
      <view class="decs-cell-item"><Success color="green" />{{descTexts.good}}</view>
      <view class="decs-cell-item"><Failure color="red" />{{descTexts.bad}}</view>
    </nut-popup>
    <nut-popup position="bottom" v-model:visible="dateModule.state.show">
      <nut-date-picker
        type="date"
        v-model="dateModule.state.currentDate"
        @confirm="dateModule.methods.onConfirm"
        :is-show-chinese="true"
      >
      </nut-date-picker>
    </nut-popup>
  </view>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { Checklist, Success, Failure, Ask } from '@nutui/icons-vue-taro'

import ThirtySixCalc from '../../components/CalcTool/ThirtySixCalc.vue'
import TwelveCalc from '../../components/CalcTool/TwelveCalc.vue'

const ThirtySixDesc = {
  title: '36存单法',
  steps: [
    '以每个月存 3000 元为例',
    '第一年，每月存款平均分成3笔，分别存储一年、二年、三年期，第一年共36张存单',
    '第二年，将当月本金3000元加上一年期到期的1000本金和利息一起，再存储三年期',
    '第三年，将当月本金3000元加上二年期到期的1000本金和利息一起，再存储三年期',
    '以此类推，一直滚存'
  ],
  good: '优点：灵活性更好',
  bad: '缺点：第一年利息较低，每月分成三笔较为繁琐'
}

const TwelveDesc = {
  title: '12存单法',
  steps: [
    '以每个月存 3000 元为例',
    '每月存3000元，存储三年期，每年12张存单',
    '第四年，将当月本金3000元加上到期的3000本金和利息一起，继续存三年期',
    '以此类推，一直滚存'
  ],
  good: '优点：可享受相对较高的三年期利率',
  bad: '缺点：灵活性较差'
}

const popupStyle = {
  padding: '1em',
  width: '80vw',
  textAlign: 'left',
}

const curTab = ref('0');
const thirtySixPaneRef = ref()
const twelvePaneRef = ref()

const descTexts = computed(() => {
  return curTab.value === '0' ? {...ThirtySixDesc} : {...TwelveDesc}
})

const overlayModule = reactive({
  state: {
    show: false,
  },
  methods: {
    show() {
      overlayModule.state.show = !overlayModule.state.show;
    },
  }
})

const dateModule = reactive({
  state: {
    show: false,
    currentDate: new Date(),
  },
  methods: {
    show() {
      dateModule.state.show = !dateModule.state.show;
    },
    onConfirm({ selectedValue, selectedOptions }) {
      const date = selectedOptions.map((val) => val.value).join('-');
      curTab.value === '0' 
        ? thirtySixPaneRef.value.updateDate(date)
        : twelvePaneRef.value.updateDate(date)
      dateModule.state.show = false
    }
  }
})
</script>

<style lang="scss">
.index {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  box-sizing: border-box;
  height: 100vh;
}

.desc-btn{
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--nut-primary-color, #2c68ff);
  font-size: 0.9em;
  cursor: pointer;
}

.decs-popup{
  .decs-cell-title{
    font-size: 1.2em;
    margin: .5em 0 .2em;
  }
  .decs-cell-item{
    display: flex;
    align-items: flex-start;
    margin-bottom: .2em;
    .nut-icon{
      margin-right: .2em;
      flex-shrink: 0;
    }
  }
}
</style>
