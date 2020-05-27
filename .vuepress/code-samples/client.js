import CodeSamples from './components/codeSamples'
import Vuex from 'vuex'

export default function (ctx) {
  const { Vue } = ctx
  Vue.use(Vuex)

  const store = new Vuex.Store({
    state: {
      count: 0,
    },
    mutations: {
      increment(state) {
        state.count++
      },
    },
  })
  Vue.component('code-samples', CodeSamples)
  Vue.mixin({ store: store })
}
