import { BuildModeEnum } from 'qovery-typescript-axios'
import { type FormEventHandler } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { AutoDeploySetting } from '@qovery/domains/services/feature'
import {
  CreateGeneralGitApplication,
  EntrypointCmdInputs,
  GeneralContainerSettings,
} from '@qovery/shared/console-shared'
import { IconEnum, ServiceTypeEnum, isApplication, isContainer } from '@qovery/shared/enums'
import { type ApplicationGeneralData, type OrganizationEntity } from '@qovery/shared/interfaces'
import { SERVICES_URL } from '@qovery/shared/routes'
import {
  ButtonLegacy,
  ButtonLegacySize,
  ButtonLegacyStyle,
  Icon,
  InputSelect,
  InputText,
  InputTextArea,
} from '@qovery/shared/ui'

export interface StepGeneralProps {
  onSubmit: FormEventHandler<HTMLFormElement>
  organization?: OrganizationEntity
}

export function StepGeneral(props: StepGeneralProps) {
  const { control, watch, formState } = useFormContext<ApplicationGeneralData>()
  const { organizationId = '', environmentId = '', projectId = '' } = useParams()
  const navigate = useNavigate()

  const watchServiceType = watch('serviceType')
  const watchBuildMode = watch('build_mode')

  return (
    <div>
      <div className="mb-10">
        <h3 className="text-neutral-400 text-lg mb-2">General information</h3>
        <p className="text-neutral-400 text-sm mb-2">
          General settings allow you to set up your application name, git repository or container settings.
        </p>
      </div>

      <form onSubmit={props.onSubmit}>
        <Controller
          name="name"
          control={control}
          rules={{
            required: 'Please enter a name.',
          }}
          render={({ field, fieldState: { error } }) => (
            <InputText
              className="mb-3"
              name={field.name}
              onChange={field.onChange}
              value={field.value}
              label="Application name"
              error={error?.message}
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <InputTextArea
              className="mb-3"
              name={field.name}
              onChange={field.onChange}
              value={field.value}
              label="Description"
            />
          )}
        />
        <Controller
          name="serviceType"
          control={control}
          rules={{
            required: 'Please select a source.',
          }}
          render={({ field, fieldState: { error } }) => (
            <InputSelect
              dataTestId="input-select-source"
              className="mb-6"
              onChange={field.onChange}
              value={field.value}
              options={[
                {
                  value: ServiceTypeEnum.APPLICATION,
                  label: 'Git provider',
                  icon: <Icon name={IconEnum.GIT} className="w-4" />,
                },
                {
                  value: ServiceTypeEnum.CONTAINER,
                  label: 'Container Registry',
                  icon: <Icon name={IconEnum.CONTAINER} className="w-4" />,
                },
              ]}
              label="Application source"
              error={error?.message}
            />
          )}
        />

        <div className="border-b border-b-neutral-200 mb-6"></div>
        {isApplication(watchServiceType) && <CreateGeneralGitApplication />}

        {isContainer(watchServiceType) && <GeneralContainerSettings organization={props.organization} />}

        {(watchBuildMode === BuildModeEnum.DOCKER || isContainer(watchServiceType)) && <EntrypointCmdInputs />}

        {watchServiceType && (
          <AutoDeploySetting source={watchServiceType === ServiceTypeEnum.CONTAINER ? 'CONTAINER_REGISTRY' : 'GIT'} />
        )}

        <div className="flex justify-between mt-6">
          <ButtonLegacy
            onClick={() => navigate(SERVICES_URL(organizationId, projectId, environmentId))}
            type="button"
            className="btn--no-min-w"
            size={ButtonLegacySize.XLARGE}
            style={ButtonLegacyStyle.STROKED}
          >
            Cancel
          </ButtonLegacy>
          <ButtonLegacy
            dataTestId="button-submit"
            type="submit"
            disabled={!formState.isValid}
            size={ButtonLegacySize.XLARGE}
            style={ButtonLegacyStyle.BASIC}
          >
            Continue
          </ButtonLegacy>
        </div>
      </form>
    </div>
  )
}

export default StepGeneral
