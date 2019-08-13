<template>
  <div class="associate">
    <el-card class="card-width">
      <div class="query_assets_top">
        <span class="query_assets"
              :class="{'active' : type === 'add'}"
              @click="changeType('add')">{{$t('associate.addAssociate')}}</span>|
        <span class="transaction_records"
              @click="changeType('cannel')"
              :class="{'active' : type === 'cannel'}">{{$t('associate.cancelAssociate')}}</span>
        <hr>
      </div>
      <router-view></router-view>
    </el-card>

  </div>
</template>

<script>
export default {
  name: 'associate',
  data () {
    return {
      type: 'add'
    }
  },
  methods: {
    changeType (type) {
      this.type = type
      if (type === 'cannel') {
        this.$router.push({ path: '/setUp/associate/cancelEntrust' })
      } else {
        this.$router.push({ path: '/setUp/associate/addAssociate' })
      }
    }
  }
}
</script>
<style scoped lang="less">
.associate {
  .card-width{
    margin: auto;
  }
  /deep/.el-card__body {
    padding: 1rem 2.5rem 3rem 2.5rem;
  }
  .query_assets_top {
    text-align: left;
    .query_assets {
      font-size: 1rem;
      letter-spacing: 0.15px;
      margin-bottom: 1rem;
      margin-right: 1rem;
      cursor: pointer;
      color: #989a9c;
    }
    .transaction_records {
      color: #989a9c;
      margin-left: 1rem;
      cursor: pointer;
    }
    .active {
      color: #2c365c;
    }
  }
  hr {
    background-color: #d5d7de;
    margin-top: 1rem;
    margin-bottom: 1.5rem;
    border: none;
    height: 1px;
  }
}
</style>
