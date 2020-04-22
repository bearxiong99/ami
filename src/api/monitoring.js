import request from '@/router/axios'

// 日冻结抄表成功率日统计接口
export const getRate = (data) => {
  return request({
    url: '/api/ami-monitor/readsuccd/page?' + data,
    method: 'get',
  })
}