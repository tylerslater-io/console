import { EnvironmentVariableSecretOrPublic } from '@console/shared/interfaces'
import { ButtonIconActionElementProps, Icon, TableHeadProps } from '@console/shared/ui'
import TableRowEnvironmentVariable from '../../ui/table-row-environment-variable/table-row-environment-variable'

export interface TableRowEnvironmentVariableFeatureProps {
  variable: EnvironmentVariableSecretOrPublic
  dataHead: TableHeadProps[]
  columnsWidth?: string
}

export function TableRowEnvironmentVariableFeature(props: TableRowEnvironmentVariableFeatureProps) {
  const { variable, dataHead, columnsWidth = '30% 10% 30% 15% 15%' } = props
  const rowActions: ButtonIconActionElementProps[] = [
    {
      iconLeft: <Icon name="icon-solid-ellipsis-v" />,
      menus: [
        {
          items: [
            {
              name: 'Deploy',
              onClick: () => console.log('Deploy'),
              contentLeft: <Icon name="icon-solid-play" className="text-sm text-brand-400" />,
            },
            {
              name: 'Stop',
              onClick: () => console.log('Stop'),
              contentLeft: <Icon name="icon-solid-circle-stop" className="text-sm text-brand-400" />,
            },
          ],
        },
      ],
    },
  ]

  return (
    <TableRowEnvironmentVariable
      variable={variable}
      dataHead={dataHead}
      rowActions={rowActions}
      isLoading={false}
      columnsWidth={columnsWidth}
    />
  )
}

export default TableRowEnvironmentVariableFeature