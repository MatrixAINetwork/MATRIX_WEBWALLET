import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/pages/Layout/Layout'
import AIApplication from '@/pages/AIApplication/AIApplication'
import Contract from '@/pages/Contract/Contract'
import GreenMining from '@/pages/GreenMining/GreenMining'
import CrossChain from '@/pages/CrossChain/CrossChain'
import Bridge from '@/components/Bridge/Bridge'

import MiningTransactionOverview from '@/components/MiningTransactionOverview/MiningTransactionOverview'
import HistoricalIncome from '@/components/HistoricalIncome/HistoricalIncome'
import MortgageHistory from '@/components/MortgageHistory/MortgageHistory'
import MyWallet from '@/pages/MyWallet/MyWallet'
import OfflineTransfer from '@/pages/OfflineTransfer/OfflineTransfer'
import OfflineTransferFirst from '@/components/OfflineTransferFirst/OfflineTransferFirst'
import OfflineTransferSecond from '@/components/OfflineTransferSecond/OfflineTransferSecond'
import OfflineTransferThird from '@/components/OfflineTransferThird/OfflineTransferThird'
import OfflineTransferFourth from '@/components/OfflineTransferFourth/OfflineTransferFourth'
import OpenWallet from '@/pages/OpenWallet/OpenWallet'
import CreateWallet from '@/pages/CreateWallet/CreateWallet'
import CreateWalletSecond from '@/pages/CreateWallet/CreateWalletSecond'
import SetGreetings from '@/pages/SetGreetings/SetGreetings'
import QueryWallet from '@/pages/QueryWallet/QueryWallet'
import MyWalletFirst from '@/pages/MyWallet/MyWalletFirst'
import MyAssets from '@/components/MyAssets/MyAssets'
import NFTManage from '@/components/NFTManage/NFTManage'
import NFTTransfer from '@/components/NFTManage/NFTTransfer'
import Token from '@/components/Token/Token'

import NFToken from '@/components/Token/NFToken'
import Record from '@/components/Record/Record'
import OnlineTransfer from '@/pages/OnlineTransfer/OnlineTransfer'
import store from '@/store'
import SetUp from '@/pages/SetUp/SetUp'
import Associate from '@/components/Associate/Associate'
import AddAssociate from '@/components/Associate/AddAssociate'
import Conversion from '@/components/Conversion/Conversion'
import PrivateKey from '@/components/PrivateKey/PrivateKey'
import CopyKeyStore from '@/components/CopyKeyStore/CopyKeyStore'
import Medical from '@/components/Medical/Medical'
import DistributedStorage2 from '@/components/DistributedStorage/DistributedStorage2'
import CampaignNode from '@/components/CampaignNode/CampaignNode'
import StartNode from '@/components/StartNode/StartNode'
import SecondKey from '@/components/SecondKey/SecondKey'
import CancelSecondKey from '@/components/SecondKey/CancelSecondKey'
import EntrustRecord from '@/components/EntrustRecord/EntrustRecord'
import CancelEntrust from '@/components/CancelEntrust/CancelEntrust'
import AIRecord from '@/pages/AIApplication/AIRecord'
import CreateCoin from '@/pages/CreateCoin/CreateCoin'
import CreateCoinSecond from '@/pages/CreateCoin/CreateCoinSecond'
import BlackList from '@/components/BlackList/BlackList'
import Refund from '@/components/Refund/Refund'
import Undo from '@/components/Undo/Undo'
import SendOffline from '@/pages/SendOffline/SendOffline'
import OfflineUnlock from '@/pages/SendOffline/OfflineUnlock'
import SendSignTransfer from '@/pages/SendOffline/SendSignTransfer'
import SendTransferData from '@/pages/SendOffline/SendTransferData'
import DigAccount from '@/components/DigAccount/DigAccount'
import CurrentMortgage from '@/components/CurrentMortgage/CurrentMortgage'
import RegularDetail from '@/components/RegularDetail/RegularDetail'
import RegularMortgage from '@/components/RegularMortgage/RegularMortgage'
import RegularWithdrawals from '@/components/RegularWithdrawals/RegularWithdrawals'
import CurrentWithdrawals from '@/components/CurrentWithdrawals/CurrentWithdrawals'
import CurrentRefund from '@/components/CurrentRefund/CurrentRefund'
import JointMining from '@/pages/JointMining/JointMining'
import JointMiningfirst from '@/pages/JointMining/JointMiningfirst'
import CreateJoin from '@/components/CreateJoin/CreateJoin'
import JointDetail from '@/components/JointDetail/JointDetail'
import ParticipantsDetail from '@/components/ParticipantsDetail/ParticipantsDetail'
import JoinRegular from '@/components/JoinRegular/JoinRegular'
import JoinCurrent from '@/components/JoinCurrent/JoinCurrent'
import JointAdd from '@/components/JointAdd/JointAdd'
import SetSignAccount from '@/components/SetSignAccount/SetSignAccount'

Vue.use(Router)

let router = new Router({
  routes: [{
    path: '/',
    name: 'layout',
    component: Layout,
    redirect: '/my-wallet/myWalletFirst',
    children: [{
      path: '/my-wallet',
      name: 'MyWallet',
      component: MyWallet,
      redirect: '/my-wallet/myWalletFirst',
      children: [{
        path: 'openWallet',
        name: 'OpenWallet',
        component: OpenWallet,
        children: [{
          path: 'myAssets',
          name: 'MyAssets',
          component: MyAssets
        }, {
          path: 'nftManage',
          name: 'NFTManage',
          component: NFTManage
        }, {
          path: 'nftTransfer',
          name: 'NFTTransfer',
          component: NFTTransfer
        }, {
          path: 'token',
          name: 'Token',
          component: Token
        }, {
          path: 'nftoken',
          name: 'NFToken',
          component: NFToken
        }, {
          path: 'record',
          name: 'Record',
          component: Record
        }, {
          path: 'onlineTransfer',
          name: 'OnlineTransfer',
          component: OnlineTransfer
        }, {
          path: 'createCoin',
          name: 'CreateCoin',
          component: CreateCoin
        }, {
          path: 'createCoinSecond',
          name: 'CreateCoinSecond',
          component: CreateCoinSecond
        }, {
          path: 'undo',
          name: 'Undo',
          component: Undo
        }]
      }, {
        path: 'myWalletFirst',
        name: 'MyWalletFirst',
        component: MyWalletFirst
      }, {
        path: 'createWallet',
        name: 'CreateWallet',
        component: CreateWallet
      }, {
        path: 'queryWallet',
        name: 'QueryWallet',
        component: QueryWallet
      }, {
        path: 'createWalletSecond',
        name: 'CreateWalletSecond',
        component: CreateWalletSecond
      }, {
        path: 'setGreetings',
        name: 'SetGreetings',
        component: SetGreetings
      }]
    }, {
      path: '/green-mining',
      name: 'GreenMining',
      component: GreenMining,
      children: [{
        path: 'mining-transaction-overview',
        name: 'MiningTransactionOverview',
        component: MiningTransactionOverview
      }, {
        path: 'refund',
        name: 'Refund',
        component: Refund
      }, {
        path: 'digAccount',
        name: 'DigAccount',
        component: DigAccount
      }, {
        path: 'currentMortgage',
        name: 'CurrentMortgage',
        component: CurrentMortgage
      }, {
        path: 'regularDetail',
        name: 'RegularDetail',
        component: RegularDetail
      }, {
        path: 'regularMortgage',
        name: 'RegularMortgage',
        component: RegularMortgage
      }, {
        path: 'regularWithdrawals',
        name: 'RegularWithdrawals',
        component: RegularWithdrawals
      }, {
        path: 'currentWithdrawals',
        name: 'CurrentWithdrawals',
        component: CurrentWithdrawals
      }, {
        path: 'currentRefund',
        name: 'CurrentRefund',
        component: CurrentRefund
      }, {
        path: 'mortgage-history',
        name: 'MortgageHistory',
        component: MortgageHistory
      }, {
        path: 'campaignNode',
        name: 'CampaignNode',
        component: CampaignNode
      }, {
        path: 'startNode',
        name: 'StartNode',
        component: StartNode
      }, {
        path: 'secondKey',
        name: 'SecondKey',
        component: SecondKey
      }, {
        path: 'cancelSecondKey',
        name: 'CancelSecondKey',
        component: CancelSecondKey
      }, {
        path: 'entrustRecord',
        name: 'EntrustRecord',
        component: EntrustRecord
      }, {
        path: 'historical-income',
        name: 'HistoricalIncome',
        component: HistoricalIncome
      }]
    }, {
      path: '/crossChain',
      name: 'CrossChain',
      component: CrossChain,
      children: [{
        path: 'bridge',
        name: 'Bridge',
        component: Bridge
      }]
    }, {
      path: '/offline-transfer',
      name: 'OfflineTransfer',
      component: OfflineTransfer,
      children: [{
        path: 'offline-transfer-first',
        name: 'OfflineTransferFirst',
        component: OfflineTransferFirst
      }, {
        path: 'offline-transfer-second',
        name: 'OfflineTransferSecond',
        component: OfflineTransferSecond
      }, {
        path: 'offline-transfer-third',
        name: 'OfflineTransferThird',
        component: OfflineTransferThird
      }, {
        path: 'offline-transfer-fourth',
        name: 'OfflineTransferFourth',
        component: OfflineTransferFourth
      }]
    }, {
      path: '/ai-application',
      name: 'AIApplication',
      component: AIApplication,
      children: [{
        path: 'medical',
        name: 'Medical',
        component: Medical
      }, {
        path: 'distributedStorage',
        name: 'DistributedStorage',
        component: DistributedStorage2
      }, {
        path: 'aiRecord',
        name: 'AIRecord',
        component: AIRecord
      }]
    }, {
      path: '/contract',
      name: 'Contract',
      component: Contract
    }, {
      path: '/setUp',
      name: 'SetUp',
      component: SetUp,
      children: [{
        path: 'associate',
        name: 'associate',
        component: Associate,
        redirect: '/setUp/associate/addAssociate',
        children: [{
          path: 'addAssociate',
          name: 'AddAssociate',
          component: AddAssociate
        }, {
          path: 'cancelEntrust',
          name: 'CancelEntrust',
          component: CancelEntrust
        }]
      }, {
        path: 'conversion',
        name: 'Conversion',
        component: Conversion
      }, {
        path: 'privateKey',
        name: 'PrivateKey',
        component: PrivateKey
      }, {
        path: 'copyKeyStore',
        name: 'CopyKeyStore',
        component: CopyKeyStore
      }, {
        path: 'blackList',
        name: 'BlackList',
        component: BlackList
      }]
    }, {
      path: '/sendOffline',
      name: 'SendOffline',
      component: SendOffline,
      children: [{
        path: 'offlineUnlock',
        name: 'OfflineUnlock',
        component: OfflineUnlock
      }, {
        path: 'sendSignTransfer',
        name: 'SendSignTransfer',
        component: SendSignTransfer
      }, {
        path: 'sendTransferData',
        name: 'SendTransferData',
        component: SendTransferData
      }]
    }, {
      path: '/jointMining',
      name: 'JointMining',
      component: JointMining,
      children: [{
        path: 'jointMiningfirst',
        name: 'JointMiningfirst',
        component: JointMiningfirst
      },
      {
        path: 'createJoin',
        name: 'CreateJoin',
        component: CreateJoin
      },
      {
        path: 'jointDetail',
        name: 'JointDetail',
        component: JointDetail
      },
      {
        path: 'participantsDetail',
        name: 'ParticipantsDetail',
        component: ParticipantsDetail
      }, {
        path: 'joinCurrent',
        name: 'JoinCurrent',
        component: JoinCurrent
      }, {
        path: 'joinRegular',
        name: 'JoinRegular',
        component: JoinRegular
      }, {
        path: 'jointAdd',
        name: 'JointAdd',
        component: JointAdd
      }, {
        path: 'setSignAccount',
        name: 'SetSignAccount',
        component: SetSignAccount
      }
      ]
    }]
  }]
})

// 判断是否解锁钱包
router.beforeEach((to, from, next) => {
  store.commit('UPDATE_HISTORYURL', to.path)
  if ((store.state.offline === null && store.state.wallet === null && to.path.indexOf('my-wallet') < 0) && to.path.indexOf('offline-transfer') < 0 && to.path.indexOf('conversion') < 0 && to.path.indexOf('sendOffline') < 0) {
    // location.href = location.href.split('#')[0]
    // console.log(this.$router)
    next({
      path: '/my-wallet/myWalletFirst'
    })
  } else {
    next()
  }
})

export default router
