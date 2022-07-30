<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <!-- <span slot="before">共16条记录</span> -->
        <template v-slot:before>
          <span>共{{ page.total }}条记录</span>
        </template>
        <template v-slot:after>
          <el-button size="small" type="success" @click="$router.push('/import?type=user')">
            Excel导入
          </el-button>
          <el-button size="small" type="danger" @click="exportData">Excel导出</el-button>
          <el-button
            v-if="checkPermission('POINT-USER-ADD')"
            :disable="checkPermission('POINT-USER-ADD')"
            size="small"
            type="primary"
            @click="showDialog = true"
          >
            新增员工
          </el-button>
        </template>
      </page-tools>
      <el-table v-loading="loading" :data="list">
        <el-table-column label="序号" type="index" sortable="" />
        <!-- 插槽 -->
        <el-table-column label="头像" width="120px" align="center">
          <template v-slot="{ row }">
            <img
              v-imageerror="require('@/assets/common/bigUserHeader.png')"
              :src="row.staffPhoto"
              style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
              @click="showURLCode(row.staffPhoto)"
            />
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="username" sortable="" />
        <el-table-column label="工号" prop="workNumber" sortable="" />
        <el-table-column
          label="聘用形式"
          :formatter="formatEmpolyee"
          prop="formOfEmployment"
          sortable=""
        />
        <el-table-column label="部门" prop="departmentName" sortable="" />
        <el-table-column label="入职时间" prop="timeOfEntry" sortable="">
          <template v-slot:default="{ row }">
            {{ row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="账户状态" prop="enableState" sortable="">
          <template v-slot="{ row }">
            <el-switch :value="row.enableState === 1"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" sortable="" fixed="right" width="280">
          <!-- <template slot-scope="{row}"> 获取id，通过作用域插槽 -->
          <template v-slot="{ row }">
            <el-button
              type="text"
              size="small"
              @click="$router.push(`/employees/detail/${row.id}`)"
            >
              查看
            </el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
            <el-button type="text" size="small" @click="delEmpolyee(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination
          :current-page="page.page"
          :page-size="page.size"
          :total="page.total"
          layout="prev, pager, next"
          @current-change="pageChange"
        />
      </el-row>
    </div>
    <!-- <add-employee :show-dialog="showDialog"/> -->
    <!-- async修饰符 目的当子组件想关闭弹层时
    只要在子组件改变父组件数据的语法糖(原来需要监听子组件的click事件来修改)
    update -->
    <add-employee :show-dialog.sync="showDialog" />
    <el-dialog title="二维码" :visible.sync="showCodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <assign-role
      ref="assignRole"
      :show-role-dialog.sync="showRoleDialog"
      :user-id="userId"
    ></assign-role>
  </div>
</template>

<script>
import employeeEnum from '@/api/constant/employees'
import { getEmployeeList, delEmpolyee } from '@/api/employees'
import AddEmployee from './component/add-employee.vue'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'
import AssignRole from './component/assign-role.vue'
export default {
  components: { AddEmployee, AssignRole },
  data() {
    return {
      showDialog: false,
      list: [], // 接受数组
      showCodeDialog: false,
      showRoleDialog: false,
      userId: '',
      page: {
        page: 1,
        size: 10,
        total: 0,
      },
      loading: false,
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    showURLCode(url) {
      if (url) {
        // 数据更新了，但是弹层会立刻出现么？页面渲染是异步的
        this.showCodeDialog = true
        // nextTick可以再上一次数据更新完毕，页面渲染完毕后执行
        this.$nextTick(() => {
          // 此时已经有ref对象了
          QrCode.toCanvas(this.$refs.myCanvas, url)
        })
      } else {
        this.$message.warning('该用户没有头像')
      }
    },
    async delEmpolyee(id) {
      try {
        await this.$confirm('确定删除员工么')
        await delEmpolyee(id)
        this.$message.success('删除员工成功')
        this.getEmployeeList()
      } catch (error) {
        console.log(error)
      }
    },
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.list = rows
      this.page.total = total
      this.loading = false
    },
    pageChange(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    formatEmpolyee(row, column, cellValue, index) {
      const obj = employeeEnum.hireType.find((item) => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    async exportData() {
      const headers = {
        手机号: 'mobile',
        姓名: 'username',
        入职日期: 'timeOfEntry',
        聘用形式: 'formOfEmployment',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        部门: 'departmentName',
      }
      const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
      const merges = ['A1:A2', 'B1:F1', 'G1:G2']
      const { res } = await this.getEmployeeList({ page: 1, size: this.page.total })
      const data = this.formatJson(headers, res)
      // 懒加载
      import('@/vendor/Export2Excel').then((excel) => {
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: 'excel_export',
          bookType: 'xlsx',
          multiHeader,
          merges,
        })
      })
    },
    // 将表头数据和数据进行对应,按顺序取value
    // 目标[{},{}]   原来[[]]
    formatJson(headers, rows) {
      // // rows.forEach(item => {})
      return rows.map((item) => {
        // [手机号,姓名，入职日期]
        return Object.keys(headers).map((key) => {
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            // debugger
            const obj = employeeEnum.hireType.find((obj) => obj.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          return item[headers[key]]
        })
      })
      // return rows.map(item => Object.keys(headers).map(key => item[headers[key]]))
    },
    async editRole(id) {
      this.userId = id
      await this.$refs.assignRole.getUserDetailById(id)
      this.showRoleDialog = true
    },
    // addForm() {
    //   console.log('index')
    //   this.getEmployeeList()
    // }
  },
}
</script>

<style></style>
