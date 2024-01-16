<!-- ${tableComment} -->
<!-- ${datetime} -->
<template>
    <div class="list-details">
        <div v-show="isShowHandle" class="title">详情</div>

        <!-- 这是属性框的内容部分 -->
        <div class="details-content-box">
          <el-form
            ref="formDetails"
            :model="formDetails"
            label-width="130px"
            label-position="right"
            :rules="detailsType != '详情' ? formRules : {}"
            :class="[detailsType == '详情' ? 'details' : '']"
          >
            <#list formList as field>
              <#if field.attrName == 'areaCode'>
              <el-form-item
                label="行政区划"
                :class="[
                  detailsType == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="areaCode"
              >
                <area-select
                  v-if="detailsType != '详情'"
                  ref="area-filter"
                  :value="formDetails.areaCode"
                  style="width: 100%"
                  placeholder="请选择行政区划"
                  :clearable="true"
                  :is-width-zero="false"
                  @change="changeAreaDetails"
                />
                <div v-else>
                  <div>
                    {{
                      formDetails.sysAreaVO.areaFullName
                        ? formDetails.sysAreaVO.areaFullName
                        : ""
                    }}
                  </div>
                </div>
              </el-form-item>

              <!--  是否是基类  -->
              <#elseif field.baseField>
              <span />

              <#elseif field.attrName == 'boundaryLine'>
              <!--  是否是空间信息  -->
              <span />

              <#elseif field.attrName?contains("Tel") || field.attrName?contains("phone")>
              <el-form-item
                label="${field.fieldComment}"
                :class="[
                  detailsType == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="${field.attrName}"
              >
                <el-input
                  v-if="detailsType != '详情'"
                  v-model="formDetails.${field.attrName}"
                  style="width: 100%"
                  placeholder="请输入${field.fieldComment}"
                  class="filter-item"
                  clearable
                />
                <div v-else>
                  <div v-if="isShow${field.attrName}">
                    {{
                      isShowSecretFunction(
                        formDetails.${field.attrName},
                        3,
                        7
                      )
                    }}<el-button
                      size="mini"
                      class="ml-10"
                      @click="isShow${field.attrName} = !isShow${field.attrName}"
                    >查看</el-button>
                  </div>
                  <div v-else>
                    {{ formDetails.${field.attrName}
                    }}<el-button
                      size="mini"
                      class="ml-10"
                      @click="isShow${field.attrName} = !isShow${field.attrName}"
                    >隐藏</el-button>
                  </div>
                
                </div>
              </el-form-item>

              <#elseif field.formType == 'attachment'>
              <el-form-item
                label="${field.fieldComment}"
                :class="[
                  detailsType == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="${field.attrName}"
              >
                <el-input
                  v-if="detailsType != '详情'"
                  v-model="formDetails.${field.attrName}"
                  style="width: 100%"
                  placeholder=""
                  class="filter-item"
                  clearable
                  :readonly="true"
                />
                <el-upload
                  v-if="detailsType != '详情'"
                  class="upload-demo"
                  :action="uploadUrl"
                  :show-file-list="false"
                  :before-upload="beforeUpload"
                  :on-success="onUploadSuccess${field.attrName}"
                >
                  <el-button
                    size="small"
                    type="primary"
                    class="mt-10"
                  >点击上传</el-button>
                  <el-button
                    size="small"
                    type="primary"
                    class="mt-10"
                    @click.stop="formDetails.${field.attrName} = ''"
                    >删除</el-button
                  >
                  <div slot="tip" class="el-upload__tip">只能上传PDF文件</div>
                </el-upload>
                <div v-else>
                  <div
                    class="c-click"
                    @click="fileDown(formDetails.${field.attrName})"
                  >
                    {{
                      formDetails.${field.attrName}
                        ? formDetails.${field.attrName}
                        : ""
                    }}
                  </div>
                </div>
              </el-form-item>
              
              <#elseif field.formType == 'attachment-video'>
              <el-form-item
                label="${field.fieldComment}"
                :class="[
                  detailsType == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="${field.attrName}"
              >
                <el-input
                  v-if="detailsType != '详情'"
                  v-model="formDetails.${field.attrName}"
                  style="width: 100%"
                  placeholder=""
                  class="filter-item"
                  clearable
                  :readonly="true"
                />
                <el-upload
                  v-if="detailsType != '详情'"
                  class="upload-demo"
                  :action="uploadUrl"
                  :show-file-list="false"
                  :before-upload="beforeUploadVideo"
                  :on-success="onUploadSuccessVideo${field.attrName}"
                >
                  <el-button
                    size="small"
                    type="primary"
                    class="mt-10"
                  >点击上传</el-button>
                  <el-button
                    size="small"
                    type="primary"
                    class="mt-10"
                    @click.stop="formDetails.${field.attrName} = ''"
                    >删除</el-button
                  >
                  <div slot="tip" class="el-upload__tip">只能上传mp4文件</div>
                </el-upload>
                <div v-else>
                  <video
                    v-if="videoUrl${field.attrName}"
                    id="media"
                    :src="videoUrl${field.attrName}"
                    controls
                    width="300px"
                    height="200px"
                  ></video>
                </div>
              </el-form-item>

              <#elseif field.formType == 'photo'>
              <el-form-item
                label="${field.fieldComment}"
                :class="[
                  detailsType == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="${field.attrName}"
              >
                <el-upload
                  v-if="detailsType != '详情'"
                  class="avatar-uploader"
                  style="height: 100px"
                  :action="uploadUrl"
                  :show-file-list="false"
                  :before-upload="beforeImgUpload"
                  :on-success="onUploadImgSuccess${field.attrName}"
                > 
                  <div
                    v-if="imageUrl${field.attrName}"
                    style="position: relative"
                  >
                    <img :src="imageUrl${field.attrName}" class="avatar" />
                    <img
                      slot="suffix"
                      class="avatar-error"
                      src="~@/static/templateImages/close-circle-filled.png"
                      alt=""
                      @click.stop="
                        imageUrl${field.attrName} = '';
                        formDetails.${field.attrName} = '';
                      "
                    />
                  </div>

                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                </el-upload>

                <div v-else>
                  <img v-if="imageUrl${field.attrName} && !isShowimageUrl${field.attrName}" :src="imageUrl${field.attrName}" class="avatar" @click="isShowimageUrl${field.attrName} = true">

                  <div
                    v-if="isShowimageUrl${field.attrName}"
                    class="overlay"
                    @click="isShowimageUrl${field.attrName} = false"
                  >
                    <img :src="imageUrl${field.attrName}" class="large-image" />
                  </div>
                </div>
              </el-form-item>

              <#elseif field.formType == 'multi-photo'>
              <el-form-item
                label="${field.fieldComment}"
                :class="[
                  detailsType == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="${field.attrName}"
              >
                <el-upload
                  v-if="detailsType != '详情'"
                  class="avatar-uploader"
                  :action="uploadUrl"
                  :show-file-list="false"
                  :before-upload="beforeImgUpload"
                  :on-success="onUploadImgsSuccess${field.attrName}"
                >
                  <div class="upload-img-box">
                    <div
                      v-for="(item, index) in imageUrl${field.attrName}Arr"
                      :key="index + 'img'"
                      style="position: relative; margin: 10px 20px 10px 0px"
                      @click.stop=""
                    >
                      <img :src="item.file" class="avatar" />
                      <img
                        slot="suffix"
                        class="avatar-error"
                        src="~@/static/templateImages/close-circle-filled.png"
                        alt=""
                        @click.stop="imgsDeleteClick(index)"
                      />
                    </div>
                    <i class="el-icon-plus avatar-uploader-icon" />
                  </div>
                </el-upload>

                <div v-else>
                  <div class="upload-img-box-details">
                    <div
                      v-for="(item, index) in imageUrl${field.attrName}Arr"
                      style="margin: 10px"
                    >
                      <img
                        v-if="item.file"
                        :src="item.file"
                        class="avatar"
                        @click="item.isBigShow = true"
                      />

                      <div
                        v-if="item.isBigShow"
                        class="overlay"
                        @click="item.isBigShow = false"
                      >
                        <img :src="item.file" class="large-image" />
                      </div>
                    </div>
                  </div>
                </div>
              </el-form-item>

              <#elseif field.formType == 'editor'>
              <el-form-item
                label="${field.fieldComment}"
                :class="[
                  detailsType == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="${field.attrName}"
              >
                <tinymce
                  v-if="detailsType != '详情'"
                  v-model="formDetails.${field.attrName}"
                  :height="300"
                />
                <div v-else>
                  <div v-html="formDetails.${field.attrName}" />
                </div>
              </el-form-item>
              
              <#elseif field.formType == 'number'>
              <el-form-item
                label="${field.fieldComment}"
                :class="[
                  detailsType == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="${field.attrName}"
              >
                <el-input-number
                  v-if="detailsType != '详情'"
                  v-model="formDetails.${field.attrName}"
                  style="width: 100%"
                  placeholder="请输入${field.fieldComment}"
                  :controls="false"
                  
                />
                <div v-else>{{ formDetails.${field.attrName} }}</div>
              </el-form-item>

              <#elseif field.formType == 'select'>
              <el-form-item
                label="${field.fieldComment}"
                :class="[
                  detailsType == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="${field.attrName}"
              >
                <dictionary-select
                  v-if="detailsType != '详情'"
                  v-model.trim="formDetails.${field.attrName}"
                  type="${field.formDict}"
                  :show-code="false"
                  :placeholder="'请选择${field.fieldComment}'"
                  class="filter-item"
                  style="width: 100%"
                />
                <div v-else><dictionary-text  code="${field.formDict}"  :value="formDetails.${field.attrName}" /></div>
              </el-form-item>

              <#elseif field.formType == 'date'>
              <el-form-item
                label="${field.fieldComment}"
                :class="[
                  detailsType == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="${field.attrName}"
              >
                <el-date-picker
                  v-if="detailsType != '详情'"
                  v-model="formDetails.${field.attrName}"
                  type="date"
                  placeholder="请选择${field.fieldComment}"
                  style="width: 100%"
                  value-format="yyyy-MM-dd"
                />
                <div v-else>{{ formDetails.${field.attrName} }}</div>
              </el-form-item>
              
              <#elseif field.formType == 'datetime'>
              <el-form-item
                label="${field.fieldComment}"
                :class="[
                  detailsType == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="${field.attrName}"
              >
                <el-date-picker
                  v-if="detailsType != '详情'"
                  v-model="formDetails.${field.attrName}"
                  type="datetime"
                  style="width: 100%"
                  placeholder="选择${field.fieldComment}"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
                <div v-else>{{ formDetails.${field.attrName} }}</div>
              </el-form-item>

              <#elseif field.formType == 'textarea'>
              <el-form-item
                label="${field.fieldComment}"
                :class="[
                  detailsType == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="${field.attrName}"
              >
                <el-input
                  v-if="detailsType != '详情'"
                  v-model="formDetails.${field.attrName}"
                  type="textarea"
                  placeholder="请输入${field.fieldComment}"
                />
                <div v-else>{{ formDetails.${field.attrName} }}</div>
              </el-form-item>

              <#else>
              <el-form-item
                label="${field.fieldComment}"
                :class="[
                  detailsType == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="${field.attrName}"
              >
                <el-input
                  v-if="detailsType != '详情'"
                  v-model="formDetails.${field.attrName}"
                  style="width: 100%"
                  placeholder="请输入${field.fieldComment}"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetails.${field.attrName} }}</div>
              </el-form-item>
              </#if>
            </#list>
          </el-form>
          <#if formLayout == 2>
          <!--  有地图  -->
          <template v-if="isShowHandle">
            <div
              v-show="isShowMapBasisLayer"
              ref="contentMapBox"
              class="content-map-box"
            >
              <#list formList as field>
                <#if field.attrName == 'boundaryLine'>
                  <#if field.geometryType == 'Line'>
                  <MapBasisLayer
                    drawType='LineString'
                    v-show="isShowMapBasisLayer"
                    ref="MapBasisLayer"
                    :is-coordinate="detailsIsCoordinate"
                    :is-terrain="false"
                    @fullScreenClickOff="fullScreenClickOff"
                  />
                  <#elseif field.geometryType == 'Polygon'>
                  <MapBasisLayer
                    drawType='Polygon'
                    v-show="isShowMapBasisLayer"
                    ref="MapBasisLayer"
                    :is-coordinate="detailsIsCoordinate"
                    :is-terrain="false"
                    @fullScreenClickOff="fullScreenClickOff"
                  />
                  <#else>
                  <MapBasisLayer
                    drawType='Point'
                    v-show="isShowMapBasisLayer"
                    ref="MapBasisLayer"
                    :is-coordinate="detailsIsCoordinate"
                    :is-terrain="false"
                    @fullScreenClickOff="fullScreenClickOff"
                  />
                  </#if>
                </#if>
              </#list>

            </div>
            <div class="map-btn-box">
              <div
                v-if="isShowMapBasisLayer"
                class="map-btn"
                @click="detailsFullScreenClick"
              >
                <img
                  class="img1"
                  src="@/static/templateImages/full-screen-off.png"
                  alt=""
                >
              </div>

              <div class="map-btn" @click="isShowMapBasisLayerClick">
                <img
                  v-if="isShowMapBasisLayer"
                  class="img"
                  src="@/static/templateImages/map-icon.png"
                  alt=""
                >
                <img
                  v-else
                  class="img"
                  src="@/static/templateImages/map-icon-off.png"
                  alt=""
                >
              </div>
            </div>
          </template>
          </#if>
        </div>

        <!-- 这是属性框的底部按钮部分 -->
        <div v-show="isShowHandle" class="details-btn-box">
          <div v-if="detailsType == '详情'" class="btn-left">
            <div
              :class="[
                currentSelectionIndex == 0 ? 'left-text-no' : 'left-text',
              ]"
              @click="handleMoveSelectClick('up')"
            >
              上一条
            </div>
            <div
              :class="[
                currentSelectionIndex == tableData.length - 1 ? 'left-text-no' : 'left-text',
              ]"
              @click="handleMoveSelectClick('down')"
            >
              下一条
            </div>
          </div>
          <div v-else>&nbsp;</div>
          <div v-if="detailsType == '详情'" class="btn-right">
            <div
              v-permission="['${moduleName}:${functionName}:delete']"
              class="right-text"
              @click="detailsDeleteClick"
            >
              删除
            </div>
            <el-button
              v-permission="['${moduleName}:${functionName}:update']"
              type="primary"
              class="right-btn"
              @click="detailsUpdateClick"
            >编辑</el-button>
          </div>
          <div v-else class="btn-right">
            <div class="right-text1" @click="detailsCancelClick">取消</div>
            <el-button
              type="primary"
              class="right-btn"
              @click="detailsSaveClick"
            >保存</el-button>
          </div>
        </div>
      </div>
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
import { ${functionName}Api } from "@/api/${moduleName}/${functionName}";

const listItemDefault = {
<#list formList as field>
  <#if field.attrName == 'areaCode'>
  ${field.attrName}: '',
  sysAreaVO: {},
  </#if>
  <#if field.attrName != 'areaCode'>
  ${field.attrName}: undefined,
  </#if>
</#list>
 
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
    // 这个是控制是否需要操作功能
    isShowHandle: {
      type: Boolean,
      default: true
    },
    // 选中行的index
    currentSelectionIndex: {
      type: Number,
      default: 0
    },
    // 选中的行的数据
    currentSelection: {
      type: Object,
      default() {
        return {};
      }
    },
    // 每页的条数范围
    queryPageSize: {
      type: Number,
      default: 1
    },
    // 表格数据
    tableData: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data () {
      return {
        detailsType: '详情', // 这个类型只会有详情和编辑
        detailsIsCoordinate: false, // 列表框里的地图控制是否需要展示坐标采集
        isShowMapBasisLayer: true, // 控制列表中属性框的地图显示隐藏
        <#list formList as field>
          <#if field.attrName?contains("Tel") || field.attrName?contains("phone")>
        isShow${field.attrName}:true, // 控制敏感数据查看
          </#if>
        </#list>
        <#list formList as field>
          <#if field.formType == 'photo'>
        imageUrl${field.attrName}:'', // 控制图片预览
        isShowimageUrl${field.attrName}:false,
        <#elseif field.formType == 'multi-photo'>
        imageUrl${field.attrName}Arr:[], // 多图
        <#elseif field.formType == 'attachment-video'>
        videoUrl${field.attrName}:'', //视屏预览
          </#if>
        </#list>
        uploadUrl: process.env.VUE_APP_BASE_API + '/files/minIo/common_upload',
        formDetails: deepClone(listItemDefault), // 这个是存放列表框中的属性框
        // 表单规则
        formRules:{
          <#list formList as field>
            <#if field.formRequired>
            '${field.attrName}': [
              <#if field.attrName == 'areaCode'>
              { required: true, message: '请选择行政区划', trigger: 'change' },
              <#elseif field.formType == 'text' || field.formType == 'number' || field.formType == 'textarea'>
                { required: true, message: '请输入${field.fieldComment}', trigger: 'blur' },
              <#else>
                { required: true, message: '请选择${field.fieldComment}', trigger: 'change' },
              </#if>
            ],
            </#if>
          </#list>
        }
    }
  },

  // components: {},

  // watch: {},

  // computed: {},

  created(){
    this.initDetails();
  },

  // mounted(){},

  methods: {
    async initDetails() {
      this.formDetails = deepClone(listItemDefault);
      // this.isShowMapBasisLayer = true;
      this.detailsType = '详情';
      this.clearImgUrlFunction();
      if (this.currentSelection) {
        await this.getDetailsFunction(this.currentSelection, 'formDetails');
        this.showImg();
        this.showImgs();
        this.handleIsShow();
        this.$nextTick(() => {
          const obj = {
            state: 'details', // 状态详情还是编辑details,update,add
            wktString: this.formDetails.boundaryLine
          };
          setTimeout(() => {
            if (this.$refs['MapBasisLayer']) {
              this.$refs['MapBasisLayer'].addPointLayer(obj);
            }
          }, 0);
        });
      }
    },

    //方便父组件更新详情的方法
    async updateDetails() {
      await this.getDetailsFunction(this.currentSelection, 'formDetails');
      this.showImg();
      this.showImgs();
      this.handleIsShow();
    },

    // 列表属性框中的编辑点击事件
    async detailsUpdateClick() {
      this.formDetails = deepClone(listItemDefault);
      await this.getDetailsFunction(this.currentSelection, 'formDetails');
      this.showImg();
      this.showImgs();
      this.detailsType = '编辑';
      this.$message({
        type: 'warning',
        message: '切换其他数据时，当前编辑的数据不会保存！',
        duration: 4000
      });
      this.$nextTick(() => {
        const obj = {
          state: 'update', // 状态详情还是编辑details,update,add
          wktString: this.formDetails.boundaryLine
        };
        if(this.$refs['MapBasisLayer']){
          setTimeout(() => {
            this.$refs['MapBasisLayer'].addPointLayer(obj);
          }, 0);
        }
      });
    },

    // 列表属性框中的删除点击事件
    detailsDeleteClick() {
      this.$emit('detailsDeleteClick');
    },

    // 列表属性框中的取消按钮事件
    detailsCancelClick() {
      this.detailsType = '详情';
      this.resetForm('formDetails');
      this.$emit("detailsCancelClick");
    },

    // 列表属性框中的保存点击事件
    detailsSaveClick() {
      this.$refs['formDetails'].validate((valid) => {
        if (valid) {
          // 这里是对行政区划选择的数据处理，因为选择的后返回的是数组，所以要取最后一个
          if(this.$refs['area-filter']){
            const temp = deepClone(this.$refs['area-filter'].codes);
            if (isArray(temp) && temp.length > 0) {
              this.formDetails.areaCode = temp.pop();
            } else {
              delete this.formDetails.areaCode;
            }
          }
          if(this.$refs['MapBasisLayer']){
            this.formDetails.boundaryLine =
              this.$refs['MapBasisLayer'].returnAddLayerWkt();
            if (!this.formDetails.boundaryLine) {
              this.$message({
                type: 'error',
                message: '请在地图绘制对应位置'
              });
              return;
            }
          }

          <#list formList as field>
          <#if field.formType == 'multi-photo'>
          let imgstr = "";
          for (let i = 0; i < this.imageUrl${field.attrName}Arr.length; i++) {
            if (i == 0) {
              imgstr = this.imageUrl${field.attrName}Arr[i].name;
            } else {
              imgstr += "," + this.imageUrl${field.attrName}Arr[i].name;
            }
          }
          this.formDetails.${field.attrName} = imgstr;
          </#if>
          </#list> 


          let data = {};
          for (let key in this.formDetails) {
            data[key] =
              this.formDetails[key] == null ? undefined : this.formDetails[key];
          }

          ${functionName}Api('update', 'post', data)
            .then((res) => {
              this.$message({
                type: 'success',
                message: '修改成功'
              });
              this.$emit('detailsSubmitClick');
            })
            .catch((err) => {});
        }
      });
    },

    // 列表属性框中的全屏按钮点击事件
    detailsFullScreenClick() {
      this.detailsIsCoordinate = true; // 全屏后开启地图的坐标采集
      setTimeout(() => {
        this.$refs['MapBasisLayer'].fullScreen();
      }, 0);
    },

    // 列表属性框中地图全屏按钮关闭回调事件
    fullScreenClickOff(wktdata) {
      this.detailsIsCoordinate = false;
    },

    // 列表属性框中的上一条下一条点击事件
    async handleMoveSelectClick(type) {
      this.$emit('handleMoveSelectClick', type);
    },

    // 列表属性框中的地图缩放按钮
    isShowMapBasisLayerClick() {
      this.isShowMapBasisLayer = !this.isShowMapBasisLayer;
      if (this.isShowMapBasisLayer) {
        this.$nextTick(() => {
          const obj = {
            state: 'details', // 状态详情还是编辑details,update,add
            wktString: this.formDetails.boundaryLine
          };
          setTimeout(() => {
            this.$refs['MapBasisLayer'].updateSizeFunction();
            this.$refs['MapBasisLayer'].addPointLayer(obj);
          }, 0);
        });
      }
    },

    <#list formList as field>
    <#if field.formType == 'attachment'>
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
    // 列表详情上传成功的钩子
    onUploadSuccess${field.attrName}(res, file, fileList) {
      if (res.code != '200') {
        this.$msgbox({
          title: '请注意',
          message: res.message
        });
        this.fileList = [];
        return;
      } else {
        this.formDetails.${field.attrName} = res.data.uniqueName;
        this.$message.success('上传成功');
      }
    },
    </#if>
    </#list>  

    fileDown(name) {
      commonDownload({ uniqueName: name }).then((res) => {
        downloadFile(res.file, res.name);
      });
    },

    <#list formList as field>
    <#if field.formType == 'photo'>
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

    // 的上传成功的钩子
    onUploadImgSuccess${field.attrName}(res, file, fileList) {
      if (res.code != '200') {
        this.$msgbox({
          title: '请注意',
          message: res.message
        });
        return;
      } else {
        this.formDetails.${field.attrName} = res.data.uniqueName;
        this.imageUrl${field.attrName} = URL.createObjectURL(file.raw);
        this.$message.success('上传成功');
      }
    },
    
    </#if>
    </#list>  
   
    <#list formList as field>
    <#if field.formType == 'attachment-video'>
    beforeUploadVideo(file) {
      const name = file.name;
      if (name.endsWith('.mp4') ) {
        return true;
      } else {
        this.$msgbox({
          title: '请注意',
          message: '您选择文件是' + name + '，文件类型错误，请重试'
        });
        return false;
      }
    },

    // 的上传成功的钩子
    onUploadSuccessVideo${field.attrName}(res, file, fileList) {
      if (res.code != '200') {
        this.$msgbox({
          title: '请注意',
          message: res.message
        });
        return;
      } else {
        this.formDetails.${field.attrName} = res.data.uniqueName;
        this.videoUrl${field.attrName} = URL.createObjectURL(file.raw);
        this.$message.success('上传成功');
      }
    },
    
    </#if>
    </#list>  

    <#list formList as field>
    <#if field.formType == 'multi-photo'>
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
    onUploadImgsSuccess${field.attrName}(res, file, fileList) {
      if (res.code != '200') {
        this.$msgbox({
          title: '请注意',
          message: res.message
        });
        return;
      } else {
        this.imageUrl${field.attrName}Arr.push({
          file: URL.createObjectURL(file.raw),
          name: res.data.uniqueName,
        });
        this.formDetails.${field.attrName} = "";
        this.imageUrl${field.attrName}Arr.forEach((item) => {
          this.formDetails.${field.attrName} += item.name;
        });
        this.$refs["formDetails"].clearValidate();
        this.$message.success('上传成功');
      }
    },

    imgsDeleteClick(index) {
      this.imageUrl${field.attrName}Arr.splice(index, 1);
      this.formDetails.${field.attrName} = "";
      this.imageUrl${field.attrName}Arr.forEach((item) => {
        this.formDetails.${field.attrName} += item.name;
      });
    },
    </#if>
    </#list>

    <#list formList as field>
      <#if field.attrName == 'areaCode'>
      // 表单中区划选择配套的事件
      changeAreaDetails(v) {
        const temp = deepClone(v);
        if (isArray(temp) && temp.length > 0) {
          this.formDetails.areaCode = temp.pop();
        } else {
          this.formDetails.areaCode = '';
        }
      },
      </#if>
    </#list>

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

    // 获取明细
    getDetailsFunction(queryData, listdata) {
      return new Promise((resolve, reject) => {
        ${functionName}Api('detail', 'get', { id: queryData.id })
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

    // 图片赋值功能
    showImg() {
      <#list formList as field>
      <#if field.formType == 'photo'>
        if (this.formDetails.${field.attrName}) {
          commonDownload({ uniqueName: this.formDetails.${field.attrName} }).then((res) => {
            const blob = new Blob([res.file], {
              type: res.file.type // 替换为对应的图片类型
            });
            this.imageUrl${field.attrName} = URL.createObjectURL(blob);
          });
        }
      </#if>
      
      <#if field.formType == 'attachment-video'>
        if (this.formDetails.${field.attrName}) {
          commonDownload({ uniqueName: this.formDetails.${field.attrName} }).then((res) => {
            const blob = new Blob([res.file], {
              type: res.file.type // 替换为对应的图片类型
            });
            this.videoUrl${field.attrName} = URL.createObjectURL(blob);
          });
        }
      </#if>
      </#list>  
    },

    // 图片赋值功能
    showImgs() {
      <#list formList as field>
      <#if field.formType == 'multi-photo'>
        if (this.formDetails.${field.attrName}) {
          let arr = this.formDetails.${field.attrName}.split(",");
          arr.forEach(item=>{
            commonDownload({ uniqueName: item} ).then((res) => {
              const blob = new Blob([res.file], {
                type: res.file.type // 替换为对应的图片类型
              });
              this.imageUrl${field.attrName}Arr.push({
                  file: URL.createObjectURL(blob),
                  name: item,
                  isBigShow: false,
                });
              });
          })
        }
      </#if>
      </#list> 
    },

    // 清空图片地址
    clearImgUrlFunction(){
    <#list formList as field>
      <#if field.formType == 'photo'>
      this.imageUrl${field.attrName}=''
      </#if>
    </#list>

    <#list formList as field>
      <#if field.formType == 'multi-photo'>
      this.imageUrl${field.attrName}Arr=[]
      </#if>
    </#list>
    
    <#list formList as field>
      <#if field.formType == 'attachment-video'>
      this.videoUrl${field.attrName}=''
      </#if>
    </#list>
    },

    // 查看详情的时候把数据都脱敏
    handleIsShow() {
      <#list formList as field>
        <#if field.attrName?contains("Tel") || field.attrName?contains("phone")>
          this.isShow${field.attrName}=true;// 控制敏感数据查看
        </#if>
      </#list>
    }
  }
}

</script>

<style lang='less' scoped>

</style>