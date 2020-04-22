import request from '@/router/axios';

/**
 * 获取所有群组
 */
export const getAllGroups = (groupType) => {
  return request({
    url: '/api/ami-system/group/getAllGroups',
    method: 'post',
    params: {
      groupType
    }
  })
}

/**
 * 查询设备
 */
export const queryDevice = (data) => {
  return request({
    url: '/api/ami-system/group/queryDevice',
    method: 'post',
    data: data
  })
}

/**
 * 查询群组
 */
export const queryGroups = (data) => {
  return request({
    url: '/api/ami-system/group/queryGroups',
    method: 'post',
    data: data
  })
}

/**
 * 新增
 */
export const save = (data) => {
  return request({
    url: '/api/ami-system/group/save',
    method: 'post',
    data: data
  })
}

/**
 * 修改
 */
export const update = (data) => {
  return request({
    url: '/api/ami-system/group/update',
    method: 'post',
    data: data
  })
}

/**
 * 删除
 */
export const remove = (ids) => {
  return request({
    url: '/api/ami-system/group/remove',
    method: 'post',
    params: {
      ids
    }
  })
}

/**
 * 增加设备
 */
export const addDevices = (groupId, deviceNos) => {
  return request({
    url: '/api/ami-system/group/addDevices',
    method: 'post',
    params: {
      groupId, deviceNos
    }
  })
}

/**
 * 删除设备
 */
export const removeDevices = (groupId, deviceNos) => {
  return request({
    url: '/api/ami-system/group/removeDevices',
    method: 'post',
    params: {
      groupId, deviceNos
    }
  })
}

/**
 * 操作群组
 */
export const optGroups = (data) => {
  return request({
    url: '/api/ami-system/group/optGroups',
    method: 'post',
    data: data
  })
}

/**
 * 校验群组名称是否重复
 */
export const verifyGroupName = (groupName,groupId) => {
  return request({
    url: '/api/ami-system/group/verifyGroupName',
    method: 'post',
    params: {
      groupName,
      groupId
    }
  })
}