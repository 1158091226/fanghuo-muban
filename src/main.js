import Vue from 'vue';

import Cookies from 'js-cookie';

import 'normalize.css/normalize.css'; // a modern alternative to CSS resets

import Element from 'element-ui';
import './styles/element-variables.scss';
import 'element-ui/lib/theme-chalk/icon.css';

import '@/styles/index.scss'; // global css

import App from './App';
import store from './store';
import router from './router';
import htmlToPdf from '@/vendor/htmlToPdf';

import i18n from './lang'; // internationalization
import './icons'; // icon
import './permission'; // permission control
import './utils/error-log'; // error log

import * as filters from './filters'; // global filters

import permission from '@/directive/permission/index.js'; // 权限判断指令

import { message } from './utils/reset-message'; // 引入重写message

// 全局禁止点击遮罩层关闭el-dialog弹窗
Element.Dialog.props.closeOnClickModal.default = false;
// 引用自定义
import {
  handleTree,
  resetForm,
  date,
  requestDate,
  imgUrl,
  fileType,
  coverImgShow,
  translate,
  tolerance,
  telEncryption
} from '@/utils/custom';
// 自定义全局方法挂载
Vue.prototype.handleTree = handleTree;
Vue.prototype.resetForm = resetForm;
Vue.prototype.$date = date;
Vue.prototype.$requestDate = requestDate;
Vue.prototype.$imgUrl = imgUrl;
Vue.prototype.$fileType = fileType;
Vue.prototype.$coverImgShow = coverImgShow;
Vue.prototype.$translate = translate;
Vue.prototype.$tolerance = tolerance;
Vue.prototype.$telEncryption = telEncryption;

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
/* if (process.env.NODE_ENV === 'production') {
    const { mockXHR } = require('../mock');
    mockXHR();
} */

// 使用权限判断指令
Vue.use(permission);
Vue.use(htmlToPdf);

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
});

// 重写message提示框 注意：此行代码一定要放在Vue.use(ElementUI)后面，否则不生效
Vue.prototype.$message = message;

// register global utility filters
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: (h) => h(App)
});
