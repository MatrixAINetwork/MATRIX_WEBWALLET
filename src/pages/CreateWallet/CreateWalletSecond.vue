<template>
  <div class="create-wallet card-width">
    <el-card>
      <div>
        <h1>{{$t('createWallet.createWallet')}}</h1>
        <span class="back-tittle"
              v-show="backTittle"
              @click="backPage">
          <i class="el-icon-arrow-left"></i>
          {{$t('openWallet.back')}}
        </span>
        <div class="creat_walllet_hint">{{$t('createWallet.hint')}}</div>
        <span class="back"
              @click="back"
              v-if="backShow">
          <i class="el-icon-arrow-left"></i>
          {{$t('openWallet.back')}}
        </span>
        <div class="card_pos">
          <div class="item"
               @click="createWallet('keystore')"
               v-show="selectKeystore">
            <div class="type_font">{{$t('createWallet.method1')}}</div>
            <div class="card_way">
              <div class="pic_dis">
                <img src="../../assets/images/keystone.png">
              </div>
              <div class="check_font">
                <label>Keystore {{$t('myWallet.file')}}</label>
              </div>
            </div>
            <div class="keyStore_explain">{{$t('createWallet.backupKeyStoreTip')}}</div>
          </div>
          <div class="item"
               v-show="selectPrivateKey"
               @click="createWallet('privateKey')">
            <div class="type_font">{{$t('createWallet.method2')}}</div>
            <div class="card_way div_dis">
              <div class="pic_dis">
                <img src="../../assets/images/private_key.png">
              </div>
              <div class="check_font">
                <label>{{$t('myWallet.privateKey')}}</label>
              </div>
            </div>
            <div translate="key_explain"
                 class="keyStore_explain">{{$t('createWallet.backupPrivateKeyTip')}}</div>
          </div>
          <div class="item"
               @click="createWallet('mnemonic')"
               v-show="selectMnemonicKey">
            <div class="type_font">{{$t('createWallet.method3')}}</div>
            <div class="card_way">
              <div class="pic_dis">
                <img src="../../assets/images/mnemonic.png">
              </div>
              <div class="check_font">
                <label>{{$t('myWallet.mnemonic')}}</label>
              </div>
            </div>
            <div class="keyStore_explain">{{$t('createWallet.backupMnemonicTip')}}</div>
          </div>
        </div>
        <div v-show="!selectMnemonicKey && !selectKeystore && selectPrivateKey && !downShow">
          <h5>{{$t('conversion.manAddress')}}</h5>
          <div>
            <input class="addressInput"
                   v-model="wallet.address"
                   readonly>
          </div>
          <div class="pass_input">
            <input class="storeInput"
                   v-model="privateKey"
                   readonly>
            <div class="copy_btn"
                 v-clipboard="privateKey"
                 @success="copySuccess"
                 @error="copyError">
              {{$t('createWallet.copy')}}
            </div>
          </div>
          <div class="file_btn"
               style="margin-bottom: -3rem;"
               @click="savePrivateKey">
            {{$t('createWallet.savePrivateKey')}}
          </div>
        </div>
        <div v-show="selectMnemonicKey && !selectKeystore && !selectPrivateKey && !downShow">
          <h5>{{$t('conversion.manAddress')}}</h5>
          <div>
            <input class="addressInput"
                   v-model="wallet.address"
                   readonly>
          </div>
          <div class="pass_input">
            <input class="storeInput"
                   v-model="mnemonic">
            <div class="copy_btn"
                 v-clipboard="mnemonic"
                 @success="copySuccess"
                 @error="copyError">
              {{$t('createWallet.copy')}}
            </div>
          </div>
          <div class="file_btn"
               style="margin-bottom: -3rem;"
               @click="saveMnemonic">
            {{$t('createWallet.saveMnemonic')}}
          </div>
        </div>
        <div v-show="!selectMnemonicKey && selectKeystore && !selectPrivateKey && !downShow">
          <h5>{{$t('conversion.manAddress')}}</h5>
          <div>
            <input class="addressInput"
                   v-model="wallet.address"
                   readonly>
          </div>
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
          <div class="error_hint"
               v-show="error_hint">*{{$t('createWallet.passwordTip')}}</div>
          <div class="file_btn"
               style="margin-bottom: -3rem;"
               @click="confirmPass">
            {{$t('createWallet.save')}}
          </div>
        </div>
        <div v-show="downShow">
          <div class="download_btn"
               @click="download">{{$t('createWallet.download')}}{{$t('myWallet.file')}}</div>
          <div class="file_btn"
               @click="next(keyStore.address)"
               style="margin-bottom: -2.875rem;"
               :class="{'is-download' : isDownload}">{{$t('createWallet.next')}}</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import WalletUtil from '@/assets/js/WalletUtil'
import FileSaver from 'file-saver'
import store from '@/store'
export default {
  name: 'MyWallet',
  data () {
    return {
      selectKeystore: true,
      selectPrivateKey: true,
      selectMnemonicKey: true,
      downShow: false,
      isShowPassword: false,
      error_hint: false,
      isDownload: true,
      privateKey: '',
      password: '',
      keyStore: null,
      mnemonic: this.$store.state.mnemonic,
      backShow: false,
      wallet: {},
      backTittle: true
    }
  },
  mounted () {
    let privateKey = WalletUtil.mnemonicToPrivateKey(this.mnemonic).toString('hex')
    this.wallet = WalletUtil.privateKeyToWallet(privateKey)
  },
  methods: {
    copySuccess () {
      this.$message.success(this.$t('myWallet.copySuccess'))
    },
    copyError () {
      this.$message.error(this.$t('myWallet.copyFile'))
    },
    changeShowPassword () {
      this.isShowPassword = !this.isShowPassword
    },
    goPage (route) {
      this.$router.push({ path: '/my-wallet/' + route })
    },
    createWallet (type) {
      this.backTittle = false
      this.backShow = true
      this.selectKeystore = false
      this.selectPrivateKey = false
      this.selectMnemonicKey = false
      this.password = ''
      this.keyStore = null
      if (type === 'keystore') {
        this.selectKeystore = true
      } else if (type === 'privateKey') {
        this.privateKey = WalletUtil.mnemonicToPrivateKey(this.mnemonic).toString('hex')
        this.selectPrivateKey = true
      } else if (type === 'mnemonic') {
        this.selectMnemonicKey = true
      }
    },
    confirmPass () {
      let loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      // if (/[a-zA-Z0-9]$/.test(this.password) && this.password.length >= 9) {
      if (this.password.length >= 9) {
        this.keyStore = WalletUtil.mnemonicToKeyStore(this.mnemonic, this.password)
        this.downShow = true
        loading.close()
      } else {
        loading.close()
        this.error_hint = true
      }
    },
    download () { // 下载keystore
      let data = JSON.stringify(this.keyStore)
      let blob = new Blob([data], { type: '' })
      FileSaver.saveAs(blob, WalletUtil.getFileName(this.keyStore.address))
      this.isDownload = false
    },
    saveMnemonic () { // 保留助记词
      let privateKey = WalletUtil.mnemonicToPrivateKey(this.mnemonic).toString('hex')
      let wallet = WalletUtil.privateKeyToWallet(privateKey)
      this.next(wallet.address)
    },
    savePrivateKey () { // 保留私钥
      let wallet = WalletUtil.privateKeyToWallet(this.privateKey)
      this.next(wallet.address)
    },
    next (address) {
      if (this.privateKey === '') {
        this.privateKey = WalletUtil.mnemonicToPrivateKey(this.mnemonic).toString('hex')
      }
      let loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let wallet = WalletUtil.privateKeyToWallet(this.privateKey.trim())
      loading.close()
      store.commit('UPDATE_WALLET', wallet)
      this.$router.push({ path: '/my-wallet/setGreetings', query: { address: address } })
    },
    back () {
      this.backTittle = true
      if (this.downShow) {
        this.downShow = false
      } else {
        this.selectKeystore = true
        this.selectPrivateKey = true
        this.selectMnemonicKey = true
        this.backShow = false
      }
    },
    backPage () {
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
  .card_pos {
    .item {
      cursor: pointer;
      .keyStore_explain {
        width: 12rem;
        text-align: center;
      }
    }
    .item:not(:first-child) {
      margin-left: 1rem;
    }
  }
  .type_font {
    font-size: 0.875rem;
    color: #2c365c;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }
  .keyStore_explain {
    font-size: 12px;
    color: #9298ae;
    letter-spacing: 0.13px;
    text-align: center;
    margin-top: 1rem;
  }
  .pass_pic {
    width: 3.3125rem;
    height: 2.6rem;
    line-height: 3rem;
    cursor: pointer;
  }
  .passwordClose {
    background: #f2f4f8;
  }
  .passwordOpen {
    background: #415eaa;
  }
  a {
    font-size: 12px;
    color: #1c51dd;
    letter-spacing: 0.11px;
    text-align: center;
    line-height: 17px;
    cursor: pointer;
  }
  img {
    width: 2rem;
  }
  label {
    font-size: 0.875rem;
    color: #1c51dd;
    letter-spacing: 0;
  }
  .pass_input {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 1rem;
  }
  .storeInput {
    width: 23.125rem;
    height: 2.5rem;
    padding: 0;
    border: 1px solid #d5d7de;
  }
  .addressInput {
    width: 26.5rem;
    height: 2.5rem;
    padding: 0;
    border: 1px solid #d5d7de;
    margin-top: 0.5rem;
  }
  .error_hint {
    font-size: 0.75rem;
    color: #ed3c1c;
    letter-spacing: 0.11px;
    margin-top: 0.5rem;
    // position: relative;
    // left: -112px;
    width: 27.56rem;
    text-align: left;
  }
  .download_btn {
    background: #ffffff;
    border: 1px solid #1c51dd;
    border-radius: 2px;
    width: 26.5rem;
    height: 2.625rem;
    line-height: 2.625rem;
    font-size: 0.875rem;
    color: #1c51dd;
    letter-spacing: 0.11px;
    text-align: center;
    margin: 2.5rem 0 2.5rem 0;
    cursor: pointer;
  }
  .copy_btn {
    background: #f2f4f8;
    width: 3.3125rem;
    height: 2.5rem;
    line-height: 2.5rem;
    border: 1px solid #d5d7de;
    border-radius: 2px;
    border-left: none;
    font-size: 0.875rem;
    border-left: none;
    cursor: pointer;
  }
  .is-download {
    pointer-events: none;
    background: #9b9ea5 !important;
  }
  /deep/.el-card__body {
    padding: 2.5rem 3rem 5.875rem 3rem;
  }
  .back {
    float: right;
    cursor: pointer;
    color: #1c51dd;
    font-size: 0.88rem;
    letter-spacing: 0.13px;
  }
  h5 {
    font-size: 0.875rem;
    color: #2c365c;
    letter-spacing: 0.13px;
    font-weight: bold;
    display: flex;
    margin-left: 15.75rem;
  }
  .back-tittle {
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
