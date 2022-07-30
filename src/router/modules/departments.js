// 员工的路由规则
import Layout from '@/layout'
export default {
    path: '/departments', // 路由地址
    name: 'departments',
    component: Layout,
    children: [{
        // 二级路由的path不写，表示二级默认路由
        // 默认/employees 不但有布局layout=>员工主页
        path: '',
        component: () =>
            import ('@/views/departments'),
        meta: {
            title: '部门',
            icon: 'tree',
        },
    }, ],
    // 当你的访问地址 是 /employees的时候 layout组件会显示 此时 你的二级路由的默认组件  也会显示
}