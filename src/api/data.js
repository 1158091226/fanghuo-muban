import request from '@/utils/request'

// 数据入库校验
export function checkWarehousingFile(data) {
    return request({
        url: '/annual/checkImportable',
        method: 'post',
        data
    })
}

// 数据入库分析
export function analysisWarehousingFile(data) {
    return request({
        url: '/annual/async-check-shp',
        method: 'post',
        data
    })
}

// 数据入库发布
export function publishWarehousingFile(data) {
    return request({
        url: '/annual/async-publish-shp',
        method: 'post',
        data
    })
}

// 数据入库上传
export function uploadWarehousingFile(data) {
    return request({
        url: '/annual/upload-shp',
        method: 'post',
        data
    })
}

// 数据入库分页列表
export function fetchWarehousingPage(query) {
    return request({
        url: '/annual/find-supervision-page',
        method: 'get',
        params: query
    })
}

// 数据入库导入
export function importWarehousingFile(data) {
    return request({
        url: '/annual/import-shp',
        method: 'post',
        data
    })
}

// 网格分析
export function analysisUnitList(query) {
    return request({
        url: '/forestry/forest-supervision/async-sbu-analysis',
        method: 'get',
        params: query
    })
}

// 分割图斑数据
export function splitSupervisionItem(data) {
    return request({
        url: '/forestry/boundary-handle/patrolAreaSplit',
        method: 'post',
        data
    })
}

// 图斑下发翻页列表
export function fetchIssuePage(query) {
    return request({
        url: '/forestry/forest-supervision/issuelist',
        method: 'get',
        params: query
    })
}

// 图斑下发
export function updateIssueItem(data) {
    return request({
        url: '/forestry/forest-supervision/issue-by-bncode',
        method: 'post',
        data
    })
}

// 图斑下发-全部
export function updateIssueList(data) {
    return request({
        url: '/forestry/forest-supervision/issue',
        method: 'post',
        data
    })
}

// 督查分页列表
export function fetchSupervisionPage(query) {
    return request({
        url: '/forestry/forest-supervision/',
        method: 'get',
        params: query
    })
}

// 督查详情
export function fetchSupervisionItem(id) {
    return request({
        url: `/forestry/forest-supervision/${id}`,
        method: 'get'
    })
}

// 督查新增
export function createSupervisionItem(data) {
    return request({
        url: '/forestry/forest-supervision/create',
        method: 'post',
        data
    })
}

// 督查修改
export function updateSupervisionItem(data) {
    return request({
        url: '/forestry/forest-supervision/update',
        method: 'post',
        data
    })
}

// 督查删除-批量
export function deleteSupervisionList(data) {
    return request({
        url: '/forestry/forest-supervision/delete',
        method: 'post',
        data
    })
}

// 督查导出
export function exportSupervisionFile(query) {
    return request({
        url: '/forestry/forest-supervision/expforestshp',
        method: 'get',
        params: query,
        responseType: 'blob'
    })
}

// 林地翻页列表
export function fetchWoodlandPage(query) {
    return request({
        url: '/forestry/forest-base-info/',
        method: 'get',
        params: query
    })
}

// 林地详情
export function fetchWoodlandItem(id) {
    return request({
        url: `/forestry/forest-base-info/${id}`,
        method: 'get'
    })
}

// 林地新增
export function createWoodlandItem(data) {
    return request({
        url: '/forestry/forest-base-info/create',
        method: 'post',
        data
    })
}

// 林地更新
export function updateWoodlandItem(data) {
    return request({
        url: '/forestry/forest-base-info/update',
        method: 'post',
        data
    })
}

// 林地删除-批量
export function deleteWoodlandList(data) {
    return request({
        url: '/forestry/forest-base-info/delete',
        method: 'post',
        data
    })
}

// 林地数据导出
export function exportWoodlandFile(query) {
    return request({
        url: '/forestry/forest-base-info/expforestshp',
        method: 'get',
        params: query,
        responseType: 'blob'
    })
}

// 迹地翻页列表
export function fetchOtherPage(query) {
    return request({
        url: '/forestry/forest-slash/',
        method: 'get',
        params: query
    })
}

// 迹地详情
export function fetchOtherItem(id) {
    return request({
        url: `/forestry/forest-slash/${id}`,
        method: 'get'
    })
}

// 迹地新增
export function createOtherItem(data) {
    return request({
        url: '/forestry/forest-slash/create',
        method: 'post',
        data
    })
}

// 迹地更新
export function updateOtherItem(data) {
    return request({
        url: '/forestry/forest-slash/update',
        method: 'post',
        data
    })
}

// 迹地删除-批量
export function deleteOtherList(data) {
    return request({
        url: '/forestry/forest-slash/delete',
        method: 'post',
        data
    })
}

// 迹地数据导出
export function exportOtherFile(query) {
    return request({
        url: '/forestry/forest-slash/expforestshp',
        method: 'get',
        params: query,
        responseType: 'blob'
    })
}

// 使用林地翻页列表
export function fetchUsePage(query) {
    return request({
        url: '/forestry/forest-use-woodland/',
        method: 'get',
        params: query
    })
}

// 使用林地详情
export function fetchUseItem(id) {
    return request({
        url: `/forestry/forest-use-woodland/${id}`,
        method: 'get'
    })
}

// 使用林地新增
export function createUseItem(data) {
    return request({
        url: '/forestry/forest-use-woodland/create',
        method: 'post',
        data
    })
}

// 使用林地更新
export function updateUseItem(data) {
    return request({
        url: '/forestry/forest-use-woodland/update',
        method: 'post',
        data
    })
}

// 使用林地删除-批量
export function deleteUseList(data) {
    return request({
        url: '/forestry/forest-use-woodland/delete',
        method: 'post',
        data
    })
}

// 使用林地数据导出
export function exportUseFile(query) {
    return request({
        url: '/forestry/forest-use-woodland/expforestshp',
        method: 'get',
        params: query,
        responseType: 'blob'
    })
}

// 林木采伐翻页列表
export function fetchFellPage(query) {
    return request({
        url: '/forestry/forest-felling-register/',
        method: 'get',
        params: query
    })
}

// 林木采伐详情
export function fetchFellItem(id) {
    return request({
        url: `/forestry/forest-felling-register/${id}`,
        method: 'get'
    })
}

// 林木采伐新增
export function createFellItem(data) {
    return request({
        url: '/forestry/forest-felling-register/create',
        method: 'post',
        data
    })
}

// 林木采伐更新
export function updateFellItem(data) {
    return request({
        url: '/forestry/forest-felling-register/update',
        method: 'post',
        data
    })
}

// 林木采伐删除-批量
export function deleteFellList(data) {
    return request({
        url: '/forestry/forest-felling-register/delete',
        method: 'post',
        data
    })
}

// 林木采伐数据导出
export function exportFellFile(query) {
    return request({
        url: '/forestry/forest-felling-register/expforestshp',
        method: 'get',
        params: query,
        responseType: 'blob'
    })
}

// 地图影像翻页列表
export function fetchMapImagePage(query) {
    return request({
        url: '/publish/image/',
        method: 'get',
        params: query
    })
}

// 地图影像列表
export function fetchMapImageList(query) {
    return request({
        url: '/publish/image/list',
        method: 'get',
        params: query
    });
}

// 地图影像详情
export function fetchMapImageItem(id) {
    return request({
        url: `/publish/image/${id}`,
        method: 'get'
    })
}

// 地图影像新增
export function createMapImageItem(data) {
    return request({
        url: '/publish/image/create',
        method: 'post',
        data
    })
}

// 地图影像更新
export function updateMapImageItem(data) {
    return request({
        url: '/publish/image/update',
        method: 'post',
        data
    })
}

// 地图影像删除-批量
export function deleteMapImageList(data) {
    return request({
        url: '/publish/image/delete',
        method: 'post',
        data
    })
}
