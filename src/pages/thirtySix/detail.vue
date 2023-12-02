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
import { useThirtySixCalcStore } from '../../stores/thirtySixCalc'
const thirtySixCalc = useThirtySixCalcStore()

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
          `¥${formatNumberWithTwoDecimals(record.endInterest)}`
        );
      }
    }
  ],
  groupList: [],
});

function formatNumberWithTwoDecimals(num) {
  const roundedNum = num.toFixed(2);
  const finalNum = parseFloat(roundedNum);
  return finalNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

onMounted(async () => {
  const detailList = thirtySixCalc.detailList
  let list = []
  console.log('detailList', detailList)
  const groupList = detailList.reduce((pre,cur,idx) => {
    list.push(cur)
    const actIdx = idx + 1
    if (actIdx === 36 || (actIdx > 36 && (actIdx - 24) % 12 === 0)) {
      const interestYear = list.reduce((pre, cur) => {
        return pre + (cur.endInterest * 1 - cur.saveMoney)
      }, 0)
      console.log('interestYear', interestYear)
      pre.push({ list, interestYear })
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
