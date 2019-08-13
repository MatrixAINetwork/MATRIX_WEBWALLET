<template>
  <div>
    <div class="distributedStorage2">
      <div class="sizeStyle">
        {{$t('offline.upload')}}
      </div>
      <div class="sizeStyle2">
        <div class="upload_pic"
             id="imgContent">
        </div>
        <input type="file"
               class="input-file"
               ref="file"
               @change="changeFile($event)" />
        <div class="offline_progress">
          <div class="offline_progress_success"
               :style="{width:uploadProgress+'%'}"></div>
        </div>
        <div class="offline_progress_num">
          {{uploadProgress}}%
        </div>
        <el-button size="small"
                   type="primary"
                   @click="upload">{{$t('offline.clickUpload')}}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import ManUtils from '@/assets/js/ManUtils'
// import WalletUtil from '@/assets/js/WalletUtil'
// import TradingFuns from '@/assets/js/TradingFuns'
export default {
  data () {
    return {
      type: '',
      uploadProgress: 0
    }
  },
  methods: {
    changeFile () {
      let file = this.$refs.file.files
      const fileUpload = []
      if (file.length <= 0) {
        return
      }
      for (let i = 0, length = file.length; i < length; i++) {
        var uploadContent = ManUtils.fileReaderStream(file[i], {
          chunkSize: 32 * 1024 * 1024
        })
        fileUpload.push({
          path: '',
          content: uploadContent
        })
      }
      let self = this
      this.ipfsProvider.add(fileUpload, {
        wrapWithDirectory: true
      }).then((response) => {
        var imgContent = document.getElementById('imgContent')
        imgContent.innerHTML = ''
        let ele
        if (file[0].type.indexOf('video') > -1) {
          // 添加 img
          ele = document.createElement('video')
          ele.style.height = '8.5rem'
          ele.style.width = '8.5rem'
          // 设置 img 图片地址
          ele.src = self.ipfsProvider.address + response[0].path
          ele.setAttribute('width', '100%')
          ele.setAttribute('controls', true)
        } else if (file[0].type.indexOf('.zip') > -1) {
          ele = document.createElement('img')
          ele.src = self.ipfsProvider.address + response[0].path
        } else {
          // 添加 img
          ele = document.createElement('img')
          ele.style.height = '8.5rem'
          ele.style.width = '8.5rem'
          // 设置 img 图片地址
          ele.src = self.ipfsProvider.address + response[0].path
        }
        imgContent.appendChild(ele)
        try {
          let dataTempLength = document.getElementById('imgContent').innerHTML.length
          let dataTempData = document.getElementById('imgContent').innerHTML
          if (!dataTempLength > 0 || dataTempData === '') {
            this.$message.error(this.$t('errorMsgs.uploadContent'))
            return
          }
          let dataTemp = {
            'type': 20, // 附文本类型
            'length': dataTempLength, // data内容长度
            'data': dataTempData // 附文本内容
          }
          this.$emit('inputData', dataTemp)
        } catch (error) {
          this.$message.error(error.message)
        }
      })
    },
    upload () {
      this.$refs.file.click()
    }
  }
}
</script>
<style scoped lang="less">
.distributedStorage2 {
  margin-top: 2rem;
  border: 1px solid #d5d7de;
  font-size: 0.875rem;
  color: #2d4670;
  /deep/.el-button--small {
    height: 2rem;
    margin-top: 106px;
    margin-left: 2rem;
  }
  .input-file {
    display: none;
  }
  .sizeStyle {
    border-bottom: 1px solid #d5d7de;
    height: 2.5rem;
    padding-left: 1rem;
    line-height: 2.5rem;
  }
  .sizeStyle2 {
    padding: 2rem 1.18rem;
    display: flex;
    justify-content: row;
  }
  .upload_pic {
    width: 8.5rem;
    height: 8.5rem;
    border: 1px solid #d4d6de;
    background: url(../../assets/images/matrix_gray.png) #f8f8fa no-repeat 50%;
    background-size: 3.125rem 2.875rem;
  }
  .upload-demo {
    margin-top: 105px;
    margin-left: 20rem;
  }
  .offline_progress {
    overflow: hidden;
    width: 15.625rem;
    height: 0.5rem;
    margin: 7rem 0 0 1.5rem;
    background-color: #f5f5f5;
    border-radius: 10px;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  .offline_progress_num {
    margin: 6.7rem -0.375rem 0 1rem;
    font-size: 0.875rem;
    color: #353e63;
    letter-spacing: 0.13px;
  }
  .offline_progress_success {
    background-color: #5dba5a;
    float: left;
    width: 0;
    height: 100%;
    font-size: 0.9rem;
    line-height: 1.4;
    color: #fff;
    text-align: center;
  }
}
.button-center {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}
</style>
