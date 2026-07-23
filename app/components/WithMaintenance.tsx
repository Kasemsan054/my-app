import { getMaintenanceSettings } from '@/app/actions/maintenanceActions'
import MaintenancePage from '@/app/maintenance/page'

export default async function WithMaintenance({ 
  path, 
  children 
}: { 
  path: string
  children: React.ReactNode 
}) {
  const disabledPaths = await getMaintenanceSettings()
  
  if (disabledPaths.includes(path)) {
    // If the path is disabled, return the maintenance page directly
    return <MaintenancePage />
  }

  return <>{children}</>
}
