<template>
  <div class="app-container">
    <div class="filter-container clearfix">
      <div class="fl">
        <area-select
          ref="area-filter"
          :value="query.areaCode"
          :placeholder="'请选择' + $t('user.areaCode')"
          :class-name="'filter-item mr-10'"
          :clearable="true"
        />
        <el-input
          v-model="query.account"
          :placeholder="'请输入' + $t('user.account')"
          style="width: 200px"
          class="filter-item mr-10"
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="query.nameCh"
          :placeholder="'请输入' + $t('user.nameCh')"
          style="width: 200px"
          class="filter-item mr-10"
          @keyup.enter.native="handleFilter"
        />
        <el-button
          v-waves
          class="filter-item mr-10"
          icon="el-icon-search"
          @click="handleFilter"
        >
          {{ $t("table.search") }}
        </el-button>
      </div>
      <div class="fr">
        <el-button
          v-permission="[path + ':create']"
          class="filter-item"
          type="primary"
          icon="el-icon-edit"
          @click="handleCreate"
        >
          {{ $t("table.create") }}
        </el-button>
      </div>
    </div>
    <div class="c-main">
      <el-table
        v-loading="loading"
        :data="list"
        border
        fit
        highlight-current-row
        height="calc(100vh - 280px)"
        style="width: 100%; height: calc(100vh - 280px)"
      >
        <el-table-column type="index" :label="$t('user.id')" width="80" />
        <el-table-column :label="$t('user.account')">
          <template slot-scope="{ row }">
            {{ row.account }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.nameCh')">
          <template slot-scope="{ row }">
            {{ row.nameCh }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.areaFullName')">
          <template slot-scope="{ row }">
            {{ row.areaFullName || "-" }}
          </template>
        </el-table-column>

        <el-table-column :label="$t('user.bnCode')">
          <template slot-scope="{ row }">
            {{ row.bnName || "-" }}
          </template>
        </el-table-column>

        <el-table-column :label="$t('user.tel')">
          <template slot-scope="{ row }">
            {{ row.tel || "-" }}
          </template>
        </el-table-column>
        <el-table-column align="header-center" :label="$t('user.remark')">
          <template slot-scope="{ row }">
            {{ row.remark || "-" }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.actions')"
          align="center"
          class-name="small-padding fixed-width"
          width="180px"
        >
          <template slot-scope="scope">
            <el-button
              v-permission="[path + ':update']"
              class="mr-10"
              type="primary"
              size="mini"
              @click="handleUpdate(scope)"
            >
              {{ $t("table.edit") }}
            </el-button>
            <!-- <el-button v-permission="[path+':update-password']" type="warning" size="mini" @click="handleUpdatePassword(scope)">
            修改密码
          </el-button>
          <el-button v-permission="[path+':reset-password']" type="success" size="mini" @click="handleResetPassword(scope)">
            {{ $t('user.resetPassword') }}
          </el-button>
          <el-button v-permission="[path+':unlock']" type="success" size="mini" @click="handleUnclock(scope)">
            解锁
          </el-button>
          <el-button v-permission="[path+':delete']" type="danger" size="mini" @click="handleDelete(scope)">
            {{ $t('table.delete') }}
          </el-button> -->
            <el-dropdown>
              <el-button size="mini">
                更多操作<i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-permission="[path + ':update-password']"
                  @click.native="handleUpdatePassword(scope)"
                >修改密码</el-dropdown-item>
                <el-dropdown-item
                  v-permission="[path + ':reset-password']"
                  @click.native="handleResetPassword(scope)"
                >{{ $t("user.resetPassword") }}</el-dropdown-item>
                <el-dropdown-item
                  v-permission="[path + ':unlock']"
                  @click.native="handleUnclock(scope)"
                >解锁</el-dropdown-item>
                <el-dropdown-item
                  v-permission="[path + ':delete']"
                  @click.native="handleDelete(scope)"
                >{{ $t("table.delete") }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="query.pageNo"
        :limit.sync="query.pageSize"
        @pagination="getList"
      />
    </div>

    <el-dialog
      :title="formStateMap[formState]"
      :visible.sync="formVisible"
      :show-close="!dialogLoading"
      width="680px"
    >
      <el-form
        ref="form"
        v-loading="dialogLoading"
        :model="item"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item :label="$t('user.account')" prop="account">
          <el-input
            v-model="item.account"
            :placeholder="'请输入' + $t('user.account')"
            :readonly="item.id != undefined"
          />
        </el-form-item>
        <el-form-item
          v-if="formState === 'create'"
          :label="$t('user.passWord')"
          prop="passWord"
        >
          <el-input
            v-model="item.passWord"
            :placeholder="'请选择' + $t('user.passWord')"
            show-password
          />
        </el-form-item>
        <el-form-item :label="$t('user.nameCh')" prop="nameCh">
          <el-input
            v-model="item.nameCh"
            :placeholder="'请输入' + $t('user.nameCh')"
          />
        </el-form-item>
        <el-form-item :label="$t('user.areaCode')" prop="areaCode">
          <area-select
            ref="area-form"
            :value="item.areaCode"
            :placeholder="'请选择' + $t('user.areaCode')"
            style="width: 100%"
            @change="changeArea"
          />
        </el-form-item>
        <el-form-item :label="$t('user.bnCode')" prop="bnCode">
          <unit-select
            ref="unit-form"
            :value="item.bnCode"
            :placeholder="'请选择' + $t('user.bnCode')"
            style="width: 100%"
            @change="changeUnit"
          />
        </el-form-item>
        <el-form-item :label="$t('user.tel')">
          <el-input
            v-model="item.tel"
            :placeholder="'请输入' + $t('user.tel')"
          />
        </el-form-item>
        <el-form-item :label="$t('user.email')">
          <el-input
            v-model="item.email"
            :placeholder="'请输入' + $t('user.email')"
          />
        </el-form-item>
        <el-form-item :label="$t('user.remark')">
          <el-input
            v-model="item.remark"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            :placeholder="'请输入' + $t('user.remark')"
          />
        </el-form-item>
        <el-form-item label="权限">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="roles"
            :props="rolesProps"
            show-checkbox
            node-key="id"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button :disabled="dialogLoading" @click="formVisible = false">
          {{ $t("table.cancel") }}
        </el-button>
        <el-button
          type="primary"
          :disabled="dialogLoading"
          @click="formState === 'create' ? createData() : updateData()"
        >
          {{ $t("table.confirm") }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="'修改密码'"
      :visible.sync="passwordVisible"
      :show-close="!dialogLoading"
      width="500px"
    >
      <el-form
        ref="passwordForm"
        v-loading="dialogLoading"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
      >
        <el-form-item :label="'原密码'" prop="password">
          <el-input
            v-model="passwordForm.password"
            :placeholder="'请输入原密码'"
            show-password
          />
        </el-form-item>
        <el-form-item :label="'新密码'" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            :placeholder="'请输入新密码'"
            show-password
          />
        </el-form-item>
        <el-form-item :label="'确认新密码'" prop="newPasswordRepeat">
          <el-input
            v-model="passwordForm.newPasswordRepeat"
            :placeholder="'请再次输入新密码'"
            show-password
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :disabled="dialogLoading" @click="passwordVisible = false">
          {{ $t("table.cancel") }}
        </el-button>
        <el-button
          type="primary"
          :disabled="dialogLoading"
          @click="submitPassword"
        >
          {{ $t("table.confirm") }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchUserPage,
  fetchUserItem,
  createUserItem,
  updateUserItem,
  deleteUserItem,
  fetchUserRoleList,
  updateUserItemPassword,
  resetUserListPassword,
  unlockUserItem,
  fetchRoleList
} from '@/api/system';
import waves from '@/directive/waves';
import Pagination from '@/components/Pagination';
import AreaSelect from '@/components/AreaSelect';
import UnitSelect from '@/components/UnitSelect';
import md5 from 'js-md5';
import { isArray } from '@/utils/validate';
import { deepClone, permissionPath } from '@/utils';

const itemDefault = {
  id: undefined,
  account: undefined,
  nameCh: undefined,
  areaCode: '',
  areaFullName: undefined,
  bnCode: '',
  tel: undefined,
  email: undefined,
  remark: undefined,
  userType: '1'
};

const passwordFormDefault = {
  id: undefined,
  password: '',
  newPassword: '',
  newPasswordRepeat: ''
};

export default {
  components: { AreaSelect, UnitSelect, Pagination },
  directives: { waves },
  filters: {},
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
      loading: true,
      path: '',
      item: {},
      list: [],
      roles: [],
      areas: [],
      total: 0,
      query: {
        pageNo: 1,
        pageSize: 10,
        areaCode: undefined,
        account: undefined,
        nameCh: undefined
      },

      dialogLoading: true, // 弹窗加载状态

      rolesProps: {
        children: 'children',
        label: 'roleName'
      },
      checkStrictly: false,

      formState: '',
      formStateMap: {
        update: '编辑',
        create: '新增'
      },
      formVisible: false,

      // 表单校验
      rules: {
        account: [
          { required: true, message: '登录账号不能为空', trigger: 'blur' }
        ],
        passWord: [
          { required: true, message: '登录密码不能为空', trigger: 'blur' }
        ],
        nameCh: [
          { required: true, message: '用户名称不能为空', trigger: 'blur' }
        ],
        areaCode: [
          { required: true, message: '请选择所属区划', trigger: 'change' }
        ],
        bnCode: [
          { required: true, message: '请选择经营单位', trigger: 'change' }
        ]
      },

      passwordVisible: false,
      passwordForm: {},
      passwordRules: {
        password: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPassword: [{ validator: validatePass, trigger: 'blur' }],
        newPasswordRepeat: [{ validator: validatePass2, trigger: 'blur' }]
      }
    };
  },
  computed: {},
  created() {
    this.path = permissionPath(this.$route.path);

    // 获取用户区划代码
    this.query.areaCode = this.$store.getters.areaCode;

    this.getRoleList();
    this.getList();
  },
  methods: {
    // 获取列表
    async getList() {
      this.loading = true;
      const res = await fetchUserPage(this.query);
      this.list = res.data.list;
      this.total = res.data.total;
      this.loading = false;
    },

    // 获取角色列表
    async getRoleList() {
      const res = await fetchRoleList();
      const level = this.$store.getters.level;

      res.data.forEach((v, k) => {
        if (
          level === 3 &&
          v.roleCode !== 'admin' &&
          v.roleCode !== 'province' &&
          v.roleCode !== 'city'
        ) {
          this.roles.push(v);
        }
        if (
          level === 2 &&
          v.roleCode !== 'admin' &&
          v.roleCode !== 'province'
        ) {
          this.roles.push(v);
        }
        if (level === 1 && v.roleCode !== 'admin') {
          this.roles.push(v);
        }
      });
    },

    // 获取详情
    getItem(id, callback) {
      fetchUserItem(id).then((res) => {
        this.item = Object.assign({}, res.data);

        // 将后端返回的null的值改为''，确保表单能正常显示
        for (const k in this.item) {
          if (
            !this.item[k] &&
            typeof this.item[k] !== 'undefined' &&
            this.item[k] !== 0
          ) {
            this.item[k] = '';
          }
        }

        if (callback && typeof callback === 'function') {
          callback();
        }
      });
    },

    // 所有菜单节点数据
    getRoleAllCheckedKeys() {
      // 目前被选中的菜单节点
      const checkedKeys = this.$refs.tree.getCheckedKeys();
      // 半选中的菜单节点
      const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },

    // 重置详情
    resetItem() {
      if (this.$refs.tree !== undefined) {
        this.$refs.tree.setCheckedKeys([]);
      }
      this.item = deepClone(itemDefault);
    },

    // 搜索
    handleFilter() {
      this.query.pageNo = 1;
      const temp = deepClone(this.$refs['area-filter'].codes);
      if (isArray(temp) && temp.length > 0) {
        this.query.areaCode = temp.pop();
      } else {
        delete this.query.areaCode;
      }

      if (this.query.account === '') {
        delete this.query.account;
      }
      if (this.query.nameCh === '') {
        delete this.query.nameCh;
      }

      this.getList();
    },

    changeArea(v) {
      const temp = deepClone(v);
      if (isArray(temp) && temp.length > 0) {
        this.item.areaCode = temp.pop();
      } else {
        this.item.areaCode = '';
      }
    },

    changeUnit(v) {
      const temp = deepClone(v);
      if (isArray(temp) && temp.length > 0) {
        this.item.bnCode = temp.pop();
      } else {
        this.item.bnCode = '';
      }
    },

    // 新增
    handleCreate() {
      this.resetItem();
      this.formState = 'create';
      this.formVisible = true;
      this.dialogLoading = true;
      this.$nextTick(() => {
        this.$refs['form'].clearValidate();
        this.dialogLoading = false;
      });
    },

    // 新增数据
    createData() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.dialogLoading = true;
          this.item.roleIds = this.getRoleAllCheckedKeys();
          this.item.passWord = md5(md5(this.item.passWord));

          createUserItem(this.item)
            .then((response) => {
              this.item.id = response.data.id;
              this.item.areaFullName = response.data.areaFullName;
              this.list.unshift(this.item);
              this.formVisible = false;
              this.dialogLoading = false;
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              });
            })
            .catch((err) => {
              this.formVisible = false;
              this.dialogLoading = false;
            });
        }
      });
    },

    // 更新
    handleUpdate(scope) {
      this.resetItem();
      this.formState = 'update';
      this.formVisible = true;
      this.dialogLoading = true;
      this.checkStrictly = true;

      this.getItem(scope.row.id, function() {});

      this.$nextTick(() => {
        this.$refs['form'].clearValidate();
        fetchUserRoleList(scope.row.id).then((response) => {
          const checkedKeys = response.data.checkedKeys;
          checkedKeys.forEach((v) => {
            this.$nextTick(() => {
              this.$refs.tree.setChecked(v, true, false);
            });
          });
          this.checkStrictly = false;
          this.dialogLoading = false;
        });
      });
    },

    // 更新数据
    updateData() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.dialogLoading = true;
          this.item.roleIds = this.getRoleAllCheckedKeys();
          /* this.item.areaCode = this.item.areaCode.pop() */

          /* console.log(this.item)
          return */
          updateUserItem(this.item).then((response) => {
            this.item.areaFullName = response.data.areaFullName;
            const k = this.list.findIndex((v) => v.id === this.item.id);
            this.list.splice(k, 1, this.item);
            this.formVisible = false;
            this.dialogLoading = false;
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            });
          });
        }
      });
    },

    // 删除
    handleDelete({ $index, row }) {
      this.$confirm('确定删除用户 “' + row.nameCh + '” ？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteUserItem(row.id);
          this.list.splice($index, 1);
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          });
        })
        .catch((err) => {
          console.error(err);
        });
    },

    handleResetPassword({ $index, row }) {
      this.$confirm('确定重置用户 “' + row.nameCh + '” 的密码？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const data = [];
          data.push(row.id);
          await resetUserListPassword(data);
          this.$confirm('新密码为：Aa!12345', '重置成功', {
            confirmButtonText: '知道了',
            showCancelButton: false,
            type: 'success'
          });
        })
        .catch((err) => {
          console.error(err);
        });
    },

    handleUpdatePassword({ $index, row }) {
      this.passwordVisible = true;
      this.passwordForm = deepClone(passwordFormDefault);
      this.passwordForm.id = row.id;
      this.dialogLoading = true;

      this.$nextTick(() => {
        this.$refs['passwordForm'].clearValidate();
        this.dialogLoading = false;
      });
    },

    handleUnclock({ $index, row }) {
      this.$confirm(
        '用户 “' + row.nameCh + '”已输入密码错误3次，确定进行解锁？',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async() => {
          const data = {};
          data.userId = row.id;
          await unlockUserItem(data);
          this.$notify({
            title: '成功',
            message: '解锁成功',
            type: 'success',
            duration: 2000
          });
        })
        .catch((err) => {
          console.error(err);
        });
    },

    // 新增数据
    submitPassword() {
      this.$refs['passwordForm'].validate((valid) => {
        if (valid) {
          this.dialogLoading = true;
          const temp = {};
          temp.id = this.passwordForm.id;
          temp.password = md5(md5(this.passwordForm.password));
          temp.newPassword = md5(md5(this.passwordForm.newPassword));
          temp.newPasswordRepeat = md5(
            md5(this.passwordForm.newPasswordRepeat)
          );
          /* console.log(this.passwordForm)
          return */
          updateUserItemPassword(temp)
            .then((res) => {
              if (res.code === 200) {
                this.passwordVisible = false;
                this.dialogLoading = false;
                this.$notify({
                  title: '成功',
                  message: '修改成功',
                  type: 'success',
                  duration: 2000
                });
                return;
              }
            })
            .catch(() => {
              this.dialogLoading = false;
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.c-main {
  background-color: #fff;
  padding: 0px 10px 5px 10px;
}
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
