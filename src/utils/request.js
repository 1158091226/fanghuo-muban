import axios from "axios";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 500000, // request timeout
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent

    if (store.getters.token && getToken()) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers["token"] = getToken();
    }
    // 控制是否开启遮罩层
    store.dispatch("app/setRequestLoading", !!config.isRequest);
    return config;
  },
  (error) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or code
   * Please return  response => response
   */

  /**
   * Determine the request code by custom code
   * Here is just an example
   * You can also judge the code by HTTP code Code
   */
  (response) => {
    const res = response.data;
    // console.log(response.headers['content-type']);

    /* if (response.headers['content-type'] === 'application/octet-stream' || response.headers['content-type'] === 'application/pdf;charset=UTF-8' || response.headers['content-type'] === 'application/vnd.ms-excel;charset=utf-8' || response.headers['content-type'] === 'image/png;charset=UTF-8' || response.headers['content-type'] === 'image/jpeg;charset=UTF-8') {

            return res;
        } */

    // 分割后面的编码
    let type = response.headers["content-type"].split(";");
    // 取类型
    type = type[0];

    // 可通过的类型
    const types = [
      "application/octet-stream", // 二进制流数据（如文件下载）
      "application/zip",
      "application/pdf", // pdf格式
      "image/png", // png图片格式
      "image/jpeg", // jpg图片格式
      "image/gif", // gif图片格式
      "video/mp4", // MP4格式
      "text/plain", // 纯文本格式
      "multipart/form-data", // 表单上传文件
      "application/msword", // doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
      "application/vnd.ms-excel", // xls
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
      "application/vnd.ms-powerpoint", // ppt
      "application/vnd.openxmlformats-officedocument.presentationml.presentatio", // pptx
    ];

    // 存在直接返回，不拦截
    if (types.indexOf(type) != -1) {
      store.dispatch("app/setRequestLoading", false);
      const fileName =
        response.headers["content-disposition"] ||
        response.headers["Content-Disposition"];
      const temp = {
        file: res,
        name: "",
      };
      if (fileName) {
        const name = fileName.substring(
          fileName.indexOf("filename=") + 10,
          fileName.length - 1
        );
        temp.name = decodeURIComponent(name);
      }
      return temp;
    }

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === "305" || res.code == "499") {
        // to re-login
        MessageBox.confirm(
          `账号“${store.getters.user.name}”已在其它设备上登录，若需继续使用，请重新登录。<br>特别提醒：若不清楚该账号在其他设备登录情况，这该账号存在安全风险，请及时修改密码或联系管理员`,
          "提醒",
          {
            confirmButtonText: "重新登录",
            cancelButtonText: "取消",
            dangerouslyUseHTMLString: true,
            type: "warning",
          }
        ).then(() => {
          store.dispatch("user/resetToken").then(() => {
            store.dispatch("app/setRequestLoading", false);
            location.reload();
          });
        });
      } else if (res.code === 4001) {
        Message({
          //  message: res.message,
          message: res.data ? res.data : res.message,
          type: "error",
          duration: 5 * 1000,
        });
      } else {
        store.dispatch("app/setRequestLoading", false);
        Message({
          message: res.message,
          // message: res.code !== '999' ? res.message : '异常错误' || 'Error',
          type: "error",
          duration: 5 * 1000,
        });
      }
      store.dispatch("app/setRequestLoading", false);
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      store.dispatch("app/setRequestLoading", false);
      return res;
    }
  },
  (error) => {
    store.dispatch("app/setRequestLoading", false);
    // console.log('err' + error); // for debug
    Message({
      // message: error.message,
      message: "异常错误",
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

export default service;
