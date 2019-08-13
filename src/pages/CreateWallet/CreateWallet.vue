<template>
  <div class="create-wallet card-width">
    <el-card>
      <div>
        <h1>{{$t('createWallet.createWallet')}}</h1>
        <span class="back"
              @click="back">
          <i class="el-icon-arrow-left"></i>
          {{$t('openWallet.back')}}
        </span>
        <div class="creat_walllet_hint ">{{$t('createWallet.createWalletTip1')}}<br>{{$t('createWallet.createWalletTip2')}}<br>{{$t('createWallet.createWalletTip3')}}<br>{{$t('createWallet.createWalletTip4')}}</div>
        <div class="file_btn"
             @click="goPage('/my-wallet/CreateWalletSecond')">
          {{$t('createWallet.createWalletButton')}}
        </div>
        <!-- <span class="keyStoneHintFont">{{$t('myWallet.msg1')}}<a @click="goPage('/')">{{$t('myWallet.openWallet')}}</a></span> -->
      </div>
    </el-card>
  </div>
</template>

<script>
import WalletUtil from '@/assets/js/WalletUtil'
export default {
  name: 'MyWallet',
  data () {
    return {
    }
  },
  methods: {
    goPage (pathStr) {
      let mnemonic = WalletUtil.createMnemonic()
      this.$store.commit('UPDATE_MNEMONIC', mnemonic)
      this.$router.push({ path: pathStr })
    },
    back () {
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="less">
.create-wallet {
  .creat_walllet_hint {
    font-size: 14px;
    color: #9298ae;
    letter-spacing: 0.13px;
    text-align: center;
  }
  .keyStoneHintFont {
    font-size: 0.75rem;
    color: #9298ae;
    letter-spacing: 0.11px;
    text-align: center;
  }
  a {
    font-size: 12px;
    color: #1c51dd;
    letter-spacing: 0.11px;
    text-align: center;
    line-height: 17px;
    cursor: pointer;
  }
  /deep/.el-card__body {
    padding: 2.5rem 1rem 5.875rem 1rem;
  }
  .back {
    // float: right;
    position: relative;
    left: 470px;
    top: -33px;
    cursor: pointer;
    color: #1c51dd;
    font-size: 0.88rem;
    letter-spacing: 0.13px;
  }
}
</style>
