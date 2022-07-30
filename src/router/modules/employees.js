// 导出属于员工的路由规则
import Layout from '@/layout'
export default {
    path: '/employees',
    name: 'employees',
    component: Layout,
    children: [{
            path: '',
            component: () =>
                import ('@/views/employees'),
            meta: {
                title: '员工管理',
                icon: 'people',
            },
        },
        {
            path: 'detail/:id?',
            hidden: true,
            component: () =>
                import ('@/views/employees/detail'),
        },
        {
            path: 'print/:id?',
            hidden: true,
            meta: {
                title: '员工打印',
            },
            component: () =>
                import ('@/views/employees/print'),
        },
    ],
}