import { ipfsHostWebPort } from '@/assets/js/config'
const ipfsAPI = require('ipfs-api')
class IpfsProvider {
  constructor (url, port, protocol) {
    this.ipfs = ipfsAPI(url, port, { protocol: protocol })
    this.ipfs.swarm.peers(function (err, res) {
      if (err) {
        console.error(err)
      } else {
        let numPeers = res.length
        console.log('IPFS - connected to ' + numPeers + ' peers')
      }
    })
    this.ipfs.address = 'https://' + ipfsHostWebPort + '/ipfs/'
    return this.ipfs
  }
}
export default IpfsProvider
