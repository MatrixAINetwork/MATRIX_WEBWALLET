<template>
  <div>
    <el-dialog :visible.sync="commonDialogExitVisible"
               :showClose=false
               customClass="common-dialog"
               :width="width"
               :before-close="handleClose"
               center>
      <div class="content">
        <div class="title">{{title}}</div>
        <div class="msg">{{msg}}</div>
        <div class="time">{{time}}</div>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <button @click="confirm('cancel')">{{cancelText}}</button>
        <button @click="confirm('ok')">{{okText}}</button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'CommonDialog',
  data () {
    return {
      functions: [],
      confirmOffline: false,
      jsonObj: '',
      sendSignVisible: false,
      information: '',
      visible: false,
      hash: '',
      allMsg: ''
    }
  },
  methods: {
    changeVisible (state) {
      this.visible = state
    },
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
    confirm (status) {
      this.$emit('closeExitDialog', status)
    },
    handleClose () {
      this.$emit('closeExitDialog', 'cancel')
    }
  },
  props: {
    commonDialogExitVisible: {
      default: false,
      type: Boolean
    },
    title: {
      default: '',
      type: String
    },
    msg: {
      default: '',
      type: String
    },
    time: {
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
    address: {
      default: '',
      type: String
    }
  }
}
</script>

<style scoped lang="less">
/deep/ .el-dialog__body {
  padding: 0 !important;
}
/deep/ .el-dialog__footer {
  background: rgba(44, 54, 92, 0.03);
  border-radius: 0px 0px 2px 2px;
  height: 3.5rem;
  margin-top: 2.06rem;
}
.common-dialog {
  .content {
    text-align: center;
    color: #2c365c;
    .title {
      font-size: 1rem;
      letter-spacing: -0.28px;
      font-weight: bold;
      margin: 0.75rem 0 0.5rem 0;
    }
    .msg {
      font-size: 0.88rem;
      letter-spacing: -0.5px;
      padding: 0 5.38rem;
    }
    .time {
      font-size: 0.88rem;
      letter-spacing: -0.5px;
      padding: 0 5.38rem;
      margin-top: 0.75rem;
    }
  }
  .dialog-footer {
    button {
      width: 5rem;
      height: 2rem;
      border-radius: 2px;
      text-align: center;
      letter-spacing: -0.21px;
      font-size: 0.75rem;
    }
    button:last-child {
      margin-left: 1.5rem;
      color: #fff;
      background: #1c51dd;
    }
    button:first-child {
      background: #fafcff;
      border: 1px solid #2c365c;
      color: #2c365c;
    }
  }
}
</style>
