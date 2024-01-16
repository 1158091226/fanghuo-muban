import { imptPointApi } from "@/api/fireprot/imptPoint";
import { imptTargetApi } from "@/api/fireprot/imptTarget";
import { industrialDataApi } from "@/api/forestry/industrialData";
import { oldAndFamousTreesApi } from "@/api/forestry/oldAndFamousTrees";
import { wholeForestApi } from "@/api/forestry/wholeForest";
import { isolationApi } from "@/api/fireprot/isolation";
import { watchtowerApi } from "@/api/fireprot/watchtower";
import { reservoirApi } from "@/api/fireprot/reservoir";
import { helWaterIntakingApi } from "@/api/fireprot/helWaterIntaking";
import { helLandingApi } from "@/api/fireprot/helLanding";
import { reserveApi } from "@/api/fireprot/reserve";
import { weatherStationApi } from "@/api/fireprot/weatherStation";
import { escapePointApi } from "@/api/fireprot/escapePoint";
import { billboardApi } from "@/api/fireprot/billboard";
import { checkpointApi } from "@/api/fireprot/checkpoint";
import { colApi } from "@/api/fireprot/col";
import { firetruckApi } from "@/api/fireprot/firetruck";
import { individualEquipmentApi } from "@/api/fireprot/individualEquipment";
import { forestProtectionApi } from "@/api/fireprot/forestProtection";
import { residentialAreaApi } from "@/api/fireprot/residentialArea";
import { naturalReserveApi } from "@/api/forestry/naturalReserve";

export function getDetailsApi(id, type, callback) {
  let arr = [
    "fireprot_impt_point",
    "fireprot_impt_target",
    "forestry_industrial_data",
    "forestry_old_and_famous_trees",
    "forestry_whole_forest",
    "forestry_natural_reserve",
    "fireprot_isolation",
    "fireprot_watchtower",
    "fireprot_reservoir",
    "fireprot_hel_water_intaking",
    "fireprot_hel_landing",
    "fireprot_reserve",
    "fireprot_weather_station",
    "fireprot_escape_point",
    "fireprot_billboard",
    "fireprot_checkpoint",
    "fireprot_col",
    "fireprot_firetruck",
    "fireprot_individual_equipment",
    "fireprot_forest_protection",
  ];
  arr.forEach((item) => {
    if (type.indexOf(item) > -1) {
      type = item;
    }
  });
  let API;
  switch (type) {
    // 防火调查数据管理
    case "fireprot_impt_point": // 火源检测点
      API = imptPointApi;
      break;
    case "fireprot_impt_target": // 重点保护点
      API = imptTargetApi;
      break;
    case "fireprot_residential_area": // 居民点
      API = residentialAreaApi;
      break;
    // 森林资源管理
    case "forestry_industrial_data": // 林业产业
      API = industrialDataApi;
      break;
    case "forestry_old_and_famous_trees": // 古树名木
      API = oldAndFamousTreesApi;
      break;
    case "forestry_natural_reserve": // 自然保护地
      API = naturalReserveApi;
      break;
    case "forestry_whole_forest": // 林地
      API = wholeForestApi;
      break;
    // 防火设备设施
    case "fireprot_isolation": // 林火阻隔
      API = isolationApi;
      break;
    case "fireprot_watchtower": // 瞭望塔
      API = watchtowerApi;
      break;
    case "fireprot_reservoir": // 蓄水池
      API = reservoirApi;
      break;
    case "fireprot_hel_water_intaking": // 直升机取水点
      API = helWaterIntakingApi;
      break;
    case "fireprot_hel_landing": // 直升机降落点
      API = helLandingApi;
      break;
    case "fireprot_reserve": // 物资存储库
      API = reserveApi;
      break;
    case "fireprot_weather_station": // 气象站
      API = weatherStationApi;
      break;
    case "fireprot_escape_point": // 火灾逃生点
      API = escapePointApi;
      break;
    case "fireprot_billboard": // 防火宣传牌
      API = billboardApi;
      break;
    case "fireprot_checkpoint": // 检查站
      API = checkpointApi;
      break;
    case "fireprot_col": // 卡口
      API = colApi;
      break;
    case "fireprot_firetruck": // 救火车
      API = firetruckApi;
      break;
    case "fireprot_individual_equipment": // 单兵作战设备
      API = individualEquipmentApi;
      break;
    case "fireprot_forest_protection": // 护林点
      API = forestProtectionApi;
      break;

    default:
      break;
  }
  API("detail", "get", { id: id })
    .then((res) => {
      callback(res);
    })
    .catch(() => {
      callback((res = ""));
    });
}
