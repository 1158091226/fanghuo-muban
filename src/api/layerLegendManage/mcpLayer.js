import request from "@/utils/request";

/**
 * @param {page} 分页列表：post
 * @param {detail} 明细：post
 * @param {create} 新增：post
 * @param {update} 修改：post
 * @param {delete} 批量删除：post
 * @param {table_list/} 获取表名列表：get
 * @param {legend_detail} 获取对应的图例list：get
 * @param {sld_preview} 预览SLD文件：get
 * @param {automatic_update} 自动更新取消自动更新：post
 * MCP图层
 */
export function mcpLayerApi(type, method, data) {
  const obj = {
    url: `/mcp_layer/` + type,
    method,
    responseType: type.indexOf("excel") > -1 ? "blob" : "", //给导出用的
    isRequest: true, // 这个接口要开启遮罩功能就传true，否知不传或者false
  };
  method == "get" ? (obj.params = data) : (obj.data = data);
  return request(obj);
}

// 获取已发布的图层list
export function mcpGeoserverList(data) {
  return request({
    url: "/geoserver_layer/list",
    method: "post",
    data,
  });
}

// 下载SLD文件
export function mcpLauerSldPreviewFile(query) {
  return request({
    url: "/mcp_layer/sld_preview/file",
    method: "get",
    params: query,
    responseType: "blob",
    isRequest: true, // 这个接口要开启遮罩功能就传true，否知不传或者false
  });
}

// 获取描述下拉列表
export function mcpDescribeList(query) {
  return request({
    url: "/mcp_describe/list",
    method: "get",
    params: query,
  });
}

// 通过表名获取推荐的配置字段
export function mcpLayerTableInfo(table) {
  return request({
    url: "/mcp_layer/table_info/" + table,
    method: "get",
  });
}

/**
 * @param {create} 新增图例：post
 * @param {delete} 删除图例：post
 * @param {enable} 禁用启用：post
 * @param {detail} 获取详情：get
 * @param {update} 修改图例：post
 * @param {get_column_list} 获取字段名下拉列表：get
 * @param {get_data_list_by_column} 根据字段名和表名获取对应值下拉列表：get

 * MCP图层-图例管理
 */
export function mcpLegendApi(type, method, data) {
  const obj = {
    url: `/mcp_legend/` + type,
    method,
    responseType: type.indexOf("excel") > -1 ? "blob" : "", //给导出用的
    isRequest: true, // 这个接口要开启遮罩功能就传true，否知不传或者false
  };
  method == "get" ? (obj.params = data) : (obj.data = data);
  return request(obj);
}

// 查询一张图左侧的完整图例树 V1.0
export function v1LayerServerLegendTree(query) {
  return request({
    url: "/v1/layer_server/legend_tree",
    method: "get",
    params: query,
  });
}

// 查询s数据绘制参数
export function getDrawData(data) {
  return request({
    url: "/v6/layer_server/data_draw",
    method: "POST",
    data,
  });
}

export function getDrawDataV5(data) {
  return request({
    url: "/v5/layer_server/data_draw",
    method: "POST",
    data,
  });
}
