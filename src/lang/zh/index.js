import base from './base'
import menu from './menu'
import loadProfileQuery from './loadProfileQuery'
import avgVoltageCurrentQuery from './avgVoltageCurrentQuery'
import touQuery from './touQuery'
import eobQuery from './eobQuery'
import meterEventQuery from './meterEventQuery'
import alarm from './alarm'
import archives from './archives'
import messageQuery from './messageQuery'
import monitoring from './monitoring'
import exportBtn from './exportBtn'
import kpiInstallSuccRate from './kpiInstallSuccRate'
import kpiReadSuccRate from './kpiReadSuccRate'
import kpiSystemUseRate from './kpiSystemUseRate'


export default {
  ...base,
  ...menu,
  ...loadProfileQuery,
  ...avgVoltageCurrentQuery,
  ...touQuery,
  ...eobQuery,
  ...alarm,
  ...archives,
  ...meterEventQuery,
  ...messageQuery,
  ...monitoring,
  ...exportBtn,
  ...kpiInstallSuccRate,
  ...kpiReadSuccRate,
  ...kpiSystemUseRate,
}
