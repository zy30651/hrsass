<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构 头部内容 -->
      <el-card class="tree-card">
        <!-- 结构内容 -->
        <tree-tools :tree-node="company" :is-root="true" @addDepts="addDepts"></tree-tools>
        <!-- <TreeTools :tree-node="company" :is-root="true"></TreeTools> -->
        <!-- 默认和label children props='defaultProps，这些可以注释’ -->
        <el-tree :data="departs" :default-expand-all="true" :props="defaultProps">
          <tree-tools
              slot-scope="{ data }"
              :tree-node="data"
              @addDepts="addDepts"
              @delDepts='getDepartments'
              @editDepts="editDepts"/>
        </el-tree>
      </el-card>
    </div>
    <addDept ref="addDepts" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartments"></addDept>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import { getDepartments} from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import addDept from './components/add-dept.vue'
export default {
  components: {
    TreeTools,
    addDept
  },
  data() {
    return {
      company: {},
      departs: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      showDialog: false,
      node: null
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments()
      this.company = {name: result.companyName, manager: '负责人', id: ''}
      // console.log(result.depts)
      this.departs = tranListToTreeData(result.depts, '')
      // this.departs = result.depts
      console.log(this.departs)
    },
    addDepts(node) {
      console.log('addDepts 1')
      this.showDialog = true
      this.node = node
    },
    editDepts(node) {
      this.showDialog = true
      this.node = node
      this.$refs.addDepts.getDepartDetail(node.id)
    }
  }
}
</script>

<style scoped>
.tree-card{
  padding: 30px 140px;
  font-size: 14px;
}
</style>

