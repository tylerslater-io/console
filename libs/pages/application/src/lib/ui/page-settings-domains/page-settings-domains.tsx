import { type CustomDomain } from 'qovery-typescript-axios'
import { type ApplicationEntity, type LoadingStatus } from '@qovery/shared/interfaces'
import {
  BlockContent,
  ButtonIcon,
  ButtonIconStyle,
  ButtonLegacy,
  EmptyState,
  HelpSection,
  IconAwesomeEnum,
  InputText,
  LoaderSpinner,
} from '@qovery/shared/ui'

export interface PageSettingsDomainsProps {
  application?: ApplicationEntity
  onAddDomain: () => void
  onEdit: (customDomain: CustomDomain) => void
  onDelete: (customDomain: CustomDomain) => void
  domains?: CustomDomain[]
  loading?: LoadingStatus
}

export function PageSettingsDomains(props: PageSettingsDomainsProps) {
  return (
    <div className="flex flex-col justify-between w-full">
      <div className="p-8  max-w-content-with-navigation-left">
        <div className="flex justify-between mb-8">
          <div>
            <h1 className="h5 text-neutral-400 mb-2">Domain</h1>
            <p className="text-sm text-neutral-400">Add custom domains to your application.</p>
          </div>

          <ButtonLegacy onClick={() => props.onAddDomain()} iconRight={IconAwesomeEnum.CIRCLE_PLUS}>
            Add Domain
          </ButtonLegacy>
        </div>

        {(props.loading === 'not loaded' || props.loading === 'loading') && props.domains?.length === 0 ? (
          <div className="flex justify-center">
            <LoaderSpinner className="w-6" />
          </div>
        ) : props.domains && props.domains.length > 0 ? (
          <BlockContent title="Configured domains">
            {props.domains &&
              props.domains.map((customDomain, i) => (
                <div
                  key={`domain-${customDomain.domain}-${customDomain.id}`}
                  className={`flex justify-between w-full items-center gap-3 ${
                    props.domains && props.domains.length !== i + 1 ? 'mb-5' : ''
                  }`}
                  data-testid="form-row"
                >
                  <InputText
                    name={`domain-${customDomain.domain}-${customDomain.id}`}
                    className="shrink-0 grow flex-1"
                    value={customDomain.domain}
                    label="Default Domain"
                    disabled
                  />
                  <ButtonIcon
                    className="!bg-transparent hover:!bg-neutral-200 !w-[52px] !h-[52px]"
                    onClick={() => props.onEdit(customDomain)}
                    dataTestId="edit-button"
                    icon={IconAwesomeEnum.WHEEL}
                    style={ButtonIconStyle.STROKED}
                  />
                  <ButtonIcon
                    className="!bg-transparent hover:!bg-neutral-200 !w-[52px] !h-[52px]"
                    onClick={() => props.onDelete(customDomain)}
                    dataTestId="delete-button"
                    icon={IconAwesomeEnum.TRASH}
                    style={ButtonIconStyle.STROKED}
                  />
                </div>
              ))}
          </BlockContent>
        ) : (
          <EmptyState title="No domains are set" description="Define a custom domain for your application" />
        )}
      </div>
      <HelpSection
        description="Need help? You may find these links useful"
        links={[
          {
            link: 'https://hub.qovery.com/docs/using-qovery/configuration/application/#domains',
            linkLabel: 'How to configure my application',
          },
        ]}
      />
    </div>
  )
}

export default PageSettingsDomains
