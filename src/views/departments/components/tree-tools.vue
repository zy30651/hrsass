<template>
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px; width: 100%">
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <el-dropdown @command="operateDepts">
            <span>
              操作
              <i class="el-icon-arrow-down"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :disable="checkPermission()" command="add">
                添加子部门
              </el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="delete">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartment } from '@/api/departments'
export default {
  props: {
    treeNode: {
      // 定义传入的属性
      require: true,
      type: Object,
    },
    isRoot: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    operateDepts(type) {
      if (type === 'add') {
        console.log('add')
        // 点击添加子部门，需要弹窗；弹窗在另外一个子组件；所以
        // 在父组件定义了是否显示的value;当前子组件点击后，修改那个value
        this.$emit('addDepts', this.treeNode)
      } else if (type === 'edit') {
        console.log('edit')
        this.$emit('editDepts', this.treeNode)
      } else {
        console.log('del')
        this.$confirm('确定要删除部门么')
          .then(() => {
            return delDepartment(this.treeNode.id)
          })
          .then(() => {
            this.$emit('delDepts')
            this.$message.success('删除部门成功')
          })
      }
    },
  },
}
</script>

<style></style>
