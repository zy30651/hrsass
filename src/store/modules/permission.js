import { constantRoutes, asyncRoutes } from '@/router'
const state = {
    // 路由表；表示当前用户所拥有的所有路由的数组
    // 一开始肯定拥有静态路由的权限
    routes: [constantRoutes],
}
const mutations = {
    setRoutes(state, newRoutes) {
        // 业务不正确；当用户退出登录；换人；
        // state.routes = [...state.routes, ...newRoutes]
        state.routes = [...constantRoutes, ...newRoutes]
    },
}
const actions = {
    // 筛选权限路由
    // 第二个参数为当前用户的所拥有的菜单权限
    // menus: ["settings","permissions"]
    // asyncRoutes是所有的动态路由
    // asyncRoutes  [{path: 'setting',name: 'setting'},{}]
    filterRoutes(context, menus) {
        const routes = []
            //   筛选出 动态路由中和menus中能够对上的路由
        menus.forEach((key) => {
                // key就是标识
                // asyncRoutes 找 有没有对象中的name属性等于 key的 如果找不到就没权限 如果找到了 要筛选出来
                routes.push(...asyncRoutes.filter((item) => item.name === key)) // 得到一个数组 有可能 有元素 也有可能是空数组
            })
            // 得到的routes是所有模块中满足权限要求的路由数组
            // routes就是当前用户所拥有的 动态路由的权限
        context.commit('setRoutes', routes) // 将动态路由提交给mutations
        return routes // 这里为什么还要return  state数据 是用来 显示左侧菜单用的  return  是给路由addRoutes用的
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
}