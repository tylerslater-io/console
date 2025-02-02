// TODO: Refactor cronstrue usage to only use formatCronExpression
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import cronstrue from 'cronstrue'
import { Controller, useFormContext } from 'react-hook-form'
import { type JobType, ServiceTypeEnum } from '@qovery/shared/enums'
import { type JobConfigureData } from '@qovery/shared/interfaces'
import { EnableBox, ExternalLink, InputText, LoaderSpinner } from '@qovery/shared/ui'
import { formatCronExpression } from '@qovery/shared/util-js'
import EntrypointCmdInputs from '../../entrypoint-cmd-inputs/ui/entrypoint-cmd-inputs'

export interface JobConfigureSettingsProps {
  jobType: JobType
  loading?: boolean
}

export function JobConfigureSettings(props: JobConfigureSettingsProps) {
  const { loading } = props
  const { control, watch } = useFormContext<JobConfigureData>()

  const watchSchedule = watch('schedule')

  return loading ? (
    <LoaderSpinner />
  ) : (
    <div>
      {props.jobType === ServiceTypeEnum.CRON_JOB ? (
        <>
          <h3 className="text-sm font-semibold mb-3">CRON</h3>
          <Controller
            name="schedule"
            control={control}
            rules={{
              required: 'Value required',
              validate: (value) => {
                return (
                  cronstrue.toString(value || '', { throwExceptionOnParseError: false }).indexOf('An error') === -1 ||
                  'Invalid cron expression'
                )
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <InputText
                className="mb-2"
                name={field.name}
                onChange={field.onChange}
                value={field.value}
                label="Schedule - Cron expression"
                error={error?.message}
              />
            )}
          />
          <div className="mb-3 flex justify-between">
            <p className="text-neutral-400 text-xs">{formatCronExpression(watchSchedule)}</p>
            <ExternalLink href="https://crontab.guru" size="xs" className="text-neutral-350">
              CRON expression builder
            </ExternalLink>
          </div>
          <EntrypointCmdInputs />
        </>
      ) : (
        <div className="mb-10">
          <h3 className="text-sm font-semibold mb-1">Event</h3>
          <p className="text-neutral-400 text-sm mb-3">
            Select one or more environment event where the job should be executed
          </p>

          <Controller
            name="on_start.enabled"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <EnableBox
                className="mb-3"
                checked={field.value}
                title="Start"
                name="on_start"
                description="Execute this job when the environment starts (Deploy and Redeploy)"
                setChecked={field.onChange}
              >
                <EntrypointCmdInputs
                  className="mt-4"
                  cmdArgumentsFieldName="on_start.arguments_string"
                  imageEntryPointFieldName="on_start.entrypoint"
                />
              </EnableBox>
            )}
          />

          <Controller
            name="on_stop.enabled"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <EnableBox
                className="mb-3"
                checked={field.value}
                title="Stop"
                name="on_stop"
                description="Execute this job when the environment stops"
                setChecked={field.onChange}
              >
                <EntrypointCmdInputs
                  className="mt-4"
                  cmdArgumentsFieldName="on_stop.arguments_string"
                  imageEntryPointFieldName="on_stop.entrypoint"
                />
              </EnableBox>
            )}
          />

          <Controller
            name="on_delete.enabled"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <EnableBox
                className="mb-3"
                checked={field.value}
                title="Delete"
                name="on_delete"
                description="Execute this job when the environment is deleted"
                setChecked={field.onChange}
              >
                <EntrypointCmdInputs
                  className="mt-4"
                  cmdArgumentsFieldName="on_delete.arguments_string"
                  imageEntryPointFieldName="on_delete.entrypoint"
                />
              </EnableBox>
            )}
          />
        </div>
      )}

      <h3 className="text-sm font-semibold mb-3 mt-8">Parameters</h3>
      <Controller
        name="nb_restarts"
        control={control}
        rules={{
          required: 'Value required',
        }}
        render={({ field, fieldState: { error } }) => (
          <InputText
            type="number"
            className="mb-2"
            name={field.name}
            onChange={field.onChange}
            value={field.value}
            label="Number of restarts"
            error={error?.message}
          />
        )}
      />
      <p className="text-neutral-350 text-xs mb-3">
        Maximum number of restarts allowed in case of job failure (0 means no failure)
      </p>

      <Controller
        name="max_duration"
        control={control}
        rules={{
          required: 'Value required',
        }}
        render={({ field, fieldState: { error } }) => (
          <InputText
            type="number"
            className="mb-2"
            name={field.name}
            onChange={field.onChange}
            value={field.value}
            label="Max duration in seconds"
            error={error?.message}
          />
        )}
      />

      <p className="text-neutral-350 text-xs mb-3">
        Maximum duration allowed for the job to run before killing it and mark it as failed
      </p>

      <Controller
        name="port"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <InputText
            type="number"
            className="mb-2"
            name={field.name}
            onChange={field.onChange}
            value={field.value}
            label="Port"
            error={error?.message}
          />
        )}
      />

      <p className="text-neutral-350 text-xs mb-3">
        Port where to run readiness and liveliness probes checks. The port will not be exposed externally
      </p>
    </div>
  )
}

export default JobConfigureSettings
