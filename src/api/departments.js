import request from '@/utils/request'
export function getDepartments() {
    return request({
        url: '/company/department'
    })
}
export function delDepartment(id) {
    return request({
        url: `/company/department/${id}`,
        method: 'delete'
    })
}
export function addDepartment(data) {
    return request({
        url: '/company/department',
        method: 'post',
        data
        // data: data // 名字一致，可以只写一次
    })
}
export function getDepartmentDetail(id) {
    return request({
        url: `/company/department/${id}`
    })
}
export function updateDepartment(data) {
    return request({
        url: `/company/department/${data.id}`,
        method: 'put',
        data
    })
}