<template>
  <el-dialog :visible.sync="confirmOffline"
             :showClose=false
             customClass="offline-dialog"
             :width="width"
             :before-close="handleClose"
             center>
    <div class="content">
      <h1>{{$t('unlock.sign')}}</h1>
      <h5>{{$t('OfflineUnlock.noSignTransfer')}}：</h5>
      <el-input type="textarea"
                :autosize="{ minRows: 4, maxRows: 6}"
                v-model="transferJson"></el-input>
      <div>
        <div class="card_pos">
          <div class="card_way"
               @click="selectUnlock('keystore')">
            <div class="pic_dis">
              <img src="../../assets/images/keystone.png">
            </div>
            <div class="check_font">
              <input type="radio"
                     v-model="unlockType"
                     value="keystore">
              <label>Keystore {{$t('myWallet.file')}}</label>
            </div>
          </div>
          <div class="card_way div_dis"
               @click="selectUnlock('privateKey')">
            <div class="pic_dis">
              <img src="../../assets/images/private_key.png">
            </div>
            <div class="check_font">
              <input type="radio"
                     v-model="unlockType"
                     value="privateKey">
              <label>{{$t('myWallet.privateKey')}}</label>
            </div>
          </div>
          <div class="card_way div_dis"
               @click="selectUnlock('mnemonic')">
            <div class="pic_dis">
              <img src="../../assets/images/mnemonic.png">
            </div>
            <div class="check_font">
              <input type="radio"
                     v-model="unlockType"
                     value="mnemonic">
              <label>{{$t('myWallet.mnemonic')}}</label>
              <div class="font-blue">{{$t('myWallet.mnemonicMan')}}</div>
            </div>
          </div>
          <!--ledger硬件钱包 Card-->
          <div class="card_way div_dis"
               @click="selectUnlock('ledger')">
            <div class="pic_dis">
              <img src="../../assets/images/ledger.svg">
            </div>
            <div class="check_font">
              <input type="radio"
                     v-model="unlockType"
                     value="ledger">
              <label>ledger</label>
            </div>
          </div>
      </div>

      <div v-show="unlockType == 'keystore'">
        <div class="pass_input"
             v-if="keyStore != null">
          <input class="storeInput"
                 :type="isShowPassword ? 'text' : 'password'"
                 :placeholder="$t('myWallet.enterPassword')"
                 v-model="password">
          <div class="pass_pic"
               :class="{'passwordClose': !isShowPassword, 'passwordOpen' : isShowPassword }"
               @click="changeShowPassword">
            <img
              :src="isShowPassword ? require('../../assets/images/password_open.png') : require('../../assets/images/password_close.png')">
          </div>
        </div>
        <div class="hint_error"
             v-show="keystoreError">*{{$t('createWallet.passWordError')}}
        </div>
        <button class="common-button button-top"
                @click="selectFile"
                v-if="keyStore == null">{{$t('myWallet.selectWalletFile')}}...
        </button>
        <button class="common-button button-top"
                @click="unlockPassword"
                v-if="keyStore != null">{{$t('myWallet.openWallet')}}
        </button>
        <input type="file"
               class="input-file"
               ref="file"
               @change="changeFile($event)"/>
      </div>
      <div v-show="unlockType == 'privateKey'">
        <div>
            <textarea class="key_text"
                      :placeholder="$t('myWallet.enterPrivate')"
                      v-model="privateKey"
                      rows="4"></textarea>
        </div>
        <div class="hint_error"
             v-show="keyPrivateError">*{{$t('myWallet.privateIncorrect')}}
        </div>
        <button class="common-button button-top"
                @click="openWallet">{{$t('myWallet.openWallet')}}
        </button>
      </div>
      <div v-show="unlockType == 'mnemonic'">
        <div>
            <textarea class="key_text"
                      :placeholder="$t('myWallet.enterMnemonic')"
                      v-model="mnemonic"
                      rows="4"></textarea>
        </div>
        <div class="hint_error"
             v-show="keyPrivateError">*{{$t('myWallet.mnemonicIncorrect')}}
        </div>
        <button class="common-button button-top"
                @click="openWallet">{{$t('myWallet.openWallet')}}
        </button>
      </div>
        <!--ledger-->
        <div v-show="unlockType == 'ledger'"
             class="ledger">
          <h4>请连接您的ledger硬件钱包</h4>
          <div class="hint_error"
               v-show="keyPrivateError">*{{$t('myWallet.ledgerIncorrect')}}</div>
          <button class="common-button button-top"
                  @click="openWallet">{{$t('myWallet.openWallet')}}
          </button>
        </div>
    </div>
    <div class="error_font">{{$t('OfflineUnlock.offlineTip')}}</div>
    <!-- <button class="common-button button-top"
            @click="signTransfer"
            v-if="wallet!=null">{{$t('unlock.sign')}}</button> -->
    </div>
  </el-dialog>
</template>

<script>
import WalletUtil from '@/assets/js/WalletUtil'
import Validate from '@/assets/js/Validate'
import LedgerUtil from '@/assets/js/LedgerUtil'
import { chainId } from '@/assets/js/config' // 配置

export default {
  name: 'TransferDialog',
  data () {
    return {
      lang: this.$i18n.locale,
      unlockType: 'keystore',
      keyStore: null,
      isShowPassword: false,
      privateKey: '',
      password: '',
      mnemonic: '',
      keystoreError: false,
      keyPrivateError: false,
      isEmit: true,
      offSwitch: false,
      address: '',
      wallet: null
    }
  },
  props: {
    confirmOffline: {
      default: false,
      type: Boolean
    },
    width: {
      default: '',
      type: String
    },
    transferJson: {
      default: '',
      type: String
    }
  },
  methods: {
    openSendSign () {
      this.$emit('changeConfirmOffline', false)
      this.$emit('openSendSign')
    },
    changeShowPassword () {
      this.isShowPassword = !this.isShowPassword
    },
    selectFile () {
      this.$refs.file.click()
    },
    unlockPassword () {
      let loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.keystoreError = false
      WalletUtil.keyStoreToWallet(this.keyStore, this.password).then((result) => {
        loading.close()
        // store.commit('UPDATE_WALLET', result)
        this.wallet = result
        this.keyStore = null
        this.isShowPassword = false
        this.password = ''
        this.keystoreError = false
        this.$refs.file.value = ''
        this.signTransfer()
      }, () => {
        loading.close()
        this.keystoreError = true
      })
    },
    changeFile () {
      let file = this.$refs.file.files[0]
      let reader = new FileReader()
      reader.readAsText(file)
      reader.onload = (file) => {
        let fileTemp = file.srcElement || file.target
        try {
          let result = Validate.walletRequirePass(fileTemp.result)
          if (result) {
            this.keyStore = JSON.parse(fileTemp.result)
          }
        } catch (e) {
          this.$message.error(e)
        }
      }
    },
    selectUnlock (type) {
      this.unlockType = type
      this.keyStore = null
      this.isShowPassword = false
      this.privateKey = ''
      this.password = ''
      this.mnemonic = ''
      this.keystoreError = false
      this.keyPrivateError = false
      this.$refs.file.value = ''
    },
    openWallet () {
      if (this.unlockType === 'privateKey') {
        if (!/^[0-9a-fA-F]{64}$/.test(this.privateKey.trim())) {
          this.keyPrivateError = true
        } else {
          this.keyPrivateError = false
          let loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          let wallet = WalletUtil.privateKeyToWallet(this.privateKey.trim())
          loading.close()
          // store.commit('UPDATE_WALLET', wallet)
          this.wallet = wallet
          this.privateKey = ''
          this.keyPrivateError = false
          this.signTransfer()
        }
      } else if (this.unlockType === 'mnemonic') {
        if (this.mnemonic.split(' ').length !== 12) {
          this.keyPrivateError = true
        } else {
          this.keyPrivateError = false
          let loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          let wallet = WalletUtil.privateKeyToWallet(WalletUtil.mnemonicToPrivateKey(this.mnemonic).toString('hex'))
          loading.close()
          // store.commit('UPDATE_WALLET', wallet)
          this.wallet = wallet
          this.mnemonic = ''
          this.keyPrivateError = false
          this.signTransfer()
        }
      } else if (this.unlockType === 'ledger') {
        let loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        let tx = WalletUtil.createTx(JSON.parse(this.transferJson))
        tx.v = '0x' + chainId.toString(16)
        LedgerUtil.sign(tx.serialize()).then((result) => {
          loading.close()
          let v = '0x' + (parseInt(result.v.toString('hex'), 16) + (chainId * 2 + 8)).toString(16)
          let r = '0x' + result.r.toString('hex')
          let s = '0x' + result.s.toString('hex')
          tx.s = s
          tx.r = r
          tx.v = v
          let serializedTx = '0x' + tx.serialize().toString('hex')
          this.changeConfirmOffline = false
          this.wallet = null
          this.$emit('changeConfirmOffline', serializedTx)
        }).catch(err => {
          loading.close()
          this.$message.error(err.message)
        })
      }
    },
    signTransfer () {
      try {
        let tx = WalletUtil.createTx(JSON.parse(this.transferJson))
        let privateKey = this.wallet.privateKey
        privateKey = Buffer.from(privateKey.indexOf('0x') > -1 ? privateKey.substring(2, privateKey.length) : privateKey, 'hex')
        tx.sign(privateKey)
        let serializedTx = '0x' + tx.serialize().toString('hex')
        this.changeConfirmOffline = false
        this.wallet = null
        this.$emit('changeConfirmOffline', serializedTx)
      } catch (e) {
        this.$message.error(this.$t('errorMsgs.jsonError'))
      }
    },
    handleClose () {
      this.$emit('changeConfirmOffline', false)
      this.wallet = null
    }
  },
  mounted () {
  }
}
</script>

<style scoped lang="less">
  .offline-dialog {
    .ledger {
      h4 {
        margin-top: 1rem;
      }
    }
    /deep/ .el-dialog__body {
      padding: 0 !important;
    }
    /deep/ .el-dialog__header {
      padding: 0;
      height: 2rem;
    }
    /deep/ .el-dialog__footer {
      background: rgba(44, 54, 92, 0.03);
      border-radius: 0px 0px 2px 2px;
      height: 3.5rem;
      margin-top: 2.06rem;
    }
    .content {
      .input-file {
        display: none;
      }
      .hint_error {
        font-size: 12px;
        color: #ed3c1c;
        letter-spacing: 0.11px;
        margin-top: 0.4rem;
        width: 27.56rem;
        text-align: left;
      }
      text-align: center;
      .div_dis {
        margin-left: 2.5rem;
      }
      label {
        font-size: 14px;
        color: #1c51dd;
        letter-spacing: 0;
      }
      padding: 0 2.5rem;
      text-align: center;
      img {
        width: 2rem;
      }
      .button-top {
        margin: 2.5rem 0 0 0;
      }
      .send_font {
        font-size: 1rem;
        color: #1c51dd;
        letter-spacing: 0.13px;
        cursor: pointer;
        margin-top: 1rem;
      }
    }
    .error_font {
      font-size: 1rem;
      color: #ed3c1c;
      letter-spacing: 0.11px;
      margin-top: 1rem;
    }
    .font-blue {
      font-size: 14px;
      color: #1c51dd;
      letter-spacing: 0;
    }
    .storeInput {
      width: 22.625rem;
      height: 2.5rem;
      padding-left: 0.5rem;
      border: 1px solid #d5d7de;
    }
    .pass_input {
      display: flex;
      flex-direction: row;
      justify-content: center;
      margin-top: 2.5rem;
      .pass_pic {
        width: 3.3125rem;
        height: 2.6rem;
        line-height: 3rem;
        cursor: pointer;
      }
      .passwordClose {
        background: #f2f4f8;
        border: 1px solid #f2f4f8;
      }
      .passwordOpen {
        background: #415eaa;
        border: 1px solid #415eaa;
      }
    }
  }
</style>
