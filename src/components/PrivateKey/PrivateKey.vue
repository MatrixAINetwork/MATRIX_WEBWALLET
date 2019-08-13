<template>
  <div class="privateKey">
    <el-card class="card-width">
      <h1>{{$t('privateKey.KeyCopy')}}</h1>
      <h4>{{$t('privateKey.keyHint')}}</h4>
      <div class="pass_input">
        <input class="storeInput"
               v-model="privateKey"
               readonly>
        <div class="copy_btn"
             v-clipboard="privateKey"
             @success="copySuccess"
             @error="copyError">
          {{$t('privateKey.copy')}}
        </div>
      </div>
      <button class="common-button button-top">
        {{$t('privateKey.custody')}}
      </button>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'privateKey',
  data () {
    return {
      privateKey: ''
    }
  },
  methods: {
    copySuccess () {
      this.$message.success(this.$t('myWallet.copySuccess'))
    },
    copyError () {
      this.$message.error(this.$t('myWallet.copyFile'))
    }
  },
  mounted () {
    this.privateKey = this.$store.state.wallet.privateKey.substring(2)
  }
}
</script>

<style scoped lang="less">
.privateKey {
  .card-width{
    margin: auto;
  }
  /deep/.el-card__body {
    padding: 2rem 0 2.5rem;
  }
  .pass_input {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 2.5rem;
    .storeInput {
      width: 23.125rem;
      height: 2.5rem;
      padding: 0;
      border: 1px solid #d5d7de;
    }
    .copy_btn {
      background: #f2f4f8;
      width: 3.3125rem;
      height: 2.5rem;
      line-height: 2.5rem;
      border: 1px solid #d5d7de;
      border-radius: 2px;
      border-left: none;
      font-size: 0.875rem;
      border-left: none;
      cursor: pointer;
    }
  }
  .button-top {
    margin-top: 2rem;
  }
}
</style>
