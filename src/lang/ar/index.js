import base from './base'
import menu from './menu'
import loadProfileQuery from './loadProfileQuery'
import avgVoltageCurrentQuery from './avgVoltageCurrentQuery'
import touQuery from './touQuery'
import eobQuery from './eobQuery'
import meterEventQuery from './meterEventQuery'
import messageQuery from './messageQuery'
import exportBtn from './exportBtn'


export default {
  ...base,
  ...menu,
  ...loadProfileQuery,
  ...avgVoltageCurrentQuery,
  ...touQuery,
  ...eobQuery,
  ...meterEventQuery,
  ...messageQuery,
  ...exportBtn,
}
