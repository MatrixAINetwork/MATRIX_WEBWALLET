<template>
  <div class="jointMining">
    <el-card class="box-card1">
      <div class="header">
        <h1>{{$t('jointFirst.jointMining')}}<span class="span-size">(beta)</span></h1>
        <button class="common-button"
                @click="goPage('createJoin')">{{$t('jointFirst.createJoint')}}</button>
      </div>
    </el-card>
    <el-card class="box-card2">
      <div class="tag-header">
        <div class="font-right-distance"
             @click="changeQuery('my')"
             :class="{'active' : selectQuery === 'my'}">{{$t('jointFirst.my')}}</div>|
        <div class="font-left-distance"
             @click="changeQuery('all')"
             :class="{'active' : selectQuery === 'all'}">{{$t('jointFirst.all')}}</div>
      </div>
      <hr>
      <div v-if="selectQuery==='all'">
        <div v-for="(item,index) in validatorList"
             :key="index">
          <div class="dis-flex between left-distance distance-top">
            <div>
              <div class="text-left"><span class="font-weight-style">{{$t('jointFirst.jointAccount')}}:</span> {{item.jointAccount}}</div>
              <div class="dis-flex distance-top">
                <div class="join-number"><span class="font-weight-style">{{$t('jointFirst.jointNumber')}}:</span>{{item.activeCount}}</div>
                <div><span class="font-weight-style">{{$t('jointFirst.jointTotal')}}：</span>{{item.allAmount }}MAN</div>
              </div>
            </div>
            <div class="text-right">
              <div class="font-style"
                   v-if="item.alreadyWithdraw"><span>{{$t('jointFirst.closeMining')}}</span></div>
              <div class="font-style"
                   v-else><span>{{$t('jointFirst.mining')}}</span></div>
              <a @click="jointDetail(item)">{{$t('digAccount.withdraw_detail')}}</a>
            </div>
          </div>
          <hr>
        </div>
        <el-pagination background
                       class="top_spacing"
                       layout="prev, pager, next"
                       :page-size="pageSize"
                       :current-page="pageNumber"
                       @current-change="changeAll"
                       :total="total">
        </el-pagination>
      </div>
      <div v-if="selectQuery==='my'">
        <div v-show="myJoinList.length !== 0">
          <div v-for="(item,index) in myJoinList"
               :key="index">
            <div class="dis-flex between left-distance distance-top">
              <div>
                <div class="text-left"><span class="font-weight-style">{{$t('jointFirst.jointAccount')}}:</span> {{item.jointAccount}}</div>
                <div class="dis-flex distance-top">
                  <div class="join-number"><span class="font-weight-style">{{$t('jointFirst.jointNumber')}}:</span>{{item.activeCount}}</div>
                  <div><span class="font-weight-style">{{$t('jointFirst.jointTotal')}}：</span>{{item.allAmount }}MAN</div>
                </div>
              </div>
              <div class="text-right">
                <div class="font-style"
                     v-if="item.alreadyWithdraw"><span>{{$t('jointFirst.closeMining')}}</span></div>
                <div class="font-style"
                     v-else><span>{{$t('jointFirst.mining')}}</span></div>
                <a @click="jointDetail(item)">{{$t('digAccount.withdraw_detail')}}</a>
              </div>
            </div>
            <hr>
          </div>
          <el-pagination background
                         class="top_spacing"
                         layout="prev, pager, next"
                         :page-size="pageSize"
                         :current-page="pageNumber"
                         @current-change="changeMy"
                         :total="myTotal">
          </el-pagination>
        </div>
        <div v-show="myJoinList.length === 0">
          <div class="space">
          </div>
          <label>{{$t('jointFirst.nojoin')}}</label>
          <label class="join_font"
                 @click="changeQuery('all')">{{$t('jointFirst.join')}}</label>
          <div class="space">
          </div>
          <hr>
        </div>

      </div>
    </el-card>
  </div>
</template>

<script>
import filter from '@/assets/js/filters'
import BigNumber from 'bignumber.js'
export default {
  name: 'jointMining',
  data () {
    return {
      validatorListALL: [],
      validatorList: [],
      pageSize: 10,
      pageNumber: 1,
      total: 0,
      myJoinList: [],
      myJoinListAll: [],
      selectQuery: 'all',
      myPageNumber: 1,
      myPageSize: 10,
      myTotal: 0
    }
  },
  methods: {
    changeQuery (type) {
      this.selectQuery = type
    },
    goPage (url) {
      this.$router.push({ path: '/jointMining/' + url })
    },
    jointDetail (detailObj) {
      this.$router.push({ name: 'JointDetail', params: { detailObj: detailObj } })
    },
    changeMy (status) {
      this.myPageNumber = status
      if (this.myJoinListAll >= this.myPageNumber * this.myPageSize) {
        this.myJoinList = this.myJoinListAll.slice((this.myPageNumber - 1) * 10, this.myPageNumber * this.pageSize)
      } else {
        this.myJoinList = this.myJoinListAll.slice((this.myPageNumber - 1) * 10, this.myJoinListAll.length)
      }
    },
    changeAll (status) {
      this.pageNumber = status
      if (this.validatorListALL.length >= this.pageNumber * this.pageSize) {
        this.validatorList = this.validatorListALL.slice((this.pageNumber - 1) * 10, this.pageNumber * this.pageSize)
      } else {
        this.validatorList = this.validatorListALL.slice((this.pageNumber - 1) * 10, this.validatorListALL.length)
      }
    },
    init () {
      let data = this.httpProvider.man.getValidatorGroupInfo()
      this.pageNumber = 1
      this.selectQuery = 'my'
      this.myPageNumber = 1
      let self = this
      console.log(data)
      Object.keys(data).forEach(function (key) {
        let item = data[key]
        let allAmount = new BigNumber(0)
        if (item.ValidatorMap != null) {
          item.ValidatorMap.forEach(validator => {
            allAmount = allAmount.plus(filter.weiToNumber(validator.AllAmount))
          })
          let alreadyWithdraw = false
          if (item.OwnerInfo.WithdrawAllTime !== 0) {
            alreadyWithdraw = true
          }
          if (item.OwnerInfo.Owner === self.address) {
            self.myJoinListAll.push({
              jointAccount: key,
              activeCount: item.ValidatorMap.length,
              allAmount: allAmount.toString(10),
              signAddress: item.OwnerInfo.SignAddress,
              validatorMap: item.ValidatorMap,
              createAddress: item.OwnerInfo.Owner,
              alreadyWithdraw: alreadyWithdraw,
              NodeRate: item.Reward.NodeRate,
              levelRate: [item.Reward.OwnerRate.Rate, item.Reward.LevelRate[0].Rate.Rate, item.Reward.LevelRate[1].Rate.Rate, item.Reward.LevelRate[2].Rate.Rate]
            })
          } else {
            for (let i = 0; i < item.ValidatorMap.length; i++) {
              const validator = item.ValidatorMap[i]
              if (validator.Address === self.address) {
                self.myJoinListAll.push({
                  jointAccount: key,
                  activeCount: item.ValidatorMap.length,
                  allAmount: allAmount.toString(10),
                  signAddress: item.OwnerInfo.SignAddress,
                  validatorMap: item.ValidatorMap,
                  createAddress: item.OwnerInfo.Owner,
                  alreadyWithdraw: alreadyWithdraw,
                  NodeRate: item.Reward.NodeRate,
                  levelRate: [item.Reward.OwnerRate.Rate, item.Reward.LevelRate[0].Rate.Rate, item.Reward.LevelRate[1].Rate.Rate, item.Reward.LevelRate[2].Rate.Rate]
                })
              }
            }
          }
          self.validatorListALL.push({
            jointAccount: key,
            activeCount: item.ValidatorMap.length,
            allAmount: allAmount.toString(10),
            signAddress: item.OwnerInfo.SignAddress,
            validatorMap: item.ValidatorMap,
            createAddress: item.OwnerInfo.Owner,
            alreadyWithdraw: alreadyWithdraw,
            NodeRate: item.Reward.NodeRate,
            levelRate: [item.Reward.OwnerRate.Rate, item.Reward.LevelRate[0].Rate.Rate, item.Reward.LevelRate[1].Rate.Rate, item.Reward.LevelRate[2].Rate.Rate]
          })
        }
      })
      this.myTotal = self.myJoinListAll.length
      this.total = self.validatorListALL.length
      if (self.validatorListALL.length > 10) {
        self.validatorList = self.validatorListALL.slice(0, 9)
      } else {
        self.validatorList = self.validatorListALL
      }
      if (self.myJoinListAll.length > 10) {
        self.myJoinList = self.myJoinListAll.slice(0, 9)
      } else {
        self.myJoinList = self.myJoinListAll
      }
    }
  },
  watch: {
    $route (to, from) {
      if (to.path.indexOf('jointMiningfirst') > -1) {
        this.validatorListALL = []
        this.validatorList = []
        this.myJoinList = []
        this.myJoinListAll = []
        this.init()
      }
    }
  },
  mounted () {
    if (this.$store.state.offline != null) {
      this.address = this.$store.state.offline
    } else {
      this.address = this.$store.getters.wallet.address
    }
    this.init()
  }
}
</script>

<style scoped lang="less">
.jointMining {
  margin: auto;
  width: 1040px;
  .box-card1 {
    .header {
      display: flex;
      justify-content: space-between;
      h1 {
        font-size: 2.25rem;
      }
      .common-button {
        width: 10.5rem;
      }
    }
  }
  .font-weight-style {
    font-size: 0.875rem;
    color: #2c365c;
    letter-spacing: 0.13px;
    font-weight: bold;
  }
  .join_font {
    font-size: 0.875rem;
    color: #1c51dd;
    margin-left: 1.5rem;
    cursor: pointer;
  }
  .space {
    margin-top: 3.5rem;
    margin-bottom: 3.5rem;
  }
  .font-style {
    font-size: 0.875rem;
    color: #2c365c;
    letter-spacing: 0.13px;
    margin-bottom: 1.4rem;
  }
  .join-number {
    text-align: left;
    width: 200px;
  }
  .box-card2 {
    .dis-flex {
      display: flex;
    }
    .between {
      justify-content: space-between;
    }
    .left-distance {
      padding-left: 2rem;
      padding-right: 3rem;
    }
    .distance-top {
      margin-top: 1.5rem;
    }
    .tag-header {
      display: flex;
      padding-left: 2rem;
      font-size: 1rem;
      color: #9aa0b6;
      letter-spacing: 0.15px;
      .font-right-distance {
        cursor: pointer;
        margin-right: 1rem;
      }
      .font-left-distance {
        cursor: pointer;
        margin-left: 1rem;
      }
      .active {
        color: #2c365c;
      }
    }
  }
  a {
    font-size: 0.875rem;
    color: #1c51dd;
    cursor: pointer;
  }
  .text-right {
    text-align: right;
  }
  .text-left {
    text-align: left;
  }
  .span-size {
    font-size: 1rem;
  }
}
</style>
