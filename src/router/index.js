import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index"),
      },
    ],
  },
  {
    path: "/login",
    component: () => import("@/views/login/index1"),
    // component: () => import('@/views/login/index'),
    hidden: true,
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404"),
    hidden: true,
  },
  {
    path: "/login/single",
    component: () => import("@/views/login/single"),
    hidden: true,
  },
  // {
  //   path: '/wall', // 电视墙
  //   component: () => import('@/views/firePerceptionManage/videoMonitoringManage/wall.vue'),
  //   hidden: true
  // },
  /* {
      path: '/',
      component: Layout,
      redirect: '/dashboard',
      children: [
          {
              path: 'dashboard',
              component: () => import('@/views/dashboard/index'),
              name: 'Dashboard',
              meta: { title: 'dashboard', icon: 'dashboard', affix: true }
          }
      ]
  }, */

  {
    path: "/",
    component: Layout,
    redirect: "/system/role",
  },
  /* {
      path: '/home',
      component: () => import('@/views/home/index')
  }, */
  {
    path: "/profile",
    component: Layout,
    redirect: "/profile/index",
    hidden: true,
    children: [
      {
        path: "index",
        component: () => import("@/views/profile/index"),
        name: "Profile",
        meta: { title: "profile", icon: "user", noCache: true },
      },
    ],
  },
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  /* {
      path: '/data',
      component: Layout,
      redirect: '/data/forest-inspection',
      name: 'data',
      meta: {
          title: 'data',
          icon: 'international',
          roles: ['admin']
      },
      children: [
          {
              path: 'forest-inspection',
              component: () => import('@/views/data/forest-inspection'),
              name: 'forestInspection',
              meta: { title: 'forestInspection' }
          },
          {
              path: 'forest-supervise',
              component: () => import('@/views/data/forest-supervise'),
              name: 'forestSupervise',
              meta: { title: 'forestSupervise' }
          },

          {
              path: 'forest-resources',
              component: () => import('@/views/data/forest-resources/woodland'),
              name: 'forestResources',
              meta: { title: 'forestResources' },
              redirect: 'noRedirect',
              children: [
                  {
                      path: 'woodland',
                      component: () => import('@/views/data/forest-resources/woodland'),
                      name: 'woodland',
                      meta: { title: 'woodland' }
                  },
                  {
                      path: 'cut-over-land',
                      component: () => import('@/views/data/forest-resources/cut-over-land'),
                      name: 'cutOverLand',
                      meta: { title: 'cutOverLand' }
                  },
                  {
                      path: 'fell',
                      component: () => import('@/views/data/forest-resources/fell'),
                      name: 'fell',
                      meta: { title: 'fell' }
                  },
                  {
                      path: 'natural-forest',
                      component: () => import('@/views/data/forest-resources/natural-forest'),
                      name: 'naturalForest',
                      meta: { title: 'naturalForest' }
                  },
                  {
                      path: 'non-commercial-forest',
                      component: () => import('@/views/data/forest-resources/non-commercial-forest'),
                      name: 'nonCommercialForest',
                      meta: { title: 'nonCommercialForest' }
                  },
                  {
                      path: 'project-land',
                      component: () => import('@/views/data/forest-resources/project-land'),
                      name: 'nonCommercialForest',
                      meta: { title: 'projectLand' }
                  }
              ]
          },
          {
              path: 'map-image',
              component: () => import('@/views/data/map-image'),
              name: 'mapImage',
              meta: { title: 'mapImage' }
          },
          {
              path: 'daily-record',
              component: () => import('@/views/data/daily-record'),
              name: 'dailyRecord',
              meta: { title: 'dailyRecord' }
          }
      ]
  },
  {
      path: '/analysis',
      component: Layout,
      redirect: 'noRedirect',
      name: 'Analysis',
      meta: {
          title: 'analysis',
          icon: 'tree-table',
          roles: ['admin']
      },
      children: [
          {
              path: 'merge',
              component: () => import('@/views/analysis/merge'),
              name: 'Merge',
              meta: { title: 'merge' }
          },
          {
              path: 'issue',
              component: () => import('@/views/analysis/issue'),
              name: 'Issue',
              meta: { title: 'issue' }
          }
      ]
  },
  {
      path: '/survey',
      component: Layout,
      redirect: '/survey/inside',
      name: 'survey',
      meta: {
          title: 'survey',
          icon: 'form',
          roles: ['admin']
      },
      children: [
          {
              path: 'inside',
              component: () => import('@/views/survey/inside'),
              name: 'inside',
              meta: { title: 'survey' }
          }
      ]
  },
  {
      path: '/case',
      component: Layout,
      redirect: '/case/index',
      name: 'case',
      meta: {
          title: 'case',
          icon: 'el-icon-warning',
          roles: ['admin']
      },
      children: [
          {
              path: 'index',
              component: () => import('@/views/case/index'),
              name: 'case',
              meta: { title: 'case' }
          }
      ]
  },
  {
      path: '/duty',
      component: Layout,
      redirect: '/duty/index',
      name: 'duty',
      meta: {
          title: 'duty',
          icon: 'el-icon-s-opportunity',
          roles: ['admin']
      },
      children: [
          {
              path: 'index',
              component: () => import('@/views/duty/index'),
              name: 'duty',
              meta: { title: 'duty' }
          }
      ]
  },
  {
      path: '/quality',
      component: Layout,
      redirect: 'noRedirect',
      name: 'quality',
      meta: {
          title: 'quality',
          icon: 'el-icon-s-order',
          roles: ['admin']
      },
      children: [
          {
              path: 'inside',
              component: () => import('@/views/quality/inside'),
              name: 'qualityInside',
              meta: { title: 'inside' }
          },
          {
              path: 'outside',
              component: () => import('@/views/quality/outside'),
              name: 'qualityOutside',
              meta: { title: 'spotCheck' }
          }
      ]
  },
  {
      path: '/results',
      component: Layout,
      redirect: '/results/statistics',
      name: 'lists',
      meta: {
          title: 'results',
          icon: 'el-icon-s-claim',
          roles: ['admin']
      },
      children: [
          {
              path: 'statistics',
              component: () => import('@/views/results/statistics'),
              name: 'statistics',
              meta: { title: 'resultsSubmit' }
          },
          {
              path: 'statistics',
              component: () => import('@/views/results/statistics'),
              name: 'statistics',
              meta: { title: 'statistics' }
          }
      ]
  },
  {
      path: '/system',
      component: Layout,
      redirect: '/system/role',
      name: 'system',
      meta: {
          title: 'system',
          icon: 'el-icon-s-tools',
          roles: ['admin']
      },
      children: [
          {
              path: 'role',
              component: () => import('@/views/system/role'),
              name: 'role',
              meta: { title: 'roles' }
          },
          {
              path: 'statistics',
              component: () => import('@/views/results/statistics'),
              name: 'statistics',
              meta: { title: 'users' }
          },
          {
              path: 'statistics',
              component: () => import('@/views/results/statistics'),
              name: 'statistics',
              meta: { title: 'menus' }
          },
          {
              path: 'statistics',
              component: () => import('@/views/results/statistics'),
              name: 'statistics',
              meta: { title: 'logs' }
          },
          {
              path: 'statistics',
              component: () => import('@/views/results/statistics'),
              name: 'statistics',
              meta: { title: 'tags' }
          }
      ]
  }, */
  /* {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: 'permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: 'pagePermission',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'directivePermission'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: 'rolePermission',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    meta: {
      title: 'errorPages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: { title: 'page401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: 'page404', noCache: true }
      }
    ]
  },
  {
    path: '/lists',
    component: Layout,
    redirect: '/lists/list',
    name: 'lists',
    meta: {
      title: 'lists',
      icon: 'list',
      roles: ['admin']
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/lists/list'),
        name: 'List',
        meta: { title: 'list', icon: 'list' }
      },
      {
        path: 'list-map',
        component: () => import('@/views/lists/list-map'),
        name: 'ListMap',
        meta: { title: 'listMap', icon: 'list' }
      }
    ]
  }, */

  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true },
  // {
  //   path: '/demo',
  //   component: Layout,
  //   name: 'demo',
  //   hidden: false,
  //   redirect: '/demo/fireproofDataManage',
  //   meta: {
  //     title: 'demo',
  //     icon: 'demo'
  //   },
  //   children: [
  //     {
  //       path: 'openlayers',
  //       component: () => import('@/views/demo/openlayers'),
  //       name: 'openlayers',
  //       meta: { title: 'openlayers', icon: '' }
  //     },
  //     {
  //       path: 'cesium',
  //       component: () => import('@/views/demo/cesiumdemo'),
  //       name: 'cesium',
  //       meta: { title: 'cesium', icon: '' }
  //     },
  //     {
  //       path: 'mapDemo',
  //       component: () => import('@/views/demo/mapDemo'),
  //       name: 'mapDemo',
  //       meta: { title: 'mapDemo', icon: '' }
  //     },
  //     {
  //       path: 'template',
  //       component: () => import('@/views/demo/template'),
  //       name: 'template',
  //       meta: { title: 'template', icon: '' }
  //     },
  //     // {
  //     //   path: 'fireproofDataManage',
  //     //   component: () =>
  //     //     import(
  //     //       '@/views/fireproofResource/fireproofingFacility/individualEquipment'
  //     //     ),
  //     //   name: 'fireproofDataManage',
  //     //   meta: { title: '居民点', icon: '' }
  //     // }
  //     {
  //       path: 'fireproofDataManage',
  //       component: () => import('@/views/demo/fireproofDataManage'),
  //       name: 'fireproofDataManage',
  //       meta: { title: '居民点', icon: '' }
  //     }
  //   ]
  // }
];

const createRouter = () =>
  new Router({
    mode: "hash", // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
