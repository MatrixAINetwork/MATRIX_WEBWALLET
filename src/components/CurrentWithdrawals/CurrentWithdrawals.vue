<template>
  <div class="regularMortgage">
    <div>
      <div class="first-left">
        {{$t('currentWithdraw.current_account')}} {{currentDepositValue}} MAN
      </div>
      <span class="back-tittle"
            @click="backPage">
        <i class="el-icon-arrow-left"></i>
        {{$t('openWallet.back')}}
      </span>
      <h1>{{$t('currentWithdraw.current_refund')}}</h1>
      <div class="dis-bottom">
        <el-input v-model="value"
                  :placeholder="$t('currentWithdraw.refund_value')"></el-input>
      </div>
      <button class="common-button"
              @click="openDialog">{{$t('transfer.confirm')}}</button>
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
    <common-dialog-cancel :commonDialogExitVisible="commonDialogExitVisible"
                          :address="address"
                          :title="$t('HistoricalIncome.remove_mortgage')"
                          :msg="$t('currentWithdraw.confirmWithdrawMsg')"
                          :time="ExpecteTime"
                          :okText="$t('miningTransactionOverview.determine')"
                          :cancelText="$t('miningTransactionOverview.cancel')"
                          :width="'365px'"
                          @closeExitDialog="closeExitDialog"></common-dialog-cancel>
  </div>
</template>
<script>
import AllDialog from '@/components/TransferDialog/AllDialog'
import OfflineDialog from '@/components/TransferDialog/TipOfflineDialog'
import sendSign from '@/components/TransferDialog/sendSignTransfer'
import SendTransfer from '@/assets/js/SendTransfer'
import WalletUtil from '@/assets/js/WalletUtil'
import TradingFuns from '@/assets/js/TradingFuns'
import { mortgage, contract } from '@/assets/js/config'
import filter from '@/assets/js/filters'
import store from 'store'
import BigNumber from 'bignumber.js'
import CommonDialogCancel from '@/components/CommonDialog/CommonDialogCancel'
export default {
  name: 'currentMortgage',
  data () {
    return {
      value: '',
      address: '',
      currentDepositValue: '',
      functions: [],
      visible: false,
      confirmOffline: false,
      jsonObj: '',
      sendSignVisible: false,
      information: '',
      successVisible: false,
      hash: '',
      msg: '',
      commonDialogExitVisible: false,
      ExpecteTime: ''
    }
  },
  methods: {
    changeSuccess () {
      this.successVisible = false
    },
    openSendSign () {
      this.sendSignVisible = true
    },
    changeSendSign (data) {
      this.sendSignVisible = false
      if (data != null && data !== false) {
        this.hash = data.hash
        this.visible = true
        this.mortgageAddrress = ''
        this.value = ''
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
      this.mortgageAddrress = ''
      this.value = ''
    },
    closeExitDialog (state) {
      if (state === 'ok') {
        this.confirm()
      }
      this.commonDialogExitVisible = false
    },
    openDialog () {
      this.commonDialogExitVisible = true
      this.ExpecteTime = this.$t('regularDetail.expected') + filter.dateFormat((parseInt(new Date().getTime() / 1000) + 7 * 86400), 'YYYY/MM/DD HH:mm:ss')
    },
    confirm () {
      try {
        if (this.value === '') {
          this.$message.error(this.$t('errorMsgs.valueError'))
          return
        }
        if (new BigNumber(this.value).comparedTo(new BigNumber(this.currentDepositValue)) === 1) {
          this.$message.error(this.$t('CampaignNode.withdrawalsBigger'))
          return
        }
        if (new BigNumber(this.value).comparedTo(new BigNumber(100)) === -1) {
          this.$message.error(this.$t('CampaignNode.withdrawalsNeed'))
          return
        }
        let tAbi = JSON.parse(mortgage.abi)
        for (let i in tAbi) {
          if (tAbi[i].type === 'function') {
            tAbi[i].inputs.map(function (i) {
              i.value = ''
            })
            this.functions.push(tAbi[i])
          }
        }
        let curFunc = this.functions[3]
        let fullFuncName = WalletUtil.solidityUtils.transformToFullName(curFunc)
        let funcSig = WalletUtil.getFunctionSignature(fullFuncName)
        let typeName = WalletUtil.solidityUtils.extractTypeName(fullFuncName)
        var types = typeName.split(',')
        types = types[0] === '' ? [] : types
        var values = [0, filter.numberToWei(this.value)]
        let nonce = this.httpProvider.man.getTransactionCount(this.address)
        nonce = WalletUtil.numToHex(nonce)
        let data = {
          to: contract,
          value: 0,
          gasLimit: 210000,
          data: '',
          gasPrice: 18000000000,
          extra_to: [[0, 0, []]],
          nonce: nonce
        }
        let jsonObj = TradingFuns.getTxData(data)
        jsonObj.data = '0x' + funcSig + WalletUtil.solidityCoder.encodeParams(types, values)
        if (this.$store.state.wallet != null) {
          let tx = WalletUtil.createTx(jsonObj)
          let privateKey = this.$store.state.wallet.privateKey
          privateKey = Buffer.from(privateKey.indexOf('0x') > -1 ? privateKey.substring(2, privateKey.length) : privateKey, 'hex')
          tx.sign(privateKey)
          let serializedTx = tx.serialize()
          this.newTxData = SendTransfer.getTxParams(serializedTx)
          let hash = this.httpProvider.man.sendRawTransaction(this.newTxData)
          this.hash = hash
          this.visible = true
          let recordArray = store.get(this.address)
          if ((typeof (recordArray) === 'string')) {
            recordArray = JSON.parse(recordArray)
          }
          if (recordArray == null) {
            recordArray = []
          }
          recordArray.push({ hash: this.hash, newTxData: { commitTime: this.newTxData.commitTime, txType: this.newTxData.txType } })
          store.set(this.address, recordArray)
        } else {
          this.jsonObj = JSON.stringify(jsonObj)
          this.confirmOffline = true
        }
        this.msg = this.$t('currentWithdraw.success')
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    backPage () {
      this.$router.back()
    }
  },
  mounted () {
    if (this.$store.state.offline != null) {
      this.address = this.$store.state.offline
    } else {
      this.address = this.$store.getters.wallet.address
    }
    this.currentDepositValue = this.$route.params.currentDepositValue
  },
  watch: {
    $route (to, from) {
      if (to.path.indexOf('currentWithdrawals') > -1) {
        this.currentDepositValue = this.$route.params.currentDepositValue
      }
    }
  },
  components: {
    AllDialog,
    OfflineDialog,
    sendSign,
    CommonDialogCancel
  }
}
</script>
<style scoped lang="less">
.regularMortgage {
  .first-left {
    text-align: left;
  }
  text-align: center;
  padding: 1.5rem 0 2.5rem;
  /deep/.el-input {
    width: 26.5rem;
  }
  .dis-bottom {
    margin-top: 1rem;
    margin-bottom: 1.5rem;
  }
  .back-tittle {
    position: relative;
    left: 446px;
    top: -21px;
    cursor: pointer;
    color: #1c51dd;
    font-size: 0.88rem;
    letter-spacing: 0.13px;
  }
}
</style>
