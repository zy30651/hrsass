// 员工的路由规则
import Layout from '@/layout'

export default {
    path: '/permission',
    component: Layout,
    children: [{
        path: '',
        component: () =>
            import ('@/views/permission'),
        meta: {
            title: '权限设置',
            icon: 'lock'
        }
    }]
}