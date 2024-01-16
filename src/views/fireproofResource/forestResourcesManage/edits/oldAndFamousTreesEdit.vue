<!--  -->
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
        <span />

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
        <el-form-item
          label="调查号"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="investigationNum"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.investigationNum"
            style="width: 100%"
            placeholder="请输入调查号"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.investigationNum }}</div>
        </el-form-item>
        <el-form-item
          label="中文名"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="treeNameCn"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.treeNameCn"
            style="width: 100%"
            placeholder="请输入中文名"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.treeNameCn }}</div>
        </el-form-item>
        <el-form-item
          label="别名"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="treeOtherName"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.treeOtherName"
            style="width: 100%"
            placeholder="请输入别名"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.treeOtherName }}</div>
        </el-form-item>
        <el-form-item
          label="名木类别"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="famousWoodCategory"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.famousWoodCategory"
            style="width: 100%"
            placeholder="请输入名木类别"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.famousWoodCategory }}</div>
        </el-form-item>
        <el-form-item
          label="拉丁文"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="latin"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.latin"
            style="width: 100%"
            placeholder="请输入拉丁文"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.latin }}</div>
        </el-form-item>
        <el-form-item
          label="科"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="section"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.section"
            style="width: 100%"
            placeholder="请输入科"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.section }}</div>
        </el-form-item>
        <el-form-item
          label="属"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="genus"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.genus"
            style="width: 100%"
            placeholder="请输入属"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.genus }}</div>
        </el-form-item>
        <el-form-item
          label="编号"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="treeNumber"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.treeNumber"
            style="width: 100%"
            placeholder="请输入编号"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.treeNumber }}</div>
        </el-form-item>
        <el-form-item
          label="小地名"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="placeNames"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.placeNames"
            style="width: 100%"
            placeholder="请输入小地名"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.placeNames }}</div>
        </el-form-item>
        <el-form-item
          label="纵坐标"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="ordinate"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.ordinate"
            style="width: 100%"
            placeholder="请输入纵坐标"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.ordinate }}</div>
        </el-form-item>
        <el-form-item
          label="横坐标"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="abscissa"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.abscissa"
            style="width: 100%"
            placeholder="请输入横坐标"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.abscissa }}</div>
        </el-form-item>
        <el-form-item
          label="真实树龄"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="trueTreeAge"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.trueTreeAge"
            style="width: 100%"
            placeholder="请输入真实树龄"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.trueTreeAge }}</div>
        </el-form-item>
        <el-form-item
          label="评估树龄"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="assessmentTreeAge"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.assessmentTreeAge"
            style="width: 100%"
            placeholder="请输入评估树龄"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.assessmentTreeAge }}</div>
        </el-form-item>
        <el-form-item
          label="树高（米）"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="treeHeight"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.treeHeight"
            style="width: 100%"
            placeholder="请输入树高（米）"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.treeHeight }}</div>
        </el-form-item>
        <el-form-item
          label="胸径"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="treeDhb"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.treeDhb"
            style="width: 100%"
            placeholder="请输入胸径"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.treeDhb }}</div>
        </el-form-item>
        <el-form-item
          label="平均冠幅"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="averageWidth"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.averageWidth"
            style="width: 100%"
            placeholder="请输入平均冠幅"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.averageWidth }}</div>
        </el-form-item>
        <el-form-item
          label="东西冠幅"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="eastWest"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.eastWest"
            style="width: 100%"
            placeholder="请输入东西冠幅"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.eastWest }}</div>
        </el-form-item>
        <el-form-item
          label="南北冠幅"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="south"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.south"
            style="width: 100%"
            placeholder="请输入南北冠幅"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.south }}</div>
        </el-form-item>
        <el-form-item
          label="海拔"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="altitude"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.altitude"
            style="width: 100%"
            placeholder="请输入海拔"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.altitude }}</div>
        </el-form-item>
        <el-form-item
          label="影响生长环境因素"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="environmentalFactor"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.environmentalFactor"
            style="width: 100%"
            placeholder="请输入影响生长环境因素"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.environmentalFactor }}</div>
        </el-form-item>
        <el-form-item
          label="坡向"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="slopeAspect"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.slopeAspect"
            style="width: 100%"
            placeholder="请输入坡向"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.slopeAspect }}</div>
        </el-form-item>
        <el-form-item
          label="坡度"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="slope"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.slope"
            style="width: 100%"
            placeholder="请输入坡度"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.slope }}</div>
        </el-form-item>
        <el-form-item
          label="土壤名称"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="soilNames"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.soilNames"
            style="width: 100%"
            placeholder="请输入土壤名称"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.soilNames }}</div>
        </el-form-item>
        <el-form-item
          label="坡位"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="slopePosition"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.slopePosition"
            style="width: 100%"
            placeholder="请输入坡位"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.slopePosition }}</div>
        </el-form-item>
        <el-form-item
          label="生长势"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="growthPotential"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.growthPotential"
            style="width: 100%"
            placeholder="请输入生长势"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.growthPotential }}</div>
        </el-form-item>
        <el-form-item
          label="生长环境"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="growthEnvironment"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.growthEnvironment"
            style="width: 100%"
            placeholder="请输入生长环境"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.growthEnvironment }}</div>
        </el-form-item>
        <el-form-item
          label="现存状态"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="existingState"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.existingState"
            style="width: 100%"
            placeholder="请输入现存状态"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.existingState }}</div>
        </el-form-item>
        <el-form-item
          label="权属"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="ownership"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.ownership"
            style="width: 100%"
            placeholder="请输入权属"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.ownership }}</div>
        </el-form-item>
        <el-form-item
          label="养护复状现状"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="conservationStatus"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.conservationStatus"
            style="width: 100%"
            placeholder="请输入养护复状现状"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.conservationStatus }}</div>
        </el-form-item>
        <el-form-item
          label="原挂牌号"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="oldNum"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.oldNum"
            style="width: 100%"
            placeholder="请输入原挂牌号"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.oldNum }}</div>
        </el-form-item>
        <el-form-item
          label="管护单位"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="protectionUnit"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.protectionUnit"
            style="width: 100%"
            placeholder="请输入管护单位"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.protectionUnit }}</div>
        </el-form-item>
        <el-form-item
          label="栽植人"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="transplantingPerson"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.transplantingPerson"
            style="width: 100%"
            placeholder="请输入栽植人"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.transplantingPerson }}</div>
        </el-form-item>
        <el-form-item
          label="栽植时间"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="transplantingTime"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.transplantingTime"
            style="width: 100%"
            placeholder="请输入栽植时间"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.transplantingTime }}</div>
        </el-form-item>
        <el-form-item
          label="古树历史"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="treeHistory"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.treeHistory"
            style="width: 100%"
            placeholder="请输入古树历史"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.treeHistory }}</div>
        </el-form-item>
        <el-form-item
          label="树木特殊状况描述"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="specialDescription"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.specialDescription"
            type="textarea"
            placeholder="请输入树木特殊状况描述"
          />
          <div v-else>{{ formDetails.specialDescription }}</div>
        </el-form-item>

        <el-form-item
          label="树种鉴定记载"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="treeRecords"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.treeRecords"
            type="textarea"
            placeholder="请输入树种鉴定记载"
          />
          <div v-else>{{ formDetails.treeRecords }}</div>
        </el-form-item>

        <el-form-item
          label="备注"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="remark"
        >
          <tinymce
            v-if="detailsType != '详情'"
            v-model="formDetails.remark"
            :height="300"
          />
          <div v-else>
            <div v-html="formDetails.remark" />
          </div>
        </el-form-item>

        <!--  是否是空间信息  -->
        <span />

        <el-form-item
          label="多媒体照片"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="media"
        >
          <el-upload
            v-if="detailsType != '详情'"
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :before-upload="beforeImgUpload"
            :on-success="onUploadImgSuccessmedia"
          >
            <img v-if="imageUrlmedia" :src="imageUrlmedia" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>

          <div v-else>
            <img
              v-if="imageUrlmedia && !isShowimageUrlmedia"
              :src="imageUrlmedia"
              class="avatar"
              @click="isShowimageUrlmedia = true"
            />

            <div
              v-if="isShowimageUrlmedia"
              class="overlay"
              @click="isShowimageUrlmedia = false"
            >
              <img :src="imageUrlmedia" class="large-image" />
            </div>
          </div>
        </el-form-item>
      </el-form>
      <template v-if="isShowHandle">
        <div
          v-show="isShowMapBasisLayer"
          ref="contentMapBox"
          class="content-map-box"
        >
          <MapBasisLayer
            drawType="Point"
            v-show="isShowMapBasisLayer"
            ref="MapBasisLayer"
            :is-coordinate="detailsIsCoordinate"
            :is-terrain="false"
            @fullScreenClickOff="fullScreenClickOff"
          />
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
            />
          </div>

          <div class="map-btn" @click="isShowMapBasisLayerClick">
            <img
              v-if="isShowMapBasisLayer"
              class="img"
              src="@/static/templateImages/map-icon.png"
              alt=""
            />
            <img
              v-else
              class="img"
              src="@/static/templateImages/map-icon-off.png"
              alt=""
            />
          </div>
        </div>
      </template>
    </div>

    <!-- 这是属性框的底部按钮部分 -->
    <div v-show="isShowHandle" class="details-btn-box">
      <div v-if="detailsType == '详情'" class="btn-left">
        <div
          :class="[currentSelectionIndex == 0 ? 'left-text-no' : 'left-text']"
          @click="handleMoveSelectClick('up')"
        >
          上一条
        </div>
        <div
          :class="[
            currentSelectionIndex == tableData.length - 1
              ? 'left-text-no'
              : 'left-text',
          ]"
          @click="handleMoveSelectClick('down')"
        >
          下一条
        </div>
      </div>
      <div v-else>&nbsp;</div>
      <div v-if="detailsType == '详情'" class="btn-right">
        <div
          v-permission="['forestry:oldAndFamousTrees:delete']"
          class="right-text"
          @click="detailsDeleteClick"
        >
          删除
        </div>
        <el-button
          v-permission="['forestry:oldAndFamousTrees:update']"
          type="primary"
          class="right-btn"
          @click="detailsUpdateClick"
          >编辑</el-button
        >
      </div>
      <div v-else class="btn-right">
        <div class="right-text1" @click="detailsCancelClick">取消</div>
        <el-button type="primary" class="right-btn" @click="detailsSaveClick"
          >保存</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import AreaSelect from "@/components/AreaSelect"; // 这个是引入行政区划组件
import Pagination from "@/components/Pagination"; // 这个是引入分页组件

import DictionarySelect from "@/components/DictionarySelect"; // 引入下拉组件
import DictionaryText from "@/components/DictionaryText"; // 引入下拉文字显示组件
import MoreQuery from "@/components/MoreQuery"; // 引入更多组件
import Tinymce from "@/components/Tinymce"; // 引入富文本
import MapBasisLayer from "@/components/MapBasis";
import { deepClone, downloadFile } from "@/utils";
import { isArray } from "@/utils/validate";
import { commonDownload } from "@/api/system";
import { oldAndFamousTreesApi } from "@/api/forestry/oldAndFamousTrees";

const listItemDefault = {
  id: undefined,
  areaCode: "",
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
    MoreQuery,
  },
  props: {
    // 这个是控制是否需要操作功能
    isShowHandle: {
      type: Boolean,
      default: true,
    },
    // 选中行的index
    currentSelectionIndex: {
      type: Number,
      default: 0,
    },
    // 选中的行的数据
    currentSelection: {
      type: Object,
      default() {
        return {};
      },
    },
    // 每页的条数范围
    queryPageSize: {
      type: Number,
      default: 1,
    },
    // 表格数据
    tableData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      detailsType: "详情", // 这个类型只会有详情和编辑
      detailsIsCoordinate: false, // 列表框里的地图控制是否需要展示坐标采集
      isShowMapBasisLayer: true, // 控制列表中属性框的地图显示隐藏
      imageUrlmedia: "", // 控制图片预览
      isShowimageUrlmedia: false,
      uploadUrl: process.env.VUE_APP_BASE_API + "/files/minIo/common_upload",
      formDetails: deepClone(listItemDefault), // 这个是存放列表框中的属性框
      // 表单规则
      formRules: {
        areaCode: [
          { required: true, message: "请选择行政区划", trigger: "change" },
        ],
        specialDescription: [
          {
            required: true,
            message: "请输入树木特殊状况描述",
            trigger: "blur",
          },
        ],
        treeRecords: [
          { required: true, message: "请输入树种鉴定记载", trigger: "blur" },
        ],
        remark: [{ required: true, message: "请选择备注", trigger: "change" }],
        boundaryLine: [
          { required: true, message: "请输入坐标", trigger: "blur" },
        ],
      },
    };
  },

  // components: {},

  // watch: {},

  // computed: {},

  created() {
    this.initDetails();
  },

  // mounted(){},

  methods: {
    async initDetails() {
      this.formDetails = deepClone(listItemDefault);
      // this.isShowMapBasisLayer = true;
      this.detailsType = "详情";
      this.clearImgUrlFunction();
      if (this.currentSelection) {
        await this.getDetailsFunction(this.currentSelection, "formDetails");
        this.showImg();
        this.handleIsShow();
        this.$nextTick(() => {
          const obj = {
            state: "details", // 状态详情还是编辑details,update,add
            wktString: this.formDetails.boundaryLine,
          };
          setTimeout(() => {
            if (this.$refs["MapBasisLayer"]?.addPointLayer) {
              this.$refs["MapBasisLayer"].addPointLayer(obj);
            }
          }, 0);
        });
      }
    },

    //方便父组件更新详情的方法
    async updateDetails() {
      await this.getDetailsFunction(this.currentSelection, "formDetails");
      this.showImg();
      this.handleIsShow();
    },

    // 列表属性框中的编辑点击事件
    async detailsUpdateClick() {
      this.formDetails = deepClone(listItemDefault);
      await this.getDetailsFunction(this.currentSelection, "formDetails");
      this.showImg();
      this.detailsType = "编辑";
      this.$message({
        type: "warning",
        message: "切换其他数据时，当前编辑的数据不会保存！",
        duration: 4000,
      });
      this.$nextTick(() => {
        const obj = {
          state: "update", // 状态详情还是编辑details,update,add
          wktString: this.formDetails.boundaryLine,
        };
        setTimeout(() => {
          this.$refs["MapBasisLayer"].addPointLayer(obj);
        }, 0);
      });
    },

    // 列表属性框中的删除点击事件
    detailsDeleteClick() {
      this.$emit("detailsDeleteClick");
    },

    // 列表属性框中的取消按钮事件
    detailsCancelClick() {
      this.detailsType = "详情";
      this.resetForm("formDetails");
      this.$emit("detailsCancelClick");
    },

    // 列表属性框中的保存点击事件
    detailsSaveClick() {
      this.$refs["formDetails"].validate((valid) => {
        if (valid) {
          // 这里是对行政区划选择的数据处理，因为选择的后返回的是数组，所以要取最后一个
          const temp = deepClone(this.$refs["area-filter"].codes);
          if (isArray(temp) && temp.length > 0) {
            this.formDetails.areaCode = temp.pop();
          } else {
            delete this.formDetails.areaCode;
          }
          this.formDetails.boundaryLine =
            this.$refs["MapBasisLayer"].returnAddLayerWkt();
          if (!this.formDetails.boundaryLine) {
            this.$message({
              type: "error",
              message: "请在地图绘制对应位置",
            });
            return;
          }

          let data = {};
          for (let key in this.formDetails) {
            data[key] =
              this.formDetails[key] == null ? undefined : this.formDetails[key];
          }

          oldAndFamousTreesApi("update", "post", data)
            .then((res) => {
              this.$message({
                type: "success",
                message: "修改成功",
              });
              this.$emit("detailsSubmitClick");
            })
            .catch((err) => {});
        }
      });
    },

    // 列表属性框中的全屏按钮点击事件
    detailsFullScreenClick() {
      this.detailsIsCoordinate = true; // 全屏后开启地图的坐标采集
      setTimeout(() => {
        this.$refs["MapBasisLayer"].fullScreen();
      }, 0);
    },

    // 列表属性框中地图全屏按钮关闭回调事件
    fullScreenClickOff(wktdata) {
      this.detailsIsCoordinate = false;
    },

    // 列表属性框中的上一条下一条点击事件
    async handleMoveSelectClick(type) {
      this.$emit("handleMoveSelectClick", type);
    },

    // 列表属性框中的地图缩放按钮
    isShowMapBasisLayerClick() {
      this.isShowMapBasisLayer = !this.isShowMapBasisLayer;
      if (this.isShowMapBasisLayer) {
        this.$nextTick(() => {
          const obj = {
            state: "details", // 状态详情还是编辑details,update,add
            wktString: this.formDetails.boundaryLine,
          };
          setTimeout(() => {
            this.$refs["MapBasisLayer"].updateSizeFunction();
            this.$refs["MapBasisLayer"].addPointLayer(obj);
          }, 0);
        });
      }
    },

    fileDown(name) {
      commonDownload({ uniqueName: name }).then((res) => {
        downloadFile(res.file, res.name);
      });
    },

    beforeImgUpload(file) {
      const name = file.name;
      if (name.endsWith(".png") || name.endsWith(".jpg")) {
        return true;
      } else {
        this.$msgbox({
          title: "请注意",
          message: "您选择文件是" + name + "，文件类型错误，请重试",
        });
        return false;
      }
    },

    // 的上传成功的钩子
    onUploadImgSuccessmedia(res, file, fileList) {
      if (res.code != "200") {
        this.$msgbox({
          title: "请注意",
          message: res.message,
        });
        return;
      } else {
        this.formDetails.media = res.data.uniqueName;
        this.imageUrlmedia = URL.createObjectURL(file.raw);
        this.$message.success("上传成功");
      }
    },

    // 表单中区划选择配套的事件
    changeAreaDetails(v) {
      const temp = deepClone(v);
      if (isArray(temp) && temp.length > 0) {
        this.formDetails.areaCode = temp.pop();
      } else {
        this.formDetails.areaCode = "";
      }
    },

    // 敏感数据显示隐藏
    isShowSecretFunction(data, start, end) {
      if (!data) {
        return;
      }
      end = end == -1 ? data.length : end;
      let dataText = JSON.parse(JSON.stringify(data));
      let xingnum = end - start;
      let xing = "";
      for (let i = 0; i < xingnum; i++) {
        xing += "*";
      }
      let text;
      text = dataText.replace(dataText.substring(start, end), xing); // 利用

      return text;
    },

    // 获取明细
    getDetailsFunction(queryData, listdata) {
      return new Promise((resolve, reject) => {
        oldAndFamousTreesApi("detail", "get", { id: queryData.id })
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
      if (this.formDetails.media) {
        commonDownload({ uniqueName: this.formDetails.media }).then((res) => {
          const blob = new Blob([res.file], {
            type: res.file.type, // 替换为对应的图片类型
          });
          this.imageUrlmedia = URL.createObjectURL(blob);
        });
      }
    },

    // 清空图片地址
    clearImgUrlFunction() {
      this.imageUrlmedia = "";
    },

    // 查看详情的时候把数据都脱敏
    handleIsShow() {},
  },
};
</script>

<style lang="less" scoped></style>
