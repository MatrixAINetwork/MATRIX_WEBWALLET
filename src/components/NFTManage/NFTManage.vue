<template>
  <div class="nft-assets">
    <div class=" account-info">
       <div class="two-input">
        <div class="token_btn" style="width: 48%"
            @click="goPage('nftoken')">+ {{$t('myWallet.addNFToken')}}</div>
        <div class="token_btn" style="width: 48%"
            @click="goPage('NFTTransfer')">> {{$t('发送NFT')}}</div>
      </div>
       <hr class="bottom_hr">
      <label class="title_font">MY NFT</label>
      <!-- <label class="transfer_font"
             @click="goTransfer(balance[0].balance, 'MAN')">{{$t('myWallet.transfer')}}</label> -->
       <div class="commonTable top-spacing">
        <el-table :data="nftList" style="width: 100%">
          <el-table-column :label="$t('NAME')"
                           prop="depositeTime"
                           width="120">
            <template slot-scope="scope">
              {{scope.row.nftName }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('NFTToken')">
            <template slot-scope="scope">
              {{scope.row.nftContract}}
            </template>
          </el-table-column>
          <el-table-column :label="$t('TokenID')"
                           prop="states">
            <template slot-scope="scope">
              {{ scope.row.TokenID}}
            </template>
          </el-table-column>
          <el-table-column :label="$t('Detail')"
                           class="font-blue">
            <template slot-scope="scope">
              <!-- <el-button v-if="parseInt(new Date().getTime()/1000) > scope.row.WithDrawTime"  @click="confirm(scope.row)"
                         type="text"
                         size="small">{{$t('digAccount.withdrawals')}}</el-button> -->
              {{ scope.row.Detail}}
            </template>
          </el-table-column>
        </el-table>
        <div class="content-between">
          <el-pagination background
                         class="top_spacing"
                         layout="prev, pager, next"
                         :page-size="pageSize"
                         :current-page="pageNumber"
                         @current-change="currentChange"
                         :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import WalletUtil from '@/assets/js/WalletUtil'
import store from 'store'
export default {
  name: 'nft-assets',
  data () {
    return {
      address: '',
      balance: [],
      currency: '',
      selectedCurrency: {
        address: '',
        balance: []
      },
      matrixCoin: null,
      nftList: [
        // {
        //   nftname: '111',
        //   NFTAddress: 'ssss',
        //   TokenID: '3erwer',
        //   Detail: 'sss'
        // }, {
        //   nftname: '111',
        //   NFTAddress: 'ssss',
        //   TokenID: '3erwer',
        //   Detail: 'sss'
        // }
      ],
      pageSize: 10,
      pageNumber: 1,
      total: 0
    }
  },
  methods: {
    copySuccess () {
      this.$message.success(this.$t('myWallet.copySuccess'))
    },
    copyError () {
      this.$message.error(this.$t('myWallet.copyFile'))
    },
    getBalance (address) {
      try {
        return this.httpProvider.man.getBalance(address)
      } catch (e) {
        this.$message.error(e.message)
        this.$router.push({ path: '/my-wallet/myWalletFirst' })
        this.$store.commit('OFFLINE', null)
        this.$store.commit('UPDATE_WALLET', null)
      }
    },
    goTransfer (balance, currency) {
      this.$router.push({ name: 'OnlineTransfer', params: { balance: balance, currency: currency } })
    },
    goPage (route) {
      if (route === 'NFTTransfer' && !this.nftList) {
        this.$message.error('Please add NFT')
        return
      }
      this.$router.push({ path: '/my-wallet/openWallet/' + route })
    },
    changeCurrency () { // 选择币种查看余额
      let address = WalletUtil.getCurrencyAddress(this.address, this.currency)
      this.selectedCurrency.address = address
      this.selectedCurrency.balance = this.getBalance(address)
    },
    getNFTCoin () { // 获取NFT内容
      try {
        // this.matrixCoin = this.httpProvider.man.getMatrixCoin('latest')
        // if (this.matrixCoin != null && this.matrixCoin.length !== 0) {
        //   this.currency = this.matrixCoin[0]
        //   let address = WalletUtil.getCurrencyAddress(this.address, this.matrixCoin[0])
        //   this.selectedCurrency.address = address
        //   this.selectedCurrency.balance = this.getBalance(address)
        // }

        this.nftList = store.get('nftoken')
        console.log(this.nftList)
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    currentChange (status) {
      this.pageNumber = status
    }
  },
  mounted () {
    // if (this.$store.state.wallet != null) {
    //   this.address = this.$store.getters.wallet.address
    // } else {
    //   this.address = this.$store.state.offline
    // }
    // this.balance = this.getBalance(this.address)
    this.getNFTCoin()
  }
}
</script>
<style scoped lang="less">
.nft-assets {
  /deep/.el-card__body {
    padding: 1rem 2.5rem 3rem 2.5rem;
  }
  .query_assets_top {
    text-align: left;
  }
  .two-input {
    /deep/ .el-select {
      width: 100% !important;
    }
  }
  hr {
    background-color: #d5d7de;
    margin-top: 1rem;
    margin-bottom: 1.5rem;
    border: none;
    height: 1px;
  }
  .account-info {
    text-align: left;
    margin-top: 2rem;
    .account-header {
      .el-select {
        float: right;
      }
    }
    .title_font {
      font-size: 1.25rem;
      color: #2c365c;
      letter-spacing: 0.18px;
      margin-top: 0.5rem;
      margin-bottom: 0.25rem;
      font-weight: bold;
    }
    .transfer_font {
      font-size: 0.875rem;
      color: #1c51dd;
      margin-left: 1.5rem;
      cursor: pointer;
    }
    .money_font {
      font-size: 0.75rem;
      color: #2c365c;
      letter-spacing: 0.11px;
      margin: 1rem 0;
      text-align: left;
      label:not(:first-child) {
        margin-left: 2.63rem;
      }
    }
    .tab_info {
      width: 100%;
      margin-top: 1rem;
      border-spacing: 0px;
      .tr1_info {
        background: rgba(242, 244, 248, 0.8);
        height: 2.5rem;
        font-size: 0.88rem;
        color: #2c365c;
        letter-spacing: 0.15px;
        td:first-of-type {
          padding-left: 1rem;
          width: 64%;
          .matrix_fontSmall {
            font-size: 0.625rem;
            color: #9298ae;
            letter-spacing: 0.13px;
            line-height: 1.25rem;
            opacity: 0.5;
            margin-left: 0.31rem;
          }
        }

        td:nth-of-type(2) {
          width: 16.6%;
        }
      }

      .tr2_info {
        color: #2c365c;
        letter-spacing: 0.13px;
        height: 3rem;
        font-size: 0.75rem;
        background: rgba(242, 244, 248, 0.3);
        td:first-of-type {
          padding-left: 1rem;
          a {
            margin-left: 1.25rem;
          }
        }
        a {
          color: #1989fa;
          text-decoration: none;
        }
      }
    }
  }
  .bottom_hr {
    margin: 3rem 0;
  }
  .token_btn {
    text-align: center;
    background: #f2f4f8;
    font-size: 14px;
    letter-spacing: 0.13px;
    margin-top: 2rem;
    height: 2.625rem;
    line-height: 2.625rem;
    color: #1c51dd;
    cursor: pointer;
  }
  .active {
    color: #2c365c;
  }
  .optionBtn {
    text-align: center;
    color: #1c51dd;
  }
}
</style>
