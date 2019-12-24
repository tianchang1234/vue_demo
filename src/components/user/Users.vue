<template>
  <div>
    <h3>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="box-card">

        <el-row :gutter="20">
          <el-col :span="8">
            <el-input
              placeholder="请输入内容"
              v-model="queryInfo.query"
              clearable
              @clear="getUseList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getUseList"
              ></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button
              type="primary"
              @click="addDialogVisible = true"
            >添加按钮</el-button>
          </el-col>
        </el-row>
        <el-table
          :data="userList"
          border
          stripe
        >
          <el-table-column type="index">
          </el-table-column>
          <el-table-column
            prop="username"
            label="姓名"
          >
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱"
          >
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="电话"
          >
          </el-table-column>
          <el-table-column
            prop="role_name"
            label="角色"
          >
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.mg_state"
                @change="UserStatusChange(scope.row)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="180px"
          >
            <template slot-scope="scope">
              <!-- 编辑按钮 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
              <!-- 删除按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeUserById(scope.row.id)"
              ></el-button>
              <!-- 设置按钮 -->
              <el-tooltip
                effect="dark"
                content="分配角色"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="warning"
                  icon="el-icon-setting"
                  size="mini"
                ></el-button>
              </el-tooltip>

            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagesize"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-card>
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed"
      >
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="70px"
        >
          <el-form-item
            label="用户名"
            prop="username"
          >
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item
            label="密码"
            prop="password"
          >
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item
            label="邮箱"
            prop="email"
          >
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item
            label="手机"
            prop="mobile"
          >
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="addUser"
          >确 定</el-button>
        </span>
      </el-dialog>
    </h3>
    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 修改用户的对话框模板 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input
            v-model="editForm.username"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item
          label="手机号"
          prop="mobile"
        >
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editUserInfo"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    }
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法手机号'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }, { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { validator: checkEmail, trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { validator: checkMobile, trigger: 'blur' }]
      },
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {},
      editFormRules: {
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { validator: checkMobile, trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { validator: checkEmail, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUseList()
  },
  methods: {
    async getUseList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败!')
      this.userList = res.data.users
      this.total = res.data.total
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getUseList()
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getUseList()
    },
    async UserStatusChange(val) {
      const { data: res } = await this.$http.put(`users/${val.id}/state/${val.mg_state}`)
      if (res.meta.status !== 200) {
        val.mg_state = !val.mg_state
        return this.$message.error('用户状态更新失败')
      }
      this.$message.success('用户更新成功')
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addForm)
        console.log(res)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功！')
        this.addDialogVisible = false
        this.getUseList()
      })
    },
    // 展示编辑用户的对话框
    async showEditDialog(id) {
      this.editDialogVisible = true
      // console.log(id)
      const { data: res } = await this.$http.get(`users/${id}`)
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('查询用户失败')
      this.editForm = res.data
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        // 发起修改用户信息请求
        const { data: res } = await this.$http.put('users/' + this.editForm.id, { email: this.editForm.email, mobile: this.editForm.mobile })
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户失败')
        }
        this.addDialogVisible = false
        this.getUseList()
        this.$message.success('更新用户成功')
      })
    },
    // 根据id删除用户信息
    async removeUserById(id) {
      // console.log(id)
      // 弹框询问客户是否真的删除数据
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果客户确认删除，返回值为字符串confirm
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.error('已取消删除')
      }
      // console.log('确认删除')
      const { data: res } = await this.$http.delete(`users/${id}`)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getUseList()
    }
  }
}
</script>

<style lang='less' scoped>
.el-table {
  margin-top: 10px;
  font-size: 12px;
}
.el-pagination {
  margin-top: 15px;
}
</style>
