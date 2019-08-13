<template>
  <div class="footer flex">
    <div>2018 ©MATRIX</div>
    <div class="lang flex">
      <img src="../../assets/images/lang.png">
      <el-dropdown trigger="click" @command="changeLang">
      <span class="el-dropdown-link">
        {{lang === 'CN' ? $t('lang.cn') : $t('lang.en')}}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="CN" :class="{'lang-active' : lang === 'CN'}">{{$t('lang.cn')}}</el-dropdown-item>
          <el-dropdown-item command="EN" :class="{'lang-active' : lang === 'EN'}">{{$t('lang.en')}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import Bus from '@/assets/js/Bus'
import store from 'store'
export default {
  name: 'Footer',
  data () {
    return {
      lang: this.$i18n.locale
    }
  },
  methods: {
    changeLang (lang) {
      if (lang !== this.lang) {
        Bus.$emit('changeLang', lang)
        store.set('lang', lang)
        this.lang = lang
        this.$i18n.locale = lang
      }
    }
  }
}
</script>

<style scoped lang="less">
  .footer {
    width: 65rem;
    margin: auto;
    justify-content: space-between;
    .el-dropdown {
      cursor: pointer;
    }
    .lang {
      align-items: center;
      img {
        margin-right: 0.63rem;
        width: 1rem;
      }
    }
    div {
      opacity: 0.8;
      font-size: 0.88rem;
      color: #ffffff;
      letter-spacing: 0.13px;
    }
  }
</style>
