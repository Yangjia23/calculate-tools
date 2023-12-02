// https://pinia.esm.dev/introduction.html
import { defineStore } from 'pinia'
import dayjs from 'dayjs'

const calcDetailList = (formData) => {
  const {
    firstRecord,
    secondRecord,
    thirdRecord,
    firstRate,
    secondRate,
    thirdRate,
    period,
    firstDate
  } = formData
  const monthly = firstRecord + secondRecord + thirdRecord; // 最开始每月投入的本金
  const monthTotal = period * 12 + 24 // 总月份
  const arr = Array.from({ length: monthTotal })
  let endBenXiArr = [] as number[]  //  到期后的本息数组（去重）
  let endShouYi = [] as number[]    //  到期后的存收益数组（去重）
  return arr.reduce((pre, cur, idx) => {
    const firstYear = idx < 36; // 是否是第一年（第一年 12 * 3笔存单）
    const increment = firstYear ? Math.floor(idx / 3) : (idx - 24);
    const startDate = increment
      ? dayjs(firstDate).add(increment, 'month').format('YYYY-MM-DD')
      : firstDate // 开始日期
    const prevEndBenXi = idx < 36 ? 0 : endBenXiArr[Math.floor((idx - 24) / 12) - 1] //上一周期到期后的本息
    const prevEndShouYi = idx < 36 ? 0 : endShouYi[Math.floor((idx - 24) / 12) - 1] //上一周期的最终利润
    const monthBase = firstYear
      ? [firstRecord, secondRecord, thirdRecord][Math.abs(idx % 3)]
      : monthly // 每月存钱基数
    const saveMoney = monthBase + prevEndBenXi
    const rate = firstYear
      ? [firstRate, secondRate, thirdRate][Math.abs(idx % 3)]
      : thirdRate // 定期利率
    const year = firstYear ? Math.abs(idx % 3) + 1 : 3; // 定期年限
    const endBenXi = saveMoney * (1 + (rate / 100 * year)) // 每月存储到期后的本息
    if (!endBenXiArr.includes(endBenXi)) {
      endBenXiArr.push(endBenXi)
      endShouYi.push(endBenXi - saveMoney)
    }
    const item = {
      startDate: dayjs(startDate).format('YY/MM/DD'),
      saveMoney,
      rate,
      year,
      endDate: dayjs(startDate).add(year, 'year').format('YY/MM/DD'),
      endInterest: endBenXi,
      inBase: monthBase + prevEndShouYi, // 当月实际本金（本月基数 + 上一周期的利率）
    }
      ; (pre as any[]).push(item)
    return pre
  }, [])
}

// @desc: 计算投入的本金和利息
const calcDepositAndInterest = (list) => {
  const totalDeposit = list.reduce((pre, cur) => {
    return pre + cur.inBase * 1
  }, 0)
  const totalInterest = list.reduce((pre, cur) => {
    return pre + (cur.endInterest - cur.saveMoney) * 1
  }, 0)
  return {
    totalDeposit,
    totalInterest,
  }
}

export const useThirtySixCalcStore = defineStore('thirtySixCalc', {
  state: () => {
    return {
      calcResult: {
        firstRecord: '',
        secondRecord: '',
        thirdRecord: '',
        firstRate: '',
        secondRate: '',
        thirdRate: '',
        firstDate: '',
        period: 1,
        endDate: '',
        allPrincipal: '', // 总本金
        allIncome: '', // 总收益
      },
      detailList: []
    }
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    startCalc(formData) {
      const { firstDate, period = 1, firstRecord, secondRecord, thirdRecord } = formData
      const curDate = dayjs().format('YYYY-MM-DD')
      const detailList = calcDetailList(formData)
      this.detailList = detailList
      const { totalDeposit, totalInterest } = calcDepositAndInterest(detailList)
      this.calcResult = {
        ...formData,
        monthly: firstRecord + secondRecord + thirdRecord,
        firstDate: firstDate || curDate,
        endDate: dayjs(firstDate || curDate).add(period, 'year').format('YYYY-MM-DD'),
        allPrincipal: totalDeposit,
        allIncome: totalInterest,
      }
    },
  },
})

// You can even use a function (similar to a component setup()) to define a Store for more advanced use cases:
// export const useCounterStore = defineStore('counter', () => {
//   const count = ref(0)
//
//   function increment() {
//     count.value++
//   }
//
//   return {count, increment}
// })