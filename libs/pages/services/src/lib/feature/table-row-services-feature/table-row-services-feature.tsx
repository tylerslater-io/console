import { useParams } from 'react-router-dom'
import { getServiceType, isDatabase } from '@qovery/shared/enums'
import { type ApplicationEntity, type DatabaseEntity } from '@qovery/shared/interfaces'
import { APPLICATION_URL, DATABASE_GENERAL_URL, DATABASE_URL, SERVICES_GENERAL_URL } from '@qovery/shared/routes'
import { type TableFilterProps, type TableHeadProps } from '@qovery/shared/ui'
import TableRowServices from '../../ui/table-row-services/table-row-services'

export interface TableRowServicesFeatureProps<T> {
  data: ApplicationEntity | DatabaseEntity
  filter: TableFilterProps[]
  environmentMode: string
  dataHead: TableHeadProps<T>[]
  link: string
  clusterId: string
  isLoading?: boolean
}

export function TableRowServicesFeature<T>(props: TableRowServicesFeatureProps<T>) {
  const { data, filter, environmentMode, dataHead, clusterId } = props
  const { organizationId = '', projectId = '', environmentId = '' } = useParams()

  const type = getServiceType(data)

  const link = isDatabase(type)
    ? DATABASE_URL(organizationId, projectId, environmentId, data.id) + DATABASE_GENERAL_URL
    : APPLICATION_URL(organizationId, projectId, environmentId, data.id) + SERVICES_GENERAL_URL

  return (
    <TableRowServices
      data={data}
      filter={filter}
      type={type}
      environmentMode={environmentMode}
      dataHead={dataHead}
      link={link}
      columnsWidth="25% 25% 25% 20%"
      isLoading={props.isLoading}
      clusterId={clusterId}
    />
  )
}

export default TableRowServicesFeature
