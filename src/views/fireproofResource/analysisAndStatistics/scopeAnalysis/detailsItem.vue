<!--  -->
<template>
  <div class="app-list-page" style="padding: 0">
    <div class="list-map-box">
      <component
        :is="currentCompoent"
        ref="isAll"
        :current-selection="dialogSelectData"
        :is-show-handle="false"
        style="padding: 0"
      />
    </div>
  </div>
</template>

<script>
// 防火设备设施
import IsolationEdit from "@/views/fireproofResource/fireproofingFacility/edits/isolationEdit.vue";
import WatchtowerEdit from "@/views/fireproofResource/fireproofingFacility/edits/watchtowerEdit.vue";
import BillboardEdit from "@/views/fireproofResource/fireproofingFacility/edits/billboardEdit.vue";
import CheckpointEdit from "@/views/fireproofResource/fireproofingFacility/edits/checkpointEdit.vue";
import ColEdit from "@/views/fireproofResource/fireproofingFacility/edits/colEdit.vue";
import EscapePointEdit from "@/views/fireproofResource/fireproofingFacility/edits/escapePointEdit.vue";
import FiretruckEdit from "@/views/fireproofResource/fireproofingFacility/edits/firetruckEdit.vue";
import ForestProtectionEdit from "@/views/fireproofResource/fireproofingFacility/edits/forestProtectionEdit.vue";
import HelLandingEdit from "@/views/fireproofResource/fireproofingFacility/edits/helLandingEdit.vue";
import HelWaterIntakingEdit from "@/views/fireproofResource/fireproofingFacility/edits/helWaterIntakingEdit.vue";
import IndividualEquipmentEdit from "@/views/fireproofResource/fireproofingFacility/edits/individualEquipmentEdit.vue";
import MechanismEdit from "@/views/fireproofResource/fireproofingFacility/edits/mechanismEdit.vue";
import ReserveEdit from "@/views/fireproofResource/fireproofingFacility/edits/reserveEdit.vue";
import ReserveManagerEdit from "@/views/fireproofResource/fireproofingFacility/edits/reserveManagerEdit.vue";
import ReservoirEdit from "@/views/fireproofResource/fireproofingFacility/edits/reservoirEdit.vue";
import WeatherStationEdit from "@/views/fireproofResource/fireproofingFacility/edits/weatherStationEdit.vue";
// 防火调查数据管理
import ImptPointEdit from "@/views/fireproofResource/investigationDataManage/edits/imptPointEdit.vue";
import ImptTargetEdit from "@/views/fireproofResource/investigationDataManage/edits/imptTargetEdit.vue";
import ResidentialAreaEdit from "@/views/fireproofResource/investigationDataManage/edits/residentialAreaEdit.vue";
// 森林资源管理
import IndustrialDataEdit from "@/views/fireproofResource/forestResourcesManage/edits/industrialDataEdit.vue";
import NaturalReserveEdit from "@/views/fireproofResource/forestResourcesManage/edits/naturalReserveEdit.vue";
import OldAndFamousTreesEdit from "@/views/fireproofResource/forestResourcesManage/edits/oldAndFamousTreesEdit.vue";
import WoleForestEdit from "@/views/fireproofResource/forestResourcesManage/forest/edits/wholeForestEdit.vue";
export default {
  components: {
    // 防火设备设施
    IsolationEdit,
    WatchtowerEdit,
    BillboardEdit,
    CheckpointEdit,
    ColEdit,
    EscapePointEdit,
    FiretruckEdit,
    ForestProtectionEdit,
    HelLandingEdit,
    HelWaterIntakingEdit,
    IndividualEquipmentEdit,
    MechanismEdit,
    ReserveEdit,
    ReserveManagerEdit,
    ReservoirEdit,
    WeatherStationEdit,
    // 防火调查数据管理
    ImptPointEdit,
    ImptTargetEdit,
    ResidentialAreaEdit,
    // 森林资源管理
    IndustrialDataEdit,
    NaturalReserveEdit,
    OldAndFamousTreesEdit,
    WoleForestEdit,
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
      currentCompoent: "",
    };
  },

  // components: {},

  // watch: {},

  // computed: {},

  // mounted(){},

  created() {},
  methods: {
    updateIs(type) {
      switch (type) {
        // 防火设备设施
        case "fireprot_isolation": // 林火阻隔
          this.currentCompoent = "IsolationEdit";
          break;
        case "fireprot_watchtower": // 瞭望塔
          this.currentCompoent = "WatchtowerEdit";
          break;
        case "fireprot_billboard": // 防火宣传牌
          this.currentCompoent = "BillboardEdit";
          break;
        case "fireprot_checkpoint": // 检查站
          this.currentCompoent = "CheckpointEdit";
          break;
        case "fireprot_col": // 卡口
          this.currentCompoent = "ColEdit";
          break;
        case "fireprot_escape_point": // 火灾逃生点
          this.currentCompoent = "EscapePointEdit";
          break;
        case "fireprot_firetruck": // 救火车
          this.currentCompoent = "FiretruckEdit";
          break;
        case "fireprot_forest_protection": // 护林点
          this.currentCompoent = "ForestProtectionEdit";
          break;
        case "fireprot_hel_landing": // 直升机降落点
          this.currentCompoent = "HelLandingEdit";
          break;
        case "fireprot_hel_water_intaking": // 直升机取水点
          this.currentCompoent = "HelWaterIntakingEdit";
          break;
        case "fireprot_individual_equipment": // 单兵作战设备
          this.currentCompoent = "IndividualEquipmentEdit";
          break;
        case "12":
          this.currentCompoent = "MechanismEdit";
          break;
        case "fireprot_reserve": // 物资存储库
          this.currentCompoent = "ReserveEdit";
          break;
        case "14":
          this.currentCompoent = "ReserveManagerEdit";
          break;
        case "fireprot_reservoir": // 蓄水池
          this.currentCompoent = "ReservoirEdit";
          break;
        case "fireprot_weather_station": // 气象站
          this.currentCompoent = "WeatherStationEdit";
          break;
        // 防火调查数据管理
        case "fireprot_impt_point": // 火源检测点
          this.currentCompoent = "ImptPointEdit";
          break;
        case "fireprot_impt_target": // 重点保护点
          this.currentCompoent = "ImptTargetEdit";
          break;
        case "fireprot_residential_area": // 居民点
          this.currentCompoent = "ResidentialAreaEdit";
          break;
        // 森林资源管理
        case "forestry_industrial_data": // 林业产业
          this.currentCompoent = "IndustrialDataEdit";
          break;
        case "forestry_natural_reserve": // 自然保护地
          this.currentCompoent = "NaturalReserveEdit";
          break;
        case "forestry_old_and_famous_trees": // 古树名木
          this.currentCompoent = "OldAndFamousTreesEdit";
          break;
        case "forestry_whole_forest": // 林地
          this.currentCompoent = "WoleForestEdit";
          break;
        default:
          this.currentCompoent = "";
          break;
      }
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.isAll.updateDetails();
        }, 10);
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
