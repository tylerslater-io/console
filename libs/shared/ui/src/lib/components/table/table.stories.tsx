import { type Meta, type Story } from '@storybook/react'
import { type Environment } from 'qovery-typescript-axios'
import { useState } from 'react'
import { environmentFactoryMock } from '@qovery/shared/factories'
import ButtonLegacy from '../buttons/button-legacy/button-legacy'
import Icon from '../icon/icon'
import { IconAwesomeEnum } from '../icon/icon-awesome.enum'
import { Table, type TableFilterProps, type TableProps } from './table'
import { TableRow } from './table-row/table-row'

export default {
  component: Table,
  title: 'Table',
} as Meta

const environmentData = environmentFactoryMock(20)

const addRow = (data: Environment[]): Environment[] => {
  const newData = [...data]
  newData.push(environmentFactoryMock(1)[0])
  return newData
}

const Template: Story<TableProps> = (args) => {
  const [data, setData] = useState<Environment[]>(environmentData)
  const [filter, setFilter] = useState<TableFilterProps[]>([])

  return (
    <>
      <ButtonLegacy className="mb-4" onClick={() => setData(addRow(data))}>
        Add Row
      </ButtonLegacy>
      <Table {...args} data={data} setFilter={setFilter} filter={filter} setDataSort={setData}>
        <>
          {data.map((currentData, index) => (
            <TableRow key={index} filter={filter} columnsWidth={args.columnsWidth} data={currentData} link="/">
              <>
                <div className="px-2 text-sm text-neutral-400">
                  {currentData.name} - {currentData.status?.state}
                </div>
                <div className="px-2 text-xs text-neutral-400 truncate">{currentData.created_at}</div>
                <div className="px-2 text-sm text-neutral-400">{currentData.mode}</div>
              </>
            </TableRow>
          ))}
        </>
      </Table>
    </>
  )
}

const dataHead = [
  {
    title: 'Status',
    className: 'px-4 py-2',
    filter: [
      {
        search: true,
        title: 'Filter by status',
        key: 'status.state',
      },
    ],
  },
  {
    title: 'Update',
    className: 'px-4 text-center',
    sort: {
      key: 'updated_at',
    },
  },
  {
    title: 'Type',
    filter: [
      {
        search: true,
        title: 'Filter by environment type',
        key: 'mode',
        itemContentCustom: (data: { mode: string; status: { state: string } }, currentFilter: string) => {
          const isActive = currentFilter === data.mode
          return (
            <p>
              {isActive ? <Icon name={IconAwesomeEnum.CHECK} /> : ''}
              {data.status.state} {data.mode}
            </p>
          )
        },
      },
    ],
  },
]

export const Primary = Template.bind({})
Primary.args = {
  dataHead: dataHead,
  className: 'bg-white rounded-sm',
  columnsWidth: '33% 33% 33% 100%',
}

const TemplateExpand: Story<TableProps> = (args) => {
  const [data, setData] = useState<Environment[]>(environmentData)
  const [filter, setFilter] = useState<TableFilterProps[]>([])

  // Add a new state variable for the expanded row
  const [expandedRow, setExpandedRow] = useState(null)

  // Define a function to toggle the expanded row
  const toggleExpandedRow = (index) => {
    if (index === expandedRow) {
      setExpandedRow(null) // close the expanded row if it's already open
    } else {
      setExpandedRow(index) // open the expanded row if it's closed
    }
  }

  return (
    <>
      <ButtonLegacy className="mb-4" onClick={() => setData(addRow(data))}>
        Add Row
      </ButtonLegacy>
      <Table {...args} data={data} setFilter={setFilter} setDataSort={setData}>
        <>
          {data.map((currentData: Environment, index) => (
            <TableRow key={index} columnsWidth={args.columnsWidth} data={currentData} filter={filter} link="/">
              <>
                <button onClick={() => toggleExpandedRow(currentData.id)}>Expand</button>
                <div className="px-2 text-sm text-neutral-400">
                  {currentData.name} - {currentData.status?.state}
                </div>
                <div className="px-2 text-xs text-neutral-400 truncate">{currentData.created_at}</div>
                <div className="px-2 text-sm text-neutral-400">{currentData.mode}</div>

                <div
                  className={`px-2 bg-brand-100 col-span-3 ${expandedRow === currentData.id ? 'visible' : 'hidden'}`}
                >
                  Expanded row
                </div>
              </>
            </TableRow>
          ))}
        </>
      </Table>
    </>
  )
}

export const WithExpand = TemplateExpand.bind({})
WithExpand.args = {
  dataHead: dataHead,
  className: 'bg-white rounded-sm',
  columnsWidth: '34% 33% 33%',
}
