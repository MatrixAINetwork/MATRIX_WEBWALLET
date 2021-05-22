import Web3 from 'web3'

class EthProvider {
  constructor (url) {
    if (typeof this.ethProvider !== 'undefined') {
      this.ethProvider = new Web3(this.ethProvider.currentProvider)
    } else {
      this.ethProvider = new Web3(new Web3.providers.HttpProvider(url))
    }
    return this.ethProvider
  }
}
export default EthProvider
