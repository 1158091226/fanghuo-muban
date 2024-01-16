<!--  -->
<template>
  <div />
</template>

<script>
import * as PlotUtils from './Utils/utils';
import * as Constants from './Constants';
import Polygon from 'ol/geom/Polygon';
import LineString from 'ol/geom/LineString';
import { fromCircle } from 'ol/geom/Polygon';
import Circle from 'ol/geom/Circle';
import GeometryCollection from 'ol/geom/GeometryCollection';
import Feature from 'ol/Feature';
import olStyle from 'ol/style/Style';
import olStyleFill from 'ol/style/Fill';
import olStyleStroke from 'ol/style/Stroke';
export default {
  name: 'SituationDraw',
  data() {
    return {
      headHeightFactor: 0.18,
      headWidthFactor: 0.3,
      neckHeightFactor: 0.85,
      neckWidthFactor: 0.15,
      headTailFactor: 0.8,
      tailWidthFactor: null,
      swallowTailFactor: null,
      swallowTailPnt: null,
      fixPointCount: null,
      connPoint: null,
      tempPoint4: null,
      maxArrowLength: 3000000,
      arrowLengthScale: 5
    };
  },

  // components: {},

  // watch: {},

  // computed: {},

  // created(){},

  // mounted(){},

  methods: {
    geometryFunction(type) {
      switch (type) {
        case 'JGJT':
          return this.geometryFunctionJGJT;
        case 'TY':
          return this.geometryFunctionTY;
        case 'FDJT':
          return this.geometryFunctionFDJT;
        case 'QJJT':
          return this.geometryFunctionQJJT;
        case 'ZXJT':
          return this.geometryFunctionZXJT;

        default:
          break;
      }
    },
    // 绘制直线箭头
    drawZXJT(event, layer, style) {
      const lineFeature = event.feature;
      const lineGeometry = lineFeature.getGeometry();

      // 计算箭头的位置和方向
      const lastCoordinate = lineGeometry.getLastCoordinate();

      const sta = lineGeometry.flatCoordinates.slice(-4);

      const dx = sta[2] - sta[0];
      const dy = sta[3] - sta[1];

      const rotation = Math.atan2(dy, dx);

      const scale = 40; // 缩放因子
      // 创建箭头的几何对象
      const arrowGeometry = new Polygon([
        [
          [0 / scale, 0 / scale],
          [-10 / scale, 10 / scale],
          [0 / scale, 0 / scale],
          [-10 / scale, -10 / scale],
          [0 / scale, 0 / scale]
        ]
      ]);

      // 平移和旋转箭头
      arrowGeometry.translate(lastCoordinate[0], lastCoordinate[1]);
      arrowGeometry.rotate(rotation, lastCoordinate);

      // 创建带有箭头的线段的几何对象
      const arrowLineGeometry = new GeometryCollection([
        lineGeometry,
        arrowGeometry
      ]);

      // 创建带有箭头的线段的要素
      const arrowLineFeature = new Feature({
        geometry: arrowLineGeometry
      });

      // 设置要素的样式
      arrowLineFeature.setStyle(function(feature) {
        const styles = [
          new olStyle({
            stroke: new olStyleStroke({
              color: style.stroke.color,
              width: style.stroke.width
            })
          }),
          new olStyle({
            geometry: arrowGeometry,
            stroke: new olStyleStroke({
              color: style.stroke.color,
              width: style.stroke.width
            }),
            fill: new olStyleFill({
              color: style.stroke.color
            })
          })
        ];
        return styles;
      });

      // // 将带有箭头的线段的要素添加到矢量图层中
      layer.getSource().addFeature(arrowLineFeature);
      this.draw.setActive(false);
      this.selectTypeId = 0;
    },

    // 绘制椭圆
    geometryFunctionZXJT(coordinates, geometry) {
      const cArray = coordinates;
      const center = cArray[0];
      const startPoint = cArray[1];
      const endPoint = cArray[2];
      if (!geometry) {
        geometry = new LineString([]);
      }
      if (cArray.length < 2) {
        return false;
      }
      this.maxArrowLength = 3000000;
      this.arrowLengthScale = 5;
      const pnts = cArray;

      const [pnt1, pnt2] = [pnts[0], pnts[1]];
      const distance = PlotUtils.MathDistance(pnt1, pnt2);
      let len = distance / this.arrowLengthScale;
      len = len > this.maxArrowLength ? this.maxArrowLength : len;
      len = len <= 0 ? 0.01 : len;
      const leftPnt = PlotUtils.getThirdPoint(
        pnt1,
        pnt2,
        Math.PI / 6,
        len,
        false
      );
      const rightPnt = PlotUtils.getThirdPoint(
        pnt1,
        pnt2,
        Math.PI / 6,
        len,
        true
      );
      geometry.setCoordinates([pnt1, pnt2, leftPnt, pnt2, rightPnt]);
      return geometry;
    },

    // --------------------------------------------------------------------

    // 绘制椭圆
    geometryFunctionTY(coordinates, geometry) {
      const cArray = coordinates[0];
      const center = cArray[0];
      const startPoint = cArray[1];
      const endPoint = cArray[2];
      if (!geometry) {
        geometry = new Polygon([]);
      }
      if (cArray.length == 3) {
        const coordinatesRing = cArray.slice();
        coordinatesRing.push(center);
        const plg = new Polygon([coordinatesRing]);
        const plygArea = plg.getArea();
        const radiusMajor = Math.sqrt(
          Math.pow(center[0] - startPoint[0], 2) +
            Math.pow(center[1] - startPoint[1], 2)
        );
        const radiusMinor = (plygArea * 2) / radiusMajor;
        const dx = startPoint[0] - center[0];
        const dy = startPoint[1] - center[1];
        let rotation = Math.atan(dx / dy);
        rotation =
          dy > 0 ? -rotation - Math.PI * 0.5 : -(Math.PI * 0.5 + rotation);
        const f = this.genEllipseGeomTY(
          radiusMajor,
          radiusMinor,
          center,
          rotation
        );
        geometry.setCoordinates(f.getCoordinates());
      }
      return geometry;
    },
    genEllipseGeomTY(radiusMajor, radiusMinor, center, rotation) {
      const circle = new Circle(center, radiusMinor);
      const polygon = fromCircle(circle, 64);
      polygon.scale(radiusMajor / radiusMinor, 1);
      polygon.rotate(rotation, center);
      return polygon;
    },

    // --------------------------------------------------------------------

    // 进攻箭头
    geometryFunctionJGJT(coordinates, geometry) {
      this.headHeightFactor = 0.18;
      this.headWidthFactor = 0.3;
      this.neckHeightFactor = 0.85;
      this.neckWidthFactor = 0.15;
      this.headTailFactor = 0.8;
      const _this = this;
      if (!geometry) {
        geometry = new Polygon([]);
      }
      const pnts = coordinates[0];
      const points = pnts.length;

      if (points < 2) {
        return false;
      } else if (points === 2) {
        // geometry.setCoordinates([pnts]);
      } else {
        let [tailLeft, tailRight] = [pnts[0], pnts[1]];
        if (PlotUtils.isClockWise(pnts[0], pnts[1], pnts[2])) {
          tailLeft = pnts[1];
          tailRight = pnts[0];
        }
        const midTail = PlotUtils.Mid(tailLeft, tailRight);
        const bonePnts = [midTail].concat(pnts.slice(2));
        const headPnts = _this.getArrowHeadPointsJGJT(
          bonePnts,
          tailLeft,
          tailRight
        );
        const [neckLeft, neckRight] = [headPnts[0], headPnts[4]];
        const tailWidthFactor =
          PlotUtils.MathDistance(tailLeft, tailRight) /
          PlotUtils.getBaseLength(bonePnts);
        const bodyPnts = _this.getArrowBodyPointsJGJT(
          bonePnts,
          neckLeft,
          neckRight,
          tailWidthFactor
        );
        const count = bodyPnts.length;
        let leftPnts = [tailLeft].concat(bodyPnts.slice(0, count / 2));
        leftPnts.push(neckLeft);
        let rightPnts = [tailRight].concat(bodyPnts.slice(count / 2, count));
        rightPnts.push(neckRight);
        leftPnts = PlotUtils.getQBSplinePoints(leftPnts);
        rightPnts = PlotUtils.getQBSplinePoints(rightPnts);
        geometry.setCoordinates([
          leftPnts.concat(headPnts, rightPnts.reverse())
        ]);
      }
      return geometry;
    },
    /**
     * 插值头部点
     * @param points
     * @returns {[*,*,*,*,*]}
     */
    getArrowHeadPointsJGJT(points, tailLeft, tailRight) {
      try {
        let len = PlotUtils.getBaseLength(points);
        let headHeight = len * this.headHeightFactor;
        const headPnt = points[points.length - 1];
        len = PlotUtils.MathDistance(headPnt, points[points.length - 2]);
        const tailWidth = PlotUtils.MathDistance(tailLeft, tailRight);
        if (headHeight > tailWidth * this.headTailFactor) {
          headHeight = tailWidth * this.headTailFactor;
        }
        const headWidth = headHeight * this.headWidthFactor;
        const neckWidth = headHeight * this.neckWidthFactor;
        headHeight = headHeight > len ? len : headHeight;
        const neckHeight = headHeight * this.neckHeightFactor;
        const headEndPnt = PlotUtils.getThirdPoint(
          points[points.length - 2],
          headPnt,
          0,
          headHeight,
          true
        );
        const neckEndPnt = PlotUtils.getThirdPoint(
          points[points.length - 2],
          headPnt,
          0,
          neckHeight,
          true
        );
        const headLeft = PlotUtils.getThirdPoint(
          headPnt,
          headEndPnt,
          Constants.HALF_PI,
          headWidth,
          false
        );
        const headRight = PlotUtils.getThirdPoint(
          headPnt,
          headEndPnt,
          Constants.HALF_PI,
          headWidth,
          true
        );
        const neckLeft = PlotUtils.getThirdPoint(
          headPnt,
          neckEndPnt,
          Constants.HALF_PI,
          neckWidth,
          false
        );
        const neckRight = PlotUtils.getThirdPoint(
          headPnt,
          neckEndPnt,
          Constants.HALF_PI,
          neckWidth,
          true
        );
        return [neckLeft, headLeft, headPnt, headRight, neckRight];
      } catch (e) {
        console.log(e);
      }
    },

    /**
     * 插值面部分数据
     * @param points
     * @param neckLeft
     * @param neckRight
     * @param tailWidthFactor
     * @returns {Array.<*>}
     */
    getArrowBodyPointsJGJT(points, neckLeft, neckRight, tailWidthFactor) {
      const allLen = PlotUtils.wholeDistance(points);
      const len = PlotUtils.getBaseLength(points);
      const tailWidth = len * tailWidthFactor;
      const neckWidth = PlotUtils.MathDistance(neckLeft, neckRight);
      const widthDif = (tailWidth - neckWidth) / 2;
      let [tempLen, leftBodyPnts, rightBodyPnts] = [0, [], []];
      for (let i = 1; i < points.length - 1; i++) {
        const angle =
          PlotUtils.getAngleOfThreePoints(
            points[i - 1],
            points[i],
            points[i + 1]
          ) / 2;
        tempLen += PlotUtils.MathDistance(points[i - 1], points[i]);
        const w =
          (tailWidth / 2 - (tempLen / allLen) * widthDif) / Math.sin(angle);
        const left = PlotUtils.getThirdPoint(
          points[i - 1],
          points[i],
          Math.PI - angle,
          w,
          true
        );
        const right = PlotUtils.getThirdPoint(
          points[i - 1],
          points[i],
          angle,
          w,
          false
        );
        leftBodyPnts.push(left);
        rightBodyPnts.push(right);
      }
      return leftBodyPnts.concat(rightBodyPnts);
    },

    // --------------------------------------------------------------------

    // 分队箭头
    geometryFunctionFDJT(coordinates, geometry) {
      this.headHeightFactor = 0.18;
      this.headWidthFactor = 0.3;
      this.neckHeightFactor = 0.85;
      this.neckWidthFactor = 0.15;
      this.tailWidthFactor = 0.1;
      this.swallowTailFactor = 1;
      this.swallowTailPnt = null;
      this.fixPointCount = 2;
      if (!geometry) {
        geometry = new Polygon([]);
      }
      const _this = this;
      const pnts = coordinates[0];
      const points = pnts.length;

      if (points < 2) {
        return false;
      } else if (points === 2) {
        // geometry.setCoordinates([pnts]);
      } else {
        const pntss = coordinates[0];
        const tailPnts = _this.getTailPointsFDJT(pntss);
        const headPnts = _this.getArrowHeadPointsFDJT(
          pntss,
          tailPnts[0],
          tailPnts[2]
        );
        const neckLeft = headPnts[0];
        const neckRight = headPnts[4];
        const bodyPnts = _this.getArrowBodyPointsFDJT(
          pntss,
          neckLeft,
          neckRight,
          _this.tailWidthFactor
        );
        const count = bodyPnts.length;
        let leftPnts = [tailPnts[0]].concat(bodyPnts.slice(0, count / 2));
        leftPnts.push(neckLeft);
        let rightPnts = [tailPnts[2]].concat(bodyPnts.slice(count / 2, count));
        rightPnts.push(neckRight);
        leftPnts = PlotUtils.getQBSplinePoints(leftPnts);
        rightPnts = PlotUtils.getQBSplinePoints(rightPnts);
        geometry.setCoordinates([
          leftPnts.concat(headPnts, rightPnts.reverse(), [
            tailPnts[1],
            leftPnts[0]
          ])
        ]);
      }

      return geometry;
    },

    getTailPointsFDJT(points) {
      const allLen = PlotUtils.getBaseLength(points);
      const tailWidth = allLen * this.tailWidthFactor;
      const tailLeft = PlotUtils.getThirdPoint(
        points[1],
        points[0],
        Constants.HALF_PI,
        tailWidth,
        false
      );
      const tailRight = PlotUtils.getThirdPoint(
        points[1],
        points[0],
        Constants.HALF_PI,
        tailWidth,
        true
      );
      const len = tailWidth * this.swallowTailFactor;
      const swallowTailPnt = PlotUtils.getThirdPoint(
        points[1],
        points[0],
        0,
        len,
        true
      );
      return [tailLeft, swallowTailPnt, tailRight];
    },

    /**
     * 插值头部点
     * @param points
     * @returns {[*,*,*,*,*]}
     */
    getArrowHeadPointsFDJT(points, tailLeft, tailRight) {
      try {
        let len = PlotUtils.getBaseLength(points);
        let headHeight = len * this.headHeightFactor;
        const headPnt = points[points.length - 1];
        len = PlotUtils.MathDistance(headPnt, points[points.length - 2]);
        const tailWidth = PlotUtils.MathDistance(tailLeft, tailRight);
        if (headHeight > tailWidth * this.headTailFactor) {
          headHeight = tailWidth * this.headTailFactor;
        }
        const headWidth = headHeight * this.headWidthFactor;
        const neckWidth = headHeight * this.neckWidthFactor;
        headHeight = headHeight > len ? len : headHeight;
        const neckHeight = headHeight * this.neckHeightFactor;
        const headEndPnt = PlotUtils.getThirdPoint(
          points[points.length - 2],
          headPnt,
          0,
          headHeight,
          true
        );
        const neckEndPnt = PlotUtils.getThirdPoint(
          points[points.length - 2],
          headPnt,
          0,
          neckHeight,
          true
        );
        const headLeft = PlotUtils.getThirdPoint(
          headPnt,
          headEndPnt,
          Constants.HALF_PI,
          headWidth,
          false
        );
        const headRight = PlotUtils.getThirdPoint(
          headPnt,
          headEndPnt,
          Constants.HALF_PI,
          headWidth,
          true
        );
        const neckLeft = PlotUtils.getThirdPoint(
          headPnt,
          neckEndPnt,
          Constants.HALF_PI,
          neckWidth,
          false
        );
        const neckRight = PlotUtils.getThirdPoint(
          headPnt,
          neckEndPnt,
          Constants.HALF_PI,
          neckWidth,
          true
        );
        return [neckLeft, headLeft, headPnt, headRight, neckRight];
      } catch (e) {
        console.log(e);
      }
    },

    /**
     * 插值面部分数据
     * @param points
     * @param neckLeft
     * @param neckRight
     * @param tailWidthFactor
     * @returns {Array.<*>}
     */
    getArrowBodyPointsFDJT(points, neckLeft, neckRight, tailWidthFactor) {
      const allLen = PlotUtils.wholeDistance(points);
      const len = PlotUtils.getBaseLength(points);
      const tailWidth = len * tailWidthFactor;
      const neckWidth = PlotUtils.MathDistance(neckLeft, neckRight);
      const widthDif = (tailWidth - neckWidth) / 2;
      let [tempLen, leftBodyPnts, rightBodyPnts] = [0, [], []];
      for (let i = 1; i < points.length - 1; i++) {
        const angle =
          PlotUtils.getAngleOfThreePoints(
            points[i - 1],
            points[i],
            points[i + 1]
          ) / 2;
        tempLen += PlotUtils.MathDistance(points[i - 1], points[i]);
        const w =
          (tailWidth / 2 - (tempLen / allLen) * widthDif) / Math.sin(angle);
        const left = PlotUtils.getThirdPoint(
          points[i - 1],
          points[i],
          Math.PI - angle,
          w,
          true
        );
        const right = PlotUtils.getThirdPoint(
          points[i - 1],
          points[i],
          angle,
          w,
          false
        );
        leftBodyPnts.push(left);
        rightBodyPnts.push(right);
      }
      return leftBodyPnts.concat(rightBodyPnts);
    },

    // --------------------------------------------------------------------

    // 钳击箭头
    geometryFunctionQJJT(coordinates, geometry) {
      this.headHeightFactor = 0.25;
      this.headWidthFactor = 0.3;
      this.neckHeightFactor = 0.85;
      this.neckWidthFactor = 0.15;
      this.connPoint = null;
      this.tempPoint4 = null;
      this.fixPointCount = 4;
      if (!geometry) {
        geometry = new Polygon([]);
      }
      const _this = this;
      const pnts = coordinates[0];
      const points = pnts.length;

      if (points < 2) {
        return false;
      } else if (points === 2) {
        // geometry.setCoordinates([pnts]);
      } else {
        const pntss = coordinates[0];
        const count = pntss.length;
        const [pnt1, pnt2, pnt3] = [pntss[0], pntss[1], pntss[2]];
        if (count === 3) {
          _this.tempPoint4 = _this.getTempPoint4QJJT(pnt1, pnt2, pnt3);
          _this.connPoint = PlotUtils.Mid(pnt1, pnt2);
        } else if (count === 4) {
          _this.tempPoint4 = pntss[3];
          _this.connPoint = PlotUtils.Mid(pnt1, pnt2);
        } else {
          _this.tempPoint4 = pntss[3];
          _this.connPoint = pntss[4];
        }
        let [leftArrowPnts, rightArrowPnts] = [undefined, undefined];
        if (PlotUtils.isClockWise(pnt1, pnt2, pnt3)) {
          leftArrowPnts = _this.getArrowPointsQJJT(
            pnt1,
            _this.connPoint,
            _this.tempPoint4,
            false
          );
          rightArrowPnts = _this.getArrowPointsQJJT(
            _this.connPoint,
            pnt2,
            pnt3,
            true
          );
        } else {
          leftArrowPnts = _this.getArrowPointsQJJT(
            pnt2,
            _this.connPoint,
            pnt3,
            false
          );
          rightArrowPnts = _this.getArrowPointsQJJT(
            _this.connPoint,
            pnt1,
            _this.tempPoint4,
            true
          );
        }
        const m = leftArrowPnts.length;
        const t = (m - 5) / 2;
        const llBodyPnts = leftArrowPnts.slice(0, t);
        const lArrowPnts = leftArrowPnts.slice(t, t + 5);
        let lrBodyPnts = leftArrowPnts.slice(t + 5, m);
        let rlBodyPnts = rightArrowPnts.slice(0, t);
        const rArrowPnts = rightArrowPnts.slice(t, t + 5);
        const rrBodyPnts = rightArrowPnts.slice(t + 5, m);
        rlBodyPnts = PlotUtils.getBezierPoints(rlBodyPnts);
        const bodyPnts = PlotUtils.getBezierPoints(
          rrBodyPnts.concat(llBodyPnts.slice(1))
        );
        lrBodyPnts = PlotUtils.getBezierPoints(lrBodyPnts);
        const pnts = rlBodyPnts.concat(
          rArrowPnts,
          bodyPnts,
          lArrowPnts,
          lrBodyPnts
        );
        geometry.setCoordinates([pnts]);
      }

      return geometry;
    },

    /**
     * 插值箭形上的点
     * @param pnt1
     * @param pnt2
     * @param pnt3
     * @param clockWise
     * @returns {Array.<T>}
     */
    getArrowPointsQJJT(pnt1, pnt2, pnt3, clockWise) {
      const midPnt = PlotUtils.Mid(pnt1, pnt2);
      const len = PlotUtils.MathDistance(midPnt, pnt3);
      let midPnt1 = PlotUtils.getThirdPoint(pnt3, midPnt, 0, len * 0.3, true);
      let midPnt2 = PlotUtils.getThirdPoint(pnt3, midPnt, 0, len * 0.5, true);
      midPnt1 = PlotUtils.getThirdPoint(
        midPnt,
        midPnt1,
        Constants.HALF_PI,
        len / 5,
        clockWise
      );
      midPnt2 = PlotUtils.getThirdPoint(
        midPnt,
        midPnt2,
        Constants.HALF_PI,
        len / 4,
        clockWise
      );
      const points = [midPnt, midPnt1, midPnt2, pnt3];
      const arrowPnts = this.getArrowHeadPointsQJJT(points);
      if (arrowPnts && Array.isArray(arrowPnts) && arrowPnts.length > 0) {
        const [neckLeftPoint, neckRightPoint] = [arrowPnts[0], arrowPnts[4]];
        const tailWidthFactor =
          PlotUtils.MathDistance(pnt1, pnt2) /
          PlotUtils.getBaseLength(points) /
          2;
        const bodyPnts = this.getArrowBodyPointsQJJT(
          points,
          neckLeftPoint,
          neckRightPoint,
          tailWidthFactor
        );
        if (bodyPnts) {
          const n = bodyPnts.length;
          let lPoints = bodyPnts.slice(0, n / 2);
          let rPoints = bodyPnts.slice(n / 2, n);
          lPoints.push(neckLeftPoint);
          rPoints.push(neckRightPoint);
          lPoints = lPoints.reverse();
          lPoints.push(pnt2);
          rPoints = rPoints.reverse();
          rPoints.push(pnt1);
          return lPoints.reverse().concat(arrowPnts, rPoints);
        }
      } else {
        throw new Error('插值出错');
      }
    },

    /**
     * 获取对称点
     * @param linePnt1
     * @param linePnt2
     * @param point
     * @returns {*}
     */
    getTempPoint4QJJT(linePnt1, linePnt2, point) {
      try {
        const midPnt = PlotUtils.Mid(linePnt1, linePnt2);
        const len = PlotUtils.MathDistance(midPnt, point);
        const angle = PlotUtils.getAngleOfThreePoints(linePnt1, midPnt, point);
        let [symPnt, distance1, distance2, mid] = [
          undefined,
          undefined,
          undefined,
          undefined
        ];
        if (angle < Constants.HALF_PI) {
          distance1 = len * Math.sin(angle);
          distance2 = len * Math.cos(angle);
          mid = PlotUtils.getThirdPoint(
            linePnt1,
            midPnt,
            Constants.HALF_PI,
            distance1,
            false
          );
          symPnt = PlotUtils.getThirdPoint(
            midPnt,
            mid,
            Constants.HALF_PI,
            distance2,
            true
          );
        } else if (angle >= Constants.HALF_PI && angle < Math.PI) {
          distance1 = len * Math.sin(Math.PI - angle);
          distance2 = len * Math.cos(Math.PI - angle);
          mid = PlotUtils.getThirdPoint(
            linePnt1,
            midPnt,
            Constants.HALF_PI,
            distance1,
            false
          );
          symPnt = PlotUtils.getThirdPoint(
            midPnt,
            mid,
            Constants.HALF_PI,
            distance2,
            false
          );
        } else if (angle >= Math.PI && angle < Math.PI * 1.5) {
          distance1 = len * Math.sin(angle - Math.PI);
          distance2 = len * Math.cos(angle - Math.PI);
          mid = PlotUtils.getThirdPoint(
            linePnt1,
            midPnt,
            Constants.HALF_PI,
            distance1,
            true
          );
          symPnt = PlotUtils.getThirdPoint(
            midPnt,
            mid,
            Constants.HALF_PI,
            distance2,
            true
          );
        } else {
          distance1 = len * Math.sin(Math.PI * 2 - angle);
          distance2 = len * Math.cos(Math.PI * 2 - angle);
          mid = PlotUtils.getThirdPoint(
            linePnt1,
            midPnt,
            Constants.HALF_PI,
            distance1,
            true
          );
          symPnt = PlotUtils.getThirdPoint(
            midPnt,
            mid,
            Constants.HALF_PI,
            distance2,
            false
          );
        }
        return symPnt;
      } catch (e) {
        console.log(e);
      }
    },

    /**
     * 插值面部分数据
     * @param points
     * @param neckLeft
     * @param neckRight
     * @param tailWidthFactor
     * @returns {Array.<*>}
     */
    getArrowBodyPointsQJJT(points, neckLeft, neckRight, tailWidthFactor) {
      const allLen = PlotUtils.wholeDistance(points);
      const len = PlotUtils.getBaseLength(points);
      const tailWidth = len * tailWidthFactor;
      const neckWidth = PlotUtils.MathDistance(neckLeft, neckRight);
      const widthDif = (tailWidth - neckWidth) / 2;
      let [tempLen, leftBodyPnts, rightBodyPnts] = [0, [], []];
      for (let i = 1; i < points.length - 1; i++) {
        const angle =
          PlotUtils.getAngleOfThreePoints(
            points[i - 1],
            points[i],
            points[i + 1]
          ) / 2;
        tempLen += PlotUtils.MathDistance(points[i - 1], points[i]);
        const w =
          (tailWidth / 2 - (tempLen / allLen) * widthDif) / Math.sin(angle);
        const left = PlotUtils.getThirdPoint(
          points[i - 1],
          points[i],
          Math.PI - angle,
          w,
          true
        );
        const right = PlotUtils.getThirdPoint(
          points[i - 1],
          points[i],
          angle,
          w,
          false
        );
        leftBodyPnts.push(left);
        rightBodyPnts.push(right);
      }
      return leftBodyPnts.concat(rightBodyPnts);
    },

    /**
     * 插值头部点
     * @param points
     * @returns {[*,*,*,*,*]}
     */
    getArrowHeadPointsQJJT(points) {
      try {
        const len = PlotUtils.getBaseLength(points);
        const headHeight = len * this.headHeightFactor;
        const headPnt = points[points.length - 1];
        const headWidth = headHeight * this.headWidthFactor;
        const neckWidth = headHeight * this.neckWidthFactor;
        const neckHeight = headHeight * this.neckHeightFactor;
        const headEndPnt = PlotUtils.getThirdPoint(
          points[points.length - 2],
          headPnt,
          0,
          headHeight,
          true
        );
        const neckEndPnt = PlotUtils.getThirdPoint(
          points[points.length - 2],
          headPnt,
          0,
          neckHeight,
          true
        );
        const headLeft = PlotUtils.getThirdPoint(
          headPnt,
          headEndPnt,
          Constants.HALF_PI,
          headWidth,
          false
        );
        const headRight = PlotUtils.getThirdPoint(
          headPnt,
          headEndPnt,
          Constants.HALF_PI,
          headWidth,
          true
        );
        const neckLeft = PlotUtils.getThirdPoint(
          headPnt,
          neckEndPnt,
          Constants.HALF_PI,
          neckWidth,
          false
        );
        const neckRight = PlotUtils.getThirdPoint(
          headPnt,
          neckEndPnt,
          Constants.HALF_PI,
          neckWidth,
          true
        );
        return [neckLeft, headLeft, headPnt, headRight, neckRight];
      } catch (e) {
        console.log(e);
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
