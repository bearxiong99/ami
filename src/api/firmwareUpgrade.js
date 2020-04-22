import request from '@/router/axios';

// 远程升级

// 查找终端信息
export const queryDcuUpgradeInfo = (data) => {
  return request({
    url: '/api/ami-devices/deviceRegister/queryDcuUpgradeInfo',
    method: 'post',
    data
  })
}

// 查找电表信息
export const queryMeterUpgradeInfo = (data) => {
  return request({
    url: '/api/ami-devices/deviceRegister/queryMeterUpgradeInfo',
    method: 'post',
    data
  })
}

// 查找升级文件
export const queryUpgradeFile = (data) => {
  return request({
    url: '/api/ami-devices/deviceRegister/queryUpgradeFile',
    method: 'post',
    data
  })
}

// 上传升级文件
export const uploadUpgradeFile = (data) => {
  return request({
    url: '/api/ami-devices/deviceRegister/uploadUpgradeFile',
    method: 'post',
    data
  })
}

// 删除升级文件
export const delUpgradeFile = (data) => {
  return request({
    url: '/api/ami-devices/deviceRegister/delUpgradeFile',
    method: 'post',
    data
  })
}

// 新建升级任务
export const saveDevUpgradeInfo = (data) => {
  return request({
    url: '/api/ami-devices/deviceRegister/saveDevUpgradeInfo',
    method: 'post',
    data
  })
}

// 查找集中器电表
export const queryMeterDetail = (data) => {
  return request({
    url: '/api/ami-devices/deviceRegister/queryMeterDetail',
    method: 'post',
    data
  })
}

// 2-----------------------------

// 查看集中器升级进度
export const queryDcuUpgradeProcessInfo = (data) => {
  return request({
    url: '/api/ami-devices/deviceRegister/queryDcuUpgradeProcessInfo',
    method: 'post',
    data
  })
}

// 查看电表升级进度
export const queryMeterUpgradeProcessInfo = (data) => {
  return request({
    url: '/api/ami-devices/deviceRegister/queryMeterUpgradeProcessInfo',
    method: 'post',
    data
  })
}

// 停止重新升级
export const optUpgradeProcessInfo = (data) => {
  return request({
    url: '/api/ami-devices/deviceRegister/optUpgradeProcessInfo',
    method: 'post',
    data
  })
}

// 删除升级信息
export const delUpgradeProcessInfo = (data) => {
  return request({
    url: '/api/ami-devices/deviceRegister/delUpgradeProcessInfo',
    method: 'post',
    data
  })
}


// 3-----------------------

// 查看dcu激活
export const queryDcuUpgradeActiveInfo = (data) => {
  return request({
    url: '/api/ami-devices/deviceRegister/queryDcuUpgradeActiveInfo',
    method: 'post',
    data
  })
}

// 查看电表激活
export const queryMeterUpgradeActiveInfo = (data) => {
  return request({
    url: '/api/ami-devices/deviceRegister/queryMeterUpgradeActiveInfo',
    method: 'post',
    data
  })
}

// 修改激活
export const updateUpgradeProcessInfo = (data) => {
  return request({
    url: '/api/ami-devices/deviceRegister/updateUpgradeProcessInfo',
    method: 'post',
    data
  })
}



// 广播升级监控----------------

// 查找升级事件
export const queryBroadCastTask = (data) => {
  return request({
    url: '/api/ami-devices/deviceRegister/queryBroadCastTask',
    method: 'post',
    data
  })
}

// 集中器事件告警历史数据
export const queryDcuEventData = (data) => {
  return request({
    url: '/api/ami-devices/deviceRegister/queryDcuEventData',
    method: 'post',
    data
  })
}

// 电表升级模块查询
export const queryMetEventData = (data) => {
  return request({
    url: '/api/ami-devices/deviceRegister/queryMetEventData',
    method: 'post',
    data
  })
}


// 设备更换----------------

// 终端更换历史
export const tmnlChangedPage = (data) => {
  return request({
    url: '/api/ami-devices/tmnlchanged/page?' + data,
    method: 'get',
  })
}

// 电表更换历史
export const meterChangedPage = (data) => {
  return request({
    url: '/api/ami-devices/meterchanged/page?' + data,
    method: 'get',
  })
}

// 电表更换历史
export const changeDCU = (data) => {
  return request({
    url: '/api/ami-devices/tmnlchanged/save',
    method: 'get',
    data
  })
}
