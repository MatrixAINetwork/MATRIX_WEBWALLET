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
      <h1>{{$t('regularMortgage.change_regular')}}</h1>
      <div class="dis-bottom">
        <el-input v-model="value"
                  :placeholder="$t('regularMortgage.current_value')"></el-input>
      </div>
      <div class="dis-bottom">
        <el-select v-model="timeLimit"
                   :placeholder="$t('CampaignNode.selectTimeLimit')">
          <el-option v-for="item in timeLimitList"
                     :key="item.key"
                     :label="item.name"
                     :value="item.key">
          </el-option>
        </el-select>
      </div>
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
import Bus from '@/assets/js/Bus'
export default {
  name: 'currentMortgage',
  data () {
    return {
      value: '',
      address: '',
      currentDepositValue: '',
      functions: [],
      visible: false,
      timeLimit: '1',
      timeLimitList: [{ name: 'oneMonth', key: '1' }, { name: 'threeMonth', key: '3' }, { name: 'sixMonth', key: '6' }, { name: 'oneYear', key: '12' }],
      confirmOffline: false,
      jsonObj: '',
      sendSignVisible: false,
      information: '',
      successVisible: false,
      hash: '',
      msg: ''
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
    confirm () {
      try {
        let currentDepositValue = new BigNumber(this.currentDepositValue)
        let campaignValue = new BigNumber(this.value)
        let flag = campaignValue.comparedTo(currentDepositValue)
        if (flag > 0) {
          this.$message.error(this.$t('CampaignNode.campaignvalueError2'))
          return
        }
        if (parseInt(this.value) < 2000) {
          this.$message.error(this.$t('CampaignNode.valueLessError1'))
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
        let curFunc = this.functions[5]
        let fullFuncName = WalletUtil.solidityUtils.transformToFullName(curFunc)
        let funcSig = WalletUtil.getFunctionSignature(fullFuncName)
        let typeName = WalletUtil.solidityUtils.extractTypeName(fullFuncName)
        var types = typeName.split(',')
        types = types[0] === '' ? [] : types
        var values = [parseInt(this.timeLimit), filter.numberToWei(this.value)]
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
        this.msg = this.$t('regularMortgage.success')
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    backPage () {
      this.$router.back()
    }
  },
  watch: {
    $route (to, from) {
      if (to.path.indexOf('regularMortgage') > -1) {
        this.currentDepositValue = this.$route.params.currentDepositValue
      }
    }
  },
  mounted () {
    let self = this
    Bus.$on('changeLang', (data) => {
      setTimeout(() => {
        self.timeLimitList[0].name = self.$t('CampaignNode.oneMonth')
        self.timeLimitList[1].name = self.$t('CampaignNode.threeMonth')
        self.timeLimitList[2].name = self.$t('CampaignNode.sixMonth')
        self.timeLimitList[3].name = self.$t('CampaignNode.oneYear')
      }, 1000)
    })
    this.timeLimitList[0].name = this.$t('CampaignNode.oneMonth')
    this.timeLimitList[1].name = this.$t('CampaignNode.threeMonth')
    this.timeLimitList[2].name = this.$t('CampaignNode.sixMonth')
    this.timeLimitList[3].name = this.$t('CampaignNode.oneYear')
    if (this.$store.state.offline != null) {
      this.address = this.$store.state.offline
    } else {
      this.address = this.$store.getters.wallet.address
    }
    this.currentDepositValue = this.$route.params.currentDepositValue
  },
  components: {
    AllDialog,
    OfflineDialog,
    sendSign
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
