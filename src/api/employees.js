import request from '@/utils/request'
// 员工简单列表，只有id 名称
export function getEmployeesSimple() {
    return request({
        url: '/sys/user/simple'
    })
}
// 获取员工综合列表
export function getEmployeeList(params) {
    return request({
        url: '/sys/user',
        params
    })
}

export function delEmpolyee(id) {
    return request({
        url: `/sys/user/${id}`,
        method: 'delete'
    })
}

export function AddEmployee(data) {
    return request({
        url: '/sys/user',
        method: 'post',
        data
    })
}

export function importEmployee(data) {
    return request({
        url: '/sys/user/batch',
        method: 'post',
        data
    })
}

export function saveUserDetailById(data) {
    return request({
        url: `/sys/user/${data.id}`,
        method: 'put',
        data
    })
}

// 获取员工综合列表
export function getPersonalDetail(id) {
    return request({
        url: `/employees/${id}/personalInfo`
    })
}
export function updatePersonal(data) {
    return request({
        url: `/employees/${data.userId}/personalInfo`,
        method: 'put',
        data
    })
}
/** **
 * 获取用户的岗位信息
 *
 * ****/
export function getJobDetail(id) {
    return request({
        url: `/employees/${id}/jobs`
    })
}

/**
 * 保存岗位信息
 * ****/
export function updateJob(data) {
    return request({
        url: `/employees/${data.userId}/jobs`,
        method: 'put',
        data
    })
}
// 给用户分配角色
export function assignRoles(data) {
    return request({
        url: '/sys/user/assignRoles',
        data,
        method: 'put'
    })
}