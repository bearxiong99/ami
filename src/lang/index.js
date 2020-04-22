import Vue from 'vue'
import VueI18n from 'vue-i18n'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
import enLocale from './en/index'
import zhLocale from './zh/index'
import arLocale from './ar/index'
import {getStore} from '@/util/store'

Vue.use(VueI18n)
const Avue = window.AVUE;
const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale,
    ...Avue.locale.en,
  },
  zh: {
    ...zhLocale,
    ...elementZhLocale,
    ...Avue.locale.zh,
  },
  ar:{
    ...arLocale,
    ...Avue.locale.ar,
  }
}

const i18n = new VueI18n({
  locale: getStore({name: 'language'}) || 'zh',
  messages
})

export default i18n
