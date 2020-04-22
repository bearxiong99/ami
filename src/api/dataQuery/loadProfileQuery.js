import request from '@/router/axios';


export const fetchList = (data) => {
  return request({
    url: '/api/ami-dataquery/loadProfile/queryLoadProfileWithPage',
    method: 'post',
    data: data
  })
};

export const filterData = (data) => {
  return request({
    url: '/api/ami-dataquery/loadProfile/filterData',
    method: 'post',
    data: data
  })
}
