<template>
  <view class="header-pane">
    <view>持续存钱<text class="text-hight">{{calcResult.period}}</text>年后，预计到期后利息总收益为</view>
    <view class="money-row">
      <nut-price class="text-money" size="large" :price="calcResult.allIncome" :decimal-digits="2" thousands />
    </view>
    <nut-button class="btn-detail" plain type="info" size="mini" @click="goDetail">更多详情</nut-button>
  </view>
  <nut-config-provider :theme-vars="themeVars">
    <nut-cell-group>
      <nut-cell title="每月存款金额">
        <template #desc>
          <nut-price
            :price="calcResult.monthly" 
            :decimal-digits="2"
            position="after"
            symbol="元"
            thousands 
          />
        </template>
      </nut-cell>
      <nut-cell title="存期及年利率">
        <template #desc>
          <text>{{`${calcResult.year}年${calcResult.rate}%`}}</text>
        </template>
      </nut-cell>
      <nut-cell title="起存日" :desc="calcResult.firstDate"></nut-cell>
      <nut-cell title="存款时长">
        <template #desc>
          <span>{{calcResult.period}} <b>年</b></span>
        </template>
      </nut-cell>
      <nut-cell title="到期日" :desc="calcResult.endDate"></nut-cell>
      <nut-cell title="累计本金">
        <template #desc>
          <nut-price
            :price="calcResult.allPrincipal" 
            :decimal-digits="2"
            position="after"
            symbol="元"
            thousands 
          />
        </template>
      </nut-cell>
      <nut-cell title="利息总收益">
        <template #desc>
          <nut-price
            :price="calcResult.allIncome" 
            :decimal-digits="2"
            position="after"
            symbol="元"
            thousands 
          />
        </template>
      </nut-cell>
    </nut-cell-group>
  </nut-config-provider>
  <nut-noticebar text="计算结果仅供参考，不具备任何投资建议"
    :background="`rgba(251, 248, 220, 1)`"
    :color="`#D9500B`"
  ></nut-noticebar>
</template>

<script setup>
import { reactive, ref } from 'vue';
import Taro from '@tarojs/taro';
import { useTwelveCalcStore } from '../../stores/twelveCalc'
const twelveCalc = useTwelveCalcStore()
const calcResult = ref({...twelveCalc.calcResult})

const themeVars = reactive({
  cellDescColor: 'rgba(0,0,0, .7)',
  primaryColor: 'rgba(0,0,0, .7)',
  priceMediumSize: '28rpx',
  priceDecimalMediumSize: '24rpx'
});

const goDetail = () => {
  Taro.navigateTo({
    url: `/pages/twelve/detail`,
  })
}

</script>

<style lang="scss">
.header-pane {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: var(--nut-button-info-background-color, linear-gradient(315deg, rgb(73, 143, 242) 0%, rgb(73, 101, 242) 100%));;
  color: #eee;
  position: relative;
  padding: 1em .5em;

  .title-row{
    margin-bottom: 1em;
  }
  // font-size: 1em;
  .text-hight {
    font-size: 1.1em;
    padding: 0 0.1em;
  }
  .money-row{
    margin-top: .4em;
    margin-bottom: .4em;
    .text-money {
      color: #fff;
    }
  }
  .btn-detail{
    position: absolute;
    right: .5em;
    bottom: .5em;
  }
}
</style>
