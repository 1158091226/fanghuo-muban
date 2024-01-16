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
                label="图斑编号"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="tbbh"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.tbbh"
                  style="width: 100%"
                  placeholder="请输入图斑编号"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.tbbh }}</div>
              </el-form-item>
              <el-form-item
                label="草班"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="caoBan"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.caoBan"
                  style="width: 100%"
                  placeholder="请输入草班"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.caoBan }}</div>
              </el-form-item>
              <el-form-item
                label="草原类"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="cdL"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.cdL"
                  style="width: 100%"
                  placeholder="请输入草原类"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.cdL }}</div>
              </el-form-item>
              <el-form-item
                label="地类编码"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="dlbm"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.dlbm"
                  style="width: 100%"
                  placeholder="请输入地类编码"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.dlbm }}</div>
              </el-form-item>
              <el-form-item
                label="地貌"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="diMao"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.diMao"
                  style="width: 100%"
                  placeholder="请输入地貌"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.diMao }}</div>
              </el-form-item>
              <el-form-item
                label="灾害等级"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="disasterC"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.disasterC"
                  style="width: 100%"
                  placeholder="请输入灾害等级"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.disasterC }}</div>
              </el-form-item>
              <el-form-item
                label="灾害类型"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="dispe"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.dispe"
                  style="width: 100%"
                  placeholder="请输入灾害类型"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.dispe }}</div>
              </el-form-item>
              <el-form-item
                label="土地所有权属"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="ldQs"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.ldQs"
                  style="width: 100%"
                  placeholder="请输入土地所有权属"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.ldQs }}</div>
              </el-form-item>
              <el-form-item
                label="交通区位"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="kbJiDu"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.kbJiDu"
                  style="width: 100%"
                  placeholder="请输入交通区位"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.kbJiDu }}</div>
              </el-form-item>
              <el-form-item
                label="林地规划管理"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="ldghGl"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.ldghGl"
                  style="width: 100%"
                  placeholder="请输入林地规划管理"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.ldghGl }}</div>
              </el-form-item>
              <el-form-item
                label="林班"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="linBan"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.linBan"
                  style="width: 100%"
                  placeholder="请输入林班"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.linBan }}</div>
              </el-form-item>
              <el-form-item
                label="林场"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="linChang"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.linChang"
                  style="width: 100%"
                  placeholder="请输入林场"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.linChang }}</div>
              </el-form-item>
              <el-form-item
                label="林业局"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="linYeJu"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.linYeJu"
                  style="width: 100%"
                  placeholder="请输入林业局"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.linYeJu }}</div>
              </el-form-item>
              <el-form-item
                label="林木使用权"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="lmsyqs"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.lmsyqs"
                  style="width: 100%"
                  placeholder="请输入林木使用权"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.lmsyqs }}</div>
              </el-form-item>
              <el-form-item
                label="林木所有权属"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="lmqs"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.lmqs"
                  style="width: 100%"
                  placeholder="请输入林木所有权属"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.lmqs }}</div>
              </el-form-item>
              <el-form-item
                label="平均胸径"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="pingjunXj"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.pingjunXj"
                  style="width: 100%"
                  placeholder="请输入平均胸径"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.pingjunXj }}</div>
              </el-form-item>
              <el-form-item
                label="坡度"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="poDu"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.poDu"
                  style="width: 100%"
                  placeholder="请输入坡度"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.poDu }}</div>
              </el-form-item>
              <el-form-item
                label="坡位"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="poWei"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.poWei"
                  style="width: 100%"
                  placeholder="请输入坡位"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.poWei }}</div>
              </el-form-item>
              <el-form-item
                label="坡向"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="poXiang"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.poXiang"
                  style="width: 100%"
                  placeholder="请输入坡向"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.poXiang }}</div>
              </el-form-item>
              <el-form-item
                label="湿地等级"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="sdDj"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.sdDj"
                  style="width: 100%"
                  placeholder="请输入湿地等级"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.sdDj }}</div>
              </el-form-item>
              <el-form-item
                label="重要湿地名称"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="sdMc"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.sdMc"
                  style="width: 100%"
                  placeholder="请输入重要湿地名称"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.sdMc }}</div>
              </el-form-item>
              <el-form-item
                label="事权等级"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="shiQuanD"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.shiQuanD"
                  style="width: 100%"
                  placeholder="请输入事权等级"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.shiQuanD }}</div>
              </el-form-item>
              <el-form-item
                label="生态区位"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="stqw"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.stqw"
                  style="width: 100%"
                  placeholder="请输入生态区位"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.stqw }}</div>
              </el-form-item>
              <el-form-item
                label="生态区位名称"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="stqumc"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.stqumc"
                  style="width: 100%"
                  placeholder="请输入生态区位名称"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.stqumc }}</div>
              </el-form-item>
              <el-form-item
                label="土地使用权"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="tdsyqs"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.tdsyqs"
                  style="width: 100%"
                  placeholder="请输入土地使用权"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.tdsyqs }}</div>
              </el-form-item>
              <el-form-item
                label="土层厚度"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="tuCengHd"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.tuCengHd"
                  style="width: 100%"
                  placeholder="请输入土层厚度"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.tuCengHd }}</div>
              </el-form-item>
              <el-form-item
                label="土壤类型(名称)"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="tuRangLx"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.tuRangLx"
                  style="width: 100%"
                  placeholder="请输入土壤类型(名称)"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.tuRangLx }}</div>
              </el-form-item>
              <el-form-item
                label="小班面积"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="xbmj"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.xbmj"
                  style="width: 100%"
                  placeholder="请输入小班面积"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.xbmj }}</div>
              </el-form-item>
              <el-form-item
                label="数据年份"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="sjnf"
              >
                <el-date-picker
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.sjnf"
                  type="date"
                  placeholder="请选择数据年份"
                  style="width: 100%"
                  value-format="yyyy-MM-dd"
                />
                <div v-else>{{ formDetailsDialog.sjnf }}</div>
              </el-form-item>

              <el-form-item
                label="说明"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="describe"
              >
                <tinymce
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.describe"
                  :height="300"
                />
                <div v-else>
                  <div v-html="formDetailsDialog.describe" />
                </div>
              </el-form-item>
              
              <span />

          </el-form>
        </div>
        <div class="dialog-content-right">
            <MapBasisLayer v-if="dialogVisible" ref="MapBasisLayerDialog" drawType='Polygon'/>
          
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
import { wholeForestApi } from "@/api/forestry/wholeForest";

const listItemDefault = {
  id: undefined,
  areaCode: '',
  sysAreaVO: {},
  tbbh: undefined,
  caoBan: undefined,
  cdL: undefined,
  dlbm: undefined,
  diMao: undefined,
  disasterC: undefined,
  dispe: undefined,
  ldQs: undefined,
  kbJiDu: undefined,
  ldghGl: undefined,
  linBan: undefined,
  linChang: undefined,
  linYeJu: undefined,
  lmsyqs: undefined,
  lmqs: undefined,
  pingjunXj: undefined,
  poDu: undefined,
  poWei: undefined,
  poXiang: undefined,
  sdDj: undefined,
  sdMc: undefined,
  shiQuanD: undefined,
  stqw: undefined,
  stqumc: undefined,
  tdsyqs: undefined,
  tuCengHd: undefined,
  tuRangLx: undefined,
  xbmj: undefined,
  sjnf: undefined,
  describe: undefined,
  boundaryLine: undefined,
 
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
      // 新增，编辑，详情数据存放
      formDetailsDialog: deepClone(listItemDefault),
      // 表单规则
      formRules:{
          'areaCode': [
            { required: true, message: '请选择行政区划', trigger: 'change' },
          ],
          'tbbh': [
              { required: true, message: '请输入图斑编号', trigger: 'blur' },
          ],
          'boundaryLine': [
              { required: true, message: '请输入地理坐标', trigger: 'blur' },
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
        wholeForestApi('detail', 'get', { id: queryData.id })
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
            wholeForestApi('create', 'post', this.formDetailsDialog)
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
            wholeForestApi('update', 'post', data)
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