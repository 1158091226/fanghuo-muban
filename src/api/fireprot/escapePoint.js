import request from '@/utils/request';

/**
 * @param {page} 分页列表：post
 * @param {detail} 明细：post
 * @param {create} 新增：post
 * @param {update} 修改：post
 * @param {delete} 批量删除：post
 * 火灾逃生点管理
 */
export function escapePointApi(type, method, data) {
  const obj = {
    url: `/escape_point/` + type,
    method,
    responseType: type.indexOf("excel") > -1 ? "blob" : "", //给导出用的
    isRequest: true // 这个接口要开启遮罩功能就传true，否知不传或者false
  };
  method == 'get' ? (obj.params = data) : (obj.data = data);
  return request(obj);
}
