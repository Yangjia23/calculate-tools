// https://pinia.esm.dev/introduction.html
import { defineStore } from 'pinia'
import dayjs from 'dayjs'

// @desc: 计算详细清单
const calcDetailList = (formData) => {
  const { monthly, year, period, rate, firstDate } = formData
  const monthTotal = period * 12 // 总月份
  const arr = Array.from({ length: monthTotal })
  let prevPrincipalAndInterest = 0; // 上一周期到期后的本息
  let prevInterest = 0; // 上一周期到期后的利息
  return arr.reduce((pre, cur, idx) => {
    const startDate = idx
      ? dayjs(firstDate).add(idx, 'month').format('YYYY-MM-DD')
      : firstDate
    const saveMoney = monthly * 1 + prevPrincipalAndInterest
    const endInterest = saveMoney * (1 + (rate / 100 * year))
    const item = {
      startDate: dayjs(startDate).format('YY/MM/DD'),
      saveMoney,
      endDate: dayjs(startDate).add(period, 'year').format('YY/MM/DD'),
      endInterest,
      inBase: monthly + prevInterest, // 每个月投入的本金
    }
    if ((idx + 1) % (12 * year) === 0) {
      prevPrincipalAndInterest = endInterest
      prevInterest = prevPrincipalAndInterest - monthly
    }
    (pre as any[]).push(item)
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
    interest: totalInterest
  }
}

export const useTwelveCalcStore = defineStore('twelveCalc', {
  state: () => {
    return {
      calcResult: {
        monthly: '',
        year: '',
        rate: '',
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
      const { firstDate, period = 1 } = formData
      const curDate = dayjs().format('YYYY-MM-DD')
      const detailList = calcDetailList(formData)
      this.detailList = detailList
      const { totalDeposit, interest } = calcDepositAndInterest(detailList)
      this.calcResult = {
        ...formData,
        firstDate: firstDate || curDate,
        endDate: dayjs(firstDate || curDate).add(period, 'year').format('YYYY-MM-DD'),
        allPrincipal: totalDeposit,
        allIncome: interest,
      }
    },
  },
})
