import axios from 'axios'
import { SocksProxyAgent } from 'socks-proxy-agent'

const axiosInstance = axios.create({
  baseURL: '',
  httpsAgent: new SocksProxyAgent('socks5://tor-proxy:9050')
})

export default axiosInstance
