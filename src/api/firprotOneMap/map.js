import request from "@/utils/request";
import requestceshi from "@/utils/requestCeshi";
var systemUrl = process.env.VUE_APP_BASE_API_SYSTEM;
var resourcesUrl = process.env.VUE_APP_BASE_API_RESOURCES;
var publishUrl = process.env.VUE_APP_BASE_API_PUBILISH;

// 获取抽稀后的边界数据(缓存)
export function getSimplifyBoundary1(params) {
  return request({
    url: "/sys/area/getSimplifyBoundary",
    method: "get",
    params,
  });
}

// // 获取抽稀后的边界数据(缓存)
// export function getSimplifyBoundary1(areaCode) {
//   return request({
//     url: `/sys/area_wkt/${areaCode}`,
//     method: 'get'
//   });
// }

// 获取经验单位四至坐标
export function fetchUnitCodeExtent(query) {
  return request({
    url: systemUrl + "/sys/area/getextent",
    method: "get",
    params: query,
  });
}

// 获取图层详情
export function geoserver(id) {
  return request({
    // baseURL: 'http://47.110.80.118:8012/jiangxi_show/',
    url: publishUrl + `/publish/geoserver/${id}`,
    method: "get",
  });
}

// 获取地图页-树状结构树数据
export function mapMenuQuery(data) {
  return request({
    // baseURL: 'http://47.110.80.118:8012/jiangxi_show/',
    url: publishUrl + `/publish/legend/tree_by_master`,
    method: "get",
    params: data,
  });
}

// // 获取地图页-一张图树状结构树数据
// export function mapMenuYZTQuery(data) {
//   return request({
//     // baseURL: 'http://47.110.80.118:8012/jiangxi_show/',
//     url: publishUrl + `/publish/legend/tree_yzt`,
//     method: 'get',
//     params: data
//   });
// }

// 获取地图页-一张图树状结构树数据
export function mapMenuYZTQuery(masterId) {
  return request({
    // baseURL: 'http://47.110.80.118:8012/jiangxi_show/',
    url: publishUrl + `/publish/legend/tree_yzt_by_master/${masterId}`,
    method: "get",
  });
}

// // 获取地图页-一张图树状结构树数据
// export function mapMenuYZTQueryNew(masterId) {
//   return request({
//     // baseURL: 'http://47.110.80.118:8012/jiangxi_show/',
//     url: publishUrl + `/publish/legend/tree_yzt_by_master_new/${masterId}`,
//     method: 'get'
//   });
// }

// 获取地图页-一张图树状结构树数据
export function treeYztSlfh(masterId) {
  return request({
    url: `/v2/legend/tree_yzt_slfh/`,
    method: "get",
    params: masterId,
  });
}

// 树状地图点击后查询wkt值
export function treeYztSlfhWkt(data) {
  return request({
    url: `/v2/legend/tree_yzt_slfh/wkt`,
    method: "get",
    params: data,
  });
}

// 树状地图点击后查询wkt值
export function treeYztSlfhWktV2(data) {
  return request({
    url: `/v2/legend/tree_yzt_slfh/wkt`,
    method: "get",
    params: data,
  });
}

// 面积统计表
export function areageStatisPage(data) {
  return request({
    url: resourcesUrl + `/resources/areageStatis/page`,
    method: "post",
    data,
  });
}

// 查询区划统计-实时
export function legendAcreage(data) {
  return requestceshi({
    url: resourcesUrl + `/publish/legend/acreage`,
    method: "get",
    params: data,
  });
}

// 查询区划统计-实时-导出
export function legendAcreageDown(data) {
  return request({
    url: resourcesUrl + `/publish/legend/acreage_export`,
    method: "get",
    params: data,
    responseType: "blob",
  });
}

// 地图定位功能-搜索区划
export function sysAreaPage(data) {
  return request({
    url: systemUrl + `/sys/area/getPage`,
    method: "post",
    data: data,
  });
}

// 地图定位功能-搜索区划-详情
export function sysAreaPageDetail(id) {
  return request({
    url: systemUrl + `/sys/area/getDetail/${id}`,
    method: "get",
  });
}
