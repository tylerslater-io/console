import { DatabaseModeEnum } from 'qovery-typescript-axios'
import { type FormEventHandler } from 'react'
import { useFormContext } from 'react-hook-form'
import { DatabaseSettingsResources } from '@qovery/shared/console-shared'
import { type DatabaseEntity } from '@qovery/shared/interfaces'
import {
  BannerBox,
  BannerBoxEnum,
  ButtonLegacy,
  ButtonLegacySize,
  ButtonLegacyStyle,
  HelpSection,
} from '@qovery/shared/ui'

export interface PageSettingsResourcesProps {
  onSubmit: FormEventHandler<HTMLFormElement>
  database?: DatabaseEntity
  loading?: boolean
  clusterId?: string
}

export function PageSettingsResources(props: PageSettingsResourcesProps) {
  const { onSubmit, loading, database, clusterId } = props
  const { formState, watch } = useFormContext()

  if (!database) return null

  const displayInstanceTypesWarning =
    watch('instance_type') !== database.instance_type && database.mode === DatabaseModeEnum.MANAGED

  return (
    <div className="flex flex-col justify-between w-full">
      <div className="p-8 max-w-content-with-navigation-left">
        <h2 className="h5 text-neutral-400 mb-2">Resources</h2>
        <p className="text-sm text-neutral-400 max-w-content-with-navigation-left mb-8">
          Manage the database's resources
        </p>
        <form onSubmit={onSubmit}>
          {database.mode === DatabaseModeEnum.MANAGED && (
            <BannerBox
              className="mb-5"
              title="Qovery manages this resource for you"
              message={
                <span>
                  Use exclusively the Qovery console to update the resources managed by Qovery on your cloud account.
                  <br /> Do not manually update or upgrade them on the cloud provider console, otherwise you will risk a
                  drift in the configuration.
                </span>
              }
              type={BannerBoxEnum.WARNING}
            />
          )}

          <DatabaseSettingsResources
            database={database}
            clusterId={clusterId}
            isManaged={database.mode === DatabaseModeEnum.MANAGED}
            displayInstanceTypesWarning={displayInstanceTypesWarning}
          />

          <div className="flex justify-end">
            <ButtonLegacy
              dataTestId="submit-button"
              className="btn--no-min-w"
              size={ButtonLegacySize.LARGE}
              style={ButtonLegacyStyle.BASIC}
              type="submit"
              disabled={!formState.isValid}
              loading={loading}
            >
              Save
            </ButtonLegacy>
          </div>
        </form>
      </div>
      <HelpSection
        description="Need help? You may find these links useful"
        links={[
          {
            link: 'https://hub.qovery.com/docs/using-qovery/configuration/database/#resources',
            linkLabel: 'How to configure my database',
          },
        ]}
      />
    </div>
  )
}

export default PageSettingsResources
