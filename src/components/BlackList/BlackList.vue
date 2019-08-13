<template>
  <div class="blackList">
    <el-card class="card-width">
      <div class="addForm">
        <h1>{{$t('blackList.tittle')}}</h1>
        <h5 class="center">{{$t('blackList.list')}}</h5>
        <div class="div-dis"
             v-for="(item,index) in blackList"
             :key="index">
          <el-input v-model="item.address"></el-input>&nbsp;
          <span class="hint-error"  v-if="index==0">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span class="hint-error" @click="delList(index)" v-if="index>0">{{$t('blackList.del')}}</span> &nbsp;
          <span class="hint-add" @click="addList()">{{$t('blackList.add')}}</span>
        </div>
        <button class="common-button"
                @click="confirm">{{$t('transfer.confirm')}}</button>
      </div>
    </el-card>
  </div>
</template>

<script>
import TradingFuns from '@/assets/js/TradingFuns'
import WalletUtil from '@/assets/js/WalletUtil'
import SendTransfer from '@/assets/js/SendTransfer'
export default {
  name: 'blackList',
  data () {
    return {
      address: '',
      tradingObj: {
        to: '',
        IsEntrustTx: '',
        gasLimit: 210000,
        gasPrice: 18000000000,
        data: '',
        nonce: '',
        extra_to: [
          [14, 0, []]
        ],
        value: 0
      },
      blackList: []
    }
  },
  methods: {
    confirm () {
      let blackList = []
      for (let index = 0; index < this.blackList.length; index++) {
        const element = this.blackList[index]
        if (!WalletUtil.validateManAddress(element)) {
          this.$message.error(this.$t('errorMsgs.invalidManAddress'))
          return
        }
      }
      this.blackList.forEach(e => {
        blackList.push(e.address)
      })
      this.tradingObj.nonce = this.httpProvider.man.getTransactionCount(this.address)
      this.tradingObj.to = this.address
      this.tradingObj.data = JSON.stringify(blackList)
      let jsonObj = TradingFuns.getTxData(this.tradingObj)
      let tx = WalletUtil.createTx(jsonObj)
      let privateKey = this.$store.state.wallet.privateKey
      privateKey = Buffer.from(privateKey.indexOf('0x') > -1 ? privateKey.substring(2, privateKey.length) : privateKey, 'hex')
      tx.sign(privateKey)
      let serializedTx = tx.serialize()
      let newTxData = SendTransfer.getTxParams(serializedTx)
      this.httpProvider.man.sendRawTransaction(newTxData)
      this.$message.success('黑名单添加成功')
    },
    delList (index) {
      this.blackList.splice(index, 1)
    },
    addList () {
      this.blackList.push({ address: '' })
    }
  },
  mounted () {
    this.address = this.$store.getters.wallet.address
    let blackList = this.httpProvider.man.getBlackList()
    if (blackList != null && JSON.stringify(blackList) !== '[]') {
      for (let index = 0; index < blackList.length; index++) {
        const element = blackList[index]
        this.blackList.push({ address: element })
      }
    } else {
      this.blackList.push({ address: '' })
    }
  }
}
</script>
<style scoped lang="less">
.blackList {
  .card-width{
    margin: auto;
  }
  .div-dis {
    margin-top: 1rem;
  }
  .center {
    display: flex;
    justify-content: center;
  }
  /deep/.el-card__body {
    padding: 1rem 2.5rem 3rem 2.5rem;
  }
  .addForm {
    /deep/.el-input {
      width: 26.5rem;
      margin-left: 4.4rem;
      margin-bottom: 2rem;
    }
    h4 {
      margin-bottom: 2.5rem;
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
      cursor: pointer;
    }
    .hint-add {
      font-size: 0.875rem;
      color: #1c51dd;;
      letter-spacing: 0.13px;
      cursor: pointer;
    }
  }
}
</style>
