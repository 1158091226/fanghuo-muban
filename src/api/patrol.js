import request from "@/utils/request";

export default {
  selectYearAndType(query) {
    return request({
      url: "/patrol/patrolForestryUserinfoDetail/selectYearAndType",
      method: "get",
      params: query,
    });
  },

  /** 两员管理
   * @param {type} 类型
   * @param {findByPartTwo} 列表：post
   * @param {getDetail} 明细：get
   * @param {trajectory } 护林员巡护路线：get
   * @param {route } 护林员巡护轨迹点：get
   */
  patrolForestryUserinfo(type, method, data) {
    let obj = {
      url: `/patrol/patrolForestryUserinfo/${type}`,
      method,
    };
    method == "get" ? (obj.params = data) : (obj.data = data);
    return request(obj);
  },

  /** 巡护记录
   * @param {type} 类型
   * @param {findByPage} 列表：post
   * @param {getDetail} 明细：get
   */
  patrolRecord(type, method, data) {
    let obj = {
      url: `/patrol/patrolRecord/${type}`,
      method,
    };
    method == "get" ? (obj.params = data) : (obj.data = data);
    return request(obj);
  },

  /** 巡护事件
   * @param {type} 类型
   * @param {findByPage} 列表：post
   * @param {getDetail} 明细：get
   */
  patrolEventManage(type, method, data) {
    let obj = {
      url: `/patrol/eventManage/${type}`,
      method,
    };
    method == "get" ? (obj.params = data) : (obj.data = data);
    return request(obj);
  },

  /** 巡护统计
   * @param {type} 类型
   * @param {findManagePatrolStatistics} 日历：post
   * @param {findManagePatrolStatisticsTotal} 区划巡护统计：post
   * @param {findPaginationDetailsTotal} 巡护人员列表：post
   * @param {findPersonalDetails} 巡护记录：post
   * @param {findPatrolSystemStatistics} 巡护系统统计：post
   * @param {statistics} 巡护情况统计：post
   * @param {export/patrolSystemStatistics} 巡护情况统计：post
   * @param {locus/point} 获取巡护轨迹：get
   */
  patrolAnalysisStatistics(type, method, data) {
    let obj = {
      url: `/pc/patrol/patrolAnalysisStatistics/${type}`,
      method,
    };
    method == "get" ? (obj.params = data) : (obj.data = data);
    if (type.indexOf("export") != -1) obj.responseType = "blob";
    return request(obj);
  },

  /** 护林员网格
   * @param {type} 类型
   * @param {findByPage} 列表：post
   * @param {getParticulars} 明细：get
   * @param {getDetail} 巡护路线：get
   */
  patrolGridinfo(type, method, data) {
    let obj = {
      url: `/patrol/patrolGridinfo/${type}`,
      method,
    };
    method == "get" ? (obj.params = data) : (obj.data = data);
    return request(obj);
  },

  /** 巡护路线
   * @param {type} 类型
   * @param {getRecordRoute} 巡护路线：get
   */
  recordRoute(type, method, data) {
    let obj = {
      url: `/patrol/recordRoute/${type}`,
      method,
    };
    method == "get" ? (obj.params = data) : (obj.data = data);
    return request(obj);
  },

  /** 请假
   * @param {type} 类型
   * @param {findByPage} 列表：post
   * @param {getDetail} 明细：get
   * @param {getCount} 统计：get
   */
  leaveAuditInfos(type, method, data) {
    let obj = {
      url: `/patrol/leaveAuditInfos/${type}`,
      method,
    };
    method == "get" ? (obj.params = data) : (obj.data = data);
    return request(obj);
  },

  /** 备勤
   * @param {type} 类型
   * @param {findByPage} 列表：post
   * @param {getDetail} 明细：get
   * @param {getCount} 统计：get
   */
  prepareOfDuty(type, method, data) {
    let obj = {
      url: `/patrol/prepareOfDuty/${type}`,
      method,
    };
    method == "get" ? (obj.params = data) : (obj.data = data);
    return request(obj);
  },
  /** 巡护事件
   * @param {type} 类型
   * @param {findByPage} 列表：post
   * @param {getDetail} 明细：get
   */
  pcPatrolEventManage(type, method, data) {
    const obj = {
      url: `pc/patrolEventManage/${type}`,
      method,
    };
    method == "get" ? (obj.params = data) : (obj.data = data);
    return request(obj);
  },
};
