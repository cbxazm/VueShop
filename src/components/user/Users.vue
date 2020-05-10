<template>
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--卡片视图1区-->
      <el-card>
        <el-row :gutter="20">
          <el-col :span="7">
            <!--搜索与添加区域-->
            <!--只要一清空，就会触发clear事件-->
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
          </el-col>
        </el-row>
        <el-table :data="userList" border stripe>
        <!--用户列表区域-->
          <!--只需加上type="index"就能让他变成索引列-->
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="姓名" prop="username"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
          <el-table-column label="电话" prop="mobile"></el-table-column>
          <el-table-column label="角色" prop="role_name"></el-table-column>
          <el-table-column label="状态">
            <!--作用域插槽-->
            <template slot-scope="scope">
               <!--{{scope.row}}会把改行数据全部显示-->
              <!--{ "id": 500, "role_name": "超级管理员", "username": "admin", "create_time": 1486720211, "mobile": "12345678", "email": "adsfad@qq.com", "mg_state": true }会把改行数据全部显示-->
              <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">

              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!--修改-->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
              <!--删除-->
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
              <!--分配角色-->
              <el-tooltip class="item" effect="dark" content="分配角色" placement="top-start" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>

        </el-table>
        <!--分页操作-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-card>
      <!--添加用户的对话框-->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed"
        >
        <!--close事件，当dialog关闭就会触发-->
        <!--内容主体区域-->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
          <!--prop里放的是验证用户规则的属性-->
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <!--prop里放的是验证用户规则的属性-->
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <!--prop里放的是验证用户规则的属性-->
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <!--prop里放的是验证用户规则的属性-->
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!--底部区域-->
        <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
      </el-dialog>
      <!--修改用户的对话框-->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="30%"
        :before-close="handleClose"
        @close="editDialogClosed"
      >
        <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="70px">
          <el-form-item label="用户名">
            <!--disabled就是-->
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <!--disabled就是-->
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <!--disabled就是-->
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
      </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Users",
      data(){
         // 验证邮箱的规则
        var checkEmail=(rule,value,cb)=>{
          const regEmail=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
          if (regEmail.test(value)){
            //说明合法的邮箱
            return cb()
          }
          cb(new Error('请输入合法的邮箱'))
        }
         //验证手机号的规则
        var checkMobile=(rule,value,cb)=>{
          const regMobile=/^1[3456789]\d{9}$/
          if (regMobile.test(value)){
            return cb()
          }
          cb(new Error('请输入合法的手机号'))
        }
         return{
         //  获取用户列表的参数对象
           queryInfo:{
             query:'',
             //当前页数
             pagenum:1,
             //当前每页显示多少条数据
             pagesize:2
           },
           userList:[],
           total:'',
           //控制对话框的显示与隐藏
           addDialogVisible:false,
           //添加用户的表单数据
           addForm:{
             username:'',
             password:'',
             email:'',
             mobile:''
           },
         //  添加表单的验证规则对象
           addFormRules:{
             username:[
               {required:true,message:'请输入用户名',trigger:'blur'},
               {min:3,max:10,message:'用户名的长度在3-10个字符之间',trigger:'blur'}
             ],
             password:[
               {required:true,message:'请输入密码',trigger:'blur'},
               {min:6,max:10,message:'密码的长度在6-10个字符之间',trigger:'blur'}
             ],
             email:[
               {required:true,message:'请输入邮箱',trigger:'blur'},
               {validator:checkEmail,trigger:'blur'}
             ],
             mobile:[
               {required:true,message:'请输入手机',trigger:'blur'},
               {validator:checkMobile,trigger:'blur'}
             ]
           },
           //控制修改用户的对话框显示与隐藏
           editDialogVisible:false,
           //查询到的用户信息保存
           editForm:{},
           //修改表单的验证规则
           editFormRules:{
             email:[
               {required:true,message:'请输入邮箱',trigger:'blur'},
               {validator:checkEmail,trigger:'blur'}
             ],
             mobile:[
               {required:true,message:'请输入手机',trigger:'blur'},
               {validator:checkMobile,trigger:'blur'}
             ]
           }


         }
      },
      created(){
        this.getUserList()
      },
      methods:{
        getUserList(){
          this.$http.get('users',{params:this.queryInfo}).then(res=>{
            if (res.data.meta.status!=200){
           return this.$message.error('获取用户列表失败')
            }
            this.userList=res.data.data.users
            this.total=res.data.data.total
            console.log(res.data);
          })
        },
        //监听pageSize改变的事件
        handleSizeChange(newSize){
          // console.log(newSize);
           this.queryInfo.pagesize=newSize
          this.getUserList()
        },
        //监听页码值的改变
        handleCurrentChange(newPage){
          console.log(newPage);
          this.queryInfo.pagenum=newPage
          this.getUserList()

        },
        //监听switch开关的改变
        userStateChanged(userInfo){
          // console.log(userInfo);
          this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`).then(res=>{
            if (res.data.meta.status!=200){
              //如果更新失败，页面操作不变
              userInfo=!userInfo
              return this.$message.error('更新用户状态失败')
            }
          this.$message.success('更新用户状态成功')
          })
        },
        //监听添加用户对话框的关闭事件
        addDialogClosed(){
          // console.log(this.$refs);
        this.$refs.addFormRef.resetFields()
        },
        //点击按钮，添加新用户
        addUser(){
          this.$refs.addFormRef.validate(valid=>{
            if (!valid){
              //验证失败就return
              return
            }
            //发起添加请求
            this.$http.post('users',this.addForm).then(res=>{
              if (res.data.meta.status!=201){
                return this.$message.error('添加用户失败')
              }
              this.$message.success('添加用户成功')
            //  隐藏对话框
              this.addDialogVisible=false
            //  重新获取用户列表数据
              this.getUserList()
            // console.log(res.data);
            })

          })
        },
        //显示编辑用户的对话框
        showEditDialog(id){
          // console.log(id);
          this.$http.get('users/'+id).then(res=>{
            console.log(res);
            if (res.data.meta.status!=200){
              return this.$message.error('查询用户失败')
            }
           this.editForm=res.data.data
          })
          this.editDialogVisible=true
        },
        //监听修改用户对话框的关闭事件
        editDialogClosed(){
        this.$refs.editFormRef.resetFields()
        },
        //修改用户信息并提交
        editUserInfo(){
        this.$refs.editFormRef.validate(validate=>{
          if (!validate) return
          //发起修改用户数据信息的数据请求
          this.$http.put('users/'+this.editForm.id,{email:this.editForm.email,mobile:this.editForm.mobile})
            .then(res=>{
              if (res.data.meta.status!=200){
                return this.$message.error('保存用户信息失败')
              }
              //关闭对话框
              this.editDialogVisible=false
              //刷新数据列表
              this.getUserList()
              //提示修改成功
               this.$message.success('修改成功')
              console.log(res);
            })
          // console.log(validate);
        })
        },
        //删除用户通过id
        removeUserById(id){
            // console.log(id);
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
             this.$http.delete('users/'+id).then(res=>{
               if (res.data.meta.status==200){
                 this.$message({
                   type: 'success',
                   message: '删除成功!'
                 });
                 this.getUserList();
               }else {
                 this.$message.error('删除失败')
               }
             })

          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }


      }
    }
</script>

<style scoped lang="less">


</style>
