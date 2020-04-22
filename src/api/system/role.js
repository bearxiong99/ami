import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/ami-system/role/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
export const grantTree = () => {
  return request({
    url: '/api/ami-system/menu/grant-tree',
    method: 'get',
  })
}

export const grant = (roleIds, menuIds, orgNos) => {
  return request({
    url: '/api/ami-system/role/grant',
    method: 'post',
    params: {
      roleIds,
      menuIds,
      orgNos
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/ami-system/role/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/ami-system/role/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/ami-system/role/submit',
    method: 'post',
    data: row
  })
}


export const getRole = (roleIds) => {
  return request({
    url: '/api/ami-system/menu/role-tree-keys',
    method: 'get',
    params: {
      roleIds,
    }
  })
}

export const getRoleTree = (tenantId) => {
  return request({
    url: '/api/ami-system/role/tree',
    method: 'get',
    params: {
      tenantId,
    }
  })
}

export const roleOrgTreeKeys = (roleIds) => {
  return request({
    url: '/api/ami-system/org/roleTreeKeys',
    method: 'get',
    params: {
      roleIds,
    }
  })
}
