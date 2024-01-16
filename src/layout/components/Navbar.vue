<template>
  <div class="navbar">
    <div class="navbar-left">
      <hamburger
        id="hamburger-container"
        :is-active="sidebar.opened"
        class="hamburger-container"
        @toggleClick="toggleSideBar"
      />

      <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    </div>

    <div class="navbar-right">
      <template v-if="device !== 'mobile'">
        <!-- <screenfull id="screenfull" class="right-menu-item hover-effect" /> -->
      </template>
      <div class="user-avater">
        <img src="~@/static/avatar.png" class="user-avatar-img">
      </div>
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <div>
            {{ user.name }}&nbsp;&nbsp;&nbsp;&nbsp;<i
              class="el-icon-caret-bottom"
            />
          </div>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/profile/index">
            <el-dropdown-item>
              {{ $t("navbar.profile") }}
            </el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item>
              {{ $t("navbar.dashboard") }}
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">{{ $t("navbar.logOut") }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="right-notice">
        <img
          src="~@/static/templateImages/notice.png"
          class="right-notice-img"
        >
      </div>
      <div class="right-help">
        <img src="~@/static/templateImages/help.png" class="right-help-img">
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Breadcrumb from '@/components/Breadcrumb';
import Hamburger from '@/components/Hamburger';
import ErrorLog from '@/components/ErrorLog';
import Screenfull from '@/components/Screenfull';
import SizeSelect from '@/components/SizeSelect';
import Search from '@/components/HeaderSearch';

export default {
  components: {
    Breadcrumb,
    Hamburger,
    // ErrorLog,
    Screenfull
    // SizeSelect,
    // Search,
  },
  inject: ['reload'],
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'device', 'user'])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar');
    },
    async logout() {
      await this.$store.dispatch('user/logout');
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 56px;
  // overflow: hidden;
  // position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  // box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .navbar-left {
    display: flex;
    .hamburger-container {
      line-height: 50px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background 0.3s;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }

    .breadcrumb-container {
      float: left;
    }
  }

  // .errLog-container {
  //   display: inline-block;
  //   vertical-align: top;
  // }

  .navbar-right {
    height: 100%;
    // background-color: red;
    display: flex;
    align-items: center;
    width: 25%;
    justify-content: end;
    padding-right: 33px;

    .user-avater {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      .user-avatar-img {
        width: 100%;
        height: 100%;
      }
    }
    .right-notice {
      width: 11px;
      height: 14px;
      overflow: hidden;
      margin-left: 18px;
      .right-notice-img {
        width: 100%;
        height: 100%;
      }
    }
    .right-help {
      width: 14px;
      height: 14px;
      margin-left: 25px;
      overflow: hidden;
      .right-help-img {
        width: 100%;
        height: 100%;
      }
    }

    &:focus {
      outline: none;
    }

    .right-menu-item {
      // display: inline-block;
      padding: 0 8px;
      // height: 100%;
      font-size: 18px;
      color: #5a5e66;
      // vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-left: 12px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;
        align-items: center;

        // .el-icon-caret-bottom {
        //   cursor: pointer;
        //   position: absolute;
        //   right: -20px;
        //   top: 25px;
        //   font-size: 12px;
        // }
      }
    }
  }
}
</style>
