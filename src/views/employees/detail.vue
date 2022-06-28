<template>
  <div class="dashboard-container">
      <div class="app-container">
          <el-card>
              <el-tabs>
                <el-tab-pane label='账户设置'>
                    <el-form ref="userForm" :model='userInfo' :rules="rules" label-width="120px" style="margin-left: 120px; margin-top:30px">
                        <el-form-item label="用户名:" prop='username'>
                            <el-input v-model='userInfo.username' style="width:300px"></el-input>
                        </el-form-item>
                        <el-form-item label="密码:" prop='password2'>
                            <el-input v-model='userInfo.password2' style="width:300px" type='password'></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type='primary' @click='saveUser'>保存</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label='个人详情'>
                     <el-row type="flex" justify="end">
                        <el-tooltip content="打印个人基本信息">
                            <router-link :to="`/employees/print/${userId}?type=personal`">
                            <i class="el-icon-printer" />
                            </router-link>
                        </el-tooltip>
                    </el-row>
                    <!-- <user-info></user-info> -->
                    <!-- 第二种使用组件的方法, 动态组件，可以切换组件 -->
                    <component :is="userComponent"/>
                </el-tab-pane>
                <el-tab-pane label='岗位信息'>
                    <el-row type="flex" justify="end">
                        <el-tooltip content="打印岗位信息">
                            <router-link :to="`/employees/print/${userId}?type=job`">
                                <i class="el-icon-printer"  />
                            </router-link>
                        </el-tooltip>
                    </el-row>
                    <component :is="jobComponent"/>
                </el-tab-pane>
              </el-tabs>
          </el-card>
      </div>
  </div>
</template>

<script>
import {saveUserDetailById} from '@/api/employees'
import {getUserDetailById} from '@/api/user'
import UserInfo from './component/user-info.vue'
import JobInfo from './component/job-info.vue'
export default {
    components: {
        UserInfo,
        JobInfo
    },
    data() {
        return {
            userComponent: 'UserInfo',
            jobComponent: 'JobInfo',
            userInfo: {
                username: '',
                password2: '' // 因为如果是读取出来的额password是密文
            },
            rules: {
                username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
                password2: [{ required: true, message: '密码不能为空', trigger: 'blur' },
                { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
            },
            userId: this.$route.params.id // 路由中的参数赋值给data的属性
        }
    },
    created() {
        this.getUserDetailById()
    },
    methods: {
        async getUserDetailById() {
            this.userInfo = await getUserDetailById(this.userId)
        },
        async saveUser() {
            try {
                await this.$ref.userForm.validate()
                await saveUserDetailById({...this.userInfo, password: this.password2})
                this.$message.success('保存成功')
            } catch (error) {
                console.log(error)
            }
        }
    }
}
</script>

<style>

</style>