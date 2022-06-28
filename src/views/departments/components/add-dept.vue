<template>
    <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
        <el-form ref='deptForm' label-width="120px" :model="formData" :rules="rules">
            <el-form-item label='部门名称' prop="name">
                <el-input v-model='formData.name' style="width:80%" placeholdeer="1-50个字符"></el-input>
            </el-form-item>
            <el-form-item label='部门编码' prop="code">
                <el-input v-model='formData.code'  style="width:80%" placeholdeer="1-50个字符"></el-input>
            </el-form-item>
            <el-form-item label='部门负责人' prop="manager">
                <el-select v-model='formData.manager'  style="width: 80%" placeholder='请选择' @focus="getEmployeesSimple">
                    <el-option
                    v-for="item in peoples"
                    :key="item.id"
                    :label="item.username"
                    :value="item.username"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item l abel='部门介绍' prop="introduce">
                <el-input v-model='formData.introduce'  style="width:80%"  placeholdeer="1-300个字符" type="textarea" :rows="3"></el-input>
            </el-form-item>
        </el-form>
        <el-row slot="footer" type='flex' justify='center'>
            <el-col :span='6'>
                <el-button size='small' @click="btnCancel">取消</el-button>
                <el-button size='small' type="primary" @click="btnOK">确定</el-button>
            </el-col>
        </el-row>
    </el-dialog>
</template>

<script>
import {getDepartments, addDepartment, updateDepartment, getDepartmentDetail} from '@/api/departments'
import {getEmployeesSimple} from '@/api/employees'
export default {
    props: {
        showDialog: {
            type: Boolean,
            default: false
        },
        treeNode: {
            type: Object,
            default: null
        }
    },
    data() {
        const checkNameRepeat = async(rule, value, callback) => {
            // value是部门名称，要去和同级部门下的部门名称比较，有没有不同的
            const {depts} = await getDepartments()
            let isRepeat = false
            if (this.formData.id) {
                // 有id是编辑 ，数据在数据库有；但是同级情况下，名字不能和其他同级名字重复
                // 找到同级部门，但是不是自己的部门； 然后再在里边找有没有name相同的
                isRepeat = depts
                .filter(item => item.id !== this.formData.id && item.pid === this.treeNode.pid)
                .some(item => item.name === value)
            } else {
                // 新增
                isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
                // 如果isRepeat为true，表示找到了一样名字，则不能通过
                isRepeat ? callback(new Error(`同级部门下已存在${value}`)) : callback()
            }
        }
        const checkCodeRepeat = async(rule, value, callback) => {
            const {depts} = await getDepartments()
            let isRepeat = false
            if (this.formData.id) {
                // 编辑
                isRepeat = depts
                .some(item => item.id !== this.formData.id && item.code === value && value)
            } else {
                // value是部门名称，要去和同级部门下的部门名称比较，有没有不同的
                const {depts} = await getDepartments()
                isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.code === value)
                // 如果isRepeat为true，表示找到了一样名字，则不能通过
                isRepeat ? callback(new Error(`同级部门下已存在${value}`)) : callback()
            }
        }
        return {
            formData: {
                name: '',
                code: '',
                manager: '',
                introduce: ''
            },
            peoples: [],
            rules: {
                name: [{required: true, message: '部门名称不能为空', trigger: 'blur'},
                {min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur'},
                {trigger: 'blur', validator: checkNameRepeat}],
                code: [{required: true, message: '部门编码不能为空', trigger: 'blur'},
                {min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur'},
                {trigger: 'blur', validator: checkCodeRepeat}],
                manager: [{required: true, message: '部门负责人不能为空', trigger: 'blur'}],
                introduce: [{required: true, message: '部门介绍不能为空', trigger: 'blur'},
                {min: 1, max: 300, message: '部门名称要求1-300个字符', trigger: 'blur'}]
            }
        }
    },
    computed: {
        showTitle() {
           return this.formData.id ? '编辑部门' : '新增子部门'
        }
    },
    methods: {
        async getEmployeesSimple() {
            this.peoples = await getEmployeesSimple()
        },
        async getDepartDetail(id) {
            // 父组件调用子组件的方法，先设置的node数据，再调用方法；但props传值是异步的。this.treeNode.id可能为空
            this.formData = await getDepartmentDetail(id)
        },
        btnOK() {
            this.$refs.deptForm.validate(async isOK => {
                if (isOK) {
                    if (this.formData.id) {
                        // 编辑
                        await updateDepartment(this.formData)
                    } else {
                        // 新增
                        await addDepartment({...this.formData, pid: this.treeNode.id})
                    }
                    // 告诉父组件 出发一个自定义事件
                    this.$emit('addDepts')
                    // 隐藏dialog框
                    this.$emit('update:showDialog', false)
                }
            })
        },
        btnCancel() {
            // 重置数据，因为resetFields只能重置表单数据;非表单数据比如编辑的id不能重置
            this.formData = {
                name: '',
                code: '',
                manager: '',
                introduce: ''
            }
            this.$refs.deptForm.resetFields()
            this.$emit('update:showDialog', false)
        }
    }
}
</script>

<style>
/* addDepartment */
</style>