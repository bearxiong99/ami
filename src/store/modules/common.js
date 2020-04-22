import {
  setStore,
  getStore,
  removeStore
} from '@/util/store'
import website from '@/config/website'

const common = {

  state: {
    language: getStore({name: 'language'}) || 'zh',
    isCollapse: false,
    isFullScren: false,
    isShade: false,
    screen: -1,
    isLock: getStore({name: 'isLock'}) || false,
    showTag: true,
    showDebug: true,
    showCollapse: true,
    showSearch: true,
    showLock: true,
    showFullScren: true,
    showTheme: true,
    showMenu: true,
    showColor: true,
    colorName: getStore({name: 'colorName'}) || '#017572',
    colorName1: '#017572',
    themeName: getStore({name: 'themeName'}) || 'theme-iview',
    lockPasswd: getStore({name: 'lockPasswd'}) || '',
    website: website,
    treeNode: null,
    level:1,
    upgradeActiveName: 'first',
    broadcastActiveName: '1',
  },
  mutations: {
    SET_LANGUAGE: (state, language) => {
      state.language = language
      setStore({
        name: 'language',
        content: state.language
      })
    },
    SET_SHADE: (state, active) => {
      state.isShade = active;
    },
    SET_COLLAPSE: (state) => {
      state.isCollapse = !state.isCollapse;
    },
    SET_FULLSCREN: (state) => {
      state.isFullScren = !state.isFullScren;
    },
    SET_LOCK: (state) => {
      state.isLock = true;
      setStore({
        name: 'isLock',
        content: state.isLock,
        type: 'session'
      })
    },
    SET_SCREEN: (state, screen) => {
      state.screen = screen;
    },
    SET_COLOR_NAME: (state, colorName) => {
      state.colorName = colorName;
      setStore({
        name: 'colorName',
        content: state.colorName,
      })
      if (state.themeName === 'theme-star') return
      state.colorName1 = colorName;
    },
    SET_THEME_NAME: (state, themeName) => {
      state.themeName = themeName;
      if (themeName === 'theme-star') {
        state.colorName1 = 'rgba(0,0,0,0.7)'
      } else {
        state.colorName1 = state.colorName
      }
      setStore({
        name: 'themeName',
        content: state.themeName,
      })
    },
    SET_LOCK_PASSWD: (state, lockPasswd) => {
      state.lockPasswd = lockPasswd;
      setStore({
        name: 'lockPasswd',
        content: state.lockPasswd,
        type: 'session'
      })
    },
    CLEAR_LOCK: (state) => {
      state.isLock = false;
      state.lockPasswd = '';
      removeStore({
        name: 'lockPasswd',
        type: 'session'
      });
      removeStore({
        name: 'isLock',
        type: 'session'
      });
    },
    SET_TREE_NODE: (state, data) => {
      state.treeNode = data;
      setStore({
        name: 'treeNode',
        content: state.treeNode,
        type: 'session'
      })
    },
    SET_LEVEL: (state, data) => {
      state.level = data;
      setStore({
        name: 'level',
        content: state.level,
        type: 'session'
      })
    },
    SET_UPGRADE_ACTIVE: (state, data) => {
      state.upgradeActiveName = data
    },
    SET_BROADCAST_ACTIVE: (state, data) => {
      state.broadcastActiveName = data
    },
  }
}
export default common
