import Man from 'aiman'

class HttpProvider {
  constructor (url) {
    if (typeof this.httpProvider !== 'undefined') {
      this.httpProvider = new Man(this.httpProvider.currentProvider)
    } else {
      this.httpProvider = new Man(new Man.providers.HttpProvider(url))
    }
    return this.httpProvider
  }
}
export default HttpProvider
