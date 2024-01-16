<template>
  <!-- <el-form>
    <el-form-item label="Name">
      <el-input v-model.trim="user.name" />
    </el-form-item>
    <el-form-item label="Email">
      <el-input v-model.trim="user.email" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">Update</el-button>
    </el-form-item>
  </el-form> -->
  <el-form ref="passwordForm" :model="passwordForm" :rules="passwordRules" label-width="100px">
    <el-form-item :label="'原密码'" prop="password">
      <el-input v-model="passwordForm.password" :placeholder="'请输入原密码'" show-password style="width:300px" />
    </el-form-item>
    <el-form-item :label="'新密码'" prop="newPassword">
      <el-input v-model="passwordForm.newPassword" :placeholder="'请输入新密码'" show-password style="width:300px" />
    </el-form-item>
    <el-form-item :label="'确认新密码'" prop="newPasswordRepeat">
      <el-input v-model="passwordForm.newPasswordRepeat" :placeholder="'请再次输入新密码'" show-password style="width:300px" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitPassword">{{ $t('forest.confirm') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUserItemPassword } from '@/api/system';
import md5 from 'js-md5';

export default {
  props: {

  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.passwordForm.newPassword !== '') {
          this.$refs['passwordForm'].validateField('newPasswordRepeat');
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      passwordForm: {
        password: '',
        newPassword: '',
        newPasswordRepeat: ''
      },
      passwordRules: {
        password: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPassword: [
          { validator: validatePass, trigger: 'blur' }
        ],
        newPasswordRepeat: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    // 新增数据
    submitPassword() {
      this.$refs['passwordForm'].validate((valid) => {
        if (valid) {
          // console.log('到这里了'); return;
          const temp = {};
          temp.id = this.$store.getters.user.id;
          temp.password = md5(md5(this.passwordForm.password));
          temp.newPassword = md5(md5(this.passwordForm.newPassword));
          temp.newPasswordRepeat = md5(md5(this.passwordForm.newPasswordRepeat));
          updateUserItemPassword(temp).then(res => {
            if (res.status === '200') {
              this.passwordForm.password = '';
              this.passwordForm.newPassword = '';
              this.passwordForm.newPasswordRepeat = '';
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              });
              return;
            }
          }).catch(() => {

          });
        }
      });
    }
  }
};
</script>
