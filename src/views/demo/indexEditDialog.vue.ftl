<!-- ${tableComment} -->
<!-- ${datetime} -->
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
      <#if formLayout == 1>
        <!--  无地图  -->
        <div class="dialog-content-left" ref="dialogContentLeft" style="width:100%">
        <#else>
        <!--  有地图  -->
        <div class="dialog-content-left" ref="dialogContentLeft">
      </#if>
          <el-form
            ref="formDetailsDialog"
            :model="formDetailsDialog"
            label-width="130px"
            label-position="right"
            :rules="dialogtitle != '详情' ? formRules : {}"
            :class="[dialogtitle == '详情' ? 'details' : '']"
          > 
            <#list formList as field>
              <#if field.attrName == 'areaCode'>
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
              <#elseif field.baseField>
              <span />
              
              <!--  是否是空间信息  -->
              <#elseif field.attrName == 'boundaryLine'>
              <span />

              <#elseif field.attrName?contains("Tel") || field.attrName?contains("phone")>
              <el-form-item
                label="${field.fieldComment}"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="${field.attrName}"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.${field.attrName}"
                  style="width: 100%"
                  placeholder="请输入${field.fieldComment}"
                  class="filter-item"
                  clearable
                />
                <div v-else>
                  <div v-if="isShow${field.attrName}">
                    {{
                      isShowSecretFunction(
                        formDetailsDialog.${field.attrName},
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
                    {{ formDetailsDialog.${field.attrName}
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
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="${field.attrName}"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.${field.attrName}"
                  style="width: 100%"
                  placeholder=""
                  class="filter-item"
                  clearable
                  :readonly="true"
                />
                <el-upload
                  v-if="dialogtitle != '详情'"
                  class="upload-demo"
                  :action="uploadUrl"
                  :show-file-list="false"
                  :before-upload="beforeUpload"
                  :on-success="onUploadSuccessDialog${field.attrName}"
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
                    @click.stop="formDetailsDialog.${field.attrName} = ''"
                    >删除</el-button
                  >
                  <div slot="tip" class="el-upload__tip">只能上传PDF文件</div>
                </el-upload>
                <div v-else>
                  <div
                    class="c-click"
                    @click="fileDown(formDetailsDialog.${field.attrName})"
                  >
                    {{
                      formDetailsDialog.${field.attrName}
                        ? formDetailsDialog.${field.attrName}
                        : ""
                    }}
                  </div>
                </div>
              </el-form-item>
              
              <#elseif field.formType == 'attachment-video'>
              <el-form-item
                label="${field.fieldComment}"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="${field.attrName}"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.${field.attrName}"
                  style="width: 100%"
                  placeholder=""
                  class="filter-item"
                  clearable
                  :readonly="true"
                />
                <el-upload
                  v-if="dialogtitle != '详情'"
                  class="upload-demo"
                  :action="uploadUrl"
                  :show-file-list="false"
                  :before-upload="beforeUploadVideo"
                  :on-success="onUploadSuccessDialogVideo${field.attrName}"
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
                    @click.stop="formDetailsDialog.${field.attrName} = ''"
                    >删除</el-button
                  >
                  <div slot="tip" class="el-upload__tip">只能上传mp4文件</div>
                </el-upload>
                <div v-else>
                  <video
                    v-if="videoUrlDialog${field.attrName}"
                    id="media"
                    :src="videoUrlDialog${field.attrName}"
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
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="${field.attrName}"
              >
                <el-upload
                  v-if="dialogtitle != '详情'"
                  class="avatar-uploader"
                  style="height: 100px"
                  :action="uploadUrl"
                  :show-file-list="false"
                  :before-upload="beforeImgUpload"
                  :on-success="onUploadImgDialogSuccess${field.attrName}"
                >
                  <div
                    v-if="imageUrlDialog${field.attrName}"
                    style="position: relative"
                  >
                    <img :src="imageUrlDialog${field.attrName}" class="avatar" />
                    <img
                      slot="suffix"
                      class="avatar-error"
                      src="~@/static/templateImages/close-circle-filled.png"
                      alt=""
                      @click.stop="
                        imageUrlDialog${field.attrName} = '';
                        formDetailsDialog.${field.attrName} = '';
                      "
                    />
                  </div>
                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                </el-upload>

                <div v-else>
                  <img v-if="imageUrlDialog${field.attrName} && !isShowimageUrlDialog${field.attrName}" :src="imageUrlDialog${field.attrName}" class="avatar" @click="isShowimageUrlDialog${field.attrName} = true">

                  <div
                    v-if="isShowimageUrlDialog${field.attrName}"
                    class="overlay"
                    @click="isShowimageUrlDialog${field.attrName} = false"
                  >
                    <img :src="imageUrlDialog${field.attrName}" class="large-image" />
                  </div>
                </div>
              </el-form-item>

              <#elseif field.formType == 'multi-photo'>
              <el-form-item
                label="${field.fieldComment}"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="${field.attrName}"
              >
                <el-upload
                  v-if="dialogtitle != '详情'"
                  class="avatar-uploader"
                  :action="uploadUrl"
                  :show-file-list="false"
                  :before-upload="beforeImgUpload"
                  :on-success="onUploadImgsDialogSuccess${field.attrName}"
                >
                  <div class="upload-img-box">
                    <div
                      v-for="(item, index) in imageUrlDialog${field.attrName}Arr"
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
                      v-for="(item, index) in imageUrlDialog${field.attrName}Arr"
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
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="${field.attrName}"
              >
                <tinymce
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.${field.attrName}"
                  :height="300"
                />
                <div v-else>
                  <div v-html="formDetailsDialog.${field.attrName}" />
                </div>
              </el-form-item>
              
              <#elseif field.formType == 'number'>
              <el-form-item
                label="${field.fieldComment}"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="${field.attrName}"
              >
                <el-input-number
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.${field.attrName}"
                  style="width: 100%"
                  placeholder="请输入${field.fieldComment}"
                  :controls="false"
                />
                <div v-else>{{ formDetailsDialog.${field.attrName} }}</div>
              </el-form-item>

              <#elseif field.formType == 'select'>
              <el-form-item
                label="${field.fieldComment}"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="${field.attrName}"
              >
                <dictionary-select
                  v-if="dialogtitle != '详情'"
                  v-model.trim="formDetailsDialog.${field.attrName}"
                  type="${field.formDict}"
                  :show-code="false"
                  :placeholder="'请选择${field.fieldComment}'"
                  class="filter-item"
                  style="width: 100%"
                />
                <div v-else><dictionary-text  code="${field.formDict}"  :value="formDetailsDialog.${field.attrName}" /></div>
              </el-form-item>

              <#elseif field.formType == 'date'>
              <el-form-item
                label="${field.fieldComment}"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="${field.attrName}"
              >
                <el-date-picker
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.${field.attrName}"
                  type="date"
                  placeholder="请选择${field.fieldComment}"
                  style="width: 100%"
                  value-format="yyyy-MM-dd"
                />
                <div v-else>{{ formDetailsDialog.${field.attrName} }}</div>
              </el-form-item>

              <#elseif field.formType == 'datetime'>
              <el-form-item
                label="${field.fieldComment}"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="${field.attrName}"
              >
                <el-date-picker
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.${field.attrName}"
                  type="datetime"
                  style="width: 100%"
                  placeholder="选择${field.fieldComment}"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
                <div v-else>{{ formDetailsDialog.${field.attrName} }}</div>
              </el-form-item>
             
              <#elseif field.formType == 'textarea'>
              <el-form-item
                label="${field.fieldComment}"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="${field.attrName}"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.${field.attrName}"
                  type="textarea"
                  placeholder="请输入${field.fieldComment}"
                />
                <div v-else>{{ formDetailsDialog.${field.attrName} }}</div>
              </el-form-item>

              <#else>
              <el-form-item
                label="${field.fieldComment}"
                :class="[
                  dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
                ]"
                prop="${field.attrName}"
              >
                <el-input
                  v-if="dialogtitle != '详情'"
                  v-model="formDetailsDialog.${field.attrName}"
                  style="width: 100%"
                  placeholder="请输入${field.fieldComment}"
                  class="filter-item"
                  clearable
                />
                <div v-else>{{ formDetailsDialog.${field.attrName} }}</div>
              </el-form-item>
              </#if>
            </#list>
          </el-form>
        </div>
        <#if formLayout == 1>
        <!--  无地图  -->
        <div class="dialog-content-right" style="width:0">
        <#else>
        <!--  有地图  -->
        <div class="dialog-content-right">
        </#if>
        <#list formList as field>
          <#if field.attrName == 'boundaryLine'>
            <#if field.geometryType == 'Line'>
            <MapBasisLayer v-if="dialogVisible" ref="MapBasisLayerDialog" drawType='LineString'/>
            <#elseif field.geometryType == 'Polygon'>
            <MapBasisLayer v-if="dialogVisible" ref="MapBasisLayerDialog" drawType='Polygon'/>
            <#else>
            <MapBasisLayer v-if="dialogVisible" ref="MapBasisLayerDialog" drawType='Point'/>
            </#if>
          </#if>
        </#list>
          
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
      <#list formList as field>
        <#if field.attrName?contains("Tel") || field.attrName?contains("phone")>
      isShow${field.attrName}:true, // 控制敏感数据查看
        </#if>
      </#list>
      <#list formList as field>
        <#if field.formType == 'photo'>
      imageUrlDialog${field.attrName}:'', // 控制图片预览
      isShowimageUrlDialog${field.attrName}:false,
        <#elseif field.formType == 'multi-photo'>
      imageUrlDialog${field.attrName}Arr:[], // 多图
        <#elseif field.formType == 'attachment-video'>
      videoUrlDialog${field.attrName}:'', // 视屏预览
        </#if>
      </#list>
      // 新增，编辑，详情数据存放
      formDetailsDialog: deepClone(listItemDefault),
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
      this.showImgs();
      this.$nextTick(() => {
        const obj = {
          state: this.dialogtitle == '详情' ? 'details' : 'update', // 状态详情还是编辑details,update,add
          wktString: this.formDetailsDialog.boundaryLine
        };
        if(this.$refs['MapBasisLayerDialog']){
          setTimeout(() => {
            this.$refs['MapBasisLayerDialog'].addPointLayer(obj);
          }, 0);
        }
      });
    } else {
      this.formDetailsDialog = deepClone(listItemDefault);
      this.resetForm('formDetailsDialog');
      this.clearImgUrlFunction();
      this.$nextTick(() => {
        const obj = {
          state: 'add' // 状态详情还是编辑details,update,add
        };
        if(this.$refs['MapBasisLayerDialog']){
          setTimeout(() => {
            this.$refs['MapBasisLayerDialog'].addPointLayer(obj);
          }, 0);
        }
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

    // 弹框的上传成功的钩子
    onUploadSuccessDialog${field.attrName}(res, file, fileList) {
      if (res.code != '200') {
        this.$msgbox({
          title: '请注意',
          message: res.message
        });
        this.fileList = [];
        return;
      } else {
        this.formDetailsDialog.${field.attrName} = res.data.uniqueName;
        this.$message.success('上传成功');
      }
    },
    </#if>
    </#list>  
    
    <#list formList as field>
    <#if field.formType == 'attachment-video'>
    // 上传之前进行判断
    beforeUploadVideo(file) {
      const name = file.name;
      if (name.endsWith('.mp4')) {
        return true;
      } else {
        this.$msgbox({
          title: '请注意',
          message: '您选择文件是' + name + '，文件类型错误，请重试'
        });
        return false;
      }
    },

    // 弹框的上传成功的钩子
    onUploadSuccessDialogVideo${field.attrName}(res, file, fileList) {
      if (res.code != '200') {
        this.$msgbox({
          title: '请注意',
          message: res.message
        });
        this.fileList = [];
        return;
      } else {
        this.formDetailsDialog.${field.attrName} = res.data.uniqueName;
        this.videoUrlDialog${field.attrName} = URL.createObjectURL(file.raw);
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
    
    // 弹窗的上传成功的钩子
    onUploadImgDialogSuccess${field.attrName}(res, file, fileList) {
      if (res.code != '200') {
        this.$msgbox({
          title: '请注意',
          message: res.message
        });
        return;
      } else {
        this.formDetailsDialog.${field.attrName} = res.data.uniqueName;
        this.imageUrlDialog${field.attrName} = URL.createObjectURL(file.raw);
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
    onUploadImgsDialogSuccess${field.attrName}(res, file, fileList) {
      if (res.code != '200') {
        this.$msgbox({
          title: '请注意',
          message: res.message
        });
        return;
      } else {
        this.imageUrlDialog${field.attrName}Arr.push({
          file: URL.createObjectURL(file.raw),
          name: res.data.uniqueName,
        });

        this.formDetailsDialog.${field.attrName} = "";
        this.imageUrlDialog${field.attrName}Arr.forEach((item) => {
          this.formDetailsDialog.${field.attrName} += item.name;
        });
        this.$refs["formDetailsDialog"].clearValidate();

        this.$message.success('上传成功');
      }
    },

    imgsDeleteClick(index) {
      this.imageUrlDialog${field.attrName}Arr.splice(index, 1);
      this.formDetailsDialog.${field.attrName} = "";
      this.imageUrlDialog${field.attrName}Arr.forEach((item) => {
        this.formDetailsDialog.${field.attrName} += item.name;
      });
    },
    </#if>
    </#list>

    // 清空表单校验样式
    resetForm(formName) {
      this.$nextTick(() => {
        if (this.$refs[formName]) {
          this.$refs[formName].clearValidate();
        }
      });
    },

    <#list formList as field>
    <#if field.attrName == 'areaCode'>
    // 表单中区划选择配套的事件
    changeAreaDialog(v) {
      const temp = deepClone(v);
      if (isArray(temp) && temp.length > 0) {
        this.formDetailsDialog.areaCode = temp.pop();
      } else {
        this.formDetailsDialog.areaCode = '';
      }
    },
    </#if>
	  </#list> 
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

    // 查看详情的时候把数据都脱敏
    handleIsShow() {
      <#list formList as field>
        <#if field.attrName?contains("Tel") || field.attrName?contains("phone")>
          this.isShow${field.attrName}=true;// 控制敏感数据查看
        </#if>
      </#list>
    },

    // 弹窗确认按钮
    handleSubmitClick() {
      this.$refs['formDetailsDialog'].validate((valid) => {
        if (valid) {
          // 这里是对行政区划选择的数据处理，因为选择的后返回的是数组，所以要取最后一个
          if(this.$refs['area-filter-dialog']){
            const temp = deepClone(this.$refs['area-filter-dialog'].codes);
            if (isArray(temp) && temp.length > 0) {
              this.formDetailsDialog.areaCode = temp.pop();
            } else {
              delete this.formDetailsDialog.areaCode;
            }
          }

          if(this.$refs['MapBasisLayerDialog']){
            this.formDetailsDialog.boundaryLine =
              this.$refs['MapBasisLayerDialog'].returnAddLayerWkt();
            if (!this.formDetailsDialog.boundaryLine) {
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
          for (let i = 0; i < this.imageUrlDialog${field.attrName}Arr.length; i++) {
            if (i == 0) {
              imgstr = this.imageUrlDialog${field.attrName}Arr[i].name;
            } else {
              imgstr += "," + this.imageUrlDialog${field.attrName}Arr[i].name;
            }
          }
          this.formDetailsDialog.${field.attrName} = imgstr;
          </#if>
          </#list> 


          if (this.dialogtitle == '新增') {
            ${functionName}Api('create', 'post', this.formDetailsDialog)
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
            ${functionName}Api('update', 'post', data)
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
    <#list formList as field>
      <#if field.formType == 'photo'>
        this.imageUrlDialog${field.attrName} = ''
      </#if>
    </#list>

    <#list formList as field>
      <#if field.formType == 'multi-photo'>
        this.imageUrlDialog${field.attrName}Arr=[]
      </#if>
    </#list>

    <#list formList as field>
      <#if field.formType == 'attachment-video'>
        this.videoUrlDialog${field.attrName}='';
      </#if>
    </#list>
    },

    // 图片赋值功能
    showImg() {
      <#list formList as field>
      <#if field.formType == 'photo'>
        if (this.formDetailsDialog.${field.attrName}) {
          commonDownload({ uniqueName: this.formDetailsDialog.${field.attrName} }).then((res) => {
            const blob = new Blob([res.file], {
              type: res.file.type // 替换为对应的图片类型
            });
            this.imageUrlDialog${field.attrName} = URL.createObjectURL(blob);
          });
        }
      </#if>
      
      <#if field.formType == 'attachment-video'>
        if (this.formDetailsDialog.${field.attrName}) {
          commonDownload({ uniqueName: this.formDetailsDialog.${field.attrName} }).then((res) => {
            const blob = new Blob([res.file], {
              type: res.file.type // 替换为对应的图片类型
            });
            this.videoUrlDialog${field.attrName} = URL.createObjectURL(blob);
          });
        }
      </#if>
      </#list> 
    },
    
    // 图片赋值功能
    showImgs() {
      <#list formList as field>
      <#if field.formType == 'multi-photo'>
        if (this.formDetailsDialog.${field.attrName}) {
          let arr = this.formDetailsDialog.${field.attrName}.split(",");
          arr.forEach(item=>{
            commonDownload({ uniqueName: item} ).then((res) => {
              const blob = new Blob([res.file], {
                type: res.file.type // 替换为对应的图片类型
              });
              this.imageUrlDialog${field.attrName}Arr.push({
                  file: URL.createObjectURL(blob),
                  name: item,
                  isBigShow: false,
                });
              });
          })
        }
      </#if>
      </#list> 
    }
  }
}

</script>

<style lang='less' scoped>

</style>