import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon' // svg component

// register globally 注册全局icon组件
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
    // 以上代码含义为将所有的svg目录下的.svg全都引入项目