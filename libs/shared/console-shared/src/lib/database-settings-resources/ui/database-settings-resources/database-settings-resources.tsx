import { type DatabaseTypeEnum } from 'qovery-typescript-axios'
import { Controller, useFormContext } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { type DatabaseEntity } from '@qovery/shared/interfaces'
import { CLUSTER_SETTINGS_RESOURCES_URL, CLUSTER_SETTINGS_URL, CLUSTER_URL } from '@qovery/shared/routes'
import { BlockContent, InputText, Link, inputSizeUnitRules } from '@qovery/shared/ui'
import SettingsResourcesInstanceTypesFeature from '../../feature/settings-resources-instance-types-feature/setting-resources-instance-types-feature'

export interface DatabaseSettingsResourcesProps {
  database?: DatabaseEntity
  isDatabase?: boolean
  isManaged?: boolean
  clusterId?: string
  databaseType?: DatabaseTypeEnum
  displayInstanceTypesWarning?: boolean
}

export function DatabaseSettingsResources({
  database,
  databaseType,
  isManaged = false,
  clusterId = '',
  displayInstanceTypesWarning = false,
}: DatabaseSettingsResourcesProps) {
  const { control } = useFormContext()
  const { organizationId = '' } = useParams()

  const maxMemoryBySize = database?.maximum_memory

  if (database) {
    databaseType = database.type
  }

  return (
    <div>
      {!isManaged && (
        <>
          <BlockContent title="vCPU">
            <Controller
              name="cpu"
              control={control}
              render={({ field }) => (
                <InputText
                  type="number"
                  name={field.name}
                  label="Size (in milli vCPU)"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {database && (
              <p className="text-neutral-350 text-xs mt-3">
                Minimum value is 10 milli vCPU. Maximum value allowed based on the selected cluster instance type:{' '}
                {database?.maximum_cpu} mili vCPU.{' '}
                {clusterId && (
                  <Link
                    to={CLUSTER_URL(organizationId, clusterId) + CLUSTER_SETTINGS_URL + CLUSTER_SETTINGS_RESOURCES_URL}
                    size="xs"
                  >
                    Edit node
                  </Link>
                )}
              </p>
            )}
          </BlockContent>
          <BlockContent title="Memory">
            <Controller
              name="memory"
              control={control}
              rules={inputSizeUnitRules(maxMemoryBySize)}
              render={({ field, fieldState: { error } }) => (
                <InputText
                  dataTestId="input-memory-memory"
                  type="number"
                  name={field.name}
                  label="Size in MiB"
                  value={field.value}
                  onChange={field.onChange}
                  error={
                    error?.type === 'required'
                      ? 'Please enter a size.'
                      : error?.type === 'max'
                      ? `Maximum allowed ${field.name} is: ${maxMemoryBySize} MB.`
                      : undefined
                  }
                />
              )}
            />
            {database && (
              <p className="text-neutral-350 text-xs mt-3">
                Minimum value is 1 MiB. Maximum value allowed based on the selected cluster instance type:{' '}
                {database?.maximum_memory} MiB.{' '}
                {clusterId && (
                  <Link
                    to={CLUSTER_URL(organizationId, clusterId) + CLUSTER_SETTINGS_URL + CLUSTER_SETTINGS_RESOURCES_URL}
                    size="xs"
                  >
                    Edit node
                  </Link>
                )}
              </p>
            )}
          </BlockContent>
        </>
      )}
      {isManaged && databaseType && (
        <SettingsResourcesInstanceTypesFeature
          databaseType={databaseType}
          displayWarning={displayInstanceTypesWarning}
        />
      )}
      <BlockContent title="Storage">
        <Controller
          name="storage"
          control={control}
          rules={{
            pattern: {
              value: /^[0-9]+$/,
              message: 'Please enter a number.',
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <InputText
              dataTestId="input-memory-storage"
              name={field.name}
              label="Size in GiB"
              value={field.value}
              onChange={field.onChange}
              error={error?.message}
            />
          )}
        />
      </BlockContent>
    </div>
  )
}

export default DatabaseSettingsResources
