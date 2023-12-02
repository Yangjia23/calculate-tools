<template>
  <nut-form>
    <nut-form-item label-width="110" label="存款金额(元/月)" required>
      <nut-input placeholder="请输入每月存款金额" class="nut-input-text" v-model="formData.monthly" type="number" />
    </nut-form-item>
    <nut-form-item label-width="110" label="期限(年)" required>
      <nut-input class="nut-input-text" placeholder="请输入期限" v-model="formData.year" type="number" />
    </nut-form-item>
    <nut-form-item label-width="110" label="年利率(%)" required>
      <nut-input class="nut-input-text" placeholder="请输入年利率" v-model="formData.rate" type="digit" />
    </nut-form-item>
    <nut-form-item label-width="110" label="开始存款日期" required>
      <nut-input
        class="nut-input-text"
        v-model="formData.firstDate"
        @click="$emit('date-picker')"
        readonly
        placeholder="请选择起存日"
        type="text"
      />
    </nut-form-item>
    <nut-form-item label-width="110" label="存款时长(年)" required>
      <nut-input-number v-model="formData.period" min="3" max="50" />
    </nut-form-item>
    <nut-row :style="{margin: '1em 0'}" type="flex" wrap="nowrap" justify="space-around">
      <nut-col :span="6">
        <nut-button block plain type="default" @click="onStartCalc">重置</nut-button>
      </nut-col>
      <nut-col :span="16">
        <nut-button type="primary" block @click="onStartCalc">开始计算</nut-button>
      </nut-col>
    </nut-row>
  </nut-form>
</template>
<script setup>
import { reactive } from 'vue';
import Taro from '@tarojs/taro';
import dayjs from 'dayjs'
import { useTwelveCalcStore } from '../../stores/twelveCalc'
const twelveCalc = useTwelveCalcStore()

const baseData = {
  monthly: '',
  year: '',
  rate: '',
  firstDate: dayjs().format('YYYY-MM-DD'),
  period: 3,
}
const formData = reactive({...baseData})

const updateDate = (date) => {
  formData.firstDate = date
}

const onFormDataReset = () => {
  Object.assign(formData, baseData)
}

const onStartCalc = async () => {
  if (!(formData.monthly && formData.year && formData.rate)) {
    Taro.showToast({
      title: '请填写必填项!',
      icon: 'none',
      duration: 2000
    })
  } else {
    await twelveCalc.startCalc({
      ...formData,
      monthly: +formData.monthly,
      year: +formData.year,
      period: +formData.period,
      rate: +formData.rate,
    })
    Taro.navigateTo({
      url: `/pages/twelve/result`,
    })
  }
}

defineExpose({
  updateDate
})

</script>

<style lang="scss">
  .action-row{
    margin: 1em 0;
  }
</style>
