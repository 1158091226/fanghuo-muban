import { login, logout, fetchInfo } from '@/api/auth';
import { getToken, setToken, removeToken } from '@/utils/auth';
import router, { resetRouter } from '@/router';
import md5 from 'js-md5';
import { fetchAreaList } from '@/api/system';
// import defaultSettings from '@/settings';

const state = {
  token: getToken(),
  name: '',
  level: '',
  avatar: '',
  areaCode: '',
  unitCode: '',
  roles: [],
  permissions: []
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_ID: (state, id) => {
    state.id = id;
  },
  SET_AREACODE: (state, areaCode) => {
    state.areaCode = areaCode;
  },
  SET_UNITCODE: (state, unitCode) => {
    state.unitCode = unitCode;
  },
  SET_EXTENT: (state, extent) => {
    state.extent = extent;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_LEVEL: (state, level) => {
    state.level = level;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions;
  }
};

const actions = {
  // user login
  login({ commit, state }, userInfo) {
    userInfo.password_temp = '';
    userInfo.password_temp = md5(md5(userInfo.password));
    const { username, password_temp } = userInfo;
    return new Promise((resolve, reject) => {
      const data = {
        account: username.trim(),
        passWord: password_temp,
        code: userInfo.code,
        uuid: userInfo.uuid
      };
      if (userInfo.code === '') delete data.code;
      login(data)
        .then((response) => {
          const { data } = response;
          // console.log(data)
          commit('SET_TOKEN', data.token);
          setToken(data.token);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      fetchInfo(state.token)
        .then((response) => {
          const { data } = response;

          if (!data) {
            reject('验证失败，请重新登录');
          }

          const { id, roles, nameCh, areaCode, bnCode, level, extent } = data;

          // 获取当前用户完整区划树
          const areaCache = sessionStorage.getItem('areaTree');
          if (areaCache == 'undefined' || (!areaCache && level)) {
            // 清除浏览器储存
            sessionStorage.setItem('areaTree', []);
            // 获取当前用户完整区划树
            fetchAreaList().then((res) => {
              const resData = res.data;

              // 显示几级
              const showLevel = 5;
              const obj = {};
              for (let i = level; i < showLevel + 1; i++) {
                obj[i] = [];
              }
              resData.forEach((item) => {
                // 区划级别 == 显示最大层级时，删除
                if (item.areaLevelNum == showLevel) delete item.sysAreaList;
                // 区划级别 >= 用户当前级别时
                if (item.areaLevelNum >= state.level) {
                  if (
                    item.areaLevelNum !== showLevel &&
                    item.sysAreaList === undefined
                  ) {
                    item.sysAreaList = [];
                  }
                  obj[item.areaLevelNum].push(item);
                }
              });

              const len = level + 1;

              for (let i = showLevel + 1; i > len; i--) {
                const pArr = obj[i - 2];
                const arr = obj[i - 1];
                pArr.length > 0 &&
                  pArr.forEach((item) => {
                    arr.forEach((item2) => {
                      if (item.areaCode == item2.parentAreaCode) {
                        // 删除空的下级
                        if (item2.sysAreaList && item2.sysAreaList.length < 1) {
                          delete item2.sysAreaList;
                        }
                        item.sysAreaList.push(item2);
                      }
                    });
                  });
              }

              for (var key in obj) {
                const arr = obj[key].filter(
                  (item) => item.areaCode == areaCode
                );
                sessionStorage.setItem('areaTree', JSON.stringify(arr));
                break;
              }
            });
          }

          // roles must be a non-empty array
          if (!roles || roles.length <= 0) {
            reject('获取用户角色失败');
          }

          // STRING 转换成 OBJECT
          let extent_temp = {};
          if (!extent && typeof extent !== 'undefined' && extent != 0) {
            extent_temp = {};
          } else {
            // extent_temp = eval('(' + extent + ')');
            extent_temp = JSON.parse(extent);
          }

          commit('SET_ID', id);
          commit('SET_ROLES', roles);
          commit('SET_NAME', nameCh);
          commit('SET_LEVEL', level);
          // commit('SET_AVATAR', '');
          commit('SET_AREACODE', areaCode);
          commit('SET_UNITCODE', bnCode);
          commit('SET_EXTENT', extent_temp);
          commit('SET_PERMISSIONS', data.permissions);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout()
        .then(() => {
          dispatch('resetToken');

          resetRouter();

          // reset visited views and cached views
          // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
          dispatch('tagsView/delAllViews', null, { root: true });

          // 清除浏览器储存，防止空间存满，无法储存
          sessionStorage.removeItem('areaTree');

          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  setToken({ commit }, token) {
    commit('SET_TOKEN', token);
    setToken(token);
  },

  // remove token
  resetToken({ commit, dispatch }) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', '');
      commit('SET_ROLES', []);
      commit('SET_PERMISSIONS', []);

      commit('SET_ID', '');
      commit('SET_NAME', '');
      commit('SET_LEVEL', '');
      commit('SET_AVATAR', '');
      commit('SET_AREACODE', '');
      commit('SET_UNITCODE', '');
      commit('SET_EXTENT', '');

      removeToken();
      resolve();
    });
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token';

    commit('SET_TOKEN', token);
    setToken(token);

    const { roles } = await dispatch('getInfo');

    resetRouter();

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, {
      root: true
    });
    // dynamically add accessible routes
    router.addRoutes(accessRoutes);

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
