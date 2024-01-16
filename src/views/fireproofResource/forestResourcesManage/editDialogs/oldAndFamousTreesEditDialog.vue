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
                label="调查号"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="investigationNum"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.investigationNum"
                  style="width: 100%"
                  placeholder="请输入调查号"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.investigationNum }}</div>
              </el-form-item>
              <el-form-item
                label="中文名"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="treeNameCn"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.treeNameCn"
                  style="width: 100%"
                  placeholder="请输入中文名"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.treeNameCn }}</div>
              </el-form-item>
              <el-form-item
                label="别名"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="treeOtherName"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.treeOtherName"
                  style="width: 100%"
                  placeholder="请输入别名"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.treeOtherName }}</div>
              </el-form-item>
              <el-form-item
                label="名木类别"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="famousWoodCategory"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.famousWoodCategory"
                  style="width: 100%"
                  placeholder="请输入名木类别"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.famousWoodCategory }}</div>
              </el-form-item>
              <el-form-item
                label="拉丁文"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="latin"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.latin"
                  style="width: 100%"
                  placeholder="请输入拉丁文"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.latin }}</div>
              </el-form-item>
              <el-form-item
                label="科"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="section"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.section"
                  style="width: 100%"
                  placeholder="请输入科"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.section }}</div>
              </el-form-item>
              <el-form-item
                label="属"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="genus"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.genus"
                  style="width: 100%"
                  placeholder="请输入属"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.genus }}</div>
              </el-form-item>
              <el-form-item
                label="编号"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="treeNumber"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.treeNumber"
                  style="width: 100%"
                  placeholder="请输入编号"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.treeNumber }}</div>
              </el-form-item>
              <el-form-item
                label="小地名"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="placeNames"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.placeNames"
                  style="width: 100%"
                  placeholder="请输入小地名"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.placeNames }}</div>
              </el-form-item>
              <el-form-item
                label="纵坐标"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="ordinate"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.ordinate"
                  style="width: 100%"
                  placeholder="请输入纵坐标"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.ordinate }}</div>
              </el-form-item>
              <el-form-item
                label="横坐标"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="abscissa"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.abscissa"
                  style="width: 100%"
                  placeholder="请输入横坐标"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.abscissa }}</div>
              </el-form-item>
              <el-form-item
                label="真实树龄"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="trueTreeAge"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.trueTreeAge"
                  style="width: 100%"
                  placeholder="请输入真实树龄"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.trueTreeAge }}</div>
              </el-form-item>
              <el-form-item
                label="评估树龄"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="assessmentTreeAge"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.assessmentTreeAge"
                  style="width: 100%"
                  placeholder="请输入评估树龄"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.assessmentTreeAge }}</div>
              </el-form-item>
              <el-form-item
                label="树高（米）"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="treeHeight"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.treeHeight"
                  style="width: 100%"
                  placeholder="请输入树高（米）"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.treeHeight }}</div>
              </el-form-item>
              <el-form-item
                label="胸径"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="treeDhb"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.treeDhb"
                  style="width: 100%"
                  placeholder="请输入胸径"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.treeDhb }}</div>
              </el-form-item>
              <el-form-item
                label="平均冠幅"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="averageWidth"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.averageWidth"
                  style="width: 100%"
                  placeholder="请输入平均冠幅"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.averageWidth }}</div>
              </el-form-item>
              <el-form-item
                label="东西冠幅"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="eastWest"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.eastWest"
                  style="width: 100%"
                  placeholder="请输入东西冠幅"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.eastWest }}</div>
              </el-form-item>
              <el-form-item
                label="南北冠幅"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="south"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.south"
                  style="width: 100%"
                  placeholder="请输入南北冠幅"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.south }}</div>
              </el-form-item>
              <el-form-item
                label="海拔"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="altitude"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.altitude"
                  style="width: 100%"
                  placeholder="请输入海拔"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.altitude }}</div>
              </el-form-item>
              <el-form-item
                label="影响生长环境因素"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="environmentalFactor"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.environmentalFactor"
                  style="width: 100%"
                  placeholder="请输入影响生长环境因素"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.environmentalFactor }}</div>
              </el-form-item>
              <el-form-item
                label="坡向"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="slopeAspect"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.slopeAspect"
                  style="width: 100%"
                  placeholder="请输入坡向"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.slopeAspect }}</div>
              </el-form-item>
              <el-form-item
                label="坡度"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="slope"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.slope"
                  style="width: 100%"
                  placeholder="请输入坡度"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.slope }}</div>
              </el-form-item>
              <el-form-item
                label="土壤名称"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="soilNames"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.soilNames"
                  style="width: 100%"
                  placeholder="请输入土壤名称"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.soilNames }}</div>
              </el-form-item>
              <el-form-item
                label="坡位"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="slopePosition"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.slopePosition"
                  style="width: 100%"
                  placeholder="请输入坡位"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.slopePosition }}</div>
              </el-form-item>
              <el-form-item
                label="生长势"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="growthPotential"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.growthPotential"
                  style="width: 100%"
                  placeholder="请输入生长势"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.growthPotential }}</div>
              </el-form-item>
              <el-form-item
                label="生长环境"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="growthEnvironment"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.growthEnvironment"
                  style="width: 100%"
                  placeholder="请输入生长环境"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.growthEnvironment }}</div>
              </el-form-item>
              <el-form-item
                label="现存状态"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="existingState"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.existingState"
                  style="width: 100%"
                  placeholder="请输入现存状态"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.existingState }}</div>
              </el-form-item>
              <el-form-item
                label="权属"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="ownership"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.ownership"
                  style="width: 100%"
                  placeholder="请输入权属"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.ownership }}</div>
              </el-form-item>
              <el-form-item
                label="养护复状现状"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="conservationStatus"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.conservationStatus"
                  style="width: 100%"
                  placeholder="请输入养护复状现状"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.conservationStatus }}</div>
              </el-form-item>
              <el-form-item
                label="原挂牌号"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="oldNum"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.oldNum"
                  style="width: 100%"
                  placeholder="请输入原挂牌号"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.oldNum }}</div>
              </el-form-item>
              <el-form-item
                label="管护单位"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="protectionUnit"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.protectionUnit"
                  style="width: 100%"
                  placeholder="请输入管护单位"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.protectionUnit }}</div>
              </el-form-item>
              <el-form-item
                label="栽植人"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="transplantingPerson"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.transplantingPerson"
                  style="width: 100%"
                  placeholder="请输入栽植人"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.transplantingPerson }}</div>
              </el-form-item>
              <el-form-item
                label="栽植时间"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="transplantingTime"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.transplantingTime"
                  style="width: 100%"
                  placeholder="请输入栽植时间"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.transplantingTime }}</div>
              </el-form-item>
              <el-form-item
                label="古树历史"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="treeHistory"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.treeHistory"
                  style="width: 100%"
                  placeholder="请输入古树历史"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.treeHistory }}</div>
              </el-form-item>
              <el-form-item
                label="树木特殊状况描述"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="specialDescription"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.specialDescription"
                  type="textarea"
                  placeholder="请输入树木特殊状况描述"
                />
                <div v-else>{{ formDetailsDialog.specialDescription }}</div>
              </el-form-item>

              <el-form-item
                label="树种鉴定记载"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="treeRecords"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.treeRecords"
                  type="textarea"
                  placeholder="请输入树种鉴定记载"
                />
                <div v-else>{{ formDetailsDialog.treeRecords }}</div>
              </el-form-item>

              <el-form-item
                label="备注"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="remark"
              >
                <tinymce
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.remark"
                  :height="300"
                />
                <div v-else>
                  <div v-html="formDetailsDialog.remark" />
                </div>
              </el-form-item>
              
              <span />

              <el-form-item
                label="多媒体照片"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="media"
              >
                <el-upload
                  v-if="dialogtitle != '详情'"
                  class="avatar-uploader"
                  :action="uploadUrl"
                  :show-file-list="false"
                  :before-upload="beforeImgUpload"
                  :on-success="onUploadImgDialogSuccessmedia"
                >
                  <img
                    v-if="imageUrlDialogmedia"
                    :src="imageUrlDialogmedia"
                    class="avatar"
                  >
                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                </el-upload>

                <div v-else>
                  <img v-if="imageUrlDialogmedia && !isShowimageUrlDialogmedia" :src="imageUrlDialogmedia" class="avatar" @click="isShowimageUrlDialogmedia = true">

                  <div
                    v-if="isShowimageUrlDialogmedia"
                    class="overlay"
                    @click="isShowimageUrlDialogmedia = false"
                  >
                    <img :src="imageUrlDialogmedia" class="large-image" />
                  </div>
                </div>
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
import { oldAndFamousTreesApi } from "@/api/forestry/oldAndFamousTrees";

const listItemDefault = {
  id: undefined,
  areaCode: '',
  sysAreaVO: {},
  investigationNum: undefined,
  treeNameCn: undefined,
  treeOtherName: undefined,
  famousWoodCategory: undefined,
  latin: undefined,
  section: undefined,
  genus: undefined,
  treeNumber: undefined,
  placeNames: undefined,
  ordinate: undefined,
  abscissa: undefined,
  trueTreeAge: undefined,
  assessmentTreeAge: undefined,
  treeHeight: undefined,
  treeDhb: undefined,
  averageWidth: undefined,
  eastWest: undefined,
  south: undefined,
  altitude: undefined,
  environmentalFactor: undefined,
  slopeAspect: undefined,
  slope: undefined,
  soilNames: undefined,
  slopePosition: undefined,
  growthPotential: undefined,
  growthEnvironment: undefined,
  existingState: undefined,
  ownership: undefined,
  conservationStatus: undefined,
  oldNum: undefined,
  protectionUnit: undefined,
  transplantingPerson: undefined,
  transplantingTime: undefined,
  treeHistory: undefined,
  specialDescription: undefined,
  treeRecords: undefined,
  remark: undefined,
  boundaryLine: undefined,
  media: undefined,
 
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
      imageUrlDialogmedia:'', // 控制图片预览
      isShowimageUrlDialogmedia:false,
      // 新增，编辑，详情数据存放
      formDetailsDialog: deepClone(listItemDefault),
      // 表单规则
      formRules:{
          'areaCode': [
            { required: true, message: '请选择行政区划', trigger: 'change' },
          ],
          'specialDescription': [
              { required: true, message: '请输入树木特殊状况描述', trigger: 'blur' },
          ],
          'treeRecords': [
              { required: true, message: '请输入树种鉴定记载', trigger: 'blur' },
          ],
          'remark': [
              { required: true, message: '请选择备注', trigger: 'change' },
          ],
          'boundaryLine': [
              { required: true, message: '请输入坐标', trigger: 'blur' },
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

    beforeImgUpload(file) {
      const name = file.name;
      if (name.endsWith('.png') || name.endsWith('.jpg')) {
        return true;
      } else {
        this.$msgbox({
          title: '请注意',
          message: '您选择文件是' + name + '，文件类型错误，请重试'
        });
        return false;
      }
    },
    
    // 弹窗的上传成功的钩子
    onUploadImgDialogSuccessmedia(res, file, fileList) {
      if (res.code != '200') {
        this.$msgbox({
          title: '请注意',
          message: res.message
        });
        return;
      } else {
        this.formDetailsDialog.media = res.data.uniqueName;
        this.imageUrlDialogmedia = URL.createObjectURL(file.raw);
        this.$message.success('上传成功');
      }
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
        oldAndFamousTreesApi('detail', 'get', { id: queryData.id })
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
            oldAndFamousTreesApi('create', 'post', this.formDetailsDialog)
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
            oldAndFamousTreesApi('update', 'post', data)
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
      this.imageUrlDialogmedia=''
    },

    // 图片赋值功能
    showImg() {
        if (this.formDetailsDialog.media) {
          commonDownload({ uniqueName: this.formDetailsDialog.media }).then((res) => {
            const blob = new Blob([res.file], {
              type: res.file.type // 替换为对应的图片类型
            });
            this.imageUrlDialogmedia = URL.createObjectURL(blob);
          });
        }
    }
  }
}

</script>

<style lang='less' scoped>

</style>