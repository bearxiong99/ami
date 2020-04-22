// 配置编译环境和线上环境之间的切换

let baseUrl = '';
let iconfontVersion = ['567566_pwc3oottzol', '1066523_v8rsbcusj5q'];
let iconfontUrl = `//at.alicdn.com/t/font_$key.css`;
let codeUrl = `${baseUrl}/code`
const env = process.env
if (env.NODE_ENV == 'development') {
  // baseUrl = `http://47.103.39.115:88`; // 开发环境地址
  // baseUrl = `http://192.168.0.112:80`; // 开发环境地址 h
  // baseUrl = `http://192.168.0.113:80`; // 开发环境地址 w
  // baseUrl = `http://121.41.4.232:88`; // 开发环境地址 w
  // baseUrl = `http://192.168.137.1`; // 开发环境地址 w
  // baseUrl = `http://192.168.137.150`; // 开发环境地址 w
  // baseUrl = `http://192.168.191.3`; // 开发环境地址 w
  // baseUrl = `http://192.168.191.4`; // 开发环境地址 w
  // baseUrl = `http://192.168.0.117`; // 开发环境地址 w
  // baseUrl = `http://192.168.191.7`; // 开发环境地址 w
  // baseUrl = `http://192.168.43.124`; // 开发环境地址 w
  // baseUrl = `http://192.168.191.4`; // 开发环境地址 w
  // baseUrl = `http://172.28.162.99`; // 开发环境地址 w
  baseUrl = `http://172.28.161.19`; // 开发环境地址 w
} else if (env.NODE_ENV == 'production') {
  // baseUrl = `http://47.103.39.115:88`; //生产环境地址
  // baseUrl = `http://192.168.0.112:80`; //生产环境地址 h
  // baseUrl = `http://192.168.0.113:80`; //生产环境地址 w
  // baseUrl = `http://121.41.4.232:88`; //生产环境地址 w
  // baseUrl = `http://192.168.137.1`; //生产环境地址 w
  // baseUrl = `http://192.168.137.150`; // 开发环境地址 w
  // baseUrl = `http://192.168.191.3`; // 开发环境地址 w
  // baseUrl = `http://192.168.191.4`; // 开发环境地址 w
  // baseUrl = `http://192.168.191.7`; // 开发环境地址 w
  // baseUrl = `http://192.168.191.4`; // 开发环境地址 w
  // baseUrl = `http://172.28.162.99`; // 开发环境地址 w
  baseUrl = `http://172.28.161.19`; // 开发环境地址 w
} else if (env.NODE_ENV == 'test') {
  // baseUrl = `http://47.103.39.115:88`; //测试环境地址
  // baseUrl = `http://192.168.0.112:80`; //测试环境地址 h
  // baseUrl = `http://192.168.0.113:80`; //测试环境地址 w
  // baseUrl = `http://121.41.4.232:88`; //测试环境地址 w
  // baseUrl = `http://192.168.137.1`; //测试环境地址 w
  // baseUrl = `http://192.168.137.150`; // 开发环境地址 w
  // baseUrl = `http://192.168.191.3`; // 开发环境地址 w
  // baseUrl = `http://192.168.191.4`; // 开发环境地址 w
  // baseUrl = `http://192.168.191.7`; // 开发环境地址 w
  // baseUrl = `http://192.168.43.124`; // 开发环境地址 w
  // baseUrl = `http://192.168.191.4`; // 开发环境地址 w
  // baseUrl = `http://172.28.162.99`; // 开发环境地址 w
  // baseUrl = `http://172.28.163.44`; // 开发环境地址 w
  baseUrl = `http://172.28.161.19`; // 开发环境地址 w
}
export {
  baseUrl,
  iconfontUrl,
  iconfontVersion,
  codeUrl,
  env
}