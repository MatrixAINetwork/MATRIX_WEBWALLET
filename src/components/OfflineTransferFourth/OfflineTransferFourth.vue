<template>
  <div class="offline-transfer-fourth align-center">
    <div class="commonTable">
      <el-table :data="tableData"
                style="width: 100%">
        <el-table-column prop="amount"
                         :label="$t('offline.transfer_accounts_value')"
                         width="118">
        </el-table-column>
        <el-table-column prop="type"
                          :label="$t('offline.transactionType')"
                         width="135">

        </el-table-column>
        <el-table-column prop="date"
                          :label="$t('offline.transactionTime')"
                         width="136">
          <template slot-scope="scope">
            <div>
              {{scope.row.date | dateFormat('MM.DD.YYYY h:mm') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="paymentAddress"
                         :label="$t('offline.paymentAddress')"
                         width="274">
        </el-table-column>
        <el-table-column prop="collectionAddress"
                         :label="$t('offline.gatheringAddress')">
        </el-table-column>
      </el-table>
    </div>
    <div class="op">
      <button class="common-button"
              @click="sendTransfer">{{$t('offline.determineTransfer')}}</button>
    </div>
    <transfer-dialog :transferDialogVisible="transferDialogVisible"
                     :width="'800px'"
                     :status="$t('offline.success')"
                     :msg="$t('offline.offlineTransferComplete')"
                     :to="ruleForm.to"
                     :from="ruleForm.from"
                     :amount="ruleForm.value"
                     :addressList="ruleForm.addressList"
                     :hash="hash"
                     @transferDialogVisible="changeTransferDialogVisible"></transfer-dialog>
  </div>
</template>

<script>
import TransferDialog from '@/components/TransferDialog/TransferDialog'
import store from '@/store'

export default {
  name: 'OfflineTransferFourth',
  data () {
    return {
      transferDialogVisible: false,
      tableData: [],
      sendJson: {},
      newTxData: {},
      ruleForm: {},
      hash: ''
    }
  },
  components: {
    TransferDialog
  },
  mounted () {
    this.ruleForm = this.$route.params.ruleForm
    this.newTxData = this.$route.params.newTxData
    for (let i = 0; i < this.ruleForm.extra_to.length; i++) {
      let item = {}
      item.type = this.ruleForm.ExtraTimeTxType === 0 ? this.$t('offline.timeTransaction') : this.$t('offline.nowTransaction')
      item.date = this.ruleForm.CommitTime
      item.paymentAddress = this.ruleForm.from
      if (i === 0) {
        item.amount = this.ruleForm.value
        item.collectionAddress = this.ruleForm.to
      } else {
        item.collectionAddress = this.ruleForm.extra_to[i][0]
        item.amount = this.ruleForm.extra_to[i][1]
      }
      this.tableData.push(item)
    }
  },
  methods: {
    sendTransfer () {
      try {
        this.hash = this.httpProvider.man.sendRawTransaction(this.newTxData)
        store.commit('UPDATE_WALLET', null)
        this.transferDialogVisible = true
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    changeTransferDialogVisible (val) {
      this.transferDialogVisible = val
    }
  }
}
</script>

<style scoped lang="less">
.offline-transfer-fourth {
  padding: 0 3.25rem;
  margin-top: 2rem;
  .op {
    margin: 2rem 0 3rem 0;
  }
}
</style>
