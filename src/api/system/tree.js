import request from '@/router/axios';

/**
 * 获取顶级供电单位
 */
export const getTopOrg = () => {
  return request({
    url: '/api/ami-system/org/getTopOrg',
    method: 'get'
  })
}

/**
 * 获取登录用户顶级供电单位
 */
export const getSelfOrgs = () => {
  return request({
    url: '/api/ami-system/org/getSelfOrgs',
    method: 'get'
  })
}

/**
 * 查询下级供电单位 + 集中器
 * @param orgNo
 */
export const childs = (orgNo) => {
  return request({
    url: '/api/ami-system/org/childs',
    method: 'post',
    params: {
      orgNo
    }
  })
}

/**
 * 查询下级供电单位(返回Device)
 * @param orgNo
 */
export const getchildOrgs = (orgNo) => {
  return request({
    url: '/api/ami-system/org/getchildOrgs',
    method: 'post',
    params: {
      orgNo
    }
  })
}

/**
 * 查询下级电表
 * @param tmnlAddr
 */
export const childMeters = (tmnlAddr) => {
  return request({
    url: '/api/ami-system/org/childMeters',
    method: 'post',
    params: tmnlAddr
  })
}

/**
 * 获取默认展开
 */
export const getDefaultExpand = () => {
  return request({
    url: '/api/ami-system/org/getDefaultExpand',
    method: 'get'
  })
}

/**
 * 查询设备
 * @param orgNo
 * @param queryType
 * @param deviceNo
 */
export const queryDevice = (data) => {
  return request({
    url: '/api/ami-system/org/queryDevice',
    method: 'post',
    data: data
  })
}
