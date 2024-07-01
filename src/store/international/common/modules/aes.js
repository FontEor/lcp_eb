import {randomString} from '@/utils'

const state = {
  aesKey: randomString(),
  aesIv: randomString()
}
export default {
  namespaced: true,
  state
}
