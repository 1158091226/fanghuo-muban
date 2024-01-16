<!--  -->
<template>
    <el-dialog
      :title="dialogtitle"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      class="dialog-class"
      width="84%"
      top="50px"
    >
      <div class="dialog-content-box" v-loading="requestLoading">
        <div class="dialog-content-left" ref="dialogContentLeft">
          <el-form
            ref="formDetailsDialog"
            :model="formDetailsDialog"
            label-width="130px"
            label-position="right"
            :rules="dialogtitle != '详情' ? formRules : {}"
            :class="[dialogtitle == '详情' ? 'details' : '']"
          > 
                          <span />
              
              <!--  是否是空间信息  -->
              <span />
              
              <!--  是否是空间信息  -->
              <span />
              
              <!--  是否是空间信息  -->
              <el-form-item
                label="行政区划"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="areaCode"
              >
                <area-select
                  v-if="dialogtitle != '详情'"
                  ref="area-filter-dialog"
                  :value="formDetailsDialog.areaCode"
                  style="width: 100%"
                  placeholder="请选择行政区划"
                  :clearable="true"
                  :is-width-zero="false"
                  @change="changeAreaDialog"
                />
                <div v-else>
                  <div>
                    {{
                      formDetailsDialog.sysAreaVO.areaFullName
                        ? formDetailsDialog.sysAreaVO.areaFullName
                        : ""
                    }}
                  </div>
                </div>
              </el-form-item>
              
              <!--  是否是基类  -->
              <el-form-item
                label="名称"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="fireSourcePointName"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.fireSourcePointName"
                  style="width: 100%"
                  placeholder="请输入名称"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.fireSourcePointName }}</div>
              </el-form-item>
              <el-form-item
                label="类型"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="fireSourcePointType"
              >
                <dictionary-select
                  v-if="dialogtitle != '详情'"
                  v-model.trim="formDetailsDialog.fireSourcePointType"
                  type="fire_source_point_type"
                  :show-code="false"
                  :placeholder="'请选择类型'"
                  class="filter-item"
                  style="width: 100%"
                />
                <div v-else><dictionary-text  code="fire_source_point_type"  :value="formDetailsDialog.fireSourcePointType" /></div>
              </el-form-item>

              <el-form-item
                label="级别"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="level"
              >
                <dictionary-select
                  v-if="dialogtitle != '详情'"
                  v-model.trim="formDetailsDialog.level"
                  type="fire_source_point_level"
                  :show-code="false"
                  :placeholder="'请选择级别'"
                  class="filter-item"
                  style="width: 100%"
                />
                <div v-else><dictionary-text  code="fire_source_point_level"  :value="formDetailsDialog.level" /></div>
              </el-form-item>

              <el-form-item
                label="火源点数量"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="numberOfFirePoints"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.numberOfFirePoints"
                  style="width: 100%"
                  placeholder="请输入火源点数量"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.numberOfFirePoints }}</div>
              </el-form-item>
              <span />

              <el-form-item
                label="地址"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="address"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.address"
                  style="width: 100%"
                  placeholder="请输入地址"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.address }}</div>
              </el-form-item>
              <el-form-item
                label="重点监控开始时间"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="monitorStartTime"
              >
                <el-date-picker
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.monitorStartTime"
                  type="date"
                  placeholder="请选择重点监控开始时间"
                  style="width: 100%"
                  value-format="yyyy-MM-dd"
                />
                <div v-else>{{ formDetailsDialog.monitorStartTime }}</div>
              </el-form-item>

              <el-form-item
                label="重点监控结束时间"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="monitorEndTime"
              >
                <el-date-picker
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.monitorEndTime"
                  type="date"
                  placeholder="请选择重点监控结束时间"
                  style="width: 100%"
                  value-format="yyyy-MM-dd"
                />
                <div v-else>{{ formDetailsDialog.monitorEndTime }}</div>
              </el-form-item>

              <el-form-item
                label="管理措施"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="manegeMeasures"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.manegeMeasures"
                  style="width: 100%"
                  placeholder="请输入管理措施"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.manegeMeasures }}</div>
              </el-form-item>
              <el-form-item
                label="负责人"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="responsible"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.responsible"
                  style="width: 100%"
                  placeholder="请输入负责人"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.responsible }}</div>
              </el-form-item>
              <el-form-item
                label="联系电话"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="responsibleTel"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.responsibleTel"
                  style="width: 100%"
                  placeholder="请输入联系电话"
                  class="filter-item"
                  clearable
                />
                <div v-else>
                  <div v-if="isShowresponsibleTel">
                    {{
                      isShowSecretFunction(
                        formDetailsDialog.responsibleTel,
                        3,
                        7
                      )
                    }}<el-button
                      size="mini"
                      class="ml-10"
                      @click="isShowresponsibleTel = !isShowresponsibleTel"
                    >查看</el-button>
                  </div>
                  <div v-else>
                    {{ formDetailsDialog.responsibleTel
                    }}<el-button
                      size="mini"
                      class="ml-10"
                      @click="isShowresponsibleTel = !isShowresponsibleTel"
                    >隐藏</el-button>
                  </div>
                
                </div>
              </el-form-item>

              <el-form-item
                label="描述"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="beizhu"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.beizhu"
                  type="textarea"
                  placeholder="请输入描述"
                />
                <div v-else>{{ formDetailsDialog.beizhu }}</div>
              </el-form-item>

          </el-form>
        </div>
        <div class="dialog-content-right">
            <MapBasisLayer v-if="dialogVisible" ref="MapBasisLayerDialog" drawType='Point'/>
          
        </div>
      </div>
      <span v-show="dialogtitle != '详情'" slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmitClick">确定</el-button>
      </span>
    </el-dialog>
</template>

<script>
import AreaSelect from '@/components/AreaSelect'; // 这个是引入行政区划组件
import Pagination from '@/components/Pagination'; // 这个是引入分页组件

import DictionarySelect from '@/components/DictionarySelect'; // 引入下拉组件
import DictionaryText from '@/components/DictionaryText'; // 引入下拉文字显示组件
import MoreQuery from '@/components/MoreQuery'; // 引入更多组件
import Tinymce from '@/components/Tinymce'; // 引入富文本
import MapBasisLayer from '@/components/MapBasis';
import { deepClone, downloadFile } from '@/utils';
import { isArray } from '@/utils/validate';
import { commonDownload } from '@/api/system';
import { mapGetters } from 'vuex';
import { imptPointApi } from "@/api/fireprot/imptPoint";

const listItemDefault = {
  id: undefined,
  createdTime: undefined,
  lastModifyTime: undefined,
  areaCode: '',
  sysAreaVO: {},
  fireSourcePointName: undefined,
  fireSourcePointType: undefined,
  level: undefined,
  numberOfFirePoints: undefined,
  boundaryLine: undefined,
  address: undefined,
  monitorStartTime: undefined,
  monitorEndTime: undefined,
  manegeMeasures: undefined,
  responsible: undefined,
  responsibleTel: undefined,
  beizhu: undefined,
 
};


export default {
  // 这里吧组件引入进来
  components: {
    AreaSelect,
    Pagination,
    MapBasisLayer,
    DictionarySelect,
    DictionaryText,
    Tinymce,
    MoreQuery
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    dialogtitle: {
      type: String,
      default: '详情'
    },
    dialogSelectData: {
      type: Object,
      default() {
        return { any };
      }
    }
  },
  data () {
    return {
      uploadUrl: process.env.VUE_APP_BASE_API + '/files/minIo/common_upload',
      isShowresponsibleTel:true, // 控制敏感数据查看
      // 新增，编辑，详情数据存放
      formDetailsDialog: deepClone(listItemDefault),
      // 表单规则
      formRules:{
          'areaCode': [
            { required: true, message: '请选择行政区划', trigger: 'change' },
          ],
          'fireSourcePointName': [
              { required: true, message: '请输入名称', trigger: 'blur' },
          ],
          'fireSourcePointType': [
              { required: true, message: '请选择类型', trigger: 'change' },
          ],
          'level': [
              { required: true, message: '请选择级别', trigger: 'change' },
          ],
          'numberOfFirePoints': [
              { required: true, message: '请输入火源点数量', trigger: 'blur' },
          ],
          'boundaryLine': [
              { required: true, message: '请输入地理信息', trigger: 'blur' },
          ],
          'responsible': [
              { required: true, message: '请输入负责人', trigger: 'blur' },
          ],
          'responsibleTel': [
              { required: true, message: '请输入联系电话', trigger: 'blur' },
          ],
      }
    };
  },

  // components: {},

  // watch: {},

  computed: {
    ...mapGetters(['requestLoading'])
  },

  async created() {
    if (this.dialogtitle != '新增') {
      this.formDetailsDialog = deepClone(listItemDefault);
      this.resetForm('formDetailsDialog');
      await this.getDetailsFunction(this.dialogSelectData, 'formDetailsDialog');
      if (this.dialogtitle == '详情') {
        this.handleIsShow();
      }
      this.showImg();
      this.$nextTick(() => {
        const obj = {
          state: this.dialogtitle == '详情' ? 'details' : 'update', // 状态详情还是编辑details,update,add
          wktString: this.formDetailsDialog.boundaryLine
        };
        setTimeout(() => {
          this.$refs['MapBasisLayerDialog'].addPointLayer(obj);
        }, 0);
      });
    } else {
      this.formDetailsDialog = deepClone(listItemDefault);
      this.resetForm('formDetailsDialog');
      this.clearImgUrlFunction();
      this.$nextTick(() => {
        const obj = {
          state: 'add' // 状态详情还是编辑details,update,add
        };
        setTimeout(() => {
          this.$refs['MapBasisLayerDialog'].addPointLayer(obj);
        }, 0);
      });
    }
  },

  // mounted(){},

  methods: {
    // 弹窗关闭
    async handleClose() {
      this.formDetailsDialog = deepClone(listItemDefault);
      this.resetForm('formDetailsDialog');
      this.handleIsShow();
      this.$refs.dialogContentLeft.scrollTop = 0;
      // this.dialogVisible = false;

      this.$emit('close');
      this.$emit('update:dialogVisible', false);
    },

    // 上传之前进行判断
    beforeUpload(file) {
      const name = file.name;
      if (name.endsWith('.pdf')) {
        return true;
      } else {
        this.$msgbox({
          title: '请注意',
          message: '您选择文件是' + name + '，文件类型错误，请重试'
        });
        return false;
      }
    },


    fileDown(name) {
      commonDownload({ uniqueName: name }).then((res) => {
        downloadFile(res.file, res.name);
      });
    },


    // 清空表单校验样式
    resetForm(formName) {
      this.$nextTick(() => {
        if (this.$refs[formName]) {
          this.$refs[formName].clearValidate();
        }
      });
    },

    // 表单中区划选择配套的事件
    changeAreaDialog(v) {
      const temp = deepClone(v);
      if (isArray(temp) && temp.length > 0) {
        this.formDetailsDialog.areaCode = temp.pop();
      } else {
        this.formDetailsDialog.areaCode = '';
      }
    },
    // 获取明细
    getDetailsFunction(queryData, listdata) {
      return new Promise((resolve, reject) => {
        imptPointApi('detail', 'get', { id: queryData.id })
          .then((res) => {
            let data = {};
            for (let key in res.data) {
              data[key] = res.data[key] == null ? undefined : res.data[key];
            }
            this[listdata] = Object.assign({}, data);
            resolve(true);
          })
          .catch(() => {
            reject(false);
          });
      });
    },

    // 查看详情的时候把数据都脱敏
    handleIsShow() {
          this.isShowresponsibleTel=true;// 控制敏感数据查看
    },

    // 弹窗确认按钮
    handleSubmitClick() {
      this.$refs['formDetailsDialog'].validate((valid) => {
        if (valid) {
          // 这里是对行政区划选择的数据处理，因为选择的后返回的是数组，所以要取最后一个
          const temp = deepClone(this.$refs['area-filter-dialog'].codes);
          if (isArray(temp) && temp.length > 0) {
            this.formDetailsDialog.areaCode = temp.pop();
          } else {
            delete this.formDetailsDialog.areaCode;
          }

          this.formDetailsDialog.boundaryLine =
            this.$refs['MapBasisLayerDialog'].returnAddLayerWkt();
          if (!this.formDetailsDialog.boundaryLine) {
            this.$message({
              type: 'error',
              message: '请在地图绘制对应位置'
            });
            return;
          }

          if (this.dialogtitle == '新增') {
            imptPointApi('create', 'post', this.formDetailsDialog)
              .then((res) => {
                this.$message({
                  type: 'success',
                  message: '新增成功'
                });
                this.handleClose();
                this.$emit('diaologSubmitClick');
              })
              .catch((err) => {});
          } else {
            let data = {};
            for (let key in this.formDetailsDialog) {
              data[key] =
                this.formDetailsDialog[key] == null
                  ? undefined
                  : this.formDetailsDialog[key];
            }
            imptPointApi('update', 'post', data)
              .then((res) => {
                this.$message({
                  type: 'success',
                  message: '修改成功'
                });
                this.handleClose();
                this.$emit('diaologSubmitClick');
              })
              .catch((err) => {});
          }
        }
      });
    },

    // 敏感数据显示隐藏
    isShowSecretFunction(data, start, end) {
      if (!data) {
        return;
      }
      end = end == -1 ? data.length : end;
      let dataText = JSON.parse(JSON.stringify(data));
      let xingnum = end - start;
      let xing = '';
      for (let i = 0; i < xingnum; i++) {
        xing += '*';
      }
      let text;
      text = dataText.replace(dataText.substring(start, end), xing); // 利用

      return text;
    },

    // 清空图片地址
    clearImgUrlFunction(){
    },

    // 图片赋值功能
    showImg() {
    }
  }
}

</script>

<style lang='less' scoped>

</style>