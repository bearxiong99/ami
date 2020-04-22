import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/ami-system/client/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

