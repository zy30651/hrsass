import store from '@/store'

// 做一个混入对象
export default {
    // 混入对象是组件的选项对象
    methods: {
        // 检查权限，要么有，要么没有；key是要检查的点
        checkPermission(key) {
            // 去用户的信息里边找points中有没有key；如果有可以点；如果没有，不能点
            const { userInfo } = store.state.user
                // 判断里边有没有rules
            if (userInfo.roles && userInfo.roles.points) {
                return userInfo.roles.points.some((item) => item === key)
            }
            return false
        },
    },
}