import { EnvironmentModeEnum } from 'qovery-typescript-axios'
import { Controller, useFormContext } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { isJob } from '@qovery/shared/enums'
import { type ApplicationEntity } from '@qovery/shared/interfaces'
import { CLUSTER_SETTINGS_RESOURCES_URL, CLUSTER_SETTINGS_URL, CLUSTER_URL } from '@qovery/shared/routes'
import { BannerBox, BannerBoxEnum, BlockContent, InputText, Link, Slider, inputSizeUnitRules } from '@qovery/shared/ui'

export interface ApplicationSettingsResourcesProps {
  displayWarningCpu: boolean
  application?: ApplicationEntity
  minInstances?: number
  maxInstances?: number
  clusterId?: string
  environmentMode?: EnvironmentModeEnum
}

export function ApplicationSettingsResources(props: ApplicationSettingsResourcesProps) {
  const { displayWarningCpu, application, minInstances = 1, maxInstances = 50, clusterId = '', environmentMode } = props
  const { control, watch } = useFormContext()
  const { organizationId = '' } = useParams()

  let maxMemoryBySize = application?.maximum_memory

  if (!application) {
    // until api allows us to fetch the max possible value
    maxMemoryBySize = 128000
  }

  const watchInstances = watch('instances')

  return (
    <div>
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
        {application && (
          <p className="text-neutral-350 text-xs mt-3">
            Minimum value is 10 milli vCPU. Maximum value allowed based on the selected cluster instance type:{' '}
            {application?.maximum_cpu} mili vCPU.{' '}
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
        {displayWarningCpu && (
          <BannerBox
            dataTestId="banner-box"
            className="mt-3"
            title="Not enough resources"
            message="Increase the capacity of your cluster nodes or reduce the service consumption."
            type={BannerBoxEnum.ERROR}
          />
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
        {application && (
          <p className="text-neutral-350 text-xs mt-3">
            Minimum value is 1 MiB. Maximum value allowed based on the selected cluster instance type:{' '}
            {application.maximum_memory} MiB.{' '}
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

      {!isJob(application) && watchInstances && (
        <BlockContent title="Instances">
          <p className="text-neutral-400 mb-3 font-medium">{`${watchInstances[0]} - ${watchInstances[1]}`}</p>
          <Controller
            name="instances"
            control={control}
            render={({ field }) => (
              <Slider min={minInstances} max={maxInstances} step={1} onChange={field.onChange} value={field.value} />
            )}
          />
          <p className="text-neutral-350 text-xs mt-3">
            {application?.instances?.items && (
              <span className="flex mb-1">
                Current consumption: {application.instances.items.length} instance
                {application.instances.items.length > 1 ? 's' : ''}
              </span>
            )}
            Application auto-scaling is based on real-time CPU consumption. When your app goes above 60% (default) of
            CPU consumption for 5 minutes, your app will be auto-scaled and more instances will be added.
          </p>
          {environmentMode === EnvironmentModeEnum.PRODUCTION && watchInstances[0] === 1 && (
            <BannerBox
              className="mt-3"
              message={
                <span>
                  We strongly discourage running your production environment with only one instance. This setup might
                  create service downtime in case of cluster upgrades. Set a minimum of 2 instances for your service to
                  ensure high availability.
                </span>
              }
              type={BannerBoxEnum.WARNING}
            />
          )}
        </BlockContent>
      )}
    </div>
  )
}

export default ApplicationSettingsResources
