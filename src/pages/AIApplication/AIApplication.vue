<template>
  <div class="ai-application align-center">
    <el-card class="box-card">
      <div class="header">
        <label :class="{'active' : type === 22}"
               @click="changeType(22)">{{$t('ai.medical')}}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</label>
        <label :class="{'active' : type === 21}"
               @click="changeType(21)">{{$t('ai.posture')}}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</label>
        <label :class="{'active' : type === 20}"
               @click="changeType(20)">{{$t('ai.object')}}&nbsp;&nbsp;&nbsp;</label>
      </div>
      <medical :type="type"
               v-if="type!=23&&isUpload!==true"
               @uploadAi="uploadAi"></medical>
      <ai-record v-if="type==23&&isUpload!==true"></ai-record>
      <distributed-storage :type="type" v-if="isUpload===true"></distributed-storage>
    </el-card>
  </div>
</template>

<script>
import Medical from '@/components/Medical/Medical'
import DistributedStorage from '@/components/DistributedStorage/DistributedStorage2'
import aiRecord from '@/pages/AIApplication/AIRecord'
export default {
  name: 'AIApplication',
  data () {
    return {
      type: 22,
      isUpload: false
    }
  },
  methods: {
    changeType (status) {
      this.isUpload = false
      if (status !== this.type) {
        this.type = status
      }
      if (status === 23) {
        this.$router.push({ path: '/ai-application/aiRecord' })
      }
    },
    uploadAi (data) {
      this.isUpload = data
    }
  },
  components: {
    Medical,
    DistributedStorage,
    aiRecord
  },
  mounted () {
  }
}
</script>

<style scoped lang="less">
.ai-application {
  margin: auto;
  width: 1040px;
  .box-card {
    text-align: left;
    padding: 0 3rem 2.5rem;
    .header {
      height: 4rem;
      line-height: 4rem;
      font-size: 1rem;
      color: #9aa0b6;
      letter-spacing: 0.15px;
      border-bottom: 1px #d5d7de solid;
      label {
        cursor: pointer;
      }
      .active {
        color: #2c365c;
      }
    }
  }
}
</style>
