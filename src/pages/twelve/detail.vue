<template>
  <nut-config-provider :theme-vars="themeVars">
    <view v-for="group in state.groupList">
      <nut-table
        :columns="state.columns"
        :data="group.list"
        :bordered="false"
        :striped="true"
      ></nut-table>
      <view class="result-cell">
        <text>本年投入的全部本金到期后共可赚取利息</text>
        <nut-price class="text-price" :price="group.interestYear" :decimal-digits="2" thousands />
      </view>
    </view>
  </nut-config-provider>
</template>
<script setup>
import { reactive, h, onMounted } from 'vue';
import dayjs from 'dayjs'
import { Price } from '@nutui/nutui-taro';
import { useTwelveCalcStore } from '../../stores/twelveCalc'
const twelveCalc = useTwelveCalcStore()

const themeVars = reactive({
  tableColsPadding: '2px'
});

const state = reactive({
  columns: [
    {
      title: '存入时间',
      key: 'startDate',
      align: 'center'
    },
    {
      title: '存入金额',
      key: 'saveMoney',
      align: 'center',
      render: (record) => {
        return h(
          'span',
          {},
          `¥${record.saveMoney}`
        );
      }
    },
    {
      title: '到期时间',
      key: 'endDate',
      align: 'center'
    },
    {
      title: '到期本息',
      key: 'endInterest',
      align: 'center',
      render: (record) => {
        return h(
          'span',
          {},
          `¥${record.endInterest.toFixed(2)}`
        );
      }
    }
  ],
  groupList: [],
});

onMounted(async () => {
  const detailList = twelveCalc.detailList
  let list = []
  const groupList = detailList.reduce((pre,cur,idx) => {
    list.push(cur)
    if ((idx+1) %12 === 0) {
      const interest = cur.endInterest - cur.saveMoney
      pre.push({list, interestYear: interest * 12 })
      list = []
    }
    return pre
  }, [])
  state.groupList = groupList
})
</script>

<style lang="scss">
  .result-cell{
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.8em;
    padding: 0.3em 1em;
    background: #efe8d9;
  }
</style>
