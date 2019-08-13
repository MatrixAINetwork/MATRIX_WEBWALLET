<template>
  <div class="ai-distributedStorage">
    <div class="distributedStorage2">
      <div class="sizeStyle">
        {{$t('offline.upload')}}
      </div>
      <div class="sizeStyle2">
        <div class="upload_pic"
             id="imgContent">
        </div>
        <input type="file"
               class="input-file"
               ref="file"
               @change="changeFile($event)" />
        <div class="offline_progress">
          <div class="offline_progress_success"
               :style="{width:uploadProgress+'%'}"></div>
        </div>
        <div class="offline_progress_num">
          {{uploadProgress}}%
        </div>
        <el-button size="small"
                   type="primary"
                   @click="upload">{{$t('offline.clickUpload')}}</el-button>
      </div>
    </div>
    <el-form :model="ruleForm2"
             :rules="rules"
             ref="ruleForm2">
      <div class="ai-font"
           v-if="type===22">{{$t('ai.medicalFileType')}}</div>
      <!-- <div class="ai-font">{{$t('ai.sendTips')}}</div> -->
      <!-- <el-form-item prop="email">
        <el-input v-model="ruleForm2.email"
                  :placeholder="$t('ai.emailAddress')"></el-input>
        <span class="tip-font">{{$t('ai.sendTime')}}</span>
      </el-form-item> -->
      <el-form-item prop="confirm">
        <el-checkbox v-model="ruleForm2.confirm"></el-checkbox><span class="ai-font">{{$t('ai.serviceValue')+' '+ getGas + ' man' }}</span>
      </el-form-item>
    </el-form>
    <div class="button-center">
      <button class="common-button"
              @click="sendTransfer">{{$t('SecondKey.commit')}}</button>
    </div>
    <all-dialog :visible="visible"
                @changeVisible="changeVisible"
                :width="'800px'"
                :msg="msg"
                :hash="hash"></all-dialog>
    <offline-dialog :width="'800px'"
                    :transferJson="jsonObj"
                    :confirmOffline="confirmOffline"
                    @changeConfirmOffline="changeConfirmOffline"
                    @openSendSign="openSendSign"></offline-dialog>
    <send-sign :visible="sendSignVisible"
               :width="'800px'"
               :information="information"
               @changeSendSign="changeSendSign"></send-sign>
  </div>
</template>
<script>
import ManUtils from '@/assets/js/ManUtils'
import TradingFuns from '@/assets/js/TradingFuns'
import WalletUtil from '@/assets/js/WalletUtil'
import SendTransfer from '@/assets/js/SendTransfer'
import { aiServerUrl } from '@/assets/js/config'
import BigNumber from 'bignumber.js'
import AllDialog from '@/components/TransferDialog/AllDialog'
import OfflineDialog from '@/components/TransferDialog/TipOfflineDialog'
import sendSign from '@/components/TransferDialog/sendSignTransfer'
import store from 'store'

export default {
  data () {
    return {
      hash: '',
      msg: '',
      visible: false,
      uploadProgress: 0,
      address: '',
      getGas: 0,
      ruleForm: {
        value: 0,
        to: '',
        IsEntrustTx: '',
        ExtraTimeTxType: '0',
        gasLimit: 210000,
        gasPrice: 18000000000,
        extra_to: [[8, 0, []]],
        data: '',
        nonce: ''
      },
      ruleForm2: {
        confirm: false,
        email: ''
      },
      rules: {
        // email: [
        //   { validator: this.validEmail, trigger: 'blur' }
        // ],
        confirm: [
          { validator: this.validConfirm, trigger: 'blur' }
        ]
      },
      confirmOffline: false,
      jsonObj: '',
      sendSignVisible: false,
      information: '',
      interval: {}
    }
  },
  methods: {
    openSendSign () {
      this.sendSignVisible = true
    },
    changeSendSign (data) {
      this.sendSignVisible = false
      if (data != null && data !== false) {
        this.hash = data.hash
        this.visible = true
      }
    },
    changeConfirmOffline (data) {
      this.confirmOffline = false
      if (data !== false) {
        this.sendSignVisible = true
        this.information = data
      }
    },
    changeFile () {
      let file = this.$refs.file.files
      const fileUpload = []
      if (file.length <= 0) {
        return
      }
      for (let i = 0, length = file.length; i < length; i++) {
        var uploadContent = ManUtils.fileReaderStream(file[i], {
          chunkSize: 32 * 1024 * 1024
        })
        fileUpload.push({
          path: '',
          content: uploadContent
        })
      }
      let self = this
      this.uploadProgress = 0
      this.interval = setInterval(function () {
        if (self.uploadProgress !== 99) {
          self.uploadProgress += 1
        }
      }, 1000)
      this.ipfsProvider.add(fileUpload, {
        wrapWithDirectory: true
      }
      ).then((response) => {
        self.uploadProgress = 100
        clearInterval(this.interval)
        var imgContent = document.getElementById('imgContent')
        imgContent.innerHTML = ''
        let ele
        if (file[0].type.indexOf('video') > -1) {
          // 添加 img
          ele = document.createElement('video')
          ele.style.height = '8.5rem'
          ele.style.width = '8.5rem'
          // 设置 img 图片地址
          ele.src = self.ipfsProvider.address + response[0].path
          ele.setAttribute('width', '100%')
          ele.setAttribute('controls', true)
        } else if (file[0].type.indexOf('zip') > -1) {
          ele = document.createElement('img')
          ele.src = self.ipfsProvider.address + response[0].path
          ele.style.display = 'none'
        } else {
          // 添加 img
          ele = document.createElement('img')
          ele.style.height = '8.5rem'
          ele.style.width = '8.5rem'
          // 设置 img 图片地址
          ele.src = self.ipfsProvider.address + response[0].path
        }
        imgContent.appendChild(ele)
        let dataTempLength = document.getElementById('imgContent').innerHTML.length
        let dataTempData = document.getElementById('imgContent').innerHTML
        if (!dataTempLength > 0 || dataTempData === '') {
          this.$message.error(this.$t('errorMsgs.uploadContent'))
          return
        }
        let dataTemp = {
          'type': this.type.toString(), // 附文本类型
          'length': dataTempLength, // data内容长度
          'data': dataTempData // 附文本内容
        }
        let dataStr = WalletUtil.str2hex(JSON.stringify(dataTemp))
        let crcNum = WalletUtil.crc32(JSON.stringify(dataTemp))
        let crcHex = (crcNum < 0 ? -crcNum : crcNum).toString(16)
        this.ruleForm.data = '0x6d61747269780000' + dataStr + crcHex
        this.estimate()
      })
    },
    upload () {
      this.$refs.file.click()
    },
    sendTransfer () {
      try {
        this.$refs['ruleForm2'].validate((valid) => {
          if (valid) {
            let dataTempLength = document.getElementById('imgContent').innerHTML.length
            let dataTempData = document.getElementById('imgContent').innerHTML
            if (!dataTempLength > 0 || dataTempData === '') {
              this.$message.error(this.$t('errorMsgs.uploadContent'))
              return
            }
            let dataTemp = {
              'type': this.type.toString(), // 附文本类型
              'length': dataTempLength, // data内容长度
              'data': dataTempData // 附文本内容
            }
            this.ruleForm.nonce = this.httpProvider.man.getTransactionCount(this.address)
            this.ruleForm.nonce = WalletUtil.numToHex(this.ruleForm.nonce)
            this.ruleForm.to = this.address
            let jsonObj = TradingFuns.getTxData(this.ruleForm)
            let dataStr = WalletUtil.str2hex(JSON.stringify(dataTemp))
            let crcNum = WalletUtil.crc32(JSON.stringify(dataTemp))
            let crcHex = (crcNum < 0 ? -crcNum : crcNum).toString(16)
            jsonObj.data = '0x6d61747269780000' + dataStr + crcHex
            if (this.$store.state.wallet != null) {
              let tx = WalletUtil.createTx(jsonObj)
              let privateKey = this.$store.state.wallet.privateKey
              privateKey = Buffer.from(privateKey.indexOf('0x') > -1 ? privateKey.substring(2, privateKey.length) : privateKey, 'hex')
              tx.sign(privateKey)
              let serializedTx = tx.serialize()
              this.newTxData = SendTransfer.getTxParams(serializedTx)
              this.hash = this.httpProvider.man.sendRawTransaction(this.newTxData)
              this.aiserver(this.hash)
              let recordArray = store.get(this.address)
              if ((typeof (recordArray) === 'string')) {
                recordArray = JSON.parse(recordArray)
              }
              if (recordArray == null) {
                recordArray = []
              }
              recordArray.push({ hash: this.hash, newTxData: { commitTime: this.newTxData.commitTime, txType: this.newTxData.txType } })
              store.set(this.address, recordArray)
              this.visible = true
            } else {
              this.jsonObj = JSON.stringify(jsonObj)
              this.confirmOffline = true
            }
            this.msg = this.$t('ai.aiSuccess')
          } else {
            return false
          }
        })
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    aiserver (hash) {
      // this.$http.get('https://aiserver.matrix.io/jerry/?hash=' + hash).then(res => {
      // })
      this.$http.get(aiServerUrl + hash).then(res => {
      })
    },
    validConfirm (rule, address, callback) {
      if (!this.ruleForm2.confirm) {
        callback(new Error(window.i18n.t('errorMsgs.validConfirm')))
      } else {
        callback()
      }
    },
    estimate () { // 预估gas
      this.ruleForm.value = 0
      this.ruleForm.to = this.address
      let sendObj = TradingFuns.getTxData(this.ruleForm)
      let estObj = {
        from: this.address,
        to: sendObj.to,
        gasLimit: sendObj.gasLimit,
        gasPrice: sendObj.gasPrice,
        value: sendObj.value,
        data: sendObj.data,
        currency: this.ruleForm.to.split('.')[0],
        extra_to: []
      }
      let result = this.httpProvider.man.estimateGas(estObj)
      this.getGas = this.httpProvider.fromWei(new BigNumber(result) * new BigNumber(this.ruleForm.gasPrice))
      this.ruleForm.gasLimit = result
    },
    changeVisible (state) {
      this.visible = state
    }
  },
  // watch: {
  //   $route (to, from) {
  //     this.type = to.query.type.toString()
  //   }
  // },
  mounted () {
    if (this.$store.state.offline != null) {
      this.address = this.$store.state.offline
    } else {
      this.address = this.$store.getters.wallet.address
    }
  },
  props: {
    type: {
      default: 22,
      type: Number
    }
  },
  components: {
    AllDialog,
    OfflineDialog,
    sendSign
  }
}
</script>
<style scoped lang="less">
.ai-distributedStorage {
  .distributedStorage2 {
    margin-top: 2rem;
    border: 1px solid #d5d7de;
    font-size: 0.875rem;
    color: #2d4670;
    /deep/.el-button--small {
      height: 2rem;
      margin-top: 106px;
      margin-left: 2rem;
    }
    .input-file {
      display: none;
    }
    .sizeStyle {
      border-bottom: 1px solid #d5d7de;
      height: 2.5rem;
      padding-left: 1rem;
      line-height: 2.5rem;
    }
    .sizeStyle2 {
      padding: 2rem 1.18rem;
      display: flex;
      justify-content: row;
    }
    .upload_pic {
      width: 8.5rem;
      height: 8.5rem;
      border: 1px solid #d4d6de;
      background: url(../../assets/images/matrix_gray.png) #f8f8fa no-repeat 50%;
      background-size: 3.125rem 2.875rem;
    }
    .upload-demo {
      margin-top: 105px;
      margin-left: 20rem;
    }
    .offline_progress {
      overflow: hidden;
      width: 15.625rem;
      height: 0.5rem;
      margin: 7rem 0 0 1.5rem;
      background-color: #f5f5f5;
      border-radius: 10px;
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
    }
    .offline_progress_num {
      margin: 6.7rem -0.375rem 0 1rem;
      font-size: 0.875rem;
      color: #353e63;
      letter-spacing: 0.13px;
    }
    .offline_progress_success {
      background-color: #5dba5a;
      float: left;
      width: 0;
      height: 100%;
      font-size: 0.9rem;
      line-height: 1.4;
      color: #fff;
      text-align: center;
    }
  }
  .button-center {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
  }
  .ai-font {
    font-size: 0.875rem;
    color: #353e63;
    margin-bottom: 1rem;
  }
  /deep/.el-input {
    width: 26.5rem;
  }
  .tip-font {
    font-size: 0.875rem;
    color: #9298ae;
    letter-spacing: 0.13px;
    text-align: center;
    font-weight: 400;
  }
}
</style>
