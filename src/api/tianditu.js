/*
 * @Author: 叶述妙
 * @Date: 2022-11-15 11:02:34
 * @LastEditors: linguoxie2 171742691@qq.com
 * @LastEditTime: 2024-08-28 11:37:29
 */
import request from "@/utils/request";

// 根据名称获取地图区划信息
export function searchAreaList(data) {
  return request({
    url: "/sysArea/getPage",
    method: "post",
    data,
  });
}
// 根据id获取地图区划信息
export function getAreaDetail(params) {
  return request({
    url: "/sysArea/" + params.id,
    method: "get",
  });
}
// 根据区划获取四至
export function getExtent(params) {
  return request({
    url: "/sysArea/getextent",
    method: "get",
    params,
  });
}

export function getFeatureByUrl(params) {
  return request({
    url: params.url,
    method: "get",
    params: {},
  });
}
