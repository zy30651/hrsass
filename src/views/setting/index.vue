<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <el-row style="height: 60px">
              <el-button icon="el-icon-plus" @click="showDialog = true">新增角色</el-button>
            </el-row>
            <el-table border="" :data="list">
              <el-table-column
                align="center"
                width="120"
                label="序号"
                type="index"
              ></el-table-column>
              <el-table-column
                align="center"
                width="240"
                label="角色名"
                prop="name"
              ></el-table-column>
              <el-table-column align="center" label="描述" prop="description"></el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="{ row }">
                  <el-button size="small" type="success" @click="assignPerm(row.id)">
                    分配权限
                  </el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row type="flex" jusitify="center" align="middle" style="height: 60px">
              <el-pagination
                layout="prev,pager,next"
                :total="page.total"
                :page-size="page.pagesize"
                :current-page="page.page"
                @current-change="changePage"
              ></el-pagination>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使公司信息重新审核；请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="企业名称">
                <el-input v-model="formData.name" disabled style="width: 400px"></el-input>
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyArea" disabled style="width: 400px"></el-input>
              </el-form-item>
              <el-form-item label="电话">
                <el-input v-model="formData.companyPhone" disabled style="width: 400px"></el-input>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width: 400px"></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="formData.remarks"
                  type="textarea"
                  :row="3"
                  disabled
                  style="width: 400px"
                ></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <el-dialog title="编辑部门" :visible="showDialog" @close="btnCancel">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description"></el-input>
        </el-form-item>
      </el-form>
      <!-- 防止footer插槽 -->
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOk">确认</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 放置一个弹出层，点击分配的时候弹出 -->
    <el-dialog title="分配权限" :visible="showConfirmDialog" @close="btnPermCancel">
      <!-- 分配权限- 是一个树 可以table 可以el-tree-->
      <el-tree
        :data="permData"
        :default-expand-all="true"
        :props="defaultProps"
        :show-checkbox="true"
        :check-strictly="true"
        :default-checked-keys="selectCheck"
        node-key="id"
        ref="permTree"
      />
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPermOK">确定</el-button>
          <el-button size="small" @click="showConfirmDialog = false">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleList,
  addRole,
  getRoleDetail,
  getCompanyInfo,
  updateRole,
  deleteRole,
} from '@/api/setting'
import { getPermissionList } from '@/api/permission'
import { assignPerm } from '@/api/setting'
import { mapGetters } from 'vuex'
import { tranListToTreeData } from '@/utils'
export default {
  data() {
    return {
      list: [],
      page: {
        page: 1,
        pagesize: 10,
        total: 0,
      },
      formData: {},
      showDialog: false,
      roleForm: {
        name: '',
        description: '',
      },
      roleId: '',
      selectCheck: [],
      showConfirmDialog: false,
      permData: [], // 接收授权的数据
      defaultProps: { label: 'name' }, // 定义显示的字段名称和自属性
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
      },
    }
  },
  computed: {
    ...mapGetters(['companyId']),
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    changePage(newPage) {
      this.page.page = newPage
      this.getRoleList()
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    async editRole(id) {
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true
    },
    // addRole() {
    //   this.showDialog = true
    // },
    async btnOk() {
      try {
        await this.$refs.roleForm.validate()
        if (this.roleForm.id) {
          // 编辑
          await updateRole(this.roleForm)
        } else {
          // 新增
          await addRole(this.roleForm)
        }
        this.getRoleList()
        this.$message.success('操作成功')
        this.showDialog = false
      } catch (error) {
        console.log(error)
      }
    },
    btnCancel() {
      this.roleForm = {
        name: '',
        description: '',
      }
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },
    async deleteRole(id) {
      try {
        await this.$confirm('确认删除该角色么?')
        await deleteRole(id)
        this.$message.success('删除成功')
        this.getRoleList()
      } catch (error) {
        this.$message.success('取消删除')
      }
    },
    async assignPerm(id) {
      this.permData = tranListToTreeData(await getPermissionList(), '0')
      // 有id， 记录下，存/更新/回显均需要
      this.roleId = id
      // 获取这个id 的权限点
      const { permIds } = await getRoleDetail(id)

      this.showConfirmDialog = true
      // 当前角色所拥有的id
      this.selectCheck = permIds
    },
    async btnPermOK() {
      // 调用el-tree的方法获取当前节点

      await assignPerm({ id: this.roleeId, permIds: this.$refs.permTree.getCheckedKeys() })
      this.$message.success('分配权限成功')
      this.showConfirmDialog = false
    },
    btnPermCancel() {
      this.selectCheck = []
      this.showConfirmDialog = false
    },
  },
}
</script>

<style></style>
