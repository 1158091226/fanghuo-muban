import request from "@/utils/request";

// 文件预览
export function fetchFileItem(type, name) {
  return request({
    url: `/multimedia/show/${type}/${name}`,
    method: "get",
    responseType: "arraybuffer", // 由于后台返回来的是二进制数据，所以我们要把它设为 arraybuffer
  });
}

// 文件删除
export function deleteFileItem(data) {
  return request({
    url: "/multimedia/delete",
    method: "post",
    data,
  });
}

// 文件下载
export function commonDownload(query) {
  return request({
    url: "/files/minIo/common_download",
    method: "get",
    params: query,
    responseType: "blob",
    isRequest: true, // 这个接口要开启遮罩功能就传true，否知不传或者false
  });
}

// 文件下载-缩略图
export function commonDownThumbnailload(query) {
  return request({
    url: "/files/minIo/thumbnail_download",
    method: "get",
    params: query,
    responseType: "blob",
    isRequest: true, // 这个接口要开启遮罩功能就传true，否知不传或者false
  });
}

export function fetchRoleMenuList(id) {
  return request({
    url: `/sys/menuh/rolemenutreeselect/${id}`,
    method: "get",
  });
}

export function fetchMenuTree() {
  return request({
    url: "/sys/menuh/tree",
    method: "get",
  });
}
// 林草系统管理-图层管理-查询对应角色
export function getSystemLayerRole(query) {
  return request({
    url: publishUrl + `/layer_role`,
    method: "get",
    params: query,
  });
}

// 林草系统管理-图层管理-更新对应角色
export function putSystemLayerRole(data) {
  return request({
    url: publishUrl + `/layer_role`,
    method: "put",
    data,
  });
}

// 林草系统管理-图层管理-查询对应用户
export function getSystemLayerUser(query) {
  return request({
    url: publishUrl + `/layer_user`,
    method: "get",
    params: query,
  });
}
// 林草系统管理-图层管理-更新对应用户
export function putSystemLayerUser(data) {
  return request({
    url: publishUrl + `/layer_user`,
    method: "put",
    data,
  });
}
// 林草系统管理-图层管理-查询所有用户
export function getSystemLayerUserAll(query) {
  return request({
    url: publishUrl + `/layer_user/get-user-list`,
    method: "get",
    params: query,
  });
}
// 图层分页列表-备案图层操作
export function layerPutOnRecord(query) {
  return request({
    url: publishUrl + "/publish/geoserver/put_on_record",
    method: "post",
    data: query,
  });
}

// 角色分页列表
export function fetchRoleList(query) {
  return request({
    url: "/sys/role/findAll",
    method: "get",
    params: query,
  });
}

// 角色详情
export function fetchRoleItem(id) {
  return request({
    url: `/sys/role/getModelById/${id}`,
    method: "get",
  });
}

// 角色新增
export function createRoleItem(data) {
  return request({
    url: "/sys/role",
    method: "post",
    data,
  });
}

// 角色修改
export function updateRoleItem(data) {
  return request({
    url: "/sys/role/update",
    method: "post",
    data,
  });
}

// 角色删除
export function deleteRoleItem(id) {
  return request({
    url: `/sys/role/delete/${id}`,
    method: "delete",
  });
}

// 用户角色列表
export function fetchUserRoleList(id) {
  return request({
    url: `/sys/user/userrolebyid/${id}`,
    method: "get",
  });
}

// 用户分页列表
export function fetchUserPage(query) {
  return request({
    url: "/sys/user/page",
    method: "post",
    data: query,
  });
}
// // 用户分页列表
// export function fetchUserPage(query) {
//   return request({
//     url: '/sys/user/',
//     method: 'get',
//     params: query
//   });
// }

// 用户详情
export function fetchUserItem(id) {
  return request({
    url: `/sys/user/${id}`,
    method: "get",
  });
}

// 用户新增
export function createUserItem(data) {
  return request({
    url: "/sys/user/create",
    method: "post",
    data,
  });
}

// 用户更新
export function updateUserItem(data) {
  return request({
    url: "/sys/user/update",
    method: "put",
    data,
  });
}

// 用户删除-列表
export function deleteUserItem(id) {
  return request({
    url: `/sys/user/delete/${id}`,
    method: "delete",
  });
}

// 用户重置密码-列表
export function resetUserListPassword(data) {
  return request({
    url: "/sys/user/resetpassword",
    method: "post",
    data,
  });
}

// 用户修改密码
export function updateUserItemPassword(data) {
  return request({
    url: "/sys/user/change-password",
    method: "post",
    data,
  });
}

// 用户解锁
export function unlockUserItem(query) {
  return request({
    url: "/sys/user/unlock",
    method: "get",
    params: query,
  });
}

// 菜单分页列表
export function fetchMenuList(query) {
  return request({
    url: "/sys/menuh/list",
    method: "get",
    params: query,
  });
}

// 菜单详情
export function fetchMenuItem(id) {
  return request({
    url: "/sys/menuh/" + id,
    method: "get",
  });
}

// 菜单创建
export function createMenuItem(data) {
  return request({
    url: "/sys/menuh/create",
    method: "post",
    data,
  });
}

// 菜单修改
export function updateMenuItem(data) {
  return request({
    url: "/sys/menuh/update",
    method: "post",
    data,
  });
}

// 菜单删除
export function deleteMenuItem(id) {
  return request({
    url: "/sys/menuh/" + id,
    method: "delete",
  });
}

// 经营单位分页列表
export function fetchUnitPage(query) {
  return request({
    url: "/sys/business-unit/",
    method: "get",
    params: query,
  });
}

// // 经营单位列表
// export function fetchUnitList(query) {
//   return request({
//     url: '/sys/business-unit/list',
//     method: 'get',
//     params: query
//   });
// }

// 经营单位树状列表
export function fetchUnitTree(query) {
  return request({
    url: "/sys/business-unit/tree",
    method: "get",
    params: query,
  });
}

// // 经营单位详情
// export function fetchUnitItem(id) {
//   return request({
//     url: `/sys/business-unit/${id}`,
//     method: 'get'
//   });
// }

// // 经营单位新增
// export function createUnitItem(data) {
//   return request({
//     url: '/sys/business-unit/create',
//     method: 'post',
//     data
//   });
// }

// // 经营单位修改
// export function updateUnitItem(data) {
//   return request({
//     url: '/sys/business-unit/update',
//     method: 'post',
//     data
//   });
// }

// // 经营单位删除-批量
// export function deleteUnitList(data) {
//   return request({
//     url: `/sys/business-unit/delete`,
//     method: 'post',
//     data
//   });
// }

// 督查设置经营单位-批量
export function setupUnitList(data) {
  return request({
    url: "/sys/business-unit/up-bncode",
    method: "post",
    data,
  });
}

// // 经营单位下级列表
// export function fetchUnitChildList(query) {
//   return request({
//     url: '/sys/business-unit/subordinate_bn_code',
//     method: 'get',
//     params: query
//   });
// }

// 标记分页列表
export function fetchMarkPage(query) {
  return request({
    url: "/mark/mark-type/",
    method: "get",
    params: query,
  });
}

// 标记列表
export function fetchMarkList(query) {
  return request({
    url: "/mark/mark-type/list",
    method: "get",
    params: query,
  });
}

// 标记删除-批量
export function deleteMarkList(query) {
  return request({
    url: "/mark/mark-type/deletes",
    method: "delete",
    params: query,
  });
}

// 标记详情
export function fetchMarkItem(id) {
  return request({
    url: `/mark/mark-type/${id}`,
    method: "get",
  });
}

// 标记新增
export function createMarkItem(data) {
  return request({
    url: "/mark/mark-type/create",
    method: "post",
    data,
  });
}

// 标记修改
export function updateMarkItem(data) {
  return request({
    url: "/mark/mark-type/update",
    method: "post",
    data,
  });
}

// 设置标记-批量
export function setupMarkList(data) {
  return request({
    url: "/mark/mark-manage/markmanage",
    method: "post",
    data,
  });
}

// 批注详情
export function fetchCommentItem(id, type) {
  return request({
    url: `/comment/commenth/${id}?table_name=${type}`,
    method: "get",
  });
}

// 设置批注-批量
export function setupCommentList(data) {
  return request({
    url: "/comment/commenth/create-list",
    method: "post",
    data,
  });
}

// 年版列表
export function fetchYearList(query) {
  return request({
    url: "/annual/getyearno",
    method: "get",
    params: query,
  });
}

// 导出SQL数据文件
export function exportSqlFile(data) {
  return request({
    url: "/annual/pc-out",
    method: "post",
    data,
    responseType: "blob",
  });
}

// 获取异步任务状态
export function fetchTaskItem(query) {
  return request({
    url: "/annual/async-status",
    method: "get",
    params: query,
  });
}

// 审计分页列表
export function fetchLogPage(query) {
  return request({
    url: "/sys/oper-log/",
    method: "get",
    params: query,
  });
}

// 审计详情
export function fetchLogItem(id) {
  return request({
    url: `/sys/oper-log/${id}`,
    method: "get",
  });
}

// 行政区划分页列表
export function fetchAreaPage(query) {
  return request({
    url: "/sys/area/",
    method: "get",
    params: query,
  });
}

// 行政区划列表
export function fetchAreaList(query) {
  return request({
    url: "/sys/area/list",
    method: "get",
    params: query,
  });
}

// // 行政区划详情
// export function fetchAreaItem(id) {
//   return request({
//     url: `/sys/area/${id}`,
//     method: 'get'
//   });
// }

// 行政区划树状列表
export function fetchAreaTree(query) {
  return request({
    url: "/sys/area/tree",
    method: "get",
    params: query,
  });
}

// // 行政区划区划树状列表-根据代码获取子集
// export function fetchAreaTreeChildren(query) {
//   return request({
//     url: '/sys/area/getareacode',
//     method: 'get',
//     params: query
//   });
// }

// 字典分页列表
export function fetchDictionaryPage(query) {
  return request({
    url: "/sys/dictionary/",
    method: "get",
    params: query,
  });
}

// 字典列表
export function fetchDictionaryList(query) {
  return request({
    url: "/sys/dictionary/tree",
    method: "get",
    params: query,
  });
}

// 字典详情
export function fetchDictionaryItem(id) {
  return request({
    url: `/sys/dictionary/${id}`,
    method: "get",
  });
}

// 字典新增
export function createDictionaryItem(data) {
  return request({
    url: "/sys/dictionary/create",
    method: "post",
    data,
  });
}

// 字典更新
export function updateDictionaryItem(data) {
  return request({
    url: "/sys/dictionary/update",
    method: "post",
    data,
  });
}

// 字典删除-批量
export function deleteDictionaryList(data) {
  return request({
    url: "/sys/dictionary/delete",
    method: "post",
    data,
  });
}

// 图层分页列表
export function publishInfoPage(data) {
  return request({
    url: "/publish_info/page",
    method: "post",
    data: data,
  });
}

//图层管理-获取图例下拉列表
export function geoGetUsableTable(query) {
  return request({
    url: "/geoserver/get_usable_table",
    method: "get",
    params: query,
  });
}

// 图层管理-新增
export function publishInfoCreate(query) {
  return request({
    url: "/publish_info/create",
    method: "post",
    data: query,
  });
}

// 图层管理-删除
export function publishInfoDelete(query) {
  return request({
    url: "/publish_info/delete",
    method: "post",
    data: query,
  });
}

// 图层分页列表-发布图层
export function fetchLayerRelease(query) {
  return request({
    url: "/publish/geoserver/publish",
    method: "post",
    data: query,
  });
}

// 图层分页列表-取消发布图层
export function fetchLayerUnPublish(query) {
  return request({
    url: "/publish/geoserver/cancel-publish",
    method: "post",
    data: query,
  });
}

//
export function fetchLayerList(query) {
  return request({
    url: "/publish/geoserver/list",
    method: "get",
    params: query,
  });
}

// 图层详情
export function fetchLayerItem(id) {
  return request({
    url: `/publish/geoserver/${id}`,
    method: "get",
  });
}

// 图层新增
export function createLayerItem(data) {
  return request({
    url: "/publish/geoserver/create",
    method: "post",
    data,
  });
}

// 图层修改
export function updateLayerItem(data) {
  return request({
    url: "/publish/geoserver/update",
    method: "post",
    data,
  });
}

// 图层删除-批量
export function deleteLayerList(data) {
  return request({
    url: "/publish/geoserver/delete",
    method: "post",
    data,
  });
}

export function fetchLayerInfo(data) {
  return request({
    url: "/publish/geoserver/forwardUrl",
    method: "post",
    data,
  });
}

// 图层转发查找ID
export function forwardUrl(data) {
  return request({
    url: "/geoserver/forwardUrl",
    method: "post",
    data,
  });
}

/**
 * @param {page} 分页列表：post
 * @param {detail} 明细：post
 * @param {create} 新增：post
 * @param {update} 修改：post
 * @param {delete} 批量删除：post
 * 图层描述管理
 */
export function layersDescribeApi(type, method, data) {
  const obj = {
    url: `/layers_describe/` + type,
    method,
    isRequest: true, // 这个接口要开启遮罩功能就传true，否知不传或者false
  };
  method == "get" ? (obj.params = data) : (obj.data = data);
  return request(obj);
}

/**
 * @param {page} 分页列表：post
 * @param {detail} 明细：post
 * 附件中心
 */
export function filesInformation(type, method, data) {
  const obj = {
    url: `/files/information/` + type,
    method,
    isRequest: true, // 这个接口要开启遮罩功能就传true，否知不传或者false
  };
  method == "get" ? (obj.params = data) : (obj.data = data);
  return request(obj);
}

// 林草系统管理-图例管理-列表查询
export function updateLegendlList(query) {
  return request({
    url: "/legend/manage",
    method: "get",
    params: query,
  });
}

// 林草系统管理-图例管理-列表查询
export function updateLegendlListNew(query) {
  return request({
    url: "/v2/legend/query",
    method: "get",
    params: query,
  });
}

// 林草系统管理-图例管理-筛选语句字段名下拉获取
// export function legendGetColumnList() {
//   return request({
//     url: "/legend/get_column_list",
//     method: "get",
//   });
// }

// 林草系统管理-图例管理-更新图层
export function legendRefreshStyle(id) {
  return request({
    url: `/legend/refresh_style/${id}`,
    method: "get",
  });
}

// 林草系统管理-图例管理-筛选语句根据字段名获取热点数值下拉列表
export function legendGetdataList(query) {
  return request({
    url: "/legend/get_column_list",
    method: "get",
    params: query,
  });
}

// 林草系统管理-图例管理-筛选语句根据字段名获取热点数值下拉列表,根据下拉取值
export function legendGetdataListByColumn(query) {
  return request({
    url: "/legend/get_data_list_by_column",
    method: "get",
    params: query,
  });
}

// 林草系统管理-图例管理-菜单状态修改
export function updateLegendlEnable(query) {
  return request({
    url: "/legend/enable",
    method: "post",
    data: query,
  });
}

// 林草系统管理-图例管理-新增时查询上级菜单树
export function updateLegendlPage(data) {
  return request({
    url: "/legend/page",
    method: "post",
    data,
  });
}

// 林草系统管理-图例管理-新增接口
export function updateLegendlAdd(data) {
  return request({
    url: "/legend/create",
    method: "post",
    data,
  });
}

// 林草系统管理-图例管理-更新接口
export function updateLegendlUpdate(data) {
  return request({
    url: "/legend/update",
    method: "post",
    data,
  });
}

// 林草系统管理-图例管理-根目录更新接口
export function updateLegendlUpdateLabel(data) {
  return request({
    url: "/legend/update_label",
    method: "put",
    data,
  });
}

// 林草系统管理-图例管理-删除接口
export function updateLegendlDelete(id) {
  return request({
    url: `/legend/delete/${id}`,
    method: "delete",
  });
}

// 林草系统管理-图例管理-获取明细接口
export function updateLegendlDetail(id) {
  return request({
    url: `/legend/get_detail/${id}`,
    method: "get",
  });
}
