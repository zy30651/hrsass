<template>
  <el-dialog title="新增员工"  :visible="showDialog" @close="btnCancel">
      <!-- 表单 -->
      <el-form ref="addForm" label-width="120px" :model="formData" :rules="rules">
          <el-form-item label="姓名" prop="username">
              <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名"/>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
              <el-input v-model="formData.mobile"   style="width:50%" placeholder="请输入手机"/>
          </el-form-item>
          <el-form-item label="入职时间" prop="timeOfEntry">
            <el-date-picker v-model="formData.timeOfEntry"  style="width:50%" placeholder="请选择入职时间"/>
          </el-form-item>
          <el-form-item label="聘用形式" prop="formOfEmployment">
            <el-select  v-model="formData.formOfEmployment"  style="width:50%" placeholder="请选择">
                <!-- value 存；label展示值 -->
                <el-option
                  v-for="item in employeeEnum.hireType"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="工号" prop="workNumber">
              <el-input v-model="formData.workNumber"  style="width:50%" placeholder="请输入工号"/>
          </el-form-item>
          <el-form-item label="部门" prop="departmentName">
              <el-input v-model="formData.departmentName" style="width:50%" placeholder="请输入部门" @focus="getDepartments"/>
              <el-tree
              v-if="showTree"
              v-loading="loading"
              :data="treeData"
              :props="{ label:'name' }"
              :default-expand-all="true"
              style="height:100px"
              @node-click="selectNode"></el-tree>
          </el-form-item>
          <el-form-item label="转正时间" prop="correctionTime">
            <el-date-picker v-model="formData.correctionTime"  style="width:50%" placeholder="请选择转正时间" />
          </el-form-item>
      </el-form>
      <!-- footer插槽 v-slot需要卸载template上 -->
      <template v-slot:footer>
        <!-- <el-row slot='footer' type='flex' justify='center'> -->
        <el-row type='flex' justify='center'>
            <el-col :span='6'>
                <el-button size='small' @click="btnCancel">取消</el-button>
                <el-button size='small' type="primary"  @click="btnOK">确认</el-button>
            </el-col>
        </el-row>
      </template>
  </el-dialog>
</template>

<script>
import {tranListToTreeData} from '@/utils'
import {AddEmployee} from '@/api/employees'
import {getDepartments} from '@/api/departments'
import employeeEnum from '@/api/constant/employees'
export default {
    props: {
        showDialog: {
        type: Boolean,
        default: false
        }
    },
    data() {
        return {
            employeeEnum,
            treeData: [],
            showTree: false,
            formData: {
                username: '',
                mobile: '',
                formOfEmployment: '',
                workNumber: '',
                departmentName: '',
                timeOfEntry: '',
                correctionTime: ''
            },
            rules: {
                username: [{required: true, message: '用户名不能为空', trigger: 'blur'},
                {min: 1, max: 4, message: '用户名为1-4位字符'}],
                mobile: [{required: true, message: '手机号不能为空', trigger: 'blur'},
                {pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确'}],
                formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
                workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
                departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
                timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
            }
        }
    },
    methods: {
        async getDepartments() {
            this.showTree = true
            this.loading = true
            const {depts} = await getDepartments()
            //   depts是一个数组，需要转化为树形结构
            this.treeData = tranListToTreeData(depts, '')
            this.loading = false
        },
        selectNode(node) {
            this.formData.departmentName = node.name
            this.showTree = false
            this.treeData = []
        },
        btnCancel() {
            // 重置数据，因为resetFields只能重置表单数据;非表单数据比如编辑的id不能重置
            this.formData = {
                username: '',
                mobile: '',
                formOfEmployment: '',
                workNumber: '',
                departmentName: '',
                timeOfEntry: '',
                correctionTime: ''
            }
            this.$refs.addForm.resetFields()
            this.$emit('update:showDialog', false)
        },
        async btnOK() {
            // this.$refs.addForm.validate(async isOK => {
            //     if (isOK) {
                    // await AddEmployee(this.formData)
            //         // 告诉父组件 出发一个自定义事件
            //         this.$emit('addForm')
            //         // 隐藏dialog框
            //         this.$emit('update:showDialog', false)
            //     }
            // })
            try {
                await this.$refs.addForm.validate()
                await AddEmployee(this.formData)
                // this.$parent 可以调用父组件的实例；相当于父组件的this
                // this.$emit
                // 一旦组件放在其他组件里边，this.$parent不是根的index组件，则会出错；
                // 因为其他组件没有getEmployeeList方法
                this.$parent.getEmployeeList && this.$parent.getEmployeeList()
                this.$parent.showDialog = false
            } catch (error) {
                console.log(error)
            }
        }
    }
}
</script>

<style>

</style>