<template>
  <div class="x-tip">
    <div class="title">{{$t('tip.tittle')}}</div>
    <div class="msg">{{$t('tip.tip1')}}</div>
    <div class="msg">{{$t('tip.tip2')}}</div>
    <div class="msg">{{$t('tip.tip3')}}</div>
  </div>
</template>

<script>
export default {
  name: 'Tip'
}
</script>

<style scoped lang="less">
  .x-tip {
    text-align: center;
    margin-top: 2.5rem;
    .title {
      color: #2c365c;
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 0.38rem;
    }
    .msg {
      color: #9298ae;
      font-size: 14px;
    }
  }
</style>
