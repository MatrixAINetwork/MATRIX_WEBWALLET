<template>
  <div class="participantsDetail">
    <el-card class="box-card1">
      <div class="header">
        <div class="line-center between">
          <div class="line-center">
            <div><span class="font-weight-style">{{$t('jointDetail.account')}}：</span>{{participantsDetail.Address}}</div>
          </div>
          <div style=" text-align:right"><a @click="backPage()">{{$t('openWallet.back')}}</a> </div>
        </div>
        <div class="line-center distance-top between">
          <div class="line-center">
            <div><span class="font-weight-style">{{$t('jointDetail.stakeTotal')}}:</span>{{participantsDetail.AllAmount |weiToNumber}}MAN</div>
            <div style="margin-left: 7rem;"><span class="font-weight-style">{{$t('jointDetail.awardTotal')}}: {{participantsDetail.Reward |weiToNumber}}MAN</span> </div>
          </div>
          <div style="text-align:right"
               v-if="!(participantsDetail.Reward==='0')"><a @click="getReward()">{{$t('participantsDetail.getAward')}}</a> </div>
        </div>
      </div>
    </el-card>
    <el-card>
      <div class="commonTable">
        <el-table :data="tableData"
                  style="width: 100%">
          <el-table-column :label="$t('participantsDetail.type')">
            <template slot-scope="scope">
              {{scope.row.type===0?$t('digAccount.current'):$t('digAccount.regular')}}
            </template>
          </el-table-column>
          <el-table-column :label="$t('CampaignNode.timeLimit')">
            <template slot-scope="scope">
              {{scope.row.DType==='——'?'——':scope.row.DType+$t('regularDetail.month')}}
            </template>
          </el-table-column>
          <el-table-column :label="$t('transfer.amount')"
                           prop="value">
            <template slot-scope="scope">
              {{scope.row.value | weiToNumber}}
            </template>
          </el-table-column>
          <el-table-column :label="$t('mortgageHistory.state')">
            <template slot-scope="scope">
              <div v-if="scope.row.withdrawTime===0">
                {{scope.row.isDeposite === 0?$t('participantsDetail.staking'):$t('participantsDetail.alreadyWithraw')}}
              </div>
              <div v-else>
                {{$t('participantsDetail.waitWithrawal')}}
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('regularDetail.operation')"
                           prop="opration">
            <template slot-scope="scope">
              <div v-if="scope.row.withdrawTime===0 || scope.row.withdrawTime<parseInt(new Date().getTime()/1000)">
                <el-button @click="opration(scope.row)"
                           v-if="scope.row.isDeposite===0"
                           type="text"
                           size="small">{{$t('digAccount.withdraw_deposit')}}</el-button>
                <el-button @click="refund(scope.row.Position)"
                           v-if="scope.row.isDeposite===1"
                           type="text"
                           size="small">{{$t('digAccount.withdrawals')}}</el-button>
              </div>
              <div v-if="scope.row.withdrawTime>parseInt(new Date().getTime()/1000)">
                {{$t('participantsDetail.notYetDue')}}
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="content-between">
          <!-- <el-pagination background
                         class="top_spacing"
                         layout="prev, pager, next"
                         :page-size="pageSize"
                         :current-page="pageNumber"
                         @current-change="currentChange"
                         :total="total">
          </el-pagination> -->
        </div>
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
import { joinChildAbi } from '@/assets/js/config.js'
import store from 'store'
import WalletUtil from '@/assets/js/WalletUtil'
import TradingFuns from '@/assets/js/TradingFuns'
import SendTransfer from '@/assets/js/SendTransfer'
import OfflineDialog from '@/components/TransferDialog/TipOfflineDialog'
import sendSign from '@/components/TransferDialog/sendSignTransfer'
import AllDialog from '@/components/TransferDialog/AllDialog'
import filter from '@/assets/js/filters'
import BigNumber from 'bignumber.js'
export default {
  name: 'participantsDetail',
  data () {
    return {
      tableData: [
      ],
      participantsDetail: {
      },
      jointAccount: '',
      address: '',
      msg: '',
      hash: '',
      confirmOffline: false,
      jsonObj: '',
      sendSignVisible: false,
      information: '',
      visible: false,
      creatAddress: ''
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
    setSignAccount () {
      this.$router.push({ name: 'SetSignAccount', params: { jointAccount: this.jointAccount } })
    },
    goPage (url) {
      this.$router.push({ path: '/jointMining/' + url })
    },
    opration (row) {
      row.jointAccount = this.jointAccount
      let data = JSON.parse(JSON.stringify(row))
      data.allAmount = this.participantsDetail.allAmount
      data.isOwner = this.participantsDetail.isOwner
      if (row.type === 1) {
        this.$router.push({ name: 'JoinRegular', params: { data: data } })
      } else {
        let currentTotal = new BigNumber(0)
        this.tableData.forEach(element => {
          if (element.type === 0 && element.isDeposite === 0) {
            currentTotal = currentTotal.plus(new BigNumber(filter.weiToNumber(element.value)))
          }
        })
        data.currentTotal = currentTotal
        this.$router.push({ name: 'JoinCurrent', params: { data: data } })
      }
    },
    refund (position) {
      try {
        let abiArray = JSON.parse(joinChildAbi)
        let contractAddress = this.jointAccount
        let contract = this.httpProvider.man.contract(abiArray).at(contractAddress)
        let nonce = this.httpProvider.man.getTransactionCount(this.address)
        nonce = WalletUtil.numToHex(nonce)
        let data = {
          to: this.jointAccount,
          value: 0,
          gasLimit: 210000,
          data: '',
          gasPrice: 18000000000,
          extra_to: [[0, 0, []]],
          nonce: nonce
        }
        let jsonObj = TradingFuns.getTxData(data)
        jsonObj.data = contract.refund.getData(position)
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
    },
    withdrawAll () {
      try {
        let abiArray = JSON.parse(joinChildAbi)
        let contractAddress = this.jointAccount
        let contract = this.httpProvider.man.contract(abiArray).at(contractAddress)
        let nonce = this.httpProvider.man.getTransactionCount(this.address)
        nonce = WalletUtil.numToHex(nonce)
        let data = {
          to: this.jointAccount,
          value: 0,
          gasLimit: 210000,
          data: '',
          gasPrice: 18000000000,
          extra_to: [[0, 0, []]],
          nonce: nonce
        }
        let jsonObj = TradingFuns.getTxData(data)
        jsonObj.data = contract.withdrawAll.getData()
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
    },
    init () {
      this.participantsDetail = this.$route.params.participantsDetail
      this.participantsDetail.Address = this.participantsDetail.Address
      this.jointAccount = this.participantsDetail.jointAccount
      this.creatAddress = this.participantsDetail.creatAddress
      if (parseInt(this.participantsDetail.Current.Amount) > 0) {
        this.tableData.push(
          {
            type: 0,
            value: this.participantsDetail.Current.Amount,
            opration: 0,
            isDeposite: 0,
            Position: 0,
            withdrawTime: 0,
            DType: '——'
          }
        )
      }
      if (this.participantsDetail.Current.WithdrawList.length > 0) {
        this.participantsDetail.Current.WithdrawList.forEach(current => {
          this.tableData.push(
            {
              type: 0,
              value: current.WithDrawAmount,
              opration: 1,
              isDeposite: 1,
              Position: 0,
              withdrawTime: current.WithDrawTime,
              DType: '——'
            }
          )
        })
      }
      this.participantsDetail.Positions.forEach(element => {
        if (element.EndTime === 0) {
          this.tableData.push(
            {
              type: 1,
              value: element.Amount,
              opration: element.Position,
              Position: element.Position,
              isDeposite: 0,
              withdrawTime: 0,
              DType: element.DType
            }
          )
        } else {
          this.tableData.push(
            {
              type: 1,
              value: element.Amount,
              opration: element.Position,
              Position: element.Position,
              isDeposite: 1,
              withdrawTime: element.EndTime + 7200,
              DType: element.DType
              // withdrawTime: element.EndTime
            }
          )
        }
      })
    },
    getReward () {
      try {
        let abiArray = JSON.parse(joinChildAbi)
        let contractAddress = this.jointAccount
        let contract = this.httpProvider.man.contract(abiArray).at(contractAddress)
        let nonce = this.httpProvider.man.getTransactionCount(this.address)
        nonce = WalletUtil.numToHex(nonce)
        let data = {
          to: this.jointAccount,
          value: 0,
          gasLimit: 210000,
          data: '',
          gasPrice: 18000000000,
          extra_to: [[0, 0, []]],
          nonce: nonce
        }
        let jsonObj = TradingFuns.getTxData(data)
        jsonObj.data = contract.getReward.getData()
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
  watch: {
    $route (to, from) {
      if (to.path.indexOf('participantsDetail') > -1) {
        if (this.$route.params.participantsDetail) {
          this.tableData = []
          this.init()
        }
      }
    }
  },
  mounted () {
    if (this.$store.state.offline != null) {
      this.address = this.$store.state.offline
    } else {
      this.address = this.$store.getters.wallet.address
    }
    this.init()
  },
  components: {
    AllDialog,
    OfflineDialog,
    sendSign
  }
}
</script>

<style scoped lang="less">
.participantsDetail {
  margin: auto;
  width: 1040px;
  .box-card1 {
    .header {
      text-align: left;
      padding: 0 2rem;
      h1 {
        font-size: 2.25rem;
      }
      .common-button {
        width: 10.5rem;
      }
    }
  }
  .text-left {
    text-align: left;
  }
  .font-weight-style {
    font-size: 0.875rem;
    color: #2c365c;
    letter-spacing: 0.13px;
    font-weight: bold;
  }
  .dis-flex {
    display: flex;
  }
  .line-center {
    display: flex;
  }
  .between {
    justify-content: space-between;
  }
  .left-distance {
    padding-left: 2rem;
    padding-right: 10rem;
  }
  .distance-top {
    margin-top: 1rem;
  }
  a {
    font-size: 0.875rem;
    color: #1c51dd;
    margin-left: 1.5rem;
    cursor: pointer;
  }
  .list-width {
    width: 75%;
  }
}
</style>
