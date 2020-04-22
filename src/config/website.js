/**
 * 全局配置文件
 */
export default {
  title: "Advanced Metering Infrastructure System",
  indexTitle: 'Advanced Metering Infrastructure System',
  clientId: 'saber', // 客户端id
  clientSecret: 'saber_secret', // 客户端密钥
  tenantMode: false, // 是否开启租户模式
  publicKey: `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCpp8A8/67GMcXQuOwUEbZySxQZK8YCSY4/GA5JBbuknRahCmAW07GEifxkOLWEo8NGwGxafSmaQwt6QWIhou2cEC9/VHd8Au8bn88keBeJlukRiEBuYwdOirJsS3S9m1XMPZOed4u/9zo4VQwnjqqPnbnNMxWxBwJTNr1rPdSkFQIDAQAB`,
  logo: "S",
  key: 'saber',//配置主键,目前用于存储
  lockPage: '/lock',
  tokenTime: 6000,
  //http的status默认放行不才用统一处理的,
  statusWhiteList: [],
  //配置首页不可关闭
  isFirstPage: false,
  fistPage: {
    label: "dashboard",
    value: "/wel/index",
    params: {},
    query: {},
    meta: {
      i18n: 'dashboard'
    },
    group: [],
    close: false
  },
  //配置菜单的属性
  menu: {
    iconDefault: 'iconfont icon-caidan',
    props: {
      label: 'name',
      path: 'path',
      icon: 'source',
      children: 'children'
    }
  }
}
