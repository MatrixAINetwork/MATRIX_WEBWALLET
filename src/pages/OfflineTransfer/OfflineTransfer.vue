<template>
  <div class="offline-transfer align-center">
    <el-card class="body-card">
      <div class="step-content flex">
        <div class="step-content-item" :class="{'is-process' : step === 1, 'is-success' : step > 1}">
          <div class="step-content-item-number">1</div>
          <div class="step-content-item-name">{{$t('offline.getWallet')}}</div>
          <div class="step-content-item-line">———————</div>
        </div>
        <div class="step-content-item" :class="{'is-process' : step === 2, 'is-success' : step > 2}">
          <div class="step-content-item-number">2</div>
          <div class="step-content-item-name">{{$t('offline.offTransfer')}}</div>
          <div class="step-content-item-line">———————</div>
        </div>
        <div class="step-content-item" :class="{'is-process' : step === 3, 'is-success' : step > 3}">
          <div class="step-content-item-number">3</div>
          <div class="step-content-item-name">{{$t('offline.unlockWallet')}}</div>
          <div class="step-content-item-line">———————</div>
        </div>
        <div class="step-content-item" :class="{'is-process' : step === 4}">
          <div class="step-content-item-number">4</div>
          <div class="step-content-item-name">{{$t('offline.confirmTransfer')}}</div>
        </div>
      </div>
      <div class="sub-header">
        <div class="title">{{$t('offline.offLineTransfer')}}</div>
        <div class="sub-title">{{$t('offline.offLineTransferHint')}}</div>
      </div>
      <router-view></router-view>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'OfflineTransfer',
  data () {
    return {
      step: 1
    }
  },
  watch: {
    $route (to, from) {
      let name = to.name
      if (name === 'OfflineTransferFirst') {
        this.step = 1
      } else if (name === 'OfflineTransferSecond') {
        this.step = 2
      } else if (name === 'OfflineTransferThird') {
        this.step = 3
      } else if (name === 'OfflineTransferFourth') {
        this.step = 4
      }
    }
  },
  mounted () {
    let name = this.$route.name
    if (name === 'OfflineTransferFirst') {
      this.step = 1
    } else if (name === 'OfflineTransferSecond') {
      this.step = 2
    } else if (name === 'OfflineTransferThird') {
      this.step = 3
    } else if (name === 'OfflineTransferFourth') {
      this.step = 4
    }
  },
  components: {
  }
}
</script>

<style scoped lang="less">
  .offline-transfer {
    .sub-header {
      padding: 0 3.25rem;
      text-align: center;
      .title {
        font-size: 1.25rem;
        color: #2c365c;
        letter-spacing: 0.18px;
        margin-top: 2rem;
      }
      .sub-title {
        font-size: 14px;
        color: #9298ae;
        letter-spacing: 0.13px;
        margin-top: 0.38rem;
        padding: 0 10.19rem;
        padding-bottom: 2.04rem;
        border-bottom: 1px #d5d7de solid;
      }
    }
    .step-content {
      background: #f9fafc;
      padding: 1.94rem 3.19rem;
      border: 1px #ebecf2 solid;
      &-item {
        display: flex;
        align-items: center;
        &-name {
          font-size: 0.88rem;
          color: #b1b7c8;
          margin-left: 5px;
        }
        &-number {
          color: #b1b7c8;
          width: 23px;
          height: 23px;
          line-height: 23px;
          border-radius: 50%;
          font-size: 0.88rem;
          border: 1px #b1b7c8 solid;
        }
        &-line {
          color: #b1b7c8;
          margin: 0 10px 0 20px;
        }
      }
      .is-success {
        .step-content-item-number {
          color: #4a7aed;
          border: 1px #4a7aed solid;
        }
        .step-content-item-line {
          color: #70c5f7;
        }
      }
      .is-process {
        .step-content-item-number {
          color: #fff;
          border: 1px #104ee6 solid;
          background: #104ee6;
        }
        .step-content-item-name {
          color: #4e5679;
        }
      }
    }
  }
</style>
