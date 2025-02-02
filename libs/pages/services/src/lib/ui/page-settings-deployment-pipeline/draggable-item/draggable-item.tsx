import { type CloudProviderEnum, ServiceTypeEnum } from 'qovery-typescript-axios'
import { type DraggableProvided, type DraggableStateSnapshot } from 'react-beautiful-dnd'
import { getServiceType } from '@qovery/shared/enums'
import { type ApplicationEntity, type DatabaseEntity } from '@qovery/shared/interfaces'
import { ServiceIcon, Truncate } from '@qovery/shared/ui'
import { upperCaseFirstLetter } from '@qovery/shared/util-js'

export interface DraggableItemProps {
  services: (DatabaseEntity | ApplicationEntity)[]
  serviceId: string
  cloudProvider: CloudProviderEnum
  provided?: DraggableProvided
  snapshot?: DraggableStateSnapshot
}

const getServiceByServiceId = (
  serviceId: string,
  services: (DatabaseEntity | ApplicationEntity)[]
): DatabaseEntity | ApplicationEntity => {
  return services.filter((service) => service.id === serviceId)[0]
}

export function DraggableItem(props: DraggableItemProps) {
  const { services, serviceId, cloudProvider, provided, snapshot } = props

  const service = getServiceByServiceId(serviceId || '', services)
  const serviceType = getServiceType(service)

  const classNameItem = (isDragging: boolean) =>
    `flex items-center bg-neutral-50 rounded px-2 py-3 border ${
      isDragging ? 'border-2 border-green-500' : 'border-neutral-200'
    }`

  const contentWithParams = serviceType === ServiceTypeEnum.DATABASE

  const content = (name = '', type = '', mode = '') => {
    return (
      <div className={`text-neutral-400 font-medium ${contentWithParams ? 'text-xs' : 'text-ssm'}`}>
        <Truncate truncateLimit={contentWithParams ? 32 : 27} text={name || ''} />
        {contentWithParams && (
          <div data-testid="draggable-item-subtitle" className="text-2xs font-normal">
            {upperCaseFirstLetter(type)} - {upperCaseFirstLetter(mode)}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      ref={provided?.innerRef}
      {...provided?.draggableProps}
      {...provided?.dragHandleProps}
      style={{ ...provided?.draggableProps.style }}
      className={snapshot && classNameItem(snapshot.isDragging)}
    >
      <ServiceIcon
        className="mr-2"
        serviceType={serviceType}
        cloudProvider={cloudProvider}
        buildMode={(service as ApplicationEntity)?.build_mode}
      />
      {content(service?.name, (service as DatabaseEntity)?.type, (service as DatabaseEntity)?.mode)}
    </div>
  )
}

export default DraggableItem
