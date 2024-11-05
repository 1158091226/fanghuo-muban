/*
 * @Author: 叶述妙
 * @Date: 2022-05-24 11:16:34
 * @LastEditors: 叶述妙
 * @LastEditTime: 2024-06-07 14:57:10
 */
import request from "@/utils/request";

// 行政区划树状列表
export function fetchAreaTree(query) {
  return request({
    url: "/sysArea/tree",
    method: "get",
    params: query,
  });
}

// 统计两员及林长办的数量
export function getTowLzSum(params) {
  return request({
    url: "/statistics/forestryUser/getTowLzSum",
    method: "get",
    params,
  });
}

//统计五级林长的数量
export function getlevelLzSum(params) {
  return request({
    url: "/statistics/forestryUser/getlevelLzSum",
    method: "get",
    params,
  });
}

//统计林长巡林及林长+项目的数量
export function getPatrolWaitSum(params) {
  return request({
    url: "/statistics/forestryUser/getPatrolWaitSum",
    method: "get",
    params,
  });
}

//区划林长人数
export function getLzNumByArea(data) {
  return request({
    url: "/statistics/forestryUser/getLzNumByArea",
    method: "post",
    data,
  });
}

//区划网格数
export function gridAreaCount(params) {
  return request({
    url: "/app/patrolGridinfo/gridAreaCount",
    method: "get",
    params,
  });
}

//获取网格详情
export function getParticulars(params) {
  return request({
    url: "/patrol/patrolGridinfo/getParticulars",
    method: "get",
    params,
  });
}

//巡林登记数据翻页查询
export function findByPageApp(data) {
  return request({
    url: "/app/waitInfo/findByPageApp",
    method: "post",
    data,
  });
}

//当前用户巡林登记数据翻页查询
export function findByCreatedIdPageApp(data) {
  return request({
    url: "/app/waitInfo/findByCreatedIdPageApp",
    method: "post",
    data,
  });
}

//巡林登记批量删除
export function deleteBatch(data) {
  return request({
    url: "/app/waitInfo/deleteBatch",
    method: "post",
    data,
  });
}

//巡林登记明细
export function waitInfoGetDetail(params) {
  return request({
    url: "/app/waitInfo/getDetail",
    method: "get",
    params,
  });
}

//巡林登记综合统计
export function groupByCount(data) {
  return request({
    url: "/app/waitInfo/groupByCount",
    method: "post",
    data,
  });
}

//巡林登记综合统计
export function openBatch(data) {
  return request({
    url: "/app/waitInfo/openBatch",
    method: "post",
    data,
  });
}

//巡林登记新增
export function waitInfoSave(data) {
  return request({
    url: "/app/waitInfo/save",
    method: "post",
    data,
  });
}

//巡林登记编辑
export function waitInfoUpdate(data) {
  return request({
    url: "/app/waitInfo/update",
    method: "post",
    data,
  });
}

//巡林登记修改状态
export function waitInfoUpdateStatus(params) {
  return request({
    url: "/app/waitInfo/updateStatus",
    method: "get",
    params,
  });
}

//林长+项目明细
export function projectRegistrationGetDetail(params) {
  return request({
    url: "/app/projectRegistration/getDetail",
    method: "get",
    params,
  });
}

//林长+项目数据翻页查询
export function projectRegistrationFindByPage(data) {
  return request({
    url: "/app/projectRegistration/findByPage",
    method: "post",
    data,
  });
}

//巡护统计今日巡护情况统计
export function statisticalTodayPatrol(data) {
  return request({
    url: "/statistics/record/statisticalTodayPatrol",
    method: "post",
    data,
  });
}

//人员数据翻页查询（林长） pc
export function findByPageUserInfoPc(data) {
  return request({
    url: "/statistics/record/findByPageUserInfoPc",
    method: "post",
    data,
  });
}

//事件统计事件分页
export function appEventFindPage(data) {
  return request({
    url: "/statistics/event/appEventFindPage",
    method: "post",
    data,
  });
}

//事件统计根据行政区划统计 事件分布
export function getAllEventByAreaCodeAndStatus(data) {
  return request({
    url: "/statistics/event/getAllEventByAreaCodeAndStatus",
    method: "post",
    data,
  });
}

//事件统计根据事件类型统计
export function getEventTypeToDay(data) {
  return request({
    url: "/statistics/event/getEventTypeToDay",
    method: "post",
    data,
  });
}

//事件统计根据事件状态统计
export function getEventGroupByStatus(params) {
  return request({
    url: "/statistics/event/getEventGroutByStatus",
    method: "get",
    params,
  });
}

//三单两函两单一涵明细
export function appInventoryCulvertDetail(params) {
  return request({
    url: "/app/inventory/appInventoryCulvertDetail",
    method: "get",
    params,
  });
}

//三单两函资源清单明细
export function getInventoryDetail(params) {
  return request({
    url: "/app/inventory/getInventoryDetail",
    method: "get",
    params,
  });
}

//三单两函两单一涵数据翻页查询
export function appInventoryCulvertFindByPage(data) {
  return request({
    url: "/app/inventory/appInventoryCulvertFindByPage",
    method: "post",
    data,
  });
}

//森林资源清单主表数据明细
export function patrolInventoryDetail(data) {
  return request({
    url: "/app/patrolInventoryDetail/getDetail",
    method: "post",
    data,
  });
}

//三单两函资源清单数据翻页查询
export function findByPageIssue(data) {
  return request({
    url: "/app/inventory/findByPageIssue",
    method: "post",
    data,
  });
}

//三单两函资源清单区县明细
export function getAreaCodeByInventoryDetail(data) {
  return request({
    url: "/app/inventory/getAreaCodeByInventoryDetail",
    method: "post",
    data,
  });
}

//林长信息数据翻页查询
export function lzInfoFindByPage(data) {
  return request({
    url: "/patrol/patrolForestryUserinfo/findByPage",
    method: "post",
    data,
  });
}

//林长巡林登记翻页查询
export function rangerDynamic(data) {
  return request({
    url: "/pc/patrolWaitInfo/rangerDynamic",
    method: "post",
    data,
  });
}

//林长制考核
export function appIssueCount(data) {
  return request({
    url: "/app/assess/appIssueCount",
    method: "post",
    data,
  });
}

//工作动态详情
export function workTrendDetail(params) {
  return request({
    url: "/pc/workTrend/getDetail",
    method: "get",
    params,
  });
}

//工作动态
export function workTrend(data) {
  return request({
    url: "/pc/workTrend/getWorkList",
    method: "post",
    data,
  });
}

//新闻资讯详情
export function policyRegulationDetail(params) {
  return request({
    url: "/pc/newsInfo/getDetail",
    method: "get",
    params,
  });
}

//新闻资讯
export function policyRegulation(data) {
  return request({
    url: "/pc/newsInfo/policyRegulation",
    method: "post",
    data,
  });
}

//多媒体上传
export function patrolWaitFile(data) {
  return request({
    headers: {
      "Content-type": "multipart/form-data",
    },
    url: "/multimedia/uploadType/patrolWaitFile/1",
    method: "post",
    data,
  });
}

//林长+空间坐标
export function findBoundaryLine(data) {
  return request({
    url: "/patrol/patrolProjectRegistration/findBoundaryLine",
    method: "post",
    data,
  });
}

//林长信息提醒
export function patrolForestryUserinfoHint(data) {
  return request({
    url: "/app/patrolForestryUserinfoHint/findByPage",
    method: "post",
    data,
  });
}

//网格信息列表
export function patrolGridinfo(data) {
  return request({
    url: "/patrol/patrolGridinfo/findByPage",
    method: "post",
    data,
  });
}

//实时巡护数据列表
export function patrolRecordPosition(data) {
  return request({
    // url: '/pc/patrolRecordPosition/areaCodeList',
    url: "/pc/patrolRecordPosition/patrolList",
    method: "post",
    data,
  });
}

//信息提醒详情
export function patrolForestryUserinfoHintDetail(params) {
  return request({
    url: "/app/patrolForestryUserinfoHint/getDetail",
    method: "get",
    params,
  });
}

//信息提醒修改状态
export function patrolForestryUserinfoHintStatus(params) {
  return request({
    url: "/app/patrolForestryUserinfoHint/updateStatus",
    method: "get",
    params,
  });
}

//实时巡护数据
export function dynamicPatrol(params) {
  return request({
    url: "/app/patrolRecordPosition/dynamicPatrol",
    method: "get",
    params,
  });
}

//林长信息
export function getLzDetail(params) {
  return request({
    url: "/patrol/patrolForestryUserinfo/getDetail",
    method: "get",
    params,
  });
}

//APP获取林长信息
export function getAppLzDetail(params) {
  return request({
    url: "patrol/patrolForestryUserinfo/getAppLzDetail",
    method: "get",
    params,
  });
}

//获取抽稀后的边界数据(缓存)
export function getSimplifyBoundary1(params) {
  return request({
    url: "sysArea/getSimplifyBoundary1",
    method: "get",
    params,
  });
}

//统计林长巡林及林长+项目及护林员网格的数量
export function getPatrolWaitGridSum(params) {
  return request({
    url: "/statistics/forestryUser/getPatrolWaitGridSum",
    method: "get",
    params,
  });
}

//事件详情
export function patrolEventDetail(params) {
  return request({
    url: "/patrol/eventManage/getDetail",
    method: "get",
    params,
  });
}

//根据林长id获取责任区
export function getTurnoutArea(params) {
  return request({
    url: "/patrol/patrolInventoryInfo/getTurnoutArea",
    method: "get",
    params,
  });
}

//林长查询
export function frameworkLz(data) {
  return request({
    url: "/pc/patrolForestryUserinfo/frameworkLz",
    method: "POST",
    data,
  });
}

//修改密码
export function changePassword(data) {
  return request({
    url: "/sys/User/change-password",
    method: "POST",
    data,
  });
}

//获取区划下林长和护林员数量
export function getTwoPersonnel(params) {
  return request({
    url: "/statistics/forestryUser/getTwoPersonnel",
    method: "get",
    params,
  });
}

//人员巡林列表
export function personnelRangerList(params) {
  return request({
    url: "/app/waitInfo/personnelRangerList",
    method: "get",
    params,
  });
}

//获取监管员和护林员巡护数据
export function findLowerLevelData(data) {
  return request({
    url: "/pc/patrol/patrolAnalysisStatistics/findLowerLevelData",
    method: "post",
    data,
  });
}

//获取护林员巡护信息
export function findLowerLevelDetails(data) {
  return request({
    url: "/pc/patrol/patrolAnalysisStatistics/findLowerLevelDetails",
    method: "post",
    data,
  });
}

//巡林人员列表
export function rangerList(data) {
  return request({
    url: "/app/waitInfo/rangerList",
    method: "post",
    data,
  });
}

//巡护督查统计一级页面
export function patrolForestryTotal(data) {
  return request({
    url: "/pc/patrol/patrolForestryTotal/findTotalBySecond",
    method: "post",
    data,
  });
}

//巡护督查统计一级页面（同级）
export function realTimePatrol(data) {
  return request({
    url: "/pc/patrol/patrolAnalysisStatistics/findTotal",
    method: "post",
    data,
  });
}

//人员请假备勤天数
export function leavePreparation(data) {
  return request({
    url: "/pc/patrol/patrolAnalysisStatistics/leavePreparation",
    method: "post",
    data,
  });
}

//巡护督查统计二级页面
export function findNotYetPatrol(data) {
  return request({
    url: "/pc/patrol/patrolForestryTotal/findNotYetPatrol",
    method: "post",
    data,
  });
}

//公众号列表
export function officialPublicList(data) {
  return request({
    url: "/official/public/findByPage",
    method: "post",
    data,
  });
}

//新增反馈
export function feedbackSave(data) {
  return request({
    url: "/business/feedback/save",
    method: "post",
    data,
  });
}

//反馈列表
export function getFeedbackList(data) {
  return request({
    url: "/business/feedback/findPage",
    method: "post",
    data,
  });
}

//林长名单发布
export function extractIssueLz(data) {
  return request({
    url: "/business/extractIssueLz/findByLz",
    method: "post",
    data,
  });
}

// H5三单一函统计
export function countHSanDan(params) {
  return request({
    url: "/pc/patrolInventoryDetail/countHSanDan",
    method: "get",
    params,
  });
}

//公众号列表明细
export function officialPublicDetail(params) {
  return request({
    url: "/official/public/details",
    method: "get",
    params,
  });
}

// 总林长令/会明细
export function publicDirectiveDetail(params) {
  return request({
    url: "/business/publicDirective/getDetail",
    method: "get",
    params,
  });
}

// 获取林长责任区
export function getAppLzInfo(params) {
  return request({
    url: "/app/forestryUserinfo/getAppLzInfo",
    method: "get",
    params,
  });
}

// 每日巡护统计
export function findStatisticsTotalDays(data) {
  return request({
    url: "/app/patrolRecordPosition/findStatisticsTotalDays",
    method: "post",
    data,
  });
}

// 当前区划总林长
export function getAppAreaLzInfo(params) {
  return request({
    url: "/app/forestryUserinfo/getAppAreaLzInfo",
    method: "get",
    params,
  });
}

// 获取省总林长总林长会、令统计
export function getForesterOrder(data) {
  return request({
    url: "/business/publicDirective/getForesterOrder",
    method: "post",
    data,
  });
}

// 林长批示下发
export function messageSave(data) {
  return request({
    url: "/business/message/save",
    method: "post",
    data,
  });
}

// 林长批示下发列表
export function getMessageList(data) {
  return request({
    url: "/business/message/findByPage",
    method: "post",
    data,
  });
}

// 林长批示下发明细
export function messageDetail(params) {
  return request({
    url: "/business/message/getDetail",
    method: "get",
    params,
  });
}

// 林长批示下发查看明细
export function getMessageOfUserDetail(params) {
  return request({
    url: "/business/message/getMessageOfUserDetail",
    method: "get",
    params,
  });
}

// 获取通讯录区划统计
export function getMailListTreeByAreaCode(data) {
  return request({
    url: "patrol/patrolForestryUserinfo/getMailListTreeByAreaCode",
    method: "post",
    data,
  });
}

// 获取视频通话数据
export function messageNotification(params) {
  return request({
    url: "/open/abutment/token/webPublishServer/messageNotification",
    method: "get",
    params,
  });
}

// 荣誉墙详情
export function patrolForestryUserinfoHonorDetail(params) {
  return request({
    url: "/patrol/patrolForestryUserinfoHonor/getDetail",
    method: "get",
    params,
  });
}
