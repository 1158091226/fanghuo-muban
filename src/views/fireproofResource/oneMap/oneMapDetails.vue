<!--  -->
<template>
  <div class="app-list-page">
    <component
      :is="currentCompoent"
      :dialog-select-data="dialogSelectData"
      :dialog-visible.sync="dialogVisible"
      @close="close"
    />
  </div>
</template>

<script>
// 防火设备设施
import IsolationEditDialog from "@/views/fireproofResource/fireproofingFacility/editDialogs/isolationEditDialog.vue";
import WatchtowerEditDialog from "@/views/fireproofResource/fireproofingFacility/editDialogs/watchtowerEditDialog.vue";
import BillboardEditDialog from "@/views/fireproofResource/fireproofingFacility/editDialogs/billboardEditDialog.vue";
import CheckpointEditDialog from "@/views/fireproofResource/fireproofingFacility/editDialogs/checkpointEditDialog.vue";
import ColEditDialog from "@/views/fireproofResource/fireproofingFacility/editDialogs/colEditDialog.vue";
import EscapePointEditDialog from "@/views/fireproofResource/fireproofingFacility/editDialogs/escapePointEditDialog.vue";
import FiretruckEditDialog from "@/views/fireproofResource/fireproofingFacility/editDialogs/firetruckEditDialog.vue";
import ForestProtectionEditDialog from "@/views/fireproofResource/fireproofingFacility/editDialogs/forestProtectionEditDialog.vue";
import HelLandingEditDialog from "@/views/fireproofResource/fireproofingFacility/editDialogs/helLandingEditDialog.vue";
import HelWaterIntakingEditDialog from "@/views/fireproofResource/fireproofingFacility/editDialogs/helWaterIntakingEditDialog.vue";
import IndividualEquipmentEditDialog from "@/views/fireproofResource/fireproofingFacility/editDialogs/individualEquipmentEditDialog.vue";
import MechanismEditDialog from "@/views/fireproofResource/fireproofingFacility/editDialogs/mechanismEditDialog.vue";
import ReserveEditDialog from "@/views/fireproofResource/fireproofingFacility/editDialogs/reserveEditDialog.vue";
import ReserveManagerEditDialog from "@/views/fireproofResource/fireproofingFacility/editDialogs/reserveManagerEditDialog.vue";

import ReservoirEditDialog from "@/views/fireproofResource/fireproofingFacility/editDialogs/reservoirEditDialog.vue";
import WeatherStationEditDialog from "@/views/fireproofResource/fireproofingFacility/editDialogs/weatherStationEditDialog.vue";
// 防火调查数据管理
import ImptPointEditDialog from "@/views/fireproofResource/investigationDataManage/editDialogs/imptPointEditDialog.vue";
import ImptTargetEditDialog from "@/views/fireproofResource/investigationDataManage/editDialogs/imptTargetEditDialog.vue";
import ResidentialAreaEditDialog from "@/views/fireproofResource/investigationDataManage/editDialogs/residentialAreaEditDialog.vue";
// 森林资源管理
import IndustrialDataEditDialog from "@/views/fireproofResource/forestResourcesManage/editDialogs/industrialDataEditDialog.vue";
import NaturalReserveEditDialog from "@/views/fireproofResource/forestResourcesManage/editDialogs/naturalReserveEditDialog.vue";
import OldAndFamousTreesEditDialog from "@/views/fireproofResource/forestResourcesManage/editDialogs/oldAndFamousTreesEditDialog.vue";
import WoleForestEditDialog from "@/views/fireproofResource/forestResourcesManage/forest/editDialogs/wholeForestEditDialog.vue";
export default {
  components: {
    // 防火设备设施
    IsolationEditDialog,
    WatchtowerEditDialog,
    BillboardEditDialog,
    CheckpointEditDialog,
    ColEditDialog,
    EscapePointEditDialog,
    FiretruckEditDialog,
    ForestProtectionEditDialog,
    HelLandingEditDialog,
    HelWaterIntakingEditDialog,
    IndividualEquipmentEditDialog,
    MechanismEditDialog,
    ReserveEditDialog,
    ReserveManagerEditDialog,
    ReservoirEditDialog,
    WeatherStationEditDialog,
    // 防火调查数据管理
    ImptPointEditDialog,
    ImptTargetEditDialog,
    ResidentialAreaEditDialog,
    // 森林资源管理
    IndustrialDataEditDialog,
    NaturalReserveEditDialog,
    OldAndFamousTreesEditDialog,
    WoleForestEditDialog,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    dialogSelectData: {
      type: Object,
      default() {
        return { any };
      },
    },
    dialogType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      currentCompoent: "IsolationEditDialog",
    };
  },

  // components: {},

  // watch: {},

  // computed: {},

  // mounted(){},

  created() {
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
      if (this.dialogType.indexOf(item) > -1) {
        this.dialogType = item;
      }
    });

    switch (this.dialogType) {
      // 防火设备设施
      case "fireprot_isolation": // 林火阻隔
        this.currentCompoent = "IsolationEditDialog";
        break;
      case "fireprot_watchtower": // 瞭望塔
        this.currentCompoent = "WatchtowerEditDialog";
        break;
      case "fireprot_billboard": // 防火宣传牌
        this.currentCompoent = "BillboardEditDialog";
        break;
      case "fireprot_checkpoint": // 检查站
        this.currentCompoent = "CheckpointEditDialog";
        break;
      case "fireprot_col": // 卡口
        this.currentCompoent = "ColEditDialog";
        break;
      case "fireprot_escape_point": // 火灾逃生点
        this.currentCompoent = "EscapePointEditDialog";
        break;
      case "fireprot_firetruck": // 救火车
        this.currentCompoent = "FiretruckEditDialog";
        break;
      case "fireprot_forest_protection": // 护林点
        this.currentCompoent = "ForestProtectionEditDialog";
        break;
      case "fireprot_hel_landing": // 直升机降落点
        this.currentCompoent = "HelLandingEditDialog";
        break;
      case "fireprot_hel_water_intaking": // 直升机取水点
        this.currentCompoent = "HelWaterIntakingEditDialog";
        break;
      case "fireprot_individual_equipment": // 单兵作战设备
        this.currentCompoent = "IndividualEquipmentEditDialog";
        break;
      case "12":
        this.currentCompoent = "MechanismEditDialog";
        break;
      case "fireprot_reserve": // 物资存储库
        this.currentCompoent = "ReserveEditDialog";
        break;
      case "14":
        this.currentCompoent = "ReserveManagerEditDialog";
        break;
      case "fireprot_reservoir": // 蓄水池
        this.currentCompoent = "ReservoirEditDialog";
        break;
      case "fireprot_weather_station": // 气象站
        this.currentCompoent = "WeatherStationEditDialog";
        break;
      // 防火调查数据管理
      case "fireprot_impt_point": // 火源检测点
        this.currentCompoent = "ImptPointEditDialog";
        break;
      case "fireprot_impt_target": // 重点保护点
        this.currentCompoent = "ImptTargetEditDialog";
        break;
      case "fireprot_residential_area": // 居民点
        this.currentCompoent = "ResidentialAreaEditDialog";
        break;
      // 森林资源管理
      case "forestry_industrial_data": // 林业产业
        this.currentCompoent = "IndustrialDataEditDialog";
        break;
      case "forestry_natural_reserve": // 自然保护地
        this.currentCompoent = "NaturalReserveEditDialog";
        break;
      case "forestry_old_and_famous_trees": // 古树名木
        this.currentCompoent = "OldAndFamousTreesEditDialog";
        break;
      case "forestry_whole_forest": // 林地
        this.currentCompoent = "WoleForestEditDialog";
        break;
    }
  },
  methods: {
    close() {
      this.$emit("update:dialogVisible", false);
    },
  },
};
</script>

<style lang="less" scoped></style>
