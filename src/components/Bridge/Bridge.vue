<template>
  <div class="bridge">
    <div class="addForm">
      <div>
        <div class="first-left">
        </div>
        <div>
          <h5>{{$t('crossChain.From')}}</h5>
          <div>
            <el-select v-model="bridgeFrom"
            :placeholder="$t('From')">
              <el-option v-for="item in chainList"
                         :key="item.key"
                         :label="item.name"
                         :value="item.key"
                         @click.native="getBridgeFrom(item)">
              </el-option>
            </el-select>
          </div>
          <!-- <h1>{{$t('⬇⬇')}}</h1> -->
          <h5>{{$t('crossChain.To')}}</h5>
          <div >
            <el-select v-model="bridgeTo"
                       :placeholder="$t('To')">
              <el-option v-for="item in chainList"
                         :key="item.key"
                         :label="item.name"
                         :value="item.key"
                         @click.native="getBridgeTo(item)">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <h5>{{$t('crossChain.Amount')}}</h5>
      <el-input v-model="ruleForm.value"></el-input>
      <h6>{{$t('crossChain.availableBalance')}}  {{manBalance | weiToNumber}}</h6>
      <h5>{{$t('crossChain.receiveAddress')}}</h5>
      <el-input v-model="bridgeAddrress" :readonly="true"></el-input>
      <h5>{{$t('crossChain.receiveTips')}} {{ruleForm.value>1000?(ruleForm.value*0.99):(ruleForm.value-10)}} MAN on {{bridgeTo.toLocaleUpperCase()}}</h5>
      <div style="display: flex; justify-content: center;">
        <div style="text-align:left;width:100% ">
          <p>{{$t('crossChain.declare')}}</p>
          <p>{{$t('crossChain.declare1')}}</p>
          <p>{{$t('crossChain.declare2')}}</p>
          <p>{{$t('crossChain.declare3')}}</p>
        </div>
      </div>
      <hr>
      <button class="common-button"
              @click="startBridge">{{$t('crossChain.start')}}</button>
    </div>
     <transfer-dialog :transferDialogVisible="transferDialogVisible"
                     :width="'800px'"
                     :status="$t('transfer.success')"
                     :msg="$t('transfer.transferComplete')"
                     :amount="ruleForm.value"
                     :from="address"
                     :to="ruleForm.to"
                     :addressList="ruleForm.addressList"
                     :hash="hash"
                     :sendCoin="sendCoin"
                     @transferDialogVisible="changeTransferDialogVisible"></transfer-dialog>
    <confirm-transfer-dialog :confirmVisible="confirmTransfer"
                             :width="'800px'"
                             :status="$t('transfer.success')"
                             :msg="$t('transfer.confirmTransfer')"
                             :amount="ruleForm.value"
                             :from="address"
                             :to="ruleForm.to"
                             @confirmVisible="changeDialogVisible"
                             :addressList="ruleForm.addressList"
                             :sendCoin="sendCoin"
                             @confirmSend="confirmSend">
    </confirm-transfer-dialog>
    <all-dialog :visible="visible"
                @changeVisible="changeVisible"
                :width="'800px'"
                :msg="msg"
                :hash="hash"></all-dialog>
    <offline-dialog :width="'800px'"
                    :transferJson="jsonObj"
                    :confirmOffline="confirmOffline"
                    @changeConfirmOffline="changeConfirmOffline"
                    @openSendSign="openSendSign"></offline-dialog>
    <send-sign :visible="sendSignVisible"
               :width="'800px'"
               :information="information"
               @changeSendSign="changeSendSign"></send-sign>
  </div>
</template>

<script>
import WalletUtil from '@/assets/js/WalletUtil'
import SendTransfer from '@/assets/js/SendTransfer'
import { bridgeContractAddr,bscManAddr, bridgeManCoinAddress, contract,erc20Abi,bridgeAbi } from '@/assets/js/config'
import TradingFuns from '@/assets/js/TradingFuns'
import AllDialog from '@/components/TransferDialog/AllDialog'
import GreenDialog from '@/components/TransferDialog/GreenDialog'
import BigNumber from 'bignumber.js'
import OfflineDialog from '@/components/TransferDialog/TipOfflineDialog'
import sendSign from '@/components/TransferDialog/sendSignTransfer'
import transferSuccess from '@/components/TransferDialog/transferSuccess'
import TransferDialog from '@/components/TransferDialog/TransferDialog'
import confirmTransferDialog from '@/components/TransferDialog/confirmTransferDialog'
import store from 'store'
import filter from '@/assets/js/filters'
import Bus from '@/assets/js/Bus'
import Web3 from 'web3'
import Tx from 'ethereumjs-tx'
import ethers from 'ethers'

export default {
  name: 'bridge',
  data () {
    return {
      address: '',
      chainList: [{ name: this.$t('MATRIX'), key: 'matrix' }, { name: this.$t('BSC (Binance Smart Chain)'), key: 'bsc' }],
      functions: [],
      value: '',
      bridgeAmount: 0,
      bridgeAddrress: '',
      bridgeFrom: 'matrix',
      bridgeTo: 'bsc',
      transferDialogVisible: false,
      confirmTransfer: false,
      balance:'',
      hash: '',
      msg: '',
      sendCoin: 'MAN',
      visible: false,
      alertable: true,
      confirmOffline: false,
      jsonObj: '',
      sendSignVisible: false,
      information: '',
      successVisible: false,
      isDeposit: false,
      number: 0,
      depositTotal: new BigNumber(0),
      wallet: this.$store.state.wallet,
      contract: null,
      newTxData: {},
      bridgeContract:'',
      tokenContract:'',
      ruleForm: {
        addressList: [],
        value: '11',
        to: '',
        IsEntrustTx: '',
        ExtraTimeTxType: '0',
        gas: this.httpProvider.fromWei(210000 * 18000000000),
        token: 'MAN',
        gasLimit: 210000,
        gasPrice: 18000000000,
        extra_to: [[0, 0, []]],
        data: '',
        nonce: ''
      },
       ruleFormBSC: {
        amount: '',
        address: '',
        gasPrice: '',
        gasLimit: '150000'
      },
      manBalance:'',
    }
  },
  methods: {
    changeDialogVisible (val) {
      this.confirmTransfer = val
    },
    changeSendSign (data) {
      this.sendSignVisible = false
      if (data != null && data !== false) {
        this.hash = data.hash
        this.successVisible = true
      }
    },
    getBridgeFrom (item) {
      if(item.key==='bsc'){
        this.bridgeAddrress = WalletUtil.getEthAddress(this.wallet.address)
        this.bridgeTo='matrix'
      }else{
         this.bridgeAddrress = this.wallet.address
         this.bridgeTo='bsc'
      }
     },
    getBridgeTo (item) {
      if(item.key==='bsc'){
        this.bridgeAddrress = WalletUtil.getEthAddress(this.wallet.address)
        this.bridgeFrom='matrix'
      }else{
         this.bridgeAddrress = this.wallet.address
         this.bridgeFrom='bsc'
      }
     },
    changeTransferDialogVisible (val) {
      this.transferDialogVisible = val
      this.ruleForm = {
        addressList: [],
        value: '',
        to: 'MAN.',
        IsEntrustTx: '',
        ExtraTimeTxType: '0',
        gas: this.httpProvider.fromWei(210000 * 18000000000),
        token: 'MAN',
        gasLimit: 210000,
        gasPrice: 18000000000,
        extra_to: [[0, 0, []]],
        data: '',
        nonce: ''
      }
      this.ruleForm.token = 'MAN'
      this.coinType = ''
      this.moreType = ''
      this.sendCoin = 'MAN'
    },
    changeSuccess () {
      this.successVisible = false
    },
    startBridge(){
      if (Number(this.ruleForm.value) < 11){
        this.$message.error("Unavailable Amount")
        return
      }
      if (this.bridgeFrom === 'bsc'){
        this.$message.success("BSC to MATRIX coming soon ...")
        return
        this.submitBSC()
      } else {
        this.generateTx()
      }
    },
    confirmSend (state) {
      try {
        if (state === 'ok') {
          let hash = this.httpProvider.man.sendRawTransaction(this.newTxData)
          let recordArray = store.get(this.address)
          if ((typeof (recordArray) === 'string')) {
            recordArray = JSON.parse(recordArray)
          }
          if (recordArray == null) {
            recordArray = []
          }
          recordArray.push({ hash: hash, newTxData: { commitTime: this.newTxData.commitTime, txType: this.newTxData.txType } })
          store.set(this.address, recordArray)
          // store.set(this.address, recordArray)
          this.transferDialogVisible = true
          this.hash = hash
          this.confirmTransfer = false
        } else {
          this.confirmTransfer = false
        }
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    openSendSign () {
      this.sendSignVisible = true
    },
    changeConfirmOffline (data) {
      this.confirmOffline = false
      if (data !== false) {
        this.sendSignVisible = true
        this.information = data
      }
    },
    changeAlertable () {
      this.$router.push({ path: '/my-wallet/openWallet/myAssets' })
    },
    changeVisible (state) {
      this.visible = state
      this.value = ''
    },
    getNonce () {
      this.ethProvider.eth.getTransactionCount(WalletUtil.getEthAddress(this.wallet.address)).then(result => {
        this.nonce = result
      })
    },
    initContract () {
      console.log('init...')
    },
    generateTx () {
          try {
            // ruleForm.value
            this.ruleForm.to = bridgeManCoinAddress
            this.ruleForm.nonce = this.httpProvider.man.getTransactionCount(this.address)
            this.ruleForm.nonce = WalletUtil.numToHex(this.ruleForm.nonce)
            
            if (new BigNumber(this.ruleForm.gas).comparedTo(this.httpProvider.fromWei(210000 * 18000000000)) === 1) {
              let gasNumber = new BigNumber(this.httpProvider.toWei(this.ruleForm.gas))
              this.ruleForm.gasLimit = parseInt(gasNumber.div(new BigNumber(18000000000)).toString(10)) + 1
            }
            if (this.ruleForm.value < 0) {
              this.$message.error(this.$t('errorMsgs.valueError'))
              return
            }
            console.log("eee")
            this.ruleForm.extra_to = [[parseInt(this.ruleForm.ExtraTimeTxType), 0, []]]
            
            let jsonObj = TradingFuns.getTxData(this.ruleForm)
            
            if (this.$store.state.wallet != null) {
              if (this.$store.state.wallet.privateKey) {
                let tx = WalletUtil.createTx(jsonObj)
                let privateKey = this.$store.state.wallet.privateKey
                privateKey = Buffer.from(privateKey.indexOf('0x') > -1 ? privateKey.substring(2, privateKey.length) : privateKey, 'hex')
                tx.sign(privateKey)
                let serializedTx = tx.serialize()
                this.newTxData = SendTransfer.getTxParams(serializedTx)
                console.log(this.newTxData)
                this.confirmTransfer = true
              } else {
                this.confirmOffline = true
                this.jsonObj = JSON.stringify(jsonObj)
              }
            } else {
              this.confirmOffline = true
              this.jsonObj = JSON.stringify(jsonObj)
            }
          } catch (e) {
            this.$message.error(e.message)
          }
        
    },
    submitBSC () {
          let loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          let rawTx = {
            nonce: this.ethProvider.utils.toHex(this.nonce),
            gasPrice: this.ethProvider.utils.toHex(this.ruleFormBSC.gasPrice),
            gasLimit: this.ethProvider.utils.toHex(this.ruleFormBSC.gasLimit),
            to: bridgeContract,
            // to: '0xe25bCec5D3801cE3a794079BF94adF1B8cCD802D',
            value: '0x0',
            data: this.contract.methods.move(bscManToken, ('0x' + WalletUtil.toWeiHex(new BigNumber(this.ruleForm.amount)))).encodeABI(),
            chainId: ethChainId
          }
          let tx = new Tx(rawTx)
          let privateKey = this.wallet.privateKey
          privateKey = Buffer.from(privateKey.indexOf('0x') > -1 ? privateKey.substring(2, privateKey.length) : privateKey, 'hex')
          tx.sign(privateKey)
          let serializedTx = tx.serialize()
          this.ethProvider.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, hash) => {
            if (!err) {
              loading.close()
              this.getNonce()
              this.$message.success(hash)
              this.ruleForm = {
                amount: '',
                gasLimit: '150000'
              }
            } else {
              loading.close()
              this.$message.error(JSON.parse(err.message.split('Node error:')[1]).message)
            }
          })

    },
    getTxData () {
      try {
        console.log(this.bridgeFrom)
       
        this.bridgeAddrress = this.bridgeAddrress.trim()
        if (this.bridgeFrom === 'bsc') {
          // var utils = ethers.utils
          // 创建web3对象
          var web3 = new Web3()
          // 连接到测试节点
          web3.setProvider(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/473f108e531843db9529fd549e61ad6e'))
          // console.log(await web3.eth.getBlockNumber())
          console.log(web3)

          var contractAddress = '0xAC8DdE25533ac41581a81758E9D43B4B61606039'
          var erccontract = new web3.eth.Contract(JSON.parse(erc20Abi), contractAddress)
          console.log(erccontract)
          var ethaddress = '0x387B378b8F2A6b3cFC9D7e963D860e764b99340e'
          let privateKey = this.$store.state.wallet.privateKey
          var count = web3.eth.getTransactionCount('0x698022a4b9245F58B8da4161Ab6c7A4226DC9D11')
          erccontract.methods.balanceOf('0x387B378b8F2A6b3cFC9D7e963D860e764b99340e')
          console.log(count)
          // var contractInstance = erccontract.at(contractAddress)
          // console.log("ddd",contractInstance)
          var rawTx = {
            nonce: web3.toHex(count),
            gasPrice: web3.toHex(5000000000),
            gasLimit: web3.toHex(210000),
            to: ethaddress,
            // value: web3.toHex(20000000000000000), //可以省略
            data: ''// 就是之前生成的'0x'+bytecode
          }
          var tx = new Tx(rawTx)
          tx.sign(privateKey)

          var serializedTx = tx.serialize()

          var hash = web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'))
          console.log(hash)

          // console.log(contractInstance)
          // console.log(contractInstance.methods.balanceOf('0x7d351ea9e385b00d741033099166a877132216c6'))
        }
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    getManTokenBalance () {
      this.tokenContract.methods.balanceOf(WalletUtil.getEthAddress(this.wallet.address)).call().then(balance => {
        console.log('token balance' + balance)
        // this.manBalance = balance
      })
    },
    getEthBalance () {
      this.ethProvider.eth.getBalance(WalletUtil.getEthAddress(this.wallet.address)).then(result => {
        console.log('eth balance' + result)
        this.ethBalance = result
      })
    },
    getTokenNonce () {
      this.ethProvider.eth.getTransactionCount(WalletUtil.getEthAddress(this.wallet.address)).then(result => {
        console.log(result)
        this.nonce = result
      })
    },
    getBalance (address) {
      try {
        return this.httpProvider.man.getBalance(address)[0].balance
      } catch (e) {
        this.$message.error(e.message)
        this.$router.push({ path: '/my-wallet/myWalletFirst' })
        this.$store.commit('OFFLINE', null)
        this.$store.commit('UPDATE_WALLET', null)
      }
    }
  },
  watch: {
  },
  mounted () {
    // 获取MANCOIN余额
    this.manBalance = this.getBalance(this.wallet.address)

    this.ruleForm.to = this.wallet.address
    this.bridgeAddrress = WalletUtil.getEthAddress(this.wallet.address)
    this.ethProvider.eth.getGasPrice().then(result => {
      console.log(result)
      this.ruleFormBSC.gasPrice = result
    })

    let abiArray = JSON.parse(erc20Abi)
    let bridgeAbiArray = JSON.parse(bridgeAbi)
    // let contractAddress = bscManToken
    // let contractAddress = '0xe25bCec5D3801cE3a794079BF94adF1B8cCD802D'
    this.bridgeContract = new this.ethProvider.eth.Contract(bridgeAbiArray, bridgeContractAddr)
    this.tokenContract = new this.ethProvider.eth.Contract(abiArray, bscManAddr)

    try {
      this.getManTokenBalance()
      this.getEthBalance()
      this.getTokenNonce()
    } catch (e) {
      console.log(e)
    }
    // let self = this
    if (this.$store.state.offline != null) {
      this.address = this.$store.state.offline
    } else {
      this.address = this.$store.getters.wallet.address
    }
    this.initContract()
  },
  components: {
    TransferDialog,
    confirmTransferDialog,
    transferSuccess,
    AllDialog,
    GreenDialog,
    OfflineDialog,
    sendSign
  }
}
</script>
<style scoped lang="less">
.bridge {
  .first-left {
    text-align: left;
  }
  text-align: center;
  padding: 1.5rem 0 2.5rem;
  /deep/.el-input {
    width: 26.5rem;
  }
  .hint-error {
    font-size: 0.875rem;
    color: #ed3c1c;
    letter-spacing: 0.13px;
    cursor: pointer;
  }
  text-align: center;
  padding-bottom: 2.5rem;
  /deep/.el-input {
    width: 26.5rem;
    margin-bottom: 0rem;
  }
  p {
    font-size: 0.875rem;
    color: #9298ae;
    letter-spacing: 0.13px;
    font-weight: 400;
    margin-bottom: 0;
  }
  .h1-dis {
    margin: 2rem 0 1.5rem;
  }
  h5 {
    font-size: 0.875rem;
    color: #2c365c;
    letter-spacing: 0.13px;
    font-weight: bold;
    display: flex;
    margin-left: 260px;
    margin-bottom: 0.5rem;
  }
  h6 {
    font-size: 0.875rem;
    color: #2c365c;
    letter-spacing: 0.13px;
    display: flex;
    margin-left: 260px;
    margin-bottom: 0.5rem;
    margin-top: 0.1rem;
  }
  .h4-delDis {
    margin-bottom: 0;
    margin-left: 129px;
  }
  .h4-botDis {
    margin-bottom: 0;
  }
  hr {
    background-color: #d5d7de;
    margin-top: 1rem;
    margin-bottom: 1.5rem;
    border: none;
    height: 1px;
  }
  .flex-style {
    margin: 1.5rem 0;
    display: flex;
    padding-left: 260px;
    .title {
      font-size: 0.875rem;
      color: #2c365c;
      letter-spacing: 0.13px;
      font-weight: bold;
      margin-right: 5rem;
    }
    /deep/.el-checkbox {
      margin-right: 0.5rem;
    }
    .check-font {
      font-size: 0.875rem;
    }
  }
  .back-tittle {
    position: relative;
    left: 446px;
    top: -21px;
    cursor: pointer;
    color: #1c51dd;
    font-size: 0.88rem;
    letter-spacing: 0.13px;
  }
}
</style>
