<template>
  <div class="medical align-center">
    <div class="title">
      <div class="title-1" v-if="type==22">{{$t('medical.tittle1')}}</div>
      <div class="title-1" v-if="type==22">{{$t('medical.tittle2')}}</div>
      <div class="title-1" v-if="type==21">{{$t('medical.pose1')}}</div>
      <div class="title-1" v-if="type==21">{{$t('medical.pose2')}}</div>
      <div class="title-1" v-if="type==20">{{$t('medical.obj')}}</div>
      <div class="title-2" v-if="type!=22">{{$t('medical.pose3')}}</div>
    </div>
    <div class="content">
      <div class="pic">
        <img v-if="type==22"
             src="../../assets/images/medical.jpg">
        <img v-if="type==21"
             src="../../assets/images/pos.jpg">
        <img v-if="type==20"
             src="../../assets/images/obj.png">
      </div>
      <div class="info">{{$t('medical.example')}}</div>
    </div>
    <div class="footer">
      <button class="common-button"
              @click="start">{{$t('medical.start_experience')}}</button>
      <div class="footer-info" v-if="type==22">{{$t('medical.future')}}</div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Medical',
  methods: {
    start () {
      this.$emit('uploadAi', true)
    }
  },
  props: {
    type: {
      default: 22,
      type: Number
    }
  }

}
</script>

<style scoped lang="less">
.medical {
  .title {
    font-size: 0.88rem;
    color: #2c365c;
    letter-spacing: 0.13px;
    text-align: center;
    margin: 2rem 0;
    .title-2{
      margin-top: 2rem;
    }
  }
  .content {
    border-bottom: 1px #d5d7de solid;
    .pic {
      background: #f2f4f8;
      width: 22.5rem;
      height: 17.5rem;
      margin: auto;
      img {
        width: 21.25rem;
        height: 16.25rem;
        margin-top: 0.63rem;
      }
    }
    .info {
      font-size: 0.88rem;
      color: #9298ae;
      letter-spacing: 0.13px;
      margin: 0.5rem 0 2rem 0;
    }
  }
  .footer {
    .common-button {
      margin: 2rem 0 1.5rem 0;
    }
    &-info {
      font-size: 0.88rem;
      color: #949db3;
      letter-spacing: 0.13px;
      margin-bottom: 3rem;
    }
  }
}
</style>
