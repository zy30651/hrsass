/*
 * @Author: ZY zy30651@qq.com
 * @Date: 2022-05-22 03:14:51
 * @LastEditors: ZY zy30651@qq.com
 * @LastEditTime: 2022-05-22 16:05:08
 * @FilePath: /vue-admin-template/src/main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Vue from 'vue'
import Components from '@/components'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import * as filters from '@/filters'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import * as directives from '@/directives'

// 注册自定义指令
Object.keys(directives).forEach(key => {
    Vue.directive(key, directives[key])
})

// 注册过滤器
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
    // 如果想要中文版 element-ui，按如下方式声明
    // Vue.use(ElementUI)
Vue.use(Components)
Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    render: (h) => h(App)
})