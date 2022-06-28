<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
      <el-checkbox-group v-model="roleIds">
          <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
              {{item.name}}
          </el-checkbox>
      </el-checkbox-group>
      <el-row>
          <el-col :span=6>
              <el-button type="primary" size="small" @click="btnOK">确定</el-button>
              <el-button size="small" @click="btnCancel">取消</el-button>
          </el-col>
      </el-row>
  </el-dialog>
</template>

<script>
import {getRoleList} from '@/api/setting'
import {getUserDetailById} from '@/api/user'
import {assignRoles} from '@/api/employees'
export default {
    props: {
        showRoleDialog: {
            type: Boolean,
            default: false
        },
        userId: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            // 当前所有的角色
            list: [],
            // 负责存储当前用户拥有的角色的id
            roleIds: []
        }
    },
    created() {
        // 查询角色列表
        this.getRoleList()
        // 查询点击的员工的角色, 让父组件调用
    },
    methods: {
        async btnOK() {
            await assignRoles({id: this.userId, roleIds: this.roleIds})
            this.$emit('update:showRoleDialog', false)
        },
        btnCancel() {
            this.roleIds = []
            this.$parent.showRoleDialog = false
        },
        // 因为props是异步的；所以这里不能用this.userId
        // 这个方法是给父组件调用的`
        async getUserDetailById(id) {
            const { roleIds } = await getUserDetailById(id)
            this.roleIds = roleIds
            console.log('------')
            console.log(this.roleIds)
        },
        async getRoleList() {
            //
            const {rows} = await getRoleList({page: 1, pagesize: 20})
            console.log(rows)
            // rows是要循环的记录
            this.list = rows
        }
    }
}
</script>

<style>

</style>