<template>
  <div class="jointAdd">
    <el-card>
      <div class="addForm">
        <h1>{{$t('jointAdd.jointAdd')}}</h1>
        <span class="back-tittle"
              @click="backPage">
          <i class="el-icon-arrow-left"></i>
          {{$t('openWallet.back')}}
        </span>
        <!-- <h5>{{$t('associate.associateAddress')}}</h5> -->
        <div>
          <el-select v-model="mortgageWay"
                     :placeholder="$t('CampaignNode.selectMortgageWay')">
            <el-option v-for="item in mortgageWayList"
                       :key="item.key"
                       :label="item.name"
                       :value="item.key">
            </el-option>
          </el-select>
        </div>
        <div v-show="mortgageWay==='regular'">
          <el-select v-model="timeLimit"
                     :placeholder="$t('CampaignNode.selectTimeLimit')">
            <el-option v-for="item in timeLimitList"
                       :key="item.key"
                       :label="item.name"
                       :value="item.key">
            </el-option>
          </el-select>
        </div>
        <el-input :placeholder="$t('regularDetail.deposit_value')"
                  v-model="value"
                  type="number"></el-input>
        <div class="tips">
          <p>{{$t('digAccount.tips1')}}</p>
          <p>{{$t('digAccount.tips2')}}</p>
        </div>
        <button class="common-button"
                @click="addDeposit">{{$t('jointDetail.addMining')}}</button>
      </div>
    </el-card>
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
import SendTransfer from '@/assets/js/SendTransfer'
import { joinChildAbi } from '@/assets/js/config.js'
import store from 'store'
import WalletUtil from '@/assets/js/WalletUtil'
import TradingFuns from '@/assets/js/TradingFuns'
import OfflineDialog from '@/components/TransferDialog/TipOfflineDialog'
import sendSign from '@/components/TransferDialog/sendSignTransfer'
import AllDialog from '@/components/TransferDialog/AllDialog'
import BigNumber from 'bignumber.js'
export default {
  name: 'jointAdd',
  data () {
    return {
      value: '',
      signAddress: '',
      mortgageWayList: [{ name: this.$t('CampaignNode.regular'), key: 'regular' }, { name: this.$t('CampaignNode.current'), key: 'current' }],
      timeLimitList: [{ name: this.$t('CampaignNode.oneMonth'), key: '1' }, { name: this.$t('CampaignNode.threeMonth'), key: '3' }, { name: this.$t('CampaignNode.sixMonth'), key: '6' }, { name: this.$t('CampaignNode.oneYear'), key: '12' }],
      timeLimit: '',
      mortgageWay: '',
      jointAccount: '',
      stakeValue: '',
      msg: '',
      hash: '',
      confirmOffline: false,
      jsonObj: '',
      sendSignVisible: false,
      information: '',
      visible: false
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
    },
    backPage () {
      this.$router.back()
    },
    addDeposit () {
      try {
        let abiArray = JSON.parse(joinChildAbi)
        let contractAddress = this.jointAccount
        let contract = this.httpProvider.man.contract(abiArray).at(contractAddress)
        console.log(contract)
        let nonce = this.httpProvider.man.getTransactionCount(this.address)
        nonce = WalletUtil.numToHex(nonce)
        let value = new BigNumber(this.value)
        if (new BigNumber(this.value).plus(new BigNumber(this.stakeValue)).comparedTo(new BigNumber(10000000)) === 1) {
          this.$message.error(this.$t('jointAdd.valueToMore'))
          return
        }
        let data = {
          to: this.jointAccount,
          value: parseInt(this.value),
          gasLimit: 210000,
          data: '',
          gasPrice: 18000000000,
          extra_to: [[0, 0, []]],
          nonce: nonce
        }
        let jsonObj = TradingFuns.getTxData(data)
        if (this.mortgageWay === 'regular') {
          if (value.comparedTo(new BigNumber(2000)) === -1) {
            this.$message.error(this.$t('CampaignNode.valueLessError1'))
            return
          }
          if (this.timeLimit === '') {
            this.$message.error(this.$t('CampaignNode.selectTimeLimit'))
            return
          }
          jsonObj.data = contract.addDeposit.getData(parseInt(this.timeLimit))
        } else {
          if (value.comparedTo(new BigNumber(100)) === -1) {
            this.$message.error(this.$t('CampaignNode.currentError'))
            return
          }
          jsonObj.data = contract.addDeposit.getData(0)
        }
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
          this.confirmOffline = true
          this.jsonObj = JSON.stringify(jsonObj)
        }
      } catch (e) {
        this.$message.error(e.message)
      }
    }
  },
  mounted () {
    if (this.$store.state.offline != null) {
      this.address = this.$store.state.offline
    } else {
      this.address = this.$store.getters.wallet.address
    }
    this.jointAccount = this.$route.params.jointAccount
    this.stakeValue = this.$route.params.stakeValue
  },
  components: {
    AllDialog,
    OfflineDialog,
    sendSign
  }
}
</script>
<style scoped lang="less">
.jointAdd {
  width: 1040px;
  .addForm {
    /deep/.el-input {
      width: 26.5rem;
    }
    h5 {
      font-size: 0.875rem;
      color: #2c365c;
      letter-spacing: 0.13px;
      font-weight: bold;
      display: flex;
      margin-left: 18.75rem;
      margin-bottom: 1rem;
    }
    /deep/.el-input {
      display: block;
      margin-top: 1rem;
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
    .small-input {
      width: 10rem;
      margin-top: 0;
    }
    .show-flex-between {
      width: 26.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
    }
    .common-button {
      margin-top: 1rem;
    }
    .tips {
      width: 26.5rem;
      text-align: left;
      font-size: 0.875rem;
      color: #9298ae;
      letter-spacing: 0.13px;
      font-weight: 400;
    }
  }
}
</style>
