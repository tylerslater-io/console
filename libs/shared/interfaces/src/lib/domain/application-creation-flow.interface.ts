// eslint-disable-next-line @nx/enforce-module-boundaries
import { type ServiceTypeEnum } from '@qovery/shared/enums'

export interface ApplicationGeneralData {
  name: string
  description?: string
  serviceType: ServiceTypeEnum
  auto_deploy: boolean

  // container
  registry?: string
  image_name?: string
  image_tag?: string
  image_entry_point?: string
  cmd_arguments?: string
  cmd?: string[]

  // application
  build_mode?: string
  branch?: string
  repository?: string
  provider?: string
  root_path?: string
  buildpack_language?: string
  dockerfile_path?: string
}

export interface ApplicationResourcesData {
  memory: number
  cpu: number
  instances: [number, number]
}
