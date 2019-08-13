<template>
  <el-dialog :visible.sync="successVisible"
             :showClose=false
             customClass="common-dialog"
             :width="width"
             :before-close="handleClose"
             center>
    <div class="content">
      <img src="../../assets/images/successfulTransfer.png">
      <div class="msg">{{msg}}</div>
      <div class="amount">{{amount}} <span>{{sendCoin}}</span></div>
      <div class="info">
        <div class="transfer-item">
          <label class="from">{{from}}</label>
          <img src="../../assets/images/transfer.png" />
          <label class="to">{{to}}</label>
        </div>
      </div>
      <div v-if="addressList.length > 0">
        <div v-for=" (item,index) in addressList"
             :key="index">
          <div class="amount">{{item.value}} <span>MAN</span></div>
          <div class="info">
            <div class="transfer-item">
              <label class="from">{{from}}</label>
              <img src="../../assets/images/transfer.png" />
              <label class="to">{{item.to}}</label>
            </div>
          </div>
        </div>
      </div>
      <div class="tip">
        {{$t('dialog.youCan')}} <a @click="queryRecord">{{$t('dialog.record')}}</a> {{$t('dialog.or')}} <a @click="openBrowser">{{$t('dialog.browser')}}</a> {{$t('dialog.queryDetails')}}
      </div>
      <div class="hash-font">hash：{{hash}}</div>
      <button @click="konw">{{$t('dialog.know')}}</button>
    </div>
  </el-dialog>
</template>

<script>
import { browserUrl } from '@/assets/js/config'
export default {
  name: 'TransferDialog',
  methods: {
    confirm (status) {
      this.$emit('closeDialog', status)
    },
    konw () {
      this.$emit('changeSuccess', false)
    },
    openBrowser () {
      window.open(browserUrl + '/tx/' + this.hash)
    },
    queryRecord () {
      this.$router.push({ path: '/my-wallet/openWallet/record' })
    },
    handleClose () {
      this.$emit('changeSuccess', false)
    }

  },
  data () {
    return {
    }
  },
  props: {
    successVisible: {
      default: false,
      type: Boolean
    },
    status: {
      default: '',
      type: String
    },
    amount: {
      default: '',
      type: String
    },
    title: {
      default: '',
      type: String
    },
    msg: {
      default: '',
      type: String
    },
    okText: {
      default: '',
      type: String
    },
    cancelText: {
      default: '',
      type: String
    },
    width: {
      default: '30%',
      type: String
    },
    to: {
      default: '',
      type: String
    },
    from: {
      default: '',
      type: String
    },
    hash: {
      default: '',
      type: String
    },
    addressList: {
      default: () => {
        return []
      },
      type: Array
    },
    sendCoin: {
      default: '',
      type: String
    }
  }
}
</script>

<style scoped lang="less">
.common-dialog {
  .hash-font{
    margin-top: .5rem;
    font-size: 1rem;
  }
  /deep/ .el-dialog__body {
    padding: 0 !important;
  }
  /deep/ .el-dialog__footer {
    background: rgba(44, 54, 92, 0.03);
    border-radius: 0px 0px 2px 2px;
    height: 3.5rem;
    margin-top: 2.06rem;
  }
  a {
    cursor: pointer;
  }
  .content {
    text-align: center;
    color: #2c365c;
    img {
      width: 2.25rem;
      margin-bottom: 1rem;
    }
    .msg {
      font-size: 1.25rem;
      color: #2c365c;
      letter-spacing: 0.18px;
      font-weight: bold;
      margin-bottom: 2rem;
    }
    .amount {
      font-size: 1.25rem;
      color: #4d7cfe;
      letter-spacing: 0.29px;
      margin-bottom: 1.5rem;
      span {
        font-size: 0.75rem;
        color: #2c365c;
        letter-spacing: 0.12px;
        opacity: 0.5;
      }
    }
    .info {
      .transfer-item {
        padding: 0 2.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        img {
          width: 1.5rem;
          height: 1.13rem;
          margin-top: 0.69rem;
        }
        label {
          display: block;
          width: 20.25rem;
          height: 2.5rem;
          line-height: 2.5rem;
          background: rgba(213, 215, 222, 0.16);
          font-size: 0.75rem;
          color: #2c365c;
          letter-spacing: 0.11px;
          border: 1px solid #d5d7de;
        }
      }
    }
    .tip {
      font-size: 0.75rem;
      color: #9298ae;
      letter-spacing: 0.11px;
      text-align: center;
      margin-top: 1.5rem;
      a {
        color: #1c51dd;
      }
    }
    button {
      background: #ffffff;
      border: 1px solid #1c51dd;
      border-radius: 2px;
      width: 12.5rem;
      height: 2.63rem;
      margin-top: 2rem;
      margin-bottom: 2.5rem;
      font-size: 0.88rem;
      color: #1c51dd;
      letter-spacing: 0.13px;
      text-align: center;
    }
  }
}
</style>
