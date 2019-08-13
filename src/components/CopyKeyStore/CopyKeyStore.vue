<template>
  <div class="privateKey">
    <el-card class="card-width">
      <h1>{{$t('copyKeyStore.backupsKeyStore')}}</h1>
      <div class="item">
        <div class="card_way">
          <div class="pic_dis">
            <img src="../../assets/images/keystone.png">
          </div>
          <div class="check_font">
            <label>Keystore {{$t('myWallet.file')}}</label>
          </div>
        </div>
        <div class="keyStore_explain">{{$t('createWallet.backupKeyStoreTip')}}</div>
        <div class="pass_input">
          <input :placeholder="$t('myWallet.enterPassword')"
                 :type="isShowPassword ? 'text' : 'password'"
                 v-model="password"
                 class="storeInput">
          <div class="pass_pic"
               :class="{'passwordClose': !isShowPassword, 'passwordOpen' : isShowPassword }"
               @click="changeShowPassword">
            <img :src="isShowPassword ? require('../../assets/images/password_open.png') : require('../../assets/images/password_close.png')">
          </div>
        </div>
      </div>
      <button class="common-button button-top"
              @click="download">{{$t('createWallet.download')}}</button>
    </el-card>
  </div>
</template>
<script>
import WalletUtil from '@/assets/js/WalletUtil'
import FileSaver from 'file-saver'
export default {
  name: 'copyKeyStore',
  data () {
    return {
      privateKey: this.$store.state.wallet.privateKey,
      isShowPassword: false,
      password: ''
    }
  },
  methods: {
    changeShowPassword () {
      this.isShowPassword = !this.isShowPassword
    },
    download () {
      if (this.privateKey === '' || this.privateKey == null) {
        this.$message.error('请先解锁钱包')
      } else {
        if (this.password.length < 9) {
          this.$message.error(this.$t('createWallet.passwordTip'))
        } else {
          let loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          // let keystore = WalletUtil.mnemonicToKeyStore(this.privateKey.substring(2, this.privateKey.length), this.password)
          let keystore = WalletUtil.privateKeyToKeyStore(this.privateKey.substring(2, this.privateKey.length), this.password)
          let data = JSON.stringify(keystore)
          let blob = new Blob([data], { type: '' })
          FileSaver.saveAs(blob, WalletUtil.getFileName(keystore.address))
          this.password = ''
          this.$message.success(this.$t('copyKeyStore.backupsSuccess'))
          loading.close()
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.privateKey {
  .card-width{
    margin: auto;
  }
  /deep/.el-card__body {
    padding: 2rem 0 2.5rem;
  }
  label {
    font-size: 0.875rem;
    color: #1c51dd;
    letter-spacing: 0;
  }
  .type_font {
    font-size: 0.875rem;
    color: #2c365c;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }
  .item {
    margin-top: 2rem;
    cursor: pointer;
    .card_way{
      margin: auto;
    }
    .pass_input {
      display: flex;
      flex-direction: row;
      justify-content: center;
      margin-top: 2.5rem;
      img {
        cursor: pointer;
      }
      .passwordClose {
        background: #f2f4f8;
      }
      .passwordOpen {
        background: #415eaa;
      }
      .storeInput {
        width: 23.125rem;
        height: 2.5rem;
        padding: 0;
        border: 1px solid #d5d7de;
      }
      .pass_pic {
        width: 3.3125rem;
        height: 2.6rem;
        line-height: 3rem;
        cursor: pointer;
      }
    }
    .keyStore_explain {
      width: 12rem;
      text-align: center;
      font-size: 12px;
      color: #9298ae;
      letter-spacing: 0.13px;
      text-align: center;
      margin: 1rem auto;
    }
  }
  img {
    width: 2rem;
  }
  .button-top {
    margin-top: 2rem;
  }
}
</style>
