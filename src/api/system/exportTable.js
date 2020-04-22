import request from '@/router/axios';

export const exportAll = (data) => {
  return request({
      url: '/api/ami-system/export/exportAll',
      method: 'post',
      data: data,
      responseType: 'blob'
    }
  )
}

export const exportCurrent = (data) => {
  return request({
      url: '/api/ami-system/export/exportCurrent',
      method: 'post',
      data: data,
      responseType: 'blob'
    }
  )
}

