<template>
  <el-dialog :visible.sync="visible"
             :showClose=false
             customClass="common-dialog"
             :width="width"
             :before-close="handleClose"
             center>
    <div class="content">
      <div class="msg">{{msg}}</div>
      <button class="button-color"
              @click="confirmSend">{{$t('header.confirm')}}</button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'TransferDialog',
  methods: {
    confirmSend () {
      this.$emit('changeVisible', false)
    },
    handleClose () {
      this.$emit('changeVisible', false)
    }
  },
  data () {
    return {
      product: ''
    }
  },
  props: {
    msg: {
      default: '',
      type: String
    },
    hash: {
      default: '',
      type: String
    },
    visible: {
      default: false,
      type: Boolean
    },
    width: {
      default: '',
      type: String
    }
  },
  mounted () {
  }
}
</script>

<style scoped lang="less">
/deep/ .el-dialog__body {
  padding: 0 !important;
}
/deep/ .el-dialog__header {
  padding: 0;
  height: 2rem;
}
/deep/ .el-dialog__footer {
  background: rgba(44, 54, 92, 0.03);
  border-radius: 0px 0px 2px 2px;
  height: 3.5rem;
  margin-top: 2.06rem;
}
.common-dialog {
  .content {
    padding: 0 2.5rem;
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
      margin-bottom: 1.5rem;
    }
    .hash {
      font-size: 1.1rem;
      color: #2c365c;
      margin-bottom: 1.5rem;
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
      margin-bottom: 2.5rem;
      font-size: 0.88rem;
      color: #1c51dd;
      letter-spacing: 0.13px;
      text-align: center;
    }
    .button-color {
      margin-left: 1.5rem;
      background: #415eaa;
      color: #ffffff;
    }
    hr {
      background: #d5d7de;
      border: none;
      height: 2px;
      margin: 0;
    }
    .hr-bottom {
      margin-bottom: 2rem;
    }
    .hr-dis {
      margin: 2rem 0 2.5rem 0;
    }
  }
}
</style>
