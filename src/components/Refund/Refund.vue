<template>
  <div class="refund">
    <div class="container-1 info">
      <h5>{{$t('refund.deposit_amount')}}：</h5>
      <el-input v-model="amount"
                readonly></el-input>
      <h5>{{$t('refund.node_address')}}：</h5>
      <el-input v-model="nodeAddress"
                readonly></el-input>
      <h5>{{$t('refund.deposit_status')}}：</h5>
      <el-input v-model="state"
                readonly></el-input>
      <div>
        <button class="common-button"
                @click="openDialog"
                v-if="depositShow">{{$t('miningTransactionOverview.remove_mortgage')}}</button>
        <button class="common-button"
                @click="openExitDialog"
                v-if="cancelDepositShow">{{$t('miningTransactionOverview.refund')}}</button>
      </div>
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
  </div>
</template>

<script>
import WalletUtil from '@/assets/js/WalletUtil'
import { mortgage } from '@/assets/js/config'
import CommonDialog from '@/components/CommonDialog/CommonDialog'
import CommonDialogCancel from '@/components/CommonDialog/CommonDialogCancel'

export default {
  name: 'refund',
  data () {
    return {
      address: '',
      state: '',
      amount: null,
      nodeAddress: '',
      commonDialogExitVisible: false,
      commonDialogVisible: false,
      cancelDepositShow: false,
      depositShow: false,
      blockNumber: 0
    }
  },
  methods: {
    openExitDialog () {
      this.blockNumber = this.httpProvider.man.blockNumber
      if (this.blockNumber - this.exitBlockNumber > 600) {
        this.commonDialogExitVisible = true
      } else {
        this.$message.error(this.$t('miningTransactionOverview.refundError'))
      }
    },
    closeDialog (status) {
      if (this.$store.state.offline == null) {
        if (status === 'ok') {
          this.depositShow = false
          this.cancelDepositShow = true
        }
      }
      this.commonDialogVisible = false
    },
    getHash (hash) {
      this.hash = hash
    },
    query () {
      if (WalletUtil.validateManAddress(this.address)) {
        this.getDepositInfo()
      } else {
        this.$message.error('请输入正确的查询地址')
      }
    },
    getDepositInfo () {
      let abiArray = JSON.parse(mortgage.abi)
      let contractAddress = mortgage.address
      let contract = this.httpProvider.man.contract(abiArray)
      let myContractInstance = contract.at(contractAddress)
      let deposit = myContractInstance.getDepositInfo(WalletUtil.getAddress(this.address), { currency: 'MAN' })
      if (Number(deposit[3]) === 0) {
        this.state = this.$t('refund.no_deposit')
        return
      } else if (Number(deposit[3]) === 16) {
        if (deposit[2].toNumber() !== 0) {
          this.cancelDepositShow = true
          this.state = this.$t('refund.withdraw_block') + deposit[2].toNumber() + this.$t('refund.block')
          this.exitBlockNumber = deposit[2].toNumber()
        } else {
          this.depositShow = true
          this.state = this.$t('refund.Set_Miner')
        }
      } else if (Number(deposit[3]) === 128) {
        if (deposit[2].toNumber() !== 0) {
          this.cancelDepositShow = true
          this.state = this.$t('refund.withdraw_block') + deposit[2].toNumber() + this.$t('refund.block')
          this.exitBlockNumber = deposit[2].toNumber()
        } else {
          this.depositShow = true
          this.state = this.$t('refund.Set_validator')
        }
      }
      if (deposit[1].indexOf('MAN') > -1) {
        this.nodeAddress = deposit[1]
      } else {
        this.nodeAddress = WalletUtil.getManAddress(deposit[1])
      }
      this.amount = this.httpProvider.fromWei(deposit[0]).toNumber()
    },
    closeExitDialog (status) {
      // if (status === 'ok') {
      //   this.cancelDepositShow = false
      // }
      this.commonDialogExitVisible = false
    },
    openDialog () {
      this.commonDialogVisible = true
      this.msg = this.$t('successHint.withdrawal')
    }
  },
  mounted () {
    if (this.$store.state.offline != null) {
      this.address = this.$store.state.offline
    } else {
      this.address = this.$store.getters.wallet.address
    }
    this.getDepositInfo()
  },
  components: {
    CommonDialog,
    CommonDialogCancel
  }
}
</script>

<style scoped lang="less">
.refund {
  .container-1 {
    padding: 1.5rem 0 2rem 0;
    text-align: center;
    .el-input {
      width: 37.5rem;
    }
    .common-button {
      margin-top: 1rem;
    }
    h5 {
      font-size: 0.875rem;
      color: #2c365c;
      letter-spacing: 0.13px;
      font-weight: bold;
      display: flex;
      margin-left: 14rem;
      margin-bottom: 1rem;
    }
  }
  .info {
    .el-input {
      margin-top: 1rem;
    }
  }
}
</style>
