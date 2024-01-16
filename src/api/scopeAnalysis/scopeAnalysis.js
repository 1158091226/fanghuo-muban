import request from "@/utils/request";
// 分析与统计-局部范围提取分析-列表查询
export function partialPage(data) {
  return request({
    url: "/partial/page",
    method: "post",
    data,
  });
}

// 分析与统计-局部范围提取分析-获取资源类别的下拉树
export function treeYztSlfhSimple() {
  return request({
    url: "/v1/legend/tree_yzt_slfh/simple",
    method: "get",
  });
}
// 分析与统计-局部范围提取分析-新增接口
export function partialCreate(data) {
  return request({
    url: "/partial/create",
    method: "post",
    data,
  });
}
// 分析与统计-局部范围提取分析-删除接口
export function partialDelete(data) {
  return request({
    url: `/partial/delete`,
    method: "post",
    data,
  });
}
// 分析与统计-局部范围提取分析-详情接口
export function partailDetail(data) {
  return request({
    url: "/partial/detail",
    method: "get",
    params: data,
  });
}

// 分析与统计-局部范围提取分析-详情-对应详情接口
export function partailDetailData(params) {
  return request({
    url: "/partial/detail_data",
    method: "get",
    params: params,
    isRequest: true, // 这个接口要开启遮罩功能就传true，否知不传或者false
  });
}
// 分析与统计-局部范围提取分析-查询图斑详情
export function analysePolygonDetails(params) {
  return request({
    url: NaturalResourcesUrl + "/map_analyse/detail",
    method: "get",
    params: params,
  });
}
