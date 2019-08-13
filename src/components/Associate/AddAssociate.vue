<template>
  <div class="addAssociate">
    <div class="addForm">
      <h1>{{$t('associate.addAssociate')}}</h1>
      <span class="back-tittle"
            @click="backPage">
        <i class="el-icon-arrow-left"></i>
        {{$t('openWallet.back')}}
      </span>
      <h4 v-html="$t('associate.associateHint')"></h4>
      <div v-for="(entrust,index) in entrustList"
           :key="entrust.EntrustAddress">
        <div class="hint-error"
             @click="delEntrust(index)"
             v-if="index>0">{{$t('associate.delAssociate')}}</div>
        <h5>{{$t('associate.associateAddress')}}</h5>
        <el-input v-model="entrust.EntrustAddres"></el-input>
        <h5 class="h5-dis">{{$t('associate.transferType')}}</h5>
        <div class="radio-style">
          <el-radio v-model="entrust.EnstrustSetType"
                    :label="0">{{$t('associate.blockHeight')}}</el-radio>
          <el-radio v-model="entrust.EnstrustSetType"
                    :label="1">{{$t('associate.time')}}</el-radio>
          <el-radio v-model="entrust.EnstrustSetType"
                    :label="2">{{$t('associate.times')}}</el-radio>
        </div>
        <div class="input-block"
             v-if="entrust.EnstrustSetType==0">
          <el-input v-model="entrust.StartHeight"
                    type="number"></el-input>
          <span class="span-dis"> --</span>
          <el-input v-model="entrust.EndHeight"
                    type="number"></el-input>
        </div>
        <div class="input-block"
             v-if="entrust.EnstrustSetType==1">
          <el-date-picker type="datetime"
                          v-model="entrust.useStartTime"
                          :placeholder="$t('associate.startTime')">
          </el-date-picker>
          <span class="span-dis"> --</span>
          <el-date-picker type="datetime"
                          v-model="entrust.useEndTime"
                          :placeholder="$t('associate.endTime')">
          </el-date-picker>
        </div>
        <div class="input-block"
             v-if="entrust.EnstrustSetType==2">
          <el-input v-model.number="entrust.EntrustCount"
                    type="number"></el-input>
        </div>
      </div>
      <div class="dash"></div>
      <div class="addButton"
           @click="addTransfer">{{$t('associate.addCollection')}}</div>
      <!-- <h5 class="h5-dis">{{$t('transfer.estimatedGas')}}</h5>
      <el-input disabled></el-input> -->
      <hr>
      <button class="common-button"
              @click="confirm">{{$t('transfer.confirm')}}</button>
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
import TradingFuns from '@/assets/js/TradingFuns'
import WalletUtil from '@/assets/js/WalletUtil'
import SendTransfer from '@/assets/js/SendTransfer'
import AllDialog from '@/components/TransferDialog/AllDialog'
import OfflineDialog from '@/components/TransferDialog/TipOfflineDialog'
import sendSign from '@/components/TransferDialog/sendSignTransfer'
import store from 'store'
export default {
  name: 'associate',
  data () {
    return {
      hash: '',
      msg: '抵押成功',
      visible: false,
      address: '',
      entrustList: [{
        EntrustAddres: '',
        IsEntrustGas: true,
        StartHeight: 0,
        EndHeight: 0,
        EnstrustSetType: 0,
        useStartTime: '',
        useEndTime: '',
        EntrustCount: 0
      }],
      tradingObj: {
        to: '',
        IsEntrustTx: '',
        gasLimit: 210000,
        gasPrice: 18000000000,
        data: '',
        nonce: '',
        value: 0
      },
      cancelList: [],
      confirmOffline: false,
      jsonObj: '',
      sendSignVisible: false,
      information: ''
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
        this.entrustList = [{
          EntrustAddres: '',
          IsEntrustGas: true,
          StartHeight: 0,
          EndHeight: 0,
          EnstrustSetType: 0,
          useStartTime: '',
          useEndTime: '',
          EntrustCount: 0
        }]
      }
    },
    changeConfirmOffline (data) {
      this.confirmOffline = false
      if (data !== false) {
        this.sendSignVisible = true
        this.information = data
      }
    },
    changeVisible (state) {
      this.visible = state
    },
    changeType (type) {
      this.type = type
    },
    addTransfer () {
      this.entrustList.push({
        EntrustAddres: '',
        IsEntrustGas: true,
        StartHeight: 0,
        EndHeight: 0,
        EnstrustSetType: 0,
        useStartTime: 0,
        useEndTime: 0,
        StartTime: 0,
        EndTime: 0,
        EntrustCount: 0
      })
    },
    delEntrust (index) {
      this.entrustList.splice(index, 1)
    },
    confirm () {
      try {
        this.entrustList[0].EntrustAddres = this.entrustList[0].EntrustAddres.trim()
        let currency = this.entrustList[0].EntrustAddres.split('.')[0]
        for (let index = 0; index < this.entrustList.length; index++) {
          const entrust = this.entrustList[index]
          let nowCurrency = entrust.EntrustAddres.trim().split('.')[0]
          if (nowCurrency !== currency) {
            this.$message.error(this.$t('errorMsgs.currencyError'))
            return
          }
          entrust.EntrustAddres = entrust.EntrustAddres.trim()
          if (!WalletUtil.validateAddress(entrust.EntrustAddres)) {
            this.$message.error(this.$t('errorMsgs.invalidManAddress'))
            return
          }
          if (entrust.EntrustAddres === this.address) {
            this.$message.error(this.$t('errorMsgs.entrustSelf'))
            return
          }
          if (entrust.EnstrustSetType === 1) {
            if (entrust.useStartTime === '') {
              this.$message.error(this.$t('errorMsgs.entrustTime1'))
              return
            }
            if (entrust.useEndTime.getTime() < new Date().getTime()) {
              this.$message.error(this.$t('errorMsgs.entrustTime2'))
              return
            }
            if (entrust.useStartTime.getTime() > entrust.useEndTime.getTime()) {
              this.$message.error(this.$t('errorMsgs.entrustTime3'))
              return
            }
            entrust.StartTime = parseInt(entrust.useStartTime.getTime() / 1000)
            entrust.EndTime = parseInt(entrust.useEndTime.getTime() / 1000)
          } else {
            if (entrust.StartHeight > entrust.EndHeight) {
              this.$message.error(this.$t('errorMsgs.entrustBlock'))
              return
            }
          }
          let nowAddress = (WalletUtil.getCurrencyAddress(this.address, currency))
          this.cancelList = this.httpProvider.man.getEntrustList(nowAddress)
          if (this.cancelList != null) {
            for (let j = 0; j < this.cancelList.length; j++) {
              const cannel = this.cancelList[j]
              if (cannel.EntrustAddres === entrust.EntrustAddres) {
                if (entrust.EnstrustSetType === 0) {
                  if (entrust.StartHeight < cannel.EndHeight) {
                    this.$message.error(this.$t('errorMsgs.entrustHeight'))
                    return
                  }
                } else if (entrust.EnstrustSetType === 1) {
                  if (entrust.StartTime < cannel.EndTime) {
                    this.$message.error(this.$t('errorMsgs.entrustTime4'))
                    return
                  }
                }
              }
            }
          }
        }
        if (this.entrustList[0].EntrustAddres.split('.')[0] === 'MAN') {
          this.tradingObj.nonce = this.httpProvider.man.getTransactionCount(this.address)
          this.tradingObj.nonce = WalletUtil.numToHex(this.tradingObj.nonce)
        } else {
          this.tradingObj.nonce = this.httpProvider.man.getTransactionCount(WalletUtil.getCurrencyAddress(this.address, this.entrustList[0].EntrustAddres.split('.')[0]))
          this.tradingObj.nonce = WalletUtil.numToHex(this.tradingObj.nonce)
        }
        this.tradingObj.to = WalletUtil.getCurrencyAddress(this.address, this.entrustList[0].EntrustAddres.split('.')[0])
        this.entrustList.forEach(item => {
          item.StartHeight = parseInt(item.StartHeight)
          item.EndHeight = parseInt(item.EndHeight)
        })
        this.tradingObj.data = JSON.stringify(this.entrustList)
        let jsonObj = TradingFuns.getEntrustData(this.tradingObj)
        if (this.$store.state.wallet != null) {
          let tx = WalletUtil.createTx(jsonObj)
          let privateKey = this.$store.state.wallet.privateKey
          privateKey = Buffer.from(privateKey.indexOf('0x') > -1 ? privateKey.substring(2, privateKey.length) : privateKey, 'hex')
          tx.sign(privateKey)
          let serializedTx = tx.serialize()
          let newTxData = SendTransfer.getTxParams(serializedTx)
          this.hash = this.httpProvider.man.sendRawTransaction(newTxData)
          this.visible = true
          this.entrustList = [{
            EntrustAddres: '',
            IsEntrustGas: true,
            StartHeight: 0,
            EndHeight: 0,
            EnstrustSetType: 0,
            useStartTime: '',
            useEndTime: '',
            EntrustCount: 0
          }]
          let recordArray = store.get(this.address)
          if ((typeof (recordArray) === 'string')) {
            recordArray = JSON.parse(recordArray)
          }
          if (recordArray == null) {
            recordArray = []
          }
          recordArray.push({ hash: this.hash, newTxData: { commitTime: newTxData.commitTime, txType: newTxData.txType } })
          store.set(this.address, recordArray)
        } else {
          this.jsonObj = JSON.stringify(jsonObj)
          this.confirmOffline = true
        }
        this.msg = this.$t('associate.associateSuccess')
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    backPage () {
      this.$router.push({ path: '/my-wallet/openWallet/myAssets' })
    }
  },
  mounted () {
    if (this.$store.state.offline != null) {
      this.address = this.$store.state.offline
    } else {
      this.address = this.$store.getters.wallet.address
    }
    this.tradingObj.to = this.address
  },
  components: {
    AllDialog,
    OfflineDialog,
    sendSign
  }
}
</script>
<style scoped lang="less">
.addAssociate {
  .addForm {
    /deep/.el-input {
      width: 26.5rem;
    }
    h4 {
      margin-bottom: 2.5rem;
    }
    .h5-dis {
      margin-top: 1.5rem;
    }
    h5 {
      font-size: 0.875rem;
      color: #2c365c;
      letter-spacing: 0.13px;
      font-weight: bold;
      display: flex;
      margin-left: 16.75rem;
      margin-bottom: 1rem;
    }
    .radio-style {
      display: flex;
      label:first-child {
        margin-left: 268px;
      }
      label:nth-child(2) {
        margin-left: 100px;
      }
      label:nth-child(3) {
        margin-left: 100px;
      }
    }
    .input-block {
      margin: 1.625rem 0 2rem;
      /deep/.el-input {
        width: 191px;
      }
      .span-dis {
        margin: 0 12px;
      }
      /deep/.el-icon-time:before {
        content: none;
      }
    }
    .dash {
      border: 1px dashed #d5d7de;
      width: 424px;
      margin: auto;
    }
    .addButton {
      font-size: 0.875rem;
      color: #1c51dd;
      letter-spacing: 0.13px;
      cursor: pointer;
      margin: 1rem 0 2rem;
    }
    hr {
      background-color: #d5d7de;
      margin-top: 2rem;
      margin-bottom: 2rem;
      border: none;
      height: 1px;
    }
    .hint-error {
      font-size: 0.875rem;
      color: #ed3c1c;
      letter-spacing: 0.13px;
      float: right;
      cursor: pointer;
    }
    .back-tittle {
      position: relative;
      left: 454px;
      top: -33px;
      cursor: pointer;
      color: #1c51dd;
      font-size: 0.88rem;
      letter-spacing: 0.13px;
    }
  }
}
</style>
