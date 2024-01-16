// htmlToPdf.js
// 导出页面为PDF格式
import html2Canvas from 'html2canvas';
import JsPDF from 'jspdf';
export default {
  install(Vue, options) {
    Vue.prototype.getPdf = function(type, cb) {
      var title = this.htmlTitle; // DPF标题
      console.log(`output->window.devicePixelRatio`, window.devicePixelRatio);
      // document.body.scrollTop = document.documentElement.scrollTop = 50;
      html2Canvas(document.querySelector('#pdfDom'), {
        allowTaint: true,
        taintTest: false,
        useCORS: true,
        y: 72, // 对Y轴进行裁切
        // width:1200,
        // height:5000,
        windowWidth: type ? 3500 : 1900,
        dpi: window.devicePixelRatio * 2, // 将分辨率提高到特定的DPI 提高四倍
        scale: 2 // 按比例增加分辨率
      }).then(function(canvas) {
        // document.body.scrollTop = document.documentElement.scrollTop = 0;

        const contentWidth = canvas.width;
        const contentHeight = canvas.height;
        const pageHeight = (contentWidth / 592.28) * 841.89;
        let leftHeight = contentHeight;
        let position = 20;
        const imgWidth = 595.28;
        const imgHeight = (592.28 / contentWidth) * contentHeight + 100;
        const pageData = canvas.toDataURL('image/jpeg', 0.1);
        // // 创建一个链接元素
        // var link = document.createElement('a');

        // // 设置链接的 href 属性为图片的 Base64 编码
        // link.href = pageData;

        // // 设置链接的 download 属性为文件名称和后缀
        // link.download = 'image.jpg';

        // // 模拟点击链接进行下载
        // link.click();
        // // 删除链接元素
        // link.remove();
        const PDF = new JsPDF('', 'pt', 'a4');
        if (leftHeight < pageHeight) {
          PDF.addImage(pageData, 'JPEG', 0, 20, imgWidth, imgHeight, null, 1);
        } else {
          while (leftHeight > 0) {
            PDF.addImage(
              pageData,
              'JPEG',
              0,
              position,
              imgWidth,
              imgHeight,
              null,
              1
            );
            leftHeight -= pageHeight;
            position -= 821.89;
            // position -= 841.89;
            if (leftHeight > 0) {
              PDF.addPage();
            }
          }
        }
        PDF.save(title + '.pdf');
        cb(true);
      });
    };
  }
};
