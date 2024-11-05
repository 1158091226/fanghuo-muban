import request from "@/utils/request";

/**
 * @param {page} 分页列表：post
 * @param {detail} 明细：post
 * @param {create} 新增：post
 * @param {update} 修改：post
 * @param {delete} 批量删除：post
 * @param {generalQueryAll} 获取权限控制sql语句：post
 * 图层权限表
 */
export function mcpAuthorityApi(type, method, data) {
  const obj = {
    url: `/mcp_authority/` + type,
    method,
    responseType: type.indexOf("excel") > -1 ? "blob" : "", //给导出用的
    isRequest: true, // 这个接口要开启遮罩功能就传true，否知不传或者false
  };
  method == "get" ? (obj.params = data) : (obj.data = data);
  return request(obj);
}
