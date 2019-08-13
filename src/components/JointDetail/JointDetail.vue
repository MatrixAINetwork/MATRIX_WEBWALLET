<template>
  <div class="jointDetail">
    <el-card class="box-card1">
      <div class="distance-bottom">
        <span class="back-tittle"
              @click="backPage">
          <i class="el-icon-arrow-left"></i>
          {{$t('openWallet.back')}}
        </span>
      </div>
      <div class="header">
        <div class="text-left">
          <div class="distance-top dis-flex">
            <div class="distance-right"><span class="font-weight-style">{{$t('jointFirst.jointAccount')}}：</span>{{detailObj.jointAccount}} </div>
            <div><span class="font-weight-style ">{{$t('jointFirst.jointNumber')}}：</span>{{detailObj.activeCount}}</div>
          </div>
          <div class="distance-top"><span class="font-weight-style">{{$t('jointFirst.createAddress')}}：</span>{{detailObj.createAddress}}</div>
          <div class="distance-top"><span class="font-weight-style">{{$t('jointDetail.signAddress')}}：</span>{{detailObj.signAddress}}</div>
          <div class="distance-top">
            <span class="font-weight-style">{{$t('jointDetail.stakeTotal')}}:</span>{{detailObj.allAmount}}
            <span class="font-weight-style">{{$t('jointDetail.rewardTotal')}}：</span>{{detailObj.reward}}
          </div>
          <div class="distance-top"><span class="font-weight-style">{{$t('createJoin.management_fees')}}：{{detailObj.NodeRate.Rate/detailObj.NodeRate.Decimal*100}}% </span></div>
          <div class="distance-top"><span class="font-weight-style">{{$t('jointDetail.income_distribution')}}：</span>
            <span v-for="(item,key) in detailObj.levelRate"
                  :key="key">R{{key}} ：{{item}} &nbsp;</span>
          </div>
          <div class="distance-top tips-font">
            <label>{{$t('jointFirst.ratehit')}}</label>
          </div>
        </div>
        <div><button class="common-button"
                  @click="jointAdd()"
                  v-if="!detailObj.alreadyWithdraw">
            {{$t('jointDetail.addMining')}}</button>
          <div class="distance-top"
               v-if="!detailObj.alreadyWithdraw&&address===detailObj.createAddress">
            <button @click="openDialog()"
                    class="common-button">{{$t('jointDetail.closeMining')}}</button>
          </div>
          <div class="distance-top"
               v-if="!detailObj.alreadyWithdraw&&address===detailObj.createAddress">
            <button @click="setSignAccount()"
                    class="common-button">{{$t('jointDetail.updateSign')}}</button>
          </div>
        </div>
      </div>
    </el-card>
    <el-card class="box-card2">
      <hr>
      <div v-for="(item,index) in detailList"
           :key="index">
        <div class="dis-flex between left-distance distance-top text-left">
          <div class="list-width">
            <div class="dis-flex distance-top ">
              <div class="account-width"><span class="font-weight-style">{{$t('jointDetail.account')}}：</span> {{item.Address}}</div>
              <div><span class="font-weight-style">{{$t('jointDetail.awardTotal')}}：{{item.Reward | weiToNumber}}MAN</span></div>
            </div>
            <div class="distance-top"><span class="font-weight-style">{{$t('jointDetail.stakeTotal')}}：{{item.AllAmount | weiToNumber}} </span></div>
          </div>
          <div class="distance-top"
               v-if="address===item.Address">
            <a @click="participantsDetail(item)">{{$t('digAccount.withdraw_detail')}}</a>
          </div>
        </div>
        <hr>
      </div>
      <el-pagination background
                     class="top_spacing"
                     layout="prev, pager, next"
                     :page-size="pageSize"
                     :current-page="pageNumber"
                     @current-change="changeAll"
                     :total="total">
      </el-pagination>
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
    <common-dialog-cancel :commonDialogExitVisible="commonDialogExitVisible"
                          :address="address"
                          :title="$t('jointDetail.closeMining')"
                          :msg="$t('jointDetail.dissolveJoint')"
                          :time="''"
                          :okText="$t('miningTransactionOverview.determine')"
                          :cancelText="$t('miningTransactionOverview.cancel')"
                          :width="'365px'"
                          @closeExitDialog="closeExitDialog"></common-dialog-cancel>
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
import CommonDialogCancel from '@/components/CommonDialog/CommonDialogCancel'
import BigNumber from 'bignumber.js'
import filter from '@/assets/js/filters'
export default {
  name: 'jointDetail',
  data () {
    return {
      detailObj: { reward: '0', NodeRate: { Rate: 0, Decimal: 1000000000 } },
      detailList: [],
      address: '',
      msg: '',
      hash: '',
      confirmOffline: false,
      jsonObj: '',
      sendSignVisible: false,
      information: '',
      visible: false,
      commonDialogExitVisible: false,
      pageSize: 10,
      pageNumber: 1,
      total: 0
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
    goPage (url) {
      this.$router.push({ path: '/jointMining/' + url })
    },
    participantsDetail (item) {
      item.jointAccount = this.detailObj.jointAccount
      item.creatAddress = this.detailObj.createAddress
      item.alreadyWithdraw = this.detailObj.alreadyWithdraw
      if (this.detailObj.createAddress === item.Address) {
        item.isOwner = true
      } else {
        item.isOwner = false
      }
      item.allAmount = this.detailObj.allAmount
      let obj = JSON.parse(JSON.stringify(item))
      this.$router.push({ name: 'ParticipantsDetail', params: { participantsDetail: obj } })
    },
    jointAdd () {
      this.$router.push({ name: 'JointAdd', params: { jointAccount: this.detailObj.jointAccount, stakeValue: this.detailObj.allAmount } })
    },
    backPage () {
      this.$router.back()
    },
    withdrawAll () {
      try {
        let abiArray = JSON.parse(joinChildAbi)
        let contractAddress = this.detailObj.jointAccount
        let contract = this.httpProvider.man.contract(abiArray).at(contractAddress)
        let nonce = this.httpProvider.man.getTransactionCount(this.address)
        nonce = WalletUtil.numToHex(nonce)
        let data = {
          to: this.detailObj.jointAccount,
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
    setSignAccount () {
      this.$router.push({ name: 'SetSignAccount', params: { jointAccount: this.detailObj.jointAccount } })
    },
    closeExitDialog (state) {
      if (state === 'ok') {
        this.withdrawAll()
      }
      this.commonDialogExitVisible = false
    },
    openDialog () {
      this.commonDialogExitVisible = true
    },
    changeAll (status) {
      this.pageNumber = status
      if (this.detailObj.validatorMap.length >= this.pageNumber * this.pageSize) {
        this.detailList = this.detailObj.validatorMap.slice((this.pageNumber - 1) * 10, this.pageNumber * this.pageSize)
      } else {
        this.detailList = this.detailObj.validatorMap.slice((this.pageNumber - 1) * 10, this.detailObj.validatorMap.length)
      }
    }
  },
  watch: {
    $route (to, from) {
      if (to.path.indexOf('jointDetail') > -1) {
        if (this.$route.params.detailObj) {
          this.detailObj = this.$route.params.detailObj
        }
        this.detailObj.reward = new BigNumber(0)
        for (let index = 0; index < this.detailObj.validatorMap.length; index++) {
          const element = this.detailObj.validatorMap[index]
          this.detailObj.reward = this.detailObj.reward.plus(filter.weiToNumber(element.Reward))
        }
        for (let i = 0; i < this.detailObj.validatorMap.length; i++) {
          let item = this.detailObj.validatorMap[i]
          if (item.Address === this.address) {
            let middleItem = this.detailObj.validatorMap[0]
            this.detailObj.validatorMap[0] = item
            this.detailObj.validatorMap[i] = middleItem
            break
          }
        }
        if (this.detailObj.validatorMap.length > 10) {
          this.detailList = this.detailObj.validatorMap.slice(0, 9)
        } else {
          this.detailList = this.detailObj.validatorMap
        }
        this.total = this.detailObj.validatorMap.length
        this.detailObj.reward = this.detailObj.reward.toString(10)
      }
    }
  },
  mounted () {
    if (this.$store.state.offline != null) {
      this.address = this.$store.state.offline
    } else {
      this.address = this.$store.getters.wallet.address
    }
    this.detailObj = this.$route.params.detailObj
    this.detailObj.reward = new BigNumber(0)
    this.detailObj.validatorMap.forEach(element => {
      this.detailObj.reward = this.detailObj.reward.plus(filter.weiToNumber(element.Reward))
    })
    for (let i = 0; i < this.detailObj.validatorMap.length; i++) {
      let item = this.detailObj.validatorMap[i]
      if (item.Address === this.address) {
        let middleItem = this.detailObj.validatorMap[0]
        this.detailObj.validatorMap[0] = item
        this.detailObj.validatorMap[i] = middleItem
        break
      }
    }
    if (this.detailObj.validatorMap.length > 10) {
      this.detailList = this.detailObj.validatorMap.slice(0, 9)
    } else {
      this.detailList = this.detailObj.validatorMap
    }
    this.total = this.detailObj.validatorMap.length
    this.detailObj.reward = this.detailObj.reward.toString(10)
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
.jointDetail {
  margin: auto;
  width: 1040px;
  .box-card1 {
    .header {
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
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
  .between {
    justify-content: space-between;
  }
  .left-distance {
    padding-left: 2rem;
    padding-right: 3rem;
  }
  .distance-top {
    margin-top: 1rem;
  }
  .distance-bottom {
    margin-bottom: 1rem;
  }
  a {
    font-size: 0.875rem;
    color: #1c51dd;
    margin-left: 1.5rem;
    cursor: pointer;
  }
  .list-width {
    width: 90%;
  }
  .back-tittle {
    position: relative;
    left: 441px;
    cursor: pointer;
    color: #1c51dd;
    font-size: 0.88rem;
    letter-spacing: 0.13px;
  }
  .account-width {
    width: 430px;
  }
  .distance-right {
    margin-right: 3rem;
  }
  .tips-font {
    font-size: 0.875rem;
    color: #9298ae;
    letter-spacing: 0.13px;
    font-weight: 400;
  }
}
</style>
