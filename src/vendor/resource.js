export function fireproofDict(type) {
  let imgurl = ""; //曾经一张图使用的，后续图标变成后端配置的了
  let text = ""; //一张图用的，后端有传就不用了
  let tableData = [{ label: "", value: "" }]; //局部分析用到了
  let showColumn = []; //控制列表页默认展示那些列
  let dictName = []; //局部分析用到了
  let oneMapDialog = []; //一张图，点击后出的附框展示的字段
  switch (type) {
    // 防火调查数据管理
    case "fireprot_impt_point": // 火源检测点
      imgurl = require("@/static/oneMapimages/fireprot_impt_point.png");
      text = "重要火源点分布";
      showColumn = [
        "areaCode",
        "fireSourcePointName",
        "fireSourcePointType",
        "level",
        "responsible",
      ];
      tableData = [
        { label: "区划代码", value: "areaCode", type: "areaCode", dict: "" },
        { label: "名称", value: "fireSourcePointName", type: "text", dict: "" },
        {
          label: "类型",
          value: "fireSourcePointType",
          type: "select",
          dict: "fire_source_point_type",
        },
        {
          label: "级别",
          value: "level",
          type: "select",
          dict: "fire_source_point_level",
        },
        { label: "负责人", value: "responsible", type: "text", dict: "" },
      ];
      dictName = ["fire_source_point_type"];
      oneMapDialog = [
        {
          label: "名称",
          value: "fireSourcePointName",
          type: "text",
          dict: "",
        },
      ];
      break;
    case "fireprot_impt_target": // 重点保护点
      imgurl = require("@/static/oneMapimages/fireprot_impt_target.png");
      text = "重点保护目标";
      showColumn = ["areaCode", "uuid", "name", "protLevel", "responsible"];
      tableData = [
        { label: "区划代码", value: "areaCode", type: "areaCode", dict: "" },
        { label: "编号", value: "uuid", type: "text", dict: "" },
        { label: "名称", value: "name", type: "text", dict: "" },
        {
          label: "保护等级",
          value: "protLevel",
          type: "select",
          dict: "protected_object_level",
        },
        { label: "负责人", value: "responsible", type: "text", dict: "" },
      ];
      dictName = ["protected_object_level"];
      oneMapDialog = [
        {
          label: "图斑编号",
          value: "tbbh",
          type: "text",
          dict: "",
        },
      ];
    case "fireprot_residential_area": // 居民点
      imgurl = require("@/static/oneMapimages/fireprot_residential_area.png");
      text = "居民点";
      showColumn = ["areaCode", "name", "population", "acreage", "responsible"];
      tableData = [
        { label: "区划代码", value: "areaCode", type: "areaCode", dict: "" },
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
        {
          label: "人口",
          value: "population",
          type: "text",
          dict: "",
        },
        {
          label: "面积",
          value: "acreage",
          type: "text",
          dict: "",
        },
        { label: "负责人", value: "responsible", type: "text", dict: "" },
      ];
      dictName = [];
      oneMapDialog = [
        {
          label: "图斑编号",
          value: "tbbh",
          type: "text",
          dict: "",
        },
      ];
      break;
    // 森林资源管理
    case "forestry_industrial_data": // 林业产业
      imgurl = require("@/static/oneMapimages/forestry_industrial_data.png");
      text = "林业产地数据";
      showColumn = ["areaCode", "name", "area", "responsible"];
      tableData = [
        { label: "区划代码", value: "areaCode", type: "areaCode", dict: "" },
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
        {
          label: "面积(平方米)",
          value: "area",
          type: "text",
          dict: "",
        },
        { label: "负责人", value: "responsible", type: "text", dict: "" },
      ];
      dictName = [];
      oneMapDialog = [
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
      ];
      break;
    case "forestry_old_and_famous_trees": // 古树名木
      imgurl = require("@/static/oneMapimages/forestry_old_and_famous_trees.png");
      text = "古树名木";
      showColumn = [
        "areaCode",
        "treeNumber",
        "treeNameCn",
        "assessmentTreeAge",
        "treeHeight",
        "treeDhb",
        "treeLevel",
      ];
      tableData = [
        { label: "区划代码", value: "areaCode", type: "areaCode", dict: "" },
        {
          label: "编号",
          value: "treeNumber",
          type: "text",
          dict: "",
        },
        {
          label: "中文名",
          value: "treeNameCn",
          type: "text",
          dict: "",
        },
        {
          label: "评估树龄",
          value: "assessmentTreeAge",
          type: "text",
          dict: "",
        },
        {
          label: "树高(米)",
          value: "treeHeight",
          type: "text",
          dict: "",
        },
        {
          label: "胸径",
          value: "treeDhb",
          type: "text",
          dict: "",
        },
        { label: "古树等级", value: "treeLevel", type: "text", dict: "" },
      ];
      dictName = [];
      oneMapDialog = [
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
      ];
      break;
    case "forestry_natural_reserve": // 自然保护地
      imgurl = require("@/static/oneMapimages/forestry_natural_reserve.png");
      text = "自然保护地";
      showColumn = [
        "areaCode",
        "name",
        "protectType",
        "protectLevel",
        "coreArea",
        "bufferArea",
      ];
      tableData = [
        { label: "区划代码", value: "areaCode", type: "areaCode", dict: "" },
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
        {
          label: "保护地类型",
          value: "protectType",
          type: "select",
          dict: "natural_reserve_type",
        },
        {
          label: "保护等级",
          value: "protectLevel",
          type: "select",
          dict: "natural_reserve_level",
        },
        {
          label: "核心区面积(亩)",
          value: "coreArea",
          type: "text",
          dict: "",
        },
        {
          label: "缓冲区面积(亩)",
          value: "bufferArea",
          type: "text",
          dict: "",
        },
      ];
      dictName = ["natural_reserve_type", "natural_reserve_level"];
      oneMapDialog = [
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
      ];
      break;
    case "forestry_whole_forest": // 林地
      imgurl = "";
      text = "林地";
      showColumn = [
        "areaCode",
        "xiaoBan",
        "dlmc",
        "xbmj",
        "senLinLb",
        "qiYuan",
        "linZhong",
      ];
      tableData = [
        { label: "区划代码", value: "areaCode", type: "areaCode", dict: "" },
        {
          label: "图斑号(小班)",
          value: "xiaoBan",
          type: "text",
          dict: "",
        },
        {
          label: "地类",
          value: "dlmc",
          type: "text",
          dict: "",
        },
        {
          label: "面积(亩)",
          value: "xbmj",
          type: "text",
          dict: "",
        },
        {
          label: "森林类别",
          value: "senLinLb",
          type: "text",
          dict: "",
        },
        {
          label: "起源",
          value: "qiYuan",
          type: "text",
          dict: "",
        },
        {
          label: "林种",
          value: "linZhong",
          type: "text",
          dict: "",
        },
      ];
      dictName = [];
      oneMapDialog = [
        {
          label: "图斑编号",
          value: "tbbh",
          type: "text",
          dict: "",
        },
      ];
      break;
    // 防火设备设施
    case "fireprot_isolation": // 林火阻隔
      imgurl = "";
      text = "林火阻隔系统";
      showColumn = [
        "areaCode",
        "uuid",
        "name",
        "length",
        "width",
        "responsible",
        "constructionType",
      ];
      tableData = [
        { label: "区划代码", value: "areaCode", type: "areaCode", dict: "" },
        {
          label: "编号",
          value: "uuid",
          type: "text",
          dict: "",
        },
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
        {
          label: "长度(千米)",
          value: "length",
          type: "text",
          dict: "",
        },
        {
          label: "宽度(米)",
          value: "width",
          type: "text",
          dict: "",
        },
        {
          label: "建设类型",
          value: "constructionType",
          type: "select",
          dict: "forestfire_isolation_construction_type",
        },
        { label: "负责人", value: "responsible", type: "text", dict: "" },
      ];
      dictName = ["forestfire_isolation_construction_type"];
      oneMapDialog = [
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
      ];
      break;
    case "fireprot_watchtower": // 瞭望塔
      imgurl = require("@/static/oneMapimages/fireprot_watchtower.png");
      text = "瞭望塔";
      showColumn = ["areaCode", "uuid", "name", "towerStatus", "responsible"];
      tableData = [
        { label: "区划代码", value: "areaCode", type: "areaCode", dict: "" },
        {
          label: "编号",
          value: "uuid",
          type: "text",
          dict: "",
        },
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
        {
          label: "状态",
          value: "towerStatus",
          type: "select",
          dict: "watchtower_state",
        },
        { label: "负责人", value: "responsible", type: "text", dict: "" },
      ];
      dictName = ["watchtower_state"];
      oneMapDialog = [
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
      ];
      break;
    case "fireprot_reservoir": // 蓄水池
      imgurl = require("@/static/oneMapimages/fireprot_reservoir.png");
      text = "蓄水池";
      showColumn = [
        "areaCode",
        "uuid",
        "name",
        "status",
        "volume",
        "responsible",
      ];
      tableData = [
        { label: "区划代码", value: "areaCode", type: "areaCode", dict: "" },
        {
          label: "编号",
          value: "uuid",
          type: "text",
          dict: "",
        },
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
        {
          label: "容积(立方米)",
          value: "volume",
          type: "text",
          dict: "",
        },
        {
          label: "状态",
          value: "status",
          type: "select",
          dict: "impound_construction_state",
        },
        { label: "负责人", value: "responsible", type: "text", dict: "" },
      ];
      dictName = ["impound_construction_state"];
      oneMapDialog = [
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
      ];
      break;
    case "fireprot_hel_water_intaking": // 直升机取水点
      imgurl = require("@/static/oneMapimages/fireprot_hel_water_intaking.png");
      text = "直升机取水点";
      showColumn = [
        "areaCode",
        "uuid",
        "name",
        "waterSourceType",
        "waterIntake",
        "responsible",
      ];
      tableData = [
        { label: "区划代码", value: "areaCode", type: "areaCode", dict: "" },
        {
          label: "编号",
          value: "uuid",
          type: "text",
          dict: "",
        },
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
        {
          label: "水源类型",
          value: "waterSourceType",
          type: "select",
          dict: "copter_intake_type",
        },
        {
          label: "取水量(小时·升)",
          value: "waterIntake",
          type: "text",
          dict: "",
        },
        { label: "负责人", value: "responsible", type: "text", dict: "" },
      ];
      dictName = ["copter_intake_type"];
      oneMapDialog = [
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
      ];
      break;
    case "fireprot_hel_landing": // 直升机降落点
      imgurl = require("@/static/oneMapimages/fireprot_hel_landing.png");
      text = "直升机降落点";
      showColumn = [
        "areaCode",
        "uuid",
        "name",
        "clearanceSituation",
        "responsible",
      ];
      tableData = [
        { label: "区划代码", value: "areaCode", type: "areaCode", dict: "" },
        {
          label: "编号",
          value: "uuid",
          type: "text",
          dict: "",
        },
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
        {
          label: "净空情况",
          value: "clearanceSituation",
          type: "text",
          dict: "",
        },
        { label: "负责人", value: "responsible", type: "text", dict: "" },
      ];
      dictName = [];
      oneMapDialog = [
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
      ];
      break;
    case "fireprot_reserve": // 物资存储库
      imgurl = require("@/static/oneMapimages/fireprot_reserve.png");
      text = "物资存储库";
      showColumn = [
        "areaCode",
        "uuid",
        "name",
        "capacity",
        "buildArea",
        "responsible",
      ];
      tableData = [
        { label: "区划代码", value: "areaCode", type: "areaCode", dict: "" },
        {
          label: "编号",
          value: "uuid",
          type: "text",
          dict: "",
        },
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
        {
          label: "有效容量(立方米)",
          value: "capacity",
          type: "text",
          dict: "",
        },
        {
          label: "建设面积(平方米)",
          value: "buildArea",
          type: "text",
          dict: "",
        },
        { label: "负责人", value: "responsible", type: "text", dict: "" },
      ];
      dictName = [];
      oneMapDialog = [
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
      ];
      break;
    case "fireprot_supplies": //储备物资管理
      imgurl = "";
      text = "";
      showColumn = ["areaCode", "type", "amount", "unit", "statusCode", "name"];
      tableData = [];
      dictName = [];
      oneMapDialog = [
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
      ];
      break;
    case "fireprot_reserve_manager": //储备物资管理人员
      imgurl = "";
      text = "";
      showColumn = ["areaCode", "reserveId", "name", "position"];
      tableData = [];
      dictName = [];
      oneMapDialog = [
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
      ];
      break;
    case "fireprot_weather_station": // 气象站
      imgurl = require("@/static/oneMapimages/fireprot_weather_station.png");
      text = "气象站";
      showColumn = ["areaCode", "name", "address", "responsible"];
      tableData = [
        { label: "区划代码", value: "areaCode", type: "areaCode", dict: "" },
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
        {
          label: "地址",
          value: "address",
          type: "text",
          dict: "",
        },
        { label: "负责人", value: "responsible", type: "text", dict: "" },
      ];
      dictName = [];
      oneMapDialog = [
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
      ];
      break;
    case "fireprot_escape_point": // 火灾逃生点
      imgurl = require("@/static/oneMapimages/fireprot_escape_point.png");
      text = "火灾逃生点";
      showColumn = ["areaCode", "name", "capacity", "responsible"];
      tableData = [
        { label: "区划代码", value: "areaCode", type: "areaCode", dict: "" },
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
        {
          label: "容量",
          value: "capacity",
          type: "text",
          dict: "",
        },
        { label: "负责人", value: "responsible", type: "text", dict: "" },
      ];
      dictName = [];
      oneMapDialog = [
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
      ];
      break;
    case "fireprot_billboard": // 防火宣传牌
      imgurl = require("@/static/oneMapimages/fireprot_billboard.png");
      text = "防火宣传牌";
      showColumn = [
        "areaCode",
        "name",
        "type",
        "productionTime",
        "responsible",
      ];
      tableData = [
        { label: "区划代码", value: "areaCode", type: "areaCode", dict: "" },
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
        {
          label: "宣传牌类型",
          value: "type",
          type: "select",
          dict: "fireproofing_publicity_type",
        },
        {
          label: "制作时间",
          value: "productionTime",
          type: "text",
          dict: "",
        },
        { label: "负责人", value: "responsible", type: "text", dict: "" },
      ];
      dictName = ["fireproofing_publicity_type"];
      oneMapDialog = [
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
      ];
      break;
    case "fireprot_checkpoint": // 检查站
      imgurl = require("@/static/oneMapimages/fireprot_checkpoint.png");
      text = "检查站";
      showColumn = ["areaCode", "name", "unit", "responsible"];
      tableData = [
        { label: "区划代码", value: "areaCode", type: "areaCode", dict: "" },
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
        {
          label: "所属单位",
          value: "unit",
          type: "text",
          dict: "",
        },
        { label: "负责人", value: "responsible", type: "text", dict: "" },
      ];
      dictName = [];
      oneMapDialog = [
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
      ];
      break;
    case "fireprot_col": // 卡口
      imgurl = require("@/static/oneMapimages/fireprot_col.png");
      text = "卡口";
      showColumn = ["areaCode", "name", "address", "responsible"];
      tableData = [
        { label: "区划代码", value: "areaCode", type: "areaCode", dict: "" },
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
        {
          label: "地址",
          value: "address",
          type: "text",
          dict: "",
        },
        { label: "负责人", value: "responsible", type: "text", dict: "" },
      ];
      dictName = [];
      oneMapDialog = [
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
      ];
      break;
    case "fireprot_firetruck": // 救火车
      imgurl = require("@/static/oneMapimages/fireprot_firetruck.png");
      text = "救火车";
      showColumn = ["areaCode", "name", "carType", "catStatus", "responsible"];
      tableData = [
        { label: "区划代码", value: "areaCode", type: "areaCode", dict: "" },
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
        {
          label: "车型",
          value: "carType",
          type: "select",
          dict: "fire_truck_type",
        },
        {
          label: "车辆情况",
          value: "catStatus",
          type: "select",
          dict: "fire_truck_condition",
        },
        { label: "负责人", value: "responsible", type: "text", dict: "" },
      ];
      dictName = ["fire_truck_type", "fire_truck_condition"];
      oneMapDialog = [
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
      ];
      break;
    case "fireprot_individual_equipment": // 单兵作战设备
      imgurl = require("@/static/oneMapimages/fireprot_individual_equipment.png");
      text = "单兵作战设备";
      showColumn = ["areaCode", "name", "unit", "userName", "responsible"];
      tableData = [
        { label: "区划代码", value: "areaCode", type: "areaCode", dict: "" },
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
        {
          label: "所属单位",
          value: "unit",
          type: "text",
          dict: "",
        },
        {
          label: "使用人员",
          value: "userName",
          type: "text",
          dict: "",
        },
        { label: "负责人", value: "responsible", type: "text", dict: "" },
      ];
      dictName = [];
      oneMapDialog = [
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
      ];
      break;
    case "fireprot_forest_protection": // 护林点
      imgurl = require("@/static/oneMapimages/fireprot_forest_protection.png");
      text = "护林点";
      showColumn = [
        "areaCode",
        "name",
        "buildTime",
        "buildArea",
        "responsible",
      ];
      tableData = [
        { label: "区划代码", value: "areaCode", type: "areaCode", dict: "" },
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
        {
          label: "建设日期",
          value: "buildTime",
          type: "text",
          dict: "",
        },
        {
          label: "建筑面积(平方米)",
          value: "buildArea",
          type: "text",
          dict: "",
        },
        { label: "负责人", value: "responsible", type: "text", dict: "" },
      ];
      dictName = [];
      oneMapDialog = [
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
      ];
      break;
    // 基础地理数据
    case "bgd_road_data": //基础道路数据
      imgurl = require("@/static/oneMapimages/bgd_road_data.png");
      text = "";
      showColumn = ["areaCode", "name", "type", "length"];
      tableData = [];
      dictName = ["road_data_type"];
      oneMapDialog = [
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
      ];
      break;
    case "bgd_lake_data": //基础湖泊数据
      imgurl = require("@/static/oneMapimages/bgd_lake_data.png");
      text = "";
      showColumn = ["areaCode", "name", "type", "area"];
      tableData = [];
      dictName = ["road_data_type"];
      oneMapDialog = [
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
      ];
      break;
    case "bgd_reservoir_data": //基础水库数据
      imgurl = require("@/static/oneMapimages/bgd_reservoir_data.png");
      text = "";
      showColumn = ["areaCode", "name", "type", "area"];
      tableData = [];
      dictName = ["road_data_type"];
      oneMapDialog = [
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
      ];
      break;
    case "bgd_river_data": //基础河流数据
      imgurl = require("@/static/oneMapimages/bgd_river_data.png");
      text = "";
      showColumn = ["areaCode", "name", "type", "length"];
      tableData = [];
      dictName = ["road_data_type"];
      oneMapDialog = [
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
      ];
      break;
    // 机构及防火队伍管理
    case "fireprot_mechanism": //防火机构
      imgurl = require("@/static/oneMapimages/fireprot_mechanism.png");
      text = "防火机构";
      showColumn = ["areaCode", "name", "unitLevel", "responsible"];
      tableData = [];
      dictName = [
        "fireproofing_organization_whether",
        "fireproofing_organization_investment_type",
      ];
      oneMapDialog = [
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
      ];
      break;
    case "fireprot_team_member": //防火人员
      imgurl = "";
      text = "";
      showColumn = ["areaCode", "name", "age", "position"];
      tableData = [];
      dictName = [];
      oneMapDialog = [
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
      ];
      break;
    case "fireprot_team_mgmt": //防火队伍
      imgurl = require("@/static/oneMapimages/fireprot_team_mgmt.png");
      text = "防火队伍";
      showColumn = ["areaCode", "name", "teamNum", "numOfPeople", "type"];
      tableData = [];
      dictName = ["road_data_type"];
      oneMapDialog = [
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
      ];
      break;
    // 预警监测系统
    case "ewms_satellite_hotspot": //卫星热点
      imgurl = "";
      text = "卫星热点";
      showColumn = ["areaCode", "source", "reportTime", "imgType"];
      tableData = [];
      dictName = [];
      oneMapDialog = [
        {
          label: "名称",
          value: "deviceName",
          type: "text",
          dict: "",
        },
      ];
      break;
    case "ewms_satellite_hotspot_detail": //热点详情明细
      imgurl = "";
      text = "热点详情明细";
      showColumn = ["areaCode", "receivingTime", "type", "status"];
      tableData = [];
      dictName = [];
      oneMapDialog = [
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
      ];
      break;
    case "ewms_satellite_hotspot_feedback": //热点反馈明细信息
      imgurl = "";
      text = "热点反馈明细信息";
      showColumn = [
        "areaCode",
        "sourceType",
        "status",
        "hotspotType",
        "fireStartTime",
        "fireExtinguishingTime",
      ];
      tableData = [];
      dictName = [];
      oneMapDialog = [
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
      ];
      break;
    case "ewms_alarm": //监控告警
      imgurl = "";
      text = "监控告警";
      showColumn = [
        "areaCode",
        "createdTime",
        "detectionMode",
        "status",
        "alarmTime",
        "deviceName",
      ];
      tableData = [];
      dictName = [];
      oneMapDialog = [
        {
          label: "名称",
          value: "deviceName",
          type: "text",
          dict: "",
        },
      ];
      break;
    case "ewms_hot_public_opinion": //热点舆情
      imgurl = "";
      text = "热点舆情";
      showColumn = ["areaCode", "detectionTime", "source"];
      tableData = [];
      dictName = [];
      oneMapDialog = [
        {
          label: "名称",
          value: "deviceName",
          type: "text",
          dict: "",
        },
      ];
      break;
    case "ewms_fire_danger_weaher_rating": //气象监测数据
      imgurl = "";
      text = "气象监测数据";
      showColumn = [
        "areaCode",
        "rating",
        "ratingName",
        "serviceTerms",
        "dangerIndex",
      ];
      tableData = [];
      dictName = [];
      oneMapDialog = [
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
      ];
      break;
    case "ewms_event_master": //火情事件管理
      imgurl = "";
      text = "火情事件管理";
      showColumn = [
        "areaCode",
        "name",
        "status",
        "sourceType",
        "fireStartTime",
        "fireCode",
      ];
      tableData = [];
      dictName = [];
      oneMapDialog = [
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
      ];
      break;
    // 防火宣传教育
    case "fppe_regulation": //政策法规
      imgurl = "";
      text = "政策法规";
      showColumn = ["title", "typeCode", "publishTime"];
      tableData = [];
      dictName = [];
      oneMapDialog = [
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
      ];
      break;
    case "fppe_trend": //防火动态
      imgurl = "";
      text = "防火动态";
      showColumn = ["title", "typeCode", "publishTime"];
      tableData = [];
      dictName = [];
      oneMapDialog = [
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
      ];
      break;
    case "fppe_knowledge_base": //森防知识-防火知识库
      imgurl = "";
      text = "防火知识库";
      showColumn = ["tags", "title", "author", "statusCode"];
      tableData = [];
      dictName = [];
      oneMapDialog = [
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
      ];
      break;
    case "fppe_classic_base": //森防知识-经典案例库
      imgurl = "";
      text = "经典案例库";
      showColumn = [
        "tags",
        "title",
        "publishUnit",
        "publishTime",
        "statusCode",
      ];
      tableData = [];
      dictName = [];
      oneMapDialog = [
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
      ];
      break;
    case "fppe_publicity_base": //宣传教育-宣传材料
      imgurl = "";
      text = "宣传材料";
      showColumn = [
        "tags",
        "title",
        "publishUnit",
        "publishTime",
        "statusCode",
      ];
      tableData = [];
      dictName = [];
      oneMapDialog = [
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
      ];
      break;
    case "fppe_publicity_activity": //宣传教育-宣传活动
      imgurl = "";
      text = "宣传活动";
      showColumn = [
        "tags",
        "title",
        "publishUnit",
        "publishTime",
        "statusCode",
      ];
      tableData = [];
      dictName = [];
      oneMapDialog = [
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
      ];
      break;
    case "fppe_publicity_video": //宣传教育-宣传视频
      imgurl = "";
      text = "宣传视频";
      showColumn = [
        "tags",
        "title",
        "publishUnit",
        "publishTime",
        "statusCode",
      ];
      tableData = [];
      dictName = [];
      oneMapDialog = [
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
      ];
      break;
    case "fppe_tag": //标签管理-默认标签管理
      imgurl = "";
      text = "默认标签管理";
      showColumn = ["name", "typeCode"];
      tableData = [];
      dictName = [];
      oneMapDialog = [
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
      ];
      break;
    case "bis_uav_info": // 无人机管理
      tableData = [];
      dictName = [];
      showColumn = ["areaCode", "name", "code", "pushUrl", "remark"];
      break;
    case "bis_route_task": // 无人机任务管理
      tableData = [];
      dictName = [];
      showColumn = ["areaCode", "name", "speed", "finishModel", "status"];
      break;
    case "management_duty_log": // 值班日志
      tableData = [];
      dictName = [];
      showColumn = [
        "areaCode",
        "classesDate",
        "staffName",
        // "tel",
        "organizationName",
        "hasEvent",
        "situation",
        // "toDoList",
      ];
      break;
    case "management_duty_report":
      tableData = [];
      dictName = [];
      showColumn = ["areaCode", "name", "generateTime"];
      break;
    case "management_using_fire":
      tableData = [];
      dictName = [];
      showColumn = ["areaCode", "apply", "address", "fireTime", "createdTime","status"];
      break;
    default:
      oneMapDialog = [
        {
          label: "名称",
          value: "name",
          type: "text",
          dict: "",
        },
      ];
      break;
  }
  let data = {
    imgurl,
    text,
    showColumn,
    tableData,
    dictName,
    oneMapDialog,
  };
  return data;
}
