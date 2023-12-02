<template>
  <nut-form>
    <nut-form-item label-width="110" label="存款金额(元/月)" required>
      <nut-input placeholder="请输入每月第一笔存款金额" class="nut-input-text" v-model="formData.firstRecord" type="number" />
    </nut-form-item>
    <nut-form-item label-width="110" label="一年期利率(%)" required>
      <nut-input class="nut-input-text" placeholder="请输入一年期年利率" v-model="formData.firstRate" type="digit" />
    </nut-form-item>
    <nut-form-item label-width="110" label="存款金额(元/月)" required>
      <nut-input placeholder="请输入每月第二笔存款金额" class="nut-input-text" v-model="formData.secondRecord" type="number" />
    </nut-form-item>
    <nut-form-item label-width="110" label="两年期利率(%)" required>
      <nut-input class="nut-input-text" placeholder="请输入两年期年利率" v-model="formData.secondRate" type="digit" />
    </nut-form-item>
    <nut-form-item label-width="110" label="存款金额(元/月)" required>
      <nut-input placeholder="请输入每月第三笔存款金额" class="nut-input-text" v-model="formData.thirdRecord" type="number" />
    </nut-form-item>
    <nut-form-item label-width="110" label="三年期利率(%)" required>
      <nut-input class="nut-input-text" placeholder="请输入三年期年利率" v-model="formData.thirdRate" type="digit" />
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
        <nut-button block plain type="default" @click="onFormDataReset">重置</nut-button>
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
import { useThirtySixCalcStore } from '../../stores/thirtySixCalc'
const thirtySixCalc = useThirtySixCalcStore()

const baseData = {
  firstRecord: '',
  secondRecord: '',
  thirdRecord: '',
  firstRate: '',
  secondRate: '',
  thirdRate: '',
  firstDate: dayjs().format('YYYY-MM-DD'),
  period: '3',
}

const formData = reactive({...baseData})

const updateDate = (date) => {
  formData.firstDate = date
}

const onFormDataReset = () => {
  Object.assign(formData, baseData)
}

const onStartCalc = async () => {
  if (!(Object.values(formData).every(Boolean))) {
    Taro.showToast({
      title: '请填写必填项!',
      icon: 'none',
      duration: 2000
    })
  } else {
    const {firstRecord, secondRecord, thirdRecord, firstRate, secondRate, thirdRate} = formData
    await thirtySixCalc.startCalc({
      ...formData,
      firstRecord: firstRecord * 1,
      secondRecord: secondRecord * 1,
      thirdRecord: thirdRecord * 1,
      firstRate: firstRate * 1,
      secondRate: secondRate * 1,
      thirdRate: thirdRate * 1,
    })
    Taro.navigateTo({
      url: `/pages/thirtySix/result`,
    })
  }
}

defineExpose({
  updateDate
})

</script>
