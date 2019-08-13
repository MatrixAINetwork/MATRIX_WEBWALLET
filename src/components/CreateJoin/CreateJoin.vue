<template>
  <div class="createJoin">
    <el-card>
      <div class="addForm">
        <h1>{{$t('createJoin.createJoin')}}</h1>
        <span class="back-tittle"
              @click="backPage">
          <i class="el-icon-arrow-left"></i>
          {{$t('openWallet.back')}}
        </span>
        <!-- <h5>{{$t('associate.associateAddress')}}</h5> -->
        <el-input :placeholder="$t('createJoin.valueTips')"
                  v-model="value"
                  type="number"></el-input>
        <el-input :placeholder="$t('createJoin.signAddressTips')"
                  v-model="signAddress"></el-input>
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
        <el-input :placeholder="$t('createJoin.management_fees_placeholder')"
                  type="number"
                  v-model="nodeRate"></el-input>
        <!-- <el-input :placeholder="$t('createJoin.income_distribution_weight')"
                  type="number"
                  v-model="ownerRate"></el-input>
        <div class="show-flex-between">
          <div>
            <el-input class="small-input"
                      v-model="lvlRate1"
                      type="number"
                      :placeholder="$t('createJoin.join_income')"></el-input>
          </div>
          <div>{{$t('createJoin.join_income_tips1')}}</div>
        </div>
        <div class="show-flex-between">
          <div>
            <el-input class="small-input"
                      v-model="lvlRate2"
                      type="number"
                      :placeholder="$t('createJoin.join_income')"></el-input>
          </div>
          <div>{{$t('createJoin.join_income_tips2')}}</div>
        </div>
        <div class="show-flex-between">
          <div>
            <el-input class="small-input"
                      v-model="lvlRate3"
                      type="number"
                      :placeholder="$t('createJoin.join_income')"></el-input>
          </div>
          <div>{{$t('createJoin.join_income_tips3')}}</div>
        </div>
        <div class="tips-font">
          <div>{{$t('createJoin.tips')}}：</div>
          <div>{{$t('createJoin.bottomTips1')}}</div>
          <div>{{$t('createJoin.bottomTips2')}}：</div>
          <div>{{$t('createJoin.bottomTips3')}}</div>
          <div>{{$t('createJoin.bottomTips4')}}</div>
          <div>{{$t('createJoin.bottomTips5')}}</div>
          <div>{{$t('createJoin.bottomTips6')}}</div>
          <div>{{$t('createJoin.bottomTips7')}}</div>
          <div>{{$t('createJoin.bottomTips8')}}</div>
          <div>{{$t('createJoin.bottomTips9')}}</div>
          <div>{{$t('createJoin.bottomTips10')}}</div>
        </div> -->
        <button class="common-button"
                @click="confirm">{{$t('createJoin.creatNew')}}</button>
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
import { joinAbi, joinContract } from '@/assets/js/config.js'
import store from 'store'
import WalletUtil from '@/assets/js/WalletUtil'
import TradingFuns from '@/assets/js/TradingFuns'
import OfflineDialog from '@/components/TransferDialog/TipOfflineDialog'
import sendSign from '@/components/TransferDialog/sendSignTransfer'
import AllDialog from '@/components/TransferDialog/AllDialog'
import BigNumber from 'bignumber.js'
export default {
  name: 'createJoin',
  data () {
    return {
      value: '',
      signAddress: '',
      mortgageWayList: [{ name: this.$t('CampaignNode.regular'), key: 'regular' }, { name: this.$t('CampaignNode.current'), key: 'current' }],
      timeLimitList: [{ name: this.$t('CampaignNode.oneMonth'), key: '1' }, { name: this.$t('CampaignNode.threeMonth'), key: '3' }, { name: this.$t('CampaignNode.sixMonth'), key: '6' }, { name: this.$t('CampaignNode.oneYear'), key: '12' }],
      timeLimit: '',
      mortgageWay: '',
      ownerRate: 1,
      lvlRate1: 1,
      lvlRate2: 1,
      lvlRate3: 1,
      msg: '',
      hash: '',
      confirmOffline: false,
      jsonObj: '',
      sendSignVisible: false,
      information: '',
      visible: false,
      nodeRate: ''
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
    changeVisible (state) {
      this.visible = state
    },
    backPage () {
      this.$router.back()
    },
    confirm () {
      try {
        let value = new BigNumber(this.value)
        if (!WalletUtil.validateManAddress(this.signAddress)) {
          this.$message.error(this.$t('transfer.addressTip'))
          return
        }
        if (value.comparedTo(new BigNumber(100000)) === -1) {
          this.$message.error(this.$t('createJoin.valueError'))
          return
        }
        if (new BigNumber(this.value).comparedTo(new BigNumber(10000000)) === 1) {
          this.$message.error(this.$t('createJoin.valueToMore'))
          return
        }
        let abiArray = JSON.parse(joinAbi)
        let contractAddress = joinContract
        let contract = this.httpProvider.man.contract(abiArray).at(contractAddress)
        let nonce = this.httpProvider.man.getTransactionCount(this.address)
        nonce = WalletUtil.numToHex(nonce)
        this.signAddress = this.signAddress.trim()
        let data = {
          to: contractAddress,
          value: this.value,
          gasLimit: 210000,
          data: '',
          gasPrice: 18000000000,
          extra_to: [[0, 0, []]],
          nonce: nonce
        }
        let jsonObj = TradingFuns.getTxData(data)
        let dType = 0
        if (this.mortgageWay === '') {
          this.$message.error(this.$t('CampaignNode.selectMortgageWay'))
          return
        } else if (this.mortgageWay === 'regular') {
          if (this.timeLimit === '') {
            this.$message.error(this.$t('CampaignNode.selectTimeLimit'))
            return
          }
          dType = parseInt(this.timeLimit)
        }
        if (this.ownerRate === '') {
          this.$message.error(this.$t('createJoin.createIncomeError'))
          return
        }
        if (this.lvlRate1 === '') {
          this.$message.error(this.$t('createJoin.join_income_error'))
          return
        }
        if (this.lvlRate2 === '') {
          this.$message.error(this.$t('createJoin.join_income_error'))
          return
        }
        if (this.lvlRate3 === '') {
          this.$message.error(this.$t('createJoin.join_income_error'))
          return
        }
        if (this.nodeRate === '') {
          this.$message.error(this.$t('createJoin.nodeRate_error'))
          return
        }
        if (new BigNumber(this.nodeRate).comparedTo(new BigNumber(100)) === 1 || new BigNumber(0).comparedTo(new BigNumber(this.nodeRate)) === 1) {
          this.$message.error(this.$t('createJoin.nodeRate_input_error'))
          return
        }
        jsonObj.data = contract.createValidatorGroup.getData(WalletUtil.getAddress(this.signAddress), dType, this.ownerRate, parseInt(this.nodeRate) * 10000000, [this.lvlRate1, this.lvlRate2, this.lvlRate3])
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
  },
  components: {
    AllDialog,
    OfflineDialog,
    sendSign
  }
}
</script>
<style scoped lang="less">
.createJoin {
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
    .tips-font {
      text-align: left;
      font-size: 0.875rem;
      color: #9298ae;
      letter-spacing: 0.13px;
      font-weight: 400;
      margin-left: 18rem;
      margin-top: 1rem;
    }
  }
}
</style>
