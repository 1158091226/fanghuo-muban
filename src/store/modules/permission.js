import { asyncRoutes, constantRoutes } from "@/router";
import { fetchRouter } from "@/api/auth";
import Layout from "@/layout";

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => route.meta.roles.includes(role));
  } else {
    return true;
  }
}

/* function replaceComponent(data) {
    if (data.component && typeof (data.component) == 'string') {
        data.component = componentMap[data.component]
    }
    if (data.children && data.children.length > 0) {
        for (let i = 0; i < data.children.length; i++) {
            data.children[i] = replaceComponent(data.children[i])
        }
    }
    return data
} */

/**
 * 后台查询的菜单数据拼装成路由格式的数据
 * @param routes
 */
export function generaMenu(routes, data) {
  /* console.log(routes) */
  data.forEach((item) => {
    // alert(JSON.stringify(item))

    //const com = item.component === 'Layout' ? Layout : () => import(`@/views${item.component}`)
    /* const com = item.component === 'Layout' ? Layout : componentMap[item.component] */
    /* console.log(com) */

    let menu = {
      path: item.path || "/",
      /* component: item.component === '#' ? Layout : () => import(`@/views${item.component}`), */
      /* component: item.component === 'Layout' ? Layout : '() => import(@/views' + item.component + ')', */
      /* component: item.url === '#' ? Layout : () => require(['@/views' + item.component]), */
      //component: item.component === 'Layout' ? Layout : componentMap[item.component],
      component:
        item.component === "Layout"
          ? Layout
          : (resolve) => require([`@/views${item.component}`], resolve),
      hidden: item.hidden,
      redirect: item.redirect,
      name: item.name,
      query: item.query,
      meta: {
        title: item.meta.title,
        icon: item.meta.icon,
        roles: item.meta.roles,
        noCache: item.meta.noCache,
      },
    };

    if (item.children) {
      menu.children = [];
      generaMenu(menu.children, item.children);
    }
    routes.push(menu);
  });
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = [];

  routes.forEach((route) => {
    const tmp = { ...route };
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles);
      }
      res.push(tmp);
    }
  });

  return res;
}

// 处理路由名称
export function routeName(arr, name) {
  arr.forEach((item) => {
    if (item.name) item.name = name + item.name;
    if (item.children && item.children.length)
      routeName(item.children, item.name);
  });
  return arr;
}

const state = {
  routes: [],
  addRoutes: [],
};

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes;
    state.routes = constantRoutes.concat(routes);
  },
};

const actions = {
  /* generateRoutes({ commit }, roles) {
        return new Promise(resolve => {
            console.log(resolve)
            let res = await getRouters()
            const asyncRoutes = res.data
            console.log(res)
            const tmptmp = asyncRoutes.filter(curr => {
                if (curr.children == null || curr.children.length == 0) {
                    delete curr.children
                }
                return replaceComponent(curr)
            })
            console.log(tmptmp)

            let accessedRoutes
            if (roles.includes('superadmin')) {
                accessedRoutes = asyncRoutes || []
            } else {
                accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
            }
            commit('SET_ROUTES', accessedRoutes)
            resolve(accessedRoutes)
        })
    } */
  generateRoutes({ commit }, roles) {
    return new Promise((resolve) => {
      const loadMenuData = [];
      // 先查询后台并返回左侧菜单数据并把数据添加到路由
      fetchRouter()
        .then((response) => {
          let data = response;
          if (response.code !== 200) {
            alert(JSON.stringify("菜单数据加载异常"));
            // throw new Error('菜单数据加载异常')
          } else {
            data = response.data;
            Object.assign(loadMenuData, data);
            const tempAsyncRoutes = Object.assign([], asyncRoutes);
            generaMenu(tempAsyncRoutes, loadMenuData);

            /* let test = {}
                    test = {
                        path: '/duty',
                        component: Layout,
                        redirect: '/duty/index',
                        meta: { title: 'profile', icon: 'user', noCache: false },
                        children: [
                            {
                                alwaysShow: false,
                                path: 'index',
                                component: () => import('@/views/duty/index'),
                                name: 'Profile',
                                hidden: false,
                                meta: { title: 'profile', icon: 'user', noCache: false }
                            }
                        ]
                    }
                    let tempTest = tempAsyncRoutes
                    tempTest.push(test)
                    console.log(tempTest) */
            /* const tempAsyncRoutes = [] */
            let accessedRoutes;
            if (roles.includes("superadmin")) {
              // alert(JSON.stringify(asyncRoutes))
              accessedRoutes = tempAsyncRoutes || [];
            } else {
              accessedRoutes = filterAsyncRoutes(tempAsyncRoutes, roles);
            }
            //commit('SET_ROUTES', accessedRoutes);
            commit("SET_ROUTES", routeName(accessedRoutes, ""));
            resolve(accessedRoutes);
          }
          // generaMenu(asyncRoutes, data)
        })
        .catch((error) => {
          console.log(error);
        });
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
