/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
export function handleTree(data, id, parentId, children) {
  const config = {
    id: id || 'id',
    parentId: parentId || 'parentId',
    childrenList: children || 'children'
  };

  var childrenListMap = {};
  var nodeIds = {};
  var tree = [];

  for (const d of data) {
    const parentId = d[config.parentId];
    if (childrenListMap[parentId] == null) {
      childrenListMap[parentId] = [];
    }
    nodeIds[d[config.id]] = d;
    childrenListMap[parentId].push(d);
  }

  for (const d of data) {
    const parentId = d[config.parentId];
    if (nodeIds[parentId] == null) {
      tree.push(d);
    }
  }

  for (const t of tree) {
    adaptToChildrenList(t);
  }

  function adaptToChildrenList(o) {
    if (childrenListMap[o[config.id]] !== null) {
      o[config.childrenList] = childrenListMap[o[config.id]];
    }
    if (o[config.childrenList]) {
      for (const c of o[config.childrenList]) {
        adaptToChildrenList(c);
      }
    }
  }
  return tree;
}

// 表单重置
export function resetForm(refName) {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields();
  }
}

/** 获取当前年月日
 * @type {String} // yyyy-MM-dd HH:mm:ss或者yyyy-MM-dd
 */
export function date(type) {
  const nowDate = new Date();
  const date = {
    year: nowDate.getFullYear(),
    month: nowDate.getMonth() + 1,
    day: nowDate.getDate(),
    hours: nowDate.getHours(),
    minutes: nowDate.getMinutes(),
    seconds: nowDate.getSeconds()
  };
  const newMonth = date.month >= 10 ? date.month : '0' + date.month;
  const newDay = date.day >= 10 ? date.day : '0' + date.day;
  const newHours = date.hours >= 10 ? date.hours : '0' + date.hours;
  const newMinutes = date.minutes >= 10 ? date.minutes : '0' + date.minutes;
  const newSeconds = date.seconds >= 10 ? date.seconds : '0' + date.seconds;
  if (type == 'yyyy-MM-dd HH:mm:ss') {
    return `${date.year}-${newMonth}-${newDay} ${newHours}:${newMinutes}:${newSeconds}`;
  } else if (type == 'yyyy-MM-dd') {
    return `${date.year}-${newMonth}-${newDay}`;
  } else if (type == 'yyyy-MM') {
    return `${date.year}-${newMonth}`;
  } else if (type == 'HH:mm:ss') {
    return `${newHours}:${newMinutes}:${newSeconds}`;
  }
}

/** 请求日期处理
 * 例：传入2020，输出{startTime: '2020-01', endTime: '2020-12'}
 * @val {String} // yyyy 或者 yyyy-MM
 */
export function requestDate(val) {
  if (!val) return { startTime: '', endTime: '' };
  const arr = val.split('-');
  if (arr.length == 1) {
    return { startTime: val + '-01-01', endTime: val + '-12-31' };
  } else {
    const month = arr[1] < 10 ? arr[1].substr(1, 1) : arr[1];
    const day = new Date(arr[0], month, 0).getDate();
    return { startTime: val + '-01', endTime: val + '-' + day };
  }
}

/** 图片拼接展示
 * @param {string} url 图片地址
 * @param {string} type 类型
 * @param {string} icon 值为icon取缩略图,默认为空
 * @param {string} patrolWaitFile 巡林
 */
export function imgUrl(url, type, icon = '') {
  if (!url) return '';
  const originUrl = process.env.VUE_APP_BASE_API
    ? process.env.VUE_APP_BASE_API
    : window.location.origin;
  return `${originUrl}multimedia/${'show' + icon}/${type}/${url}`;
}

// 文件格式
export const suffixJson = {
  image: ['.png', '.jpg', '.jpeg'],
  audio: ['.mp3', '.ogg', '.wav', '.acc', '.vorbis', '.silk', '.m4a'],
  video: ['.mp4', '.webm', '.avi', '.rmvb', '.3gp', '.flv'],
  application: ['.docx', '.xlsx', '.pptx', '.pdf'],
  zip: ['.zip', '.rar', '.7z'],
  txt: ['.txt']
  // image: ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.bmp', '.pic', '.tif', '.webp'],
  // audio: ['.mp3', '.ogg', '.wav', '.acc', '.vorbis', '.silk', '.m4a'],
  // video: ['.mp4', '.webm', '.avi', '.rmvb', '.3gp', '.flv'],
  // application: ['.docx', '.xlsx', '.pptx', '.pdf'],
  // zip: ['.zip', '.rar', '.7z'],
  // txt: ['.txt']
};

// 根据后缀名判断文件类型
export function fileType(str) {
  const idx = str.lastIndexOf('.');
  str = str.substring(idx, str.length);
  for (const i in suffixJson) {
    if (suffixJson[i].indexOf(str) != -1) return i;
  }
  return false;
}

// // 列表展示预览图判断
// export function coverImgShow(src) {
//   if (!src) return '';
//   const str = src.substring(
//     0,
//     src.indexOf('|') != -1 ? src.indexOf('|') : src.length
//   );
//   if (fileType(str) == 'video') {
//     return str.substring(0, str.lastIndexOf('.')) + '_icon.png';
//   } else if (fileType(str) == 'audio') {
//     return require('@/icons/upload/audio.png');
//   } else if (getSuffix(str) == '.doc' || getSuffix(str) == '.docx') {
//     return require('@/icons/upload/docx.png');
//   } else if (getSuffix(str) == '.xlsx' || getSuffix(str) == '.xls') {
//     return require('@/icons/upload/xlsx.png');
//   } else if (getSuffix(str) == '.pdf') {
//     return require('@/icons/upload/pdf.png');
//   } else if (getSuffix(str) == '.txt') {
//     return require('@/icons/upload/txt.png');
//   } else if (fileType(str) == 'zip') {
//     return require('@/icons/upload/zip.png');
//   }
//   return str;
// }

// 获取文件后缀名
function getSuffix(str) {
  const idx = str.lastIndexOf('.');
  return str.substring(idx, str.length);
}

// 动态国际化
export function translate(type, key) {
  if (!key) return;
  return this.$t(type + '.' + key);
}

// 根据区划等级抽稀
export function tolerance(areaCode) {
  let level = null;
  if (areaCode.length < 3) {
    level = 0.005;
  } else if (areaCode.length < 5) {
    level = 0.002;
  } else if (areaCode.length < 7) {
    level = 0.001;
  } else if (areaCode.length < 10) {
    level = 0.0003;
  } else {
    level = 0.0001;
  }
  return level;
}

// 手机号加密显示
export function telEncryption(str) {
  if (!str) return '';
  const reg = /^(\d{3})\d*(\d{4})$/;
  return str.replace(reg, '$1****$2');
}

String.prototype.baseTo = function(nostar) {
  if (typeof this == 'string') {
    let str = this;
    str = window.atob(str);
    str = decodeURIComponent(str); // 中文编码问题
    if (!nostar) {
      if ([16, 18].includes(str.length)) {
        const n = (str.length - 6) / 2;
        str = str.slice(0, n) + '*********' + str.slice(9 + n);
      } else if (str.length == 11) {
        str = telEncryption(str);
      } else {
        return str;
      }
    }
    return str;
  } else {
    return this.toString();
  }
};

String.prototype.toBase = function() {
  if (typeof this == 'string') {
    let str = this;
    str = encodeURIComponent(str); // 中文编码问题
    str = window.btoa(str);
    return str;
  } else {
    return this.toString();
  }
};

String.prototype.getAreaLevel = function() {
  // areaCode.getAreaLevel()
  const obj = { 2: 1, 4: 2, 6: 3, 9: 4, 12: 5, 15: 5 };
  return obj[this.length];
};

Date.prototype.getOneDay = function(num = 0, type) {
  // 根据当天传入数值返回,负数为当天前,正数为当天后，默认返回当天,type有值则返回时分秒
  const date = new Date(new Date(this).setDate(new Date(this).getDate() + num));
  let time = '';
  if (type) {
    time =
      ' ' + date.toLocaleString('chinese', { hour12: false }).split(' ')[1];
  }
  return (
    [
      date.getFullYear(),
      String(date.getMonth() + 1 + 100).slice(1),
      String(date.getDate() + 100).slice(1)
    ].join('-') + time
  );
};

// 日期格式化
Date.prototype.format = function (format) {
  const date = this;
  const map = {
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds(),
    y: date.getFullYear(),
    yy: date.getFullYear().toString().substring(2),
    yyyy: date.getFullYear().toString(),
  };
  return format.replace(/(?:M+|d+|h+|m+|s+|y+|yy+|yyyy+)/g, function (match) {
    let value = map[match[0]];
    if (match.length > 1 && value && value.toString().length < match.length) {
      value = ("0" + value).slice(-match.length);
    }
    return value;
  });
};

Date.prototype.getOneMonth = function(num = 0) {
  // 根据当月传入数值返回,负数为当月前,正数为当月后,默认返回当月
  const monthTime = this.getFullYear() + '-' + (this.getMonth() + 1) + '-01';
  const date = new Date(
    new Date(monthTime).setMonth(new Date(monthTime).getMonth() + num)
  );
  return date.getFullYear() + '-' + String(date.getMonth() + 1 + 100).slice(1);
};

/** 例如：computedMonth(2022-09-12,-1,'end') 输出：2022-08-31
 * @param {string} dateTime 时间
 * @param {number} num +1为下个月，0为当月，-1为上个月
 * @param {string} type start 为月初 end为月末
 */
export function computedMonth(dateTime, num, type) {
  const monthTime =
    new Date(dateTime).getFullYear() +
    '-' +
    (new Date(dateTime).getMonth() + 1) +
    '-01';
  const date = new Date(
    new Date(monthTime).setMonth(new Date(monthTime).getMonth() + num)
  );
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const totalDay = new Date(year, month, 0).getDate();
  if (!type) return totalDay;
  const day =
    month - new Date().getMonth() == 1 ? new Date().getDate() : totalDay;
  const _day = day < 10 ? '0' + day : day;
  return `${year}-${month < 10 ? '0' + month : month}-${
    type == 'end' ? _day : '01'
  }`;
}

/** 获取当前网址参数
 * @param {string} name 参数
 */
export function getParam(name) {
  const reg = new RegExp(`[?&]${name}=([^&]*)(&|$)`);
  const str = window.location.hash.match(reg);
  return str ? decodeURIComponent(str[1]) : '';
}

/** 接口请求对象封装
 * @param {string} path 请求路径
 * @param {string} method 请求类型
 * @param {string} params 请求参数
 * @param {string} specifyURL 指定地址
 */
export function requestObj(url, method, params, specifyURL) {
  if (['GET', 'DELETE'].includes(method.toUpperCase())) {
    for (const i in params) url += '/' + params[i];
    return { url, method, params: {}, specifyURL };
  }
  return { url, method, data: params, specifyURL };
}

/** 数组指定字段拼接
 * @param {Array} arr 数据源
 * @param {string} key 指定字段 默认，
 * @param {string} delimiter 分隔符 默认，
 */
export function montageName(arr, key, delimiter = ',') {
  let str = '';
  arr.forEach((item, idx) => {
    const unit = arr.length - idx > 1 ? delimiter : '';
    str += item[key] + unit;
  });
  return str;
}
