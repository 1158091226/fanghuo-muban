<!-- 图例管理 -->
<template>
  <div class="app-container">
    <el-row :gutter="20" class="search-content">
      <!-- 筛选条件 -->
      <el-col :span="16">
        <el-input
          v-model="listQuery.cnName"
          v-permission="[path + ':query']"
          :placeholder="'请输入' + $t('resourceTree.cnName')"
          class="w200"
          @keyup.enter.native="handleFilter"
        />

        <el-select
          v-model="listQuery.enable"
          v-permission="[path + ':query']"
          :placeholder="'请选择' + $t('resourceTree.enable')"
          clearable
          class="w200 ml-10"
        >
          <el-option
            v-for="v in statusMap"
            :key="v.key"
            :label="v.value"
            :value="v.key"
          />
        </el-select>
        <el-button class="search-btn ml-10" @click="handleFilter()">{{
          $t("table.search")
        }}</el-button>
      </el-col>
      <!-- 操作栏 -->
      <el-col :span="8">
        <div style="text-align: right">
          <el-button
            v-permission="[path + ':create']"
            type="success"
            icon="el-icon-plus"
            plain
            size="small"
            @click="handleCreate"
          >
            {{ $t("table.create") }}
          </el-button>
          <el-button icon="el-icon-sort" @click="toggleExpandAll">{{
            !isExpandAll ? "展开" : "折叠"
          }}</el-button>
        </div>
      </el-col>
    </el-row>

    <el-table
      v-if="listRefresh"
      v-loading="loading"
      :data="list"
      :default-expand-all="isExpandAll"
      lazy
      highlight-current-row
      row-key="id"
      class="c-table mt-20"
      height="calc(100vh - 210px)"
      style="width: 100%; height: calc(100vh - 210px)"
      :tree-props="{ children: 'childList' }"
    >
      <el-table-column :label="$t('resourceTree.sorting')" width="180">
        <template slot-scope="{ row }">
          <span>{{ row.sorting }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('resourceTree.cnName')">
        <template slot-scope="{ row }">
          <span>{{ row.cnName }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column :label="$t('resourceTree.cqlFilter')">
        <template slot-scope="{ row }">
          <span>{{ row.cqlFilter }}</span>
        </template>
      </el-table-column> -->

      <el-table-column label="图标">
        <template slot-scope="{ row }">
          <img
            v-if="row.type === 3 && row.pointWellKnownName"
            style="width: 34px; height: 42px"
            :src="imgurl + row.pointWellKnownName"
            class="avatar"
          />
        </template>
      </el-table-column>

      <el-table-column label="英文名">
        <template slot-scope="{ row }">
          <div>{{ row.enName }}</div>
        </template>
      </el-table-column>

      <el-table-column label="图层描述名称">
        <template slot-scope="{ row }">
          <div>{{ row.describe ? row.describe.layerDetailName : "" }}</div>
        </template>
      </el-table-column>

      <el-table-column label="样式">
        <template slot-scope="{ row }">
          <div
            v-show="row.type === 3 || row.type === 4"
            :style="{
              width: '50px',
              height: '30px',
              borderStyle: 'solid',
              borderColor: row.strokeColor || 'transparent',
              borderWidth: row.strokeWidth + 'px' || '0px',
              opacity: row.fillOpacity || 1,
              background: row.fillColor,
            }"
          />
          <div
            v-show="row.type === 2"
            :style="{
              fontSize: '20px',
              color: row.fillColor,
              textShadow: `${row.strokeColor} 1px 0 0, ${row.strokeColor} 0 1px 0, ${row.strokeColor} -1px 0 0, ${row.strokeColor} 0 -1px 0`,
            }"
          >
            {{ row.columnName }}
          </div>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('resourceTree.type')"
        align="center"
        width="100"
      >
        <template slot-scope="{ row }">
          <el-tag v-if="row.type == 1" type="primary">目录</el-tag>
          <el-tag v-else type="success">菜单</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('resourceTree.enable')"
        align="center"
        width="100"
      >
        <template slot-scope="{ row }">
          <el-tooltip
            :content="'当前状态: ' + statusMap[row.enable].value"
            placement="top"
          >
            <el-switch
              v-model="row.enable"
              :active-value="0"
              :inactive-value="1"
              @change="handleStatus(row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" width="100" align="center">
        <template slot-scope="scope">
          <el-button
            v-permission="[path + ':update']"
            type="text"
            size="small"
            @click="handleUpdate(scope)"
          >
            {{ $t("table.update") }}
          </el-button>
          <el-button
            v-if="scope.row.parentId != -1"
            v-permission="[path + ':delete']"
            type="text"
            size="small"
            @click="handleDelete(scope.row)"
          >
            {{ $t("table.delete") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog
      :title="textMap[formStateMap]"
      :visible.sync="formVisible"
      width="850px"
    >
      <el-form
        ref="form"
        v-loading="dialogLoading"
        :model="item"
        :rules="rules"
        label-width="120px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('resourceTree.parentId')" prop="parentId">
              <treeselect
                v-model="item.parentId"
                :options="menuMap"
                :normalizer="normalizer"
                :show-count="true"
                :placeholder="'选择' + $t('resourceTree.parentId')"
                @select="handleTreeSelect"
                :disabled="formStateMap == 'update'"
              />
            </el-form-item>
          </el-col>

          <el-col
            v-show="formStateMap == 'create' && item.type != -1"
            :span="24"
          >
            <el-form-item :label="$t('resourceTree.type')" prop="type">
              <el-radio-group v-model="item.type" @input="itemTypeInput">
                <el-radio
                  v-for="item in typeOptions"
                  :key="item.id"
                  :label="item.id"
                  >{{ item.name }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col
            v-show="formStateMap == 'update' && item.type != -1"
            :span="24"
          >
            <el-form-item :label="$t('resourceTree.type')" prop="type">
              <el-radio-group
                v-model="item.type"
                @input="itemTypeInput"
                :disabled="true"
              >
                <el-radio :label="0">目录</el-radio>
                <el-radio :label="2">已发布图层</el-radio>
                <el-radio :label="3">简单图层</el-radio>
                <el-radio :label="4">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <!-- 目录 -->
          <template v-if="item.type == 0">
            <el-col :span="12">
              <el-form-item :label="$t('resourceTree.cnName')" prop="cnName">
                <el-input
                  v-model="item.cnName"
                  :placeholder="'请输入' + $t('resourceTree.cnName')"
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="图层描述" prop="describeId">
                <el-select
                  v-model="item.describeId"
                  style="width: 100%"
                  clearable
                  :placeholder="'请选择'"
                >
                  <el-option
                    v-for="(item, index) in layersDescribeOption"
                    :key="index + item.id"
                    :label="item.layerDetailName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item :label="$t('resourceTree.sorting')" prop="sorting">
                <el-input-number
                  v-model="item.sorting"
                  controls-position="right"
                  :min="0"
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item>
                <span slot="label">
                  <el-tooltip
                    content="选择停用则路由将不会出现在侧边栏，也不能被访问"
                    placement="top"
                  >
                    <i class="el-icon-question" />
                  </el-tooltip>
                  {{ $t("resourceTree.enable") }}
                </span>
                <el-radio-group v-model="item.enable">
                  <el-radio
                    v-for="v in statusMap"
                    :key="v.key"
                    :label="v.key"
                    >{{ v.value }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
            </el-col>
          </template>

          <!-- 已发布图层 -->
          <template v-if="item.type == 2">
            <el-col :span="12">
              <el-form-item :label="$t('resourceTree.cnName')" prop="cnName">
                <el-input
                  v-model="item.cnName"
                  :placeholder="'请输入' + $t('resourceTree.cnName')"
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="英文名" prop="enName">
                <el-input v-model="item.enName" placeholder="请输入英文名" />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="数据类型" prop="geometryType">
                <el-radio-group v-model="item.geometryType">
                  <el-radio label="Point">点状数据</el-radio>
                  <el-radio label="Polygon">面状数据</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <template v-if="item.geometryType == 'Point'"> </template>
            <template v-if="item.geometryType == 'Polygon'">
              <el-col :span="12">
                <el-form-item label="注记关联字段名" prop="columnName">
                  <!-- <el-select
                    v-model="item.columnName"
                    style="width: 100%"
                    clearable
                    :placeholder="'请选择'"
                    @change="columnNameChange"
                  >
                    <el-option
                      v-for="(item, index) in columnNameOptions"
                      :key="index + item"
                      :label="item"
                      :value="item"
                    />
                  </el-select> -->

                  <el-input
                    v-model="item.columnName"
                    placeholder="请输入注记关联字段名"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="注记文字大小" prop="inOrEquals">
                  <el-input-number
                    v-model="item.inOrEquals"
                    controls-position="right"
                    :min="0"
                    :max="999"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="注记描边颜色" class="colorSelect">
                  <el-color-picker v-model="item.strokeColor" />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="注记填充颜色" class="colorSelect">
                  <el-color-picker v-model="item.fillColor" />
                </el-form-item>
              </el-col>
            </template>

            <el-col :span="12">
              <el-form-item label="图层描述" prop="describeId">
                <el-select
                  v-model="item.describeId"
                  style="width: 100%"
                  clearable
                  :placeholder="'请选择'"
                >
                  <el-option
                    v-for="(item, index) in layersDescribeOption"
                    :key="index + item.id"
                    :label="item.layerDetailName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item :label="$t('resourceTree.sorting')" prop="sorting">
                <el-input-number
                  v-model="item.sorting"
                  controls-position="right"
                  :min="0"
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item>
                <span slot="label">
                  <el-tooltip
                    content="选择停用则路由将不会出现在侧边栏，也不能被访问"
                    placement="top"
                  >
                    <i class="el-icon-question" />
                  </el-tooltip>
                  {{ $t("resourceTree.enable") }}
                </span>
                <el-radio-group v-model="item.enable">
                  <el-radio
                    v-for="v in statusMap"
                    :key="v.key"
                    :label="v.key"
                    >{{ v.value }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
            </el-col>
          </template>

          <!-- 简单图层 -->
          <template v-if="item.type == 3">
            <el-col :span="12">
              <el-form-item :label="$t('resourceTree.cnName')" prop="cnName">
                <el-input
                  v-model="item.cnName"
                  :placeholder="'请输入' + $t('resourceTree.cnName')"
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="英文名" prop="enName">
                <el-input v-model="item.enName" placeholder="请输入英文名" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="筛选条件">
                <el-input
                  v-model="item.cqlFilter"
                  placeholder="请输入筛选条件"
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="WKT标题参数">
                <el-input
                  v-model="item.columnName"
                  placeholder="请输入WKT标题参数"
                />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="数据类型" prop="geometryType">
                <el-radio-group v-model="item.geometryType">
                  <el-radio label="Point">点状数据</el-radio>
                  <el-radio label="Polygon">面状数据</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <template v-if="item.geometryType == 'Point'">
              <el-col :span="12">
                <el-form-item label="图片" prop="pointWellKnownName">
                  <el-upload
                    class="avatar-uploader"
                    style="height: 100px"
                    :action="uploadUrl"
                    :show-file-list="false"
                    :before-upload="beforeImgUpload"
                    :on-success="onUploadImgDialogSuccessphotoUniqueName"
                  >
                    <div
                      v-if="imageUrlDialogphotoUniqueName"
                      style="position: relative"
                    >
                      <img
                        :src="imageUrlDialogphotoUniqueName"
                        class="avatar"
                      />
                      <img
                        slot="suffix"
                        class="avatar-error"
                        src="~@/static/templateImages/close-circle-filled.png"
                        alt=""
                        @click.stop="
                          imageUrlDialogphotoUniqueName = '';
                          item.pointWellKnownName = '';
                        "
                      />
                    </div>
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
                  </el-upload>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item
                  :label="$t('resourceTree.fillColor')"
                  class="colorSelect"
                  prop="fillColor"
                >
                  <el-color-picker v-model="item.fillColor" />
                </el-form-item>
              </el-col>
            </template>
            <template v-if="item.geometryType == 'Polygon'">
              <el-col :span="12">
                <el-form-item
                  :label="$t('resourceTree.strokeColor')"
                  class="colorSelect"
                >
                  <el-color-picker v-model="item.strokeColor" />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item
                  :label="$t('resourceTree.strokeWidth')"
                  prop="strokeWidth"
                >
                  <el-input-number
                    v-model="item.strokeWidth"
                    controls-position="right"
                    :min="0"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item
                  :label="$t('resourceTree.fillOpacity')"
                  prop="fillOpacity"
                >
                  <el-input-number
                    v-model="item.fillOpacity"
                    controls-position="right"
                    :min="0"
                    :step="0.1"
                    :max="1"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item
                  :label="$t('resourceTree.fillColor')"
                  class="colorSelect"
                  prop="fillColor"
                >
                  <el-color-picker v-model="item.fillColor" />
                </el-form-item>
              </el-col>
            </template>

            <el-col :span="12">
              <el-form-item label="图层描述" prop="describeId">
                <el-select
                  v-model="item.describeId"
                  style="width: 100%"
                  clearable
                  :placeholder="'请选择'"
                >
                  <el-option
                    v-for="(item, index) in layersDescribeOption"
                    :key="index + item.id"
                    :label="item.layerDetailName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item :label="$t('resourceTree.sorting')" prop="sorting">
                <el-input-number
                  v-model="item.sorting"
                  controls-position="right"
                  :min="0"
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item>
                <span slot="label">
                  <el-tooltip
                    content="选择停用则路由将不会出现在侧边栏，也不能被访问"
                    placement="top"
                  >
                    <i class="el-icon-question" />
                  </el-tooltip>
                  {{ $t("resourceTree.enable") }}
                </span>
                <el-radio-group v-model="item.enable">
                  <el-radio
                    v-for="v in statusMap"
                    :key="v.key"
                    :label="v.key"
                    >{{ v.value }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
            </el-col>
          </template>

          <!-- 按钮 -->
          <template v-if="item.type == 4">
            <el-col :span="12">
              <el-form-item :label="$t('resourceTree.cnName')" prop="cnName">
                <el-input
                  v-model="item.cnName"
                  :placeholder="'请输入' + $t('resourceTree.cnName')"
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="英文名" prop="enName">
                <el-input v-model="item.enName" placeholder="请输入英文名" />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="数据类型" prop="geometryType">
                <el-radio-group v-model="item.geometryType">
                  <el-radio label="Point">点状数据</el-radio>
                  <el-radio label="Polygon">面状数据</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item
                :label="$t('resourceTree.cqlFilter')"
                :prop="item.type == 4 ? 'cqlFilter' : ''"
              >
                <!-- <el-select
                  v-model="item.columnName"
                  style="width: 40%"
                  clearable
                  :placeholder="'请选择'"
                  @change="columnNameChange"
                >
                  <el-option
                    v-for="(item, index) in columnNameOptions"
                    :key="index + item"
                    :label="item"
                    :value="item"
                  />
                </el-select> -->

                <el-input
                  style="width: 40%"
                  v-model="item.columnName"
                  placeholder="请输入注记关联字段名"
                />

                <el-select
                  v-model="item.inOrEquals"
                  class="ml-10"
                  style="width: 17%"
                  :placeholder="'请选择'"
                  @change="inOrEqualsChange"
                >
                  <el-option
                    v-for="item in inOrEqualsOptions"
                    :key="item.id"
                    :label="item.value"
                    :value="item.id"
                  />
                </el-select>

                <el-autocomplete
                  v-if="item.inOrEquals == 0"
                  v-model="item.filterCondition0"
                  style="width: 40%"
                  class="ml-10"
                  clearable
                  :fetch-suggestions="querySearch"
                  placeholder="请输入内容"
                />

                <el-select
                  v-if="item.inOrEquals == 1"
                  v-model="item.filterCondition1"
                  class="ml-10"
                  style="width: 40%"
                  multiple
                  collapse-tags
                  :placeholder="'请选择'"
                >
                  <el-option
                    v-for="item in filterCondition1Options"
                    :key="item.id"
                    :label="item.value"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <template v-if="item.geometryType == 'Point'">
              <el-col :span="12">
                <el-form-item label="图片" prop="pointWellKnownName">
                  <el-upload
                    class="avatar-uploader"
                    style="height: 100px"
                    :action="uploadUrl"
                    :show-file-list="false"
                    :before-upload="beforeImgUpload"
                    :on-success="onUploadImgDialogSuccessphotoUniqueName"
                  >
                    <div
                      v-if="imageUrlDialogphotoUniqueName"
                      style="position: relative"
                    >
                      <img
                        :src="imageUrlDialogphotoUniqueName"
                        class="avatar"
                      />
                      <img
                        slot="suffix"
                        class="avatar-error"
                        src="~@/static/templateImages/close-circle-filled.png"
                        alt=""
                        @click.stop="
                          imageUrlDialogphotoUniqueName = '';
                          item.pointWellKnownName = '';
                        "
                      />
                    </div>
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
                  </el-upload>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item
                  :label="$t('resourceTree.fillColor')"
                  class="colorSelect"
                  prop="fillColor"
                >
                  <el-color-picker v-model="item.fillColor" />
                </el-form-item>
              </el-col>
            </template>
            <template v-if="item.geometryType == 'Polygon'">
              <el-col :span="12">
                <el-form-item
                  :label="$t('resourceTree.strokeColor')"
                  class="colorSelect"
                >
                  <el-color-picker v-model="item.strokeColor" />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item
                  :label="$t('resourceTree.strokeWidth')"
                  prop="strokeWidth"
                >
                  <el-input-number
                    v-model="item.strokeWidth"
                    controls-position="right"
                    :min="0"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item
                  :label="$t('resourceTree.fillOpacity')"
                  prop="fillOpacity"
                >
                  <el-input-number
                    v-model="item.fillOpacity"
                    controls-position="right"
                    :min="0"
                    :step="0.1"
                    :max="1"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item
                  :label="$t('resourceTree.fillColor')"
                  class="colorSelect"
                  prop="fillColor"
                >
                  <el-color-picker v-model="item.fillColor" />
                </el-form-item>
              </el-col>
            </template>

            <el-col :span="12">
              <el-form-item label="图层描述" prop="describeId">
                <el-select
                  v-model="item.describeId"
                  style="width: 100%"
                  clearable
                  :placeholder="'请选择'"
                >
                  <el-option
                    v-for="(item, index) in layersDescribeOption"
                    :key="index + item.id"
                    :label="item.layerDetailName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item :label="$t('resourceTree.sorting')" prop="sorting">
                <el-input-number
                  v-model="item.sorting"
                  controls-position="right"
                  :min="0"
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item>
                <span slot="label">
                  <el-tooltip
                    content="选择停用则路由将不会出现在侧边栏，也不能被访问"
                    placement="top"
                  >
                    <i class="el-icon-question" />
                  </el-tooltip>
                  {{ $t("resourceTree.enable") }}
                </span>
                <el-radio-group v-model="item.enable">
                  <el-radio
                    v-for="v in statusMap"
                    :key="v.key"
                    :label="v.key"
                    >{{ v.value }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :disabled="dialogLoading" @click="formVisible = false">
          {{ $t("table.cancel") }}
        </el-button>
        <el-button
          type="primary"
          :disabled="dialogLoading"
          @click="formStateMap === 'create' ? createData() : updateData()"
        >
          {{ $t("table.confirm") }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone, permissionPath } from "@/utils";
import {
  updateLegendlDetail,
  updateLegendlUpdate,
  updateLegendlEnable,
  updateLegendlPage,
  updateLegendlAdd,
  updateLegendlDelete,
  updateLegendlList,
  updateLegendlListNew,
  legendGetColumnList,
  legendGetdataList,
  legendGetdataListByColumn,
  legendRefreshStyle,
  updateLegendlUpdateLabel,
  commonDownload,
  layersDescribeApi,
  commonDownThumbnailload,
} from "@/api/system";
import waves from "@/directive/waves"; // waves directive
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

const itemDefault = {
  cnName: undefined, // 中文名
  cqlFilter: undefined, // 筛选的sql语句
  enName: undefined, // 英文名字
  enable: 0, // 是否可用 0可用1不可用
  fillColor: undefined, // 填充颜色
  fillOpacity: undefined, // 填充颜色透明度
  icon: undefined, // 图标
  media: undefined, // 多媒体
  parentId: -1, // 父级id
  remark: undefined, // 备注
  sorting: undefined, // 排序
  strokeColor: undefined, // 线条颜色
  strokeWidth: undefined, // 线条宽度
  type: 0, // 类型 0菜单1目录
  describeId: undefined, //关联的描述id
  inOrEquals: 0, // 过滤语句第二个值
  filterCondition0: undefined, // 过滤语句第三个值第一类
  filterCondition1: undefined, // 过滤语句第三个值第二类
  columnName: undefined, // 过滤语句的第一个值
  geometryType: "Point", //数据类型
  pointWellKnownName: "", //图片名称

  // id: undefined,
  // parentId: 0,
  // menuName: undefined,
  // icon: undefined,
  // menuType: 'M',
  // orderNum: 1,
  // isFrame: '1',
  // isCache: '0',
  // visible: '0',
  // status: '0'
};

export default {
  components: {
    Treeselect,
  },
  directives: { waves },
  filters: {},
  data() {
    const sqlFiltervalidator = (rule, value, callback) => {
      const filterCondition0 = this.item.filterCondition0;
      const filterCondition1 = this.item.filterCondition1;
      const columnName = this.item.columnName;
      const inOrEquals = this.item.inOrEquals;
      if (inOrEquals === 0) {
        if (!filterCondition0 || !columnName) {
          callback(new Error("请选择"));
        } else {
          callback();
        }
      } else {
        if (filterCondition1.length == 0 || !columnName) {
          callback(new Error("请选择"));
        } else {
          callback();
        }
      }
    };
    return {
      path: permissionPath(this.$route.path),
      listKey: 0,
      list: [],
      allList: [],
      loading: false,
      listQuery: {
        cnName: undefined,
        enable: undefined,
      },
      item: {},
      dialogLoading: false, // 弹窗加载状态

      formVisible: false,
      formStateMap: "",
      deleteVisible: false,
      textMap: {
        update: "编辑",
        create: "新增",
      },
      rules: {
        parentId: [
          { required: true, message: "请选择上级菜单", trigger: "change" },
        ],
        cnName: [
          { required: true, message: "菜单名称不能为空", trigger: "blur" },
        ],
        // enName: [
        //   { required: true, message: '英文名称不能为空', trigger: 'blur' }
        // ],
        cqlFilter: [
          { required: true, validator: sqlFiltervalidator, trigger: "change" },
        ],
        sorting: [
          { required: true, message: "菜单顺序不能为空", trigger: "blur" },
        ],
        fillColor: [
          { required: true, message: "填充颜色不能为空", trigger: "change" },
        ],
        pointWellKnownName: [
          { required: true, message: "图片不能为空", trigger: "change" },
        ],
        // path: [{ required: true, message: '路由地址不能为空', trigger: 'blur' }]
      },
      statusMap: [
        { key: 0, value: "启用" },
        { key: 1, value: "禁用" },
      ],
      visibleMap: [
        { key: "0", value: "显示" },
        { key: "1", value: "隐藏" },
      ],
      menuMap: [],
      // 是否展开，默认全部折叠
      isExpandAll: false,
      // 重新渲染表格状态
      listRefresh: true,
      columnNameOptions: [],
      filterCondition1Options: [],
      inOrEqualsOptions: [
        { value: "=", id: 0 },
        { value: "IN", id: 1 },
      ],
      uploadUrl: process.env.VUE_APP_BASE_API + "/files/minIo/common_upload",
      imgurl:
        process.env.VUE_APP_BASE_API +
        "/files/minIo/thumbnail_download?uniqueName=",
      imageUrlDialogphotoUniqueName: "", // 控制图片预览
      isShowimageUrlDialogphotoUniqueName: false,

      layersDescribeOption: [],
      parentType: "", //用于记录所选择的上级菜单是什么类型的 往上的层级是否有“已发布图层”，
      typeOptions: [
        { name: "目录", id: 0 },
        { name: "已发布图层", id: 2 },
        { name: "简单图层", id: 3 },
        // { name: "按钮", id: 4 },
      ],
    };
  },
  beforeCreate() {
    // legendGetColumnList().then((res) => {
    //   this.columnNameOptions = res.data;
    // });
    layersDescribeApi("all_list", "get").then((res) => {
      this.layersDescribeOption = res.data;
    });
  },
  created() {
    this.getList();
  },
  methods: {
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

    // 弹窗的上传成功的钩子
    onUploadImgDialogSuccessphotoUniqueName(res, file, fileList) {
      if (res.code != "200") {
        this.$msgbox({
          title: "请注意",
          message: res.message,
        });
        return;
      } else {
        this.item.pointWellKnownName = res.data.uniqueName;
        this.imageUrlDialogphotoUniqueName = URL.createObjectURL(file.raw);
        this.$refs["form"].clearValidate();
        this.$message.success("上传成功");
      }
    },

    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.listRefresh = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.listRefresh = true;
      });
    },

    querySearch(queryString, cb) {
      if (this.item.columnName && queryString) {
        const restaurants = this.filterCondition1Options;
        const results = restaurants.filter((item) => {
          return (
            item.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1
          );
        });
        const list = results.map((item) => {
          return { value: item };
        });
        cb(results);
      } else {
        cb(this.filterCondition1Options);
      }
    },

    columnNameChange(data) {
      this.filterCondition1Options = [];
      if (data) {
        legendGetdataListByColumn({
          columnName: data,
          tableName: this.item.columnName || "",
        }).then((res) => {
          const list = res.data.map((item) => {
            return { value: item, id: item };
          });
          this.item.filterCondition0 = "";
          this.item.filterCondition1 = "";
          this.filterCondition1Options = list;
        });
      } else {
        this.item.filterCondition0 = "";
        this.item.filterCondition1 = "";
        this.filterCondition1Options = [];
      }
    },

    inOrEqualsChange() {
      this.item.filterCondition0 = "";
      this.item.filterCondition1 = "";
    },

    // 选择图标
    selectedIcon(name) {
      this.item.icon = name;
    },

    handleTreeSelect(node) {
      console.log(`output->`, node);
      this.isPublishFunction(node);
      console.log(`output->this.parentType`, this.parentType);
      if (this.parentType == "isTwo") {
        //有“已发布图层”
        //有的情况下，可以创建目录和按钮
        this.typeOptions = [
          { name: "目录", id: 0 },
          { name: "按钮", id: 4 },
        ];
        this.item.type = 0;
      }
      if (this.parentType == "isNoTwo") {
        //无“已发布图层”
        //无的情况下，可以创建目录、简单图、已发布图层
        this.typeOptions = [
          { name: "目录", id: 0 },
          { name: "已发布图层", id: 2 },
          { name: "简单图层", id: 3 },
        ];
        this.item.type = 0;
      }
      if (this.parentType == "isThree") {
        //“简单图”
        //简单图应该是什么都创建不了了
        this.typeOptions = [];
        this.item.type = -1;
      }
      if (this.parentType == "isBtn") {
        //“按钮”
        //按钮应该是什么都创建不了了
        this.typeOptions = [];
        this.item.type = -1;
      }
    },

    isPublishFunction(data) {
      //递归中拒绝return取值，使用外部变量取值
      if (data.type === 2) {
        //2是已发布图层
        this.parentType = "isTwo";
        return "isTwo";
      }
      if (data.type === 3) {
        //3是简单图
        this.parentType = "isThree";
        return "isThree";
      }
      if (data.type === 4) {
        //4是按钮
        this.parentType = "isBtn";
        return "isBtn";
      }
      console.log(`output->data`, data);
      let ishas = this.allList.some((item) => {
        return item.id === data.parentId;
      });
      if (ishas) {
        let selectdata = this.allList.find((item) => {
          return item.id === data.parentId;
        });
        this.isPublishFunction(selectdata);
      } else {
        this.parentType = "isNoTwo";
        return "isNoTwo";
      }
    },

    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      let typText = "";
      switch (node.type) {
        case 0:
          typText = " (目录)";
          break;
        case 3:
          typText = " (简单图层)";
          break;
        case 2:
          typText = " (已发布图层)";
          break;
        case 4:
          typText = " (按钮)";
          break;
      }
      return {
        id: node.id,
        label: node.cnName + typText,
        children: node.children,
      };
    },

    /** 查询菜单下拉树结构 */
    getTreeselect() {
      updateLegendlPage({
        pageNo: 1,
        pageSize: 99999,
        sort: {
          parentId: "desc",
        },
      }).then((res) => {
        this.allList = res.data.list;
        this.menuMap = [];
        const menu = { id: -1, cnName: "主类目", children: [] };
        menu.children = this.handleTree(res.data.list, "id");
        this.menuMap.push(menu);
      });
    },

    // 动态国际化
    translateTable(key) {
      if (!key) {
        return;
      }
      const value = "table." + key;
      return this.$t(value);
    },

    getList() {
      this.loading = true;
      // updateLegendlList({
      //   cnName: this.listQuery.cnName,
      //   enable: this.listQuery.enable
      // }).then((res) => {
      updateLegendlListNew({
        cnName: this.listQuery.cnName,
        enable: this.listQuery.enable,
      }).then((res) => {
        // const childArr = JSON.parse(JSON.stringify([res.data[2]]));

        // const childArr = [];
        // for (const key in res.data) {
        //   if (res.data[key]) {
        //     childArr.push(res.data[key]);
        //   }
        // }

        this.list = res.data;
        this.loading = false;
      });
    },

    getItem(id) {
      updateLegendlDetail(id).then((response) => {
        this.item = Object.assign({}, response.data);
        legendGetdataList({
          tableName: this.item.columnName || "",
        }).then((res) => {
          const list = res.data.map((item) => {
            return { value: item, id: item };
          });

          this.filterCondition1Options = list;
        });
        if (this.item.type === 4) {
          if (this.item.inOrEquals === 0) {
            this.$set(this.item, "filterCondition0", this.item.filterCondition);
            this.$set(this.item, "filterCondition1", []);
          } else {
            this.$set(
              this.item,
              "filterCondition1",
              this.item.filterCondition.split(",")
            );
            this.$set(this.item, "filterCondition0", "");
          }
        }
      });
      // fetchMenuItem(id).then((response) => {
      //   this.item = Object.assign({}, response.data);
      // });
    },

    handleFilter() {
      if (this.listQuery.cnName === "") {
        delete this.listQuery.cnName;
      }
      if (this.listQuery.enable === "") {
        delete this.listQuery.enable;
      }

      this.getList();
    },
    resetItem() {
      this.item = deepClone(itemDefault);
    },
    handleStatus(row) {
      this.loading = false;
      updateLegendlEnable({
        enable: row.enable, // 0开1关
        id: row.id,
      })
        .then((res) => {
          this.$notify({
            title: "成功",
            message: "修改成功",
            type: "success",
            duration: 2000,
          });
          this.getList();
          this.loading = true;
        })
        .catch((err) => {
          this.getList();
          this.loading = true;
        });
    },
    handleCreate() {
      this.resetItem();
      this.clearImgUrlFunction();
      this.getTreeselect();
      this.formStateMap = "create";
      this.formVisible = true;
      this.dialogLoading = true;
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
        this.dialogLoading = false;
      });
    },
    createData() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.item.filterCondition1 =
            this.item.filterCondition1 && this.item.filterCondition1.length > 0
              ? this.item.filterCondition1.join(",")
              : "";
          this.item.filterCondition =
            this.item.inOrEquals === 0
              ? this.item.filterCondition0
              : this.item.filterCondition1;
          this.dialogLoading = true;
          updateLegendlAdd(this.item).then((response) => {
            this.getList();
            this.formVisible = false;
            this.dialogLoading = false;
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },
    handleUpdate(scope) {
      this.clearImgUrlFunction();
      this.resetItem();
      this.getTreeselect();
      this.item = Object.assign({}, scope.row);
      this.getItem(scope.row.id);
      this.formStateMap = "update";

      this.showImg();
      this.formVisible = true;
      this.dialogLoading = true;
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
        this.dialogLoading = false;
      });
    },

    updateData() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.item.type === 0) {
            this.item.filterCondition1 =
              this.item.filterCondition1 &&
              this.item.filterCondition1.length > 0
                ? this.item.filterCondition1.join(",")
                : "";
            this.item.filterCondition =
              this.item.inOrEquals === 0
                ? this.item.filterCondition0
                : this.item.filterCondition1;
          }
          this.dialogLoading = true;
          const tempData = Object.assign({}, this.item);
          if (this.item.parentId === -1) {
            updateLegendlUpdateLabel(tempData).then(() => {
              if (this.item.type == 2 || this.item.type == 4) {
                // 图层样式更新
                legendRefreshStyle(this.item.id).then((res) => {
                  this.getList();
                  this.formVisible = false;
                  this.dialogLoading = false;
                  this.$notify({
                    title: "成功",
                    message: "更新成功",
                    type: "success",
                    duration: 2000,
                  });
                });
              } else {
                this.getList();
                this.formVisible = false;
                this.dialogLoading = false;
                this.$notify({
                  title: "成功",
                  message: "更新成功",
                  type: "success",
                  duration: 2000,
                });
              }
            });
          } else {
            updateLegendlUpdate(tempData).then(() => {
              this.getList();
              this.formVisible = false;
              this.dialogLoading = false;
              this.$notify({
                title: "成功",
                message: "修改成功",
                type: "success",
                duration: 2000,
              });
              if (this.item.type == 2 || this.item.type == 4) {
                // 图层样式更新
                legendRefreshStyle(this.item.id).then((res) => {
                  this.getList();
                  this.formVisible = false;
                  this.dialogLoading = false;
                  this.$notify({
                    title: "成功",
                    message: "更新成功",
                    type: "success",
                    duration: 2000,
                  });
                });
              } else {
                this.getList();
                this.formVisible = false;
                this.dialogLoading = false;
                this.$notify({
                  title: "成功",
                  message: "更新成功",
                  type: "success",
                  duration: 2000,
                });
              }
            });
          }
        }
      });
    },

    handleDelete(scope) {
      this.$confirm("确认删除该菜单？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        confirmButtonType: "",
        type: "warning",
      })
        .then(() => {
          updateLegendlDelete(scope.id).then((res) => {
            this.getList();
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000,
            });
          });
        })
        .catch((err) => {});
    },
    itemTypeInput() {
      this.item.cqlFilter = "";
      this.item.filterCondition0 = "";
      this.item.filterCondition1 = [];
      this.item.columnName = "";
      this.item.strokeWidth = undefined;
      this.item.strokeColor = "";
      this.item.fillColor = "";
      this.item.fillOpacity = undefined;
      this.$refs["form"].clearValidate();
    },

    // 清空图片地址
    clearImgUrlFunction() {
      this.imageUrlDialogphotoUniqueName = "";
    },

    // 图片赋值功能
    showImg() {
      if (this.item.pointWellKnownName) {
        commonDownload({
          uniqueName: this.item.pointWellKnownName,
        }).then((res) => {
          const blob = new Blob([res.file], {
            type: res.file.type, // 替换为对应的图片类型
          });
          this.imageUrlDialogphotoUniqueName = URL.createObjectURL(blob);
        });
      }
    },
  },
};
</script>

<style scoped>
.colorSelect >>> .el-form-item__content {
  height: 36px;
}
.w200 {
  width: 200px;
}
</style>
<style lang="scss" scoped>
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  border: 1px dashed #999;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
  // margin-bottom: 10px;
}
.avatar-error {
  width: 20px;
  height: 20px;
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 20px;
  cursor: pointer;
}
</style>
