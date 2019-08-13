<template>
  <div class="mining-transaction-overview">
    <div class="container">
      <div class="container-item">
        <div class="container-item-1">
          <label class="amount">{{totalIncome}} MAN <span>{{$t('miningTransactionOverview.total_revenue')}}</span></label>
          <label class="op"
                 @click="goHistoricalIncome">{{$t('miningTransactionOverview.query_history_revenue')}}</label>
        </div>
        <div class="container-item-2">{{$t('miningTransactionOverview.mining_hint')}}</div>
      </div>
      <div class="container-item">
        <div class="container-item-1">
          <label class="amount">{{stakedAssets}} MAN <span>{{$t('myWallet.stakedAssets2')}}</span></label>
          <label class="op"
                 @click="goMortgageHistory">{{$t('miningTransactionOverview.query_history_mortgage')}}</label>
        </div>
        <div class="container-item-2">{{$t('miningTransactionOverview.remove_tittle')}}</div>
      </div>
    </div>
    <div class="info-1">
      {{$t('miningTransactionOverview.getRevenue')}} <label @click="goPage">{{$t('miningTransactionOverview.campaign_node')}}</label>
    </div>
    <node-campaign-record @incomeList="getIncomeList"></node-campaign-record>
    <div class="demolition">
      <button class="common-button"
              @click="openDialog"
              v-if="depositShow">{{$t('miningTransactionOverview.remove_mortgage')}}</button>
      <button class="common-button"
              @click="openExitDialog"
              v-if="cancelDepositShow">{{$t('miningTransactionOverview.refund')}}</button>
    </div>
    <div class="demolition"
         v-if="cancelDepositShow">
      <div>{{$t('miningTransactionOverview.nodeHint')}}</div>
    </div>
    <common-dialog :commonDialogVisible="commonDialogVisible"
                   :address="address"
                   :title="$t('miningTransactionOverview.remove_mortgage')"
                   :msg="$t('miningTransactionOverview.remove_tittle')"
                   :okText="$t('miningTransactionOverview.determine')"
                   :cancelText="$t('miningTransactionOverview.cancel')"
                   :width="'365px'"
                   @closeDialog="closeDialog"
                   @getHash="getHash"></common-dialog>
    <common-dialog-cancel :commonDialogExitVisible="commonDialogExitVisible"
                          :address="address"
                          :title="$t('miningTransactionOverview.determine_refund')"
                          :msg="$t('miningTransactionOverview.refundHint')"
                          :okText="$t('miningTransactionOverview.determine')"
                          :cancelText="$t('miningTransactionOverview.cancel')"
                          :width="'365px'"
                          @closeExitDialog="closeExitDialog"></common-dialog-cancel>
    <all-dialog :visible="visible"
                @changeVisible="changeVisible"
                :width="'800px'"
                :msg="msg"
                :hash="hash"></all-dialog>
    <!-- <green-dialog :visible="alertable"
                @changeVisible="changeAlertable"
                :width="'800px'"
                :msg="$t('greenMining.greenTips')"></green-dialog> -->
  </div>
</template>

<script>
import CommonDialog from '@/components/CommonDialog/CommonDialog'
import CommonDialogCancel from '@/components/CommonDialog/CommonDialogCancel'
import NodeCampaignRecord from '@/components/NodeCampaignRecord/NodeCampaignRecord'
import ManUtils from '@/assets/js/ManUtils'
import store from '@/store'
import { mortgage } from '@/assets/js/config'
import WalletUtil from '@/assets/js/WalletUtil'
import AllDialog from '@/components/TransferDialog/AllDialog'
import GreenDialog from '@/components/TransferDialog/GreenDialog'

export default {
  name: 'MiningTransactionOverview',
  data () {
    return {
      commonDialogVisible: false,
      address: this.$store.state.wallet.address,
      stakedAssets: 0,
      totalIncome: 0,
      incomeListLength: 0,
      cancelDepositShow: false,
      depositShow: false,
      deposit: {},
      blockNumber: 0,
      commonDialogExitVisible: false,
      visible: false,
      hash: '',
      msg: '',
      alertable: true
    }
  },
  created () {
    // this.getStakedAssets()
    this.findTotalIncome()
    this.deposit = this.$route.params.deposit
    if (this.deposit) {
      if (this.deposit[1] !== '0x') {
        if (this.deposit[3].toNumber() === 128) {
          if (this.deposit[2].toNumber() !== 0) {
            this.cancelDepositShow = true
            this.exitBlockNumber = this.deposit[2].toNumber()
          } else {
            this.depositShow = true
          }
        } else if (this.deposit[3].toNumber() === 16) {
          if (this.deposit[2].toNumber() !== 0) {
            this.cancelDepositShow = true
            this.exitBlockNumber = this.deposit[2].toNumber()
          } else {
            this.depositShow = true
          }
        } else {
          return false
        }
      }
    } else {
      this.getDepositInfo()
    }
    if (this.deposit[0] !== undefined && this.deposit[0] != null) {
      this.stakedAssets = this.httpProvider.fromWei(this.deposit[0]).toNumber()
    }
  },
  methods: {
    changeAlertable () {
      this.$router.push({ path: '/my-wallet/openWallet/myAssets' })
    },
    getHash (hash) {
      this.hash = hash
    },
    changeVisible (state) {
      this.visible = state
    },
    goPage () {
      this.$router.push({ path: '/green-mining/campaignNode' })
    },
    getIncomeList (length) {
      this.incomeListLength = length
    },
    findTotalIncome () { // 获取总收益
      this.$http.get('findTotalIncome/' + this.address).then(res => {
        if (res.data.status === 200) {
          this.totalIncome = res.data.result
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    getStakedAssets () { // 获取抵押资产
      this.$http.get('findValueByAddressAndTxType/' + this.address + '/MAN.1111111111111111111B8/0/0').then(res => {
        if (res.data.status === 200) {
          let values = res.data.result
          values.forEach(item => {
            this.stakedAssets += Number(ManUtils.fromWei(item))
          })
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    closeDialog (status) {
      if (status === 'ok') {
        this.depositShow = false
        this.cancelDepositShow = true
        this.visible = true
      }
      this.commonDialogVisible = false
    },
    closeExitDialog (status) {
      if (status === 'ok') {
        this.cancelDepositShow = false
      }
      this.commonDialogExitVisible = false
    },
    openDialog () {
      this.commonDialogVisible = true
      this.msg = this.$t('successHint.withdrawal')
    },
    openExitDialog () {
      this.blockNumber = this.httpProvider.man.blockNumber
      if (this.blockNumber - this.exitBlockNumber > 600) {
        this.commonDialogExitVisible = true
        this.msg = this.$t('successHint.refund')
      } else {
        this.$message.error(this.$t('miningTransactionOverview.refundError'))
      }
    },
    goMortgageHistory () {
      this.$router.push({ path: '/green-mining/mortgage-history' })
    },
    getDepositInfo () {
      let abiArray = JSON.parse(mortgage.abi)
      let contractAddress = mortgage.address
      let contract = this.httpProvider.man.contract(abiArray)
      let myContractInstance = contract.at(contractAddress)
      let deposit = myContractInstance.getDepositInfo(WalletUtil.getAddress(store.state.wallet.address), { currency: 'MAN' })
      this.deposit = deposit
      if (deposit[1] !== '0x') {
        if (deposit[3].toNumber() === 128) {
          if (deposit[2].toNumber() !== 0) {
            this.cancelDepositShow = true
            this.exitBlockNumber = deposit[2].toNumber()
          } else {
            this.depositShow = true
          }
        } else if (deposit[3].toNumber() === 16) {
          if (deposit[2].toNumber() !== 0) {
            this.cancelDepositShow = true
            this.exitBlockNumber = deposit[2].toNumber()
          } else {
            this.depositShow = true
          }
        } else {
          return false
        }
      }
    },
    goHistoricalIncome () {
      this.$router.push({
        path: '/green-mining/historical-income',
        query: {
          depositShow: this.depositShow,
          exitBlockNumber: this.exitBlockNumber,
          cancelDepositShow: this.cancelDepositShow,
          totalIncome: this.totalIncome
        }
      })
    }
  },
  mounted () {
    // let deposit = this.getDepositInfo()
    // if (!deposit) {
    //   this.$router.push({ path: '/green-mining/StartNode' })
    // } else {
    //   this.$router.push({ path: '/green-mining/mining-transaction-overview' })
    // }
  },
  components: {
    CommonDialog,
    CommonDialogCancel,
    NodeCampaignRecord,
    AllDialog,
    GreenDialog
  },
  watch: {
    $route (to, from) {
      if (to.path.indexOf('StartNode') > 0) {
        if (this.cancelDepositShow) {
          this.$message.error(this.$t('CampaignNode.cancelDepositError'))
          this.$router.push({ name: 'MiningTransactionOverview' })
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.mining-transaction-overview {
  .container {
    &-item:not(:last-child) {
      border-bottom: 1px dashed #d5d7de;
    }
    &-item:last-child {
      border-bottom: 1px solid #d5d7de;
    }
    &-item {
      &-1 {
        margin: 2rem 0 1rem 0;
        .amount {
          font-size: 1.25rem;
          color: #2c365c;
          letter-spacing: 0.18px;
          span {
            font-size: 0.88rem;
          }
        }
        .op {
          float: right;
          font-size: 0.88rem;
          color: #1c51dd;
          letter-spacing: 0.13px;
          cursor: pointer;
        }
      }
      &-2 {
        font-size: 0.75rem;
        color: #9298ae;
        letter-spacing: 0.11px;
        margin-bottom: 1.97rem;
      }
    }
  }
  .info-1 {
    margin: 2rem 0 9.75rem 0;
    font-size: 0.88rem;
    color: #9298ae;
    letter-spacing: 0.13px;
    text-align: right;
    label {
      color: #1c51dd;
      cursor: pointer;
    }
  }
  .demolition {
    text-align: -webkit-center;
    text-align: -moz-center;
    div {
      font-size: 0.75rem;
      color: #ed3c1c;
      letter-spacing: 0.11px;
      margin: 1.5rem 0 1rem 0;
    }
    button {
      background: #fff;
      border: 1px solid #1c51dd;
      color: #1c51dd;
      margin-bottom: 3rem;
    }
  }
}
</style>
