import {
  type OrganizationCustomRole,
  type OrganizationCustomRoleProjectPermissionsInner,
} from 'qovery-typescript-axios'
import { type FormEventHandler } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { SETTINGS_ROLES_URL, SETTINGS_URL } from '@qovery/shared/routes'
import {
  BlockContent,
  ButtonLegacy,
  ButtonLegacySize,
  ButtonLegacyStyle,
  HelpSection,
  Icon,
  IconAwesomeEnum,
  InputText,
  InputTextArea,
  LoaderSpinner,
} from '@qovery/shared/ui'
import RowProject from './row-project/row-project'
import TableClusters from './table-clusters/table-clusters'
import Table from './table/table'

export interface PageOrganizationRolesEditProps {
  onSubmit: FormEventHandler<HTMLFormElement>
  onDeleteRole: (customRole: OrganizationCustomRole) => void
  currentRole?: OrganizationCustomRole
  loading?: boolean
  loadingForm?: boolean
}

export function PageOrganizationRolesEdit(props: PageOrganizationRolesEditProps) {
  const { currentRole, loading, loadingForm, onSubmit, onDeleteRole } = props

  const { control, formState } = useFormContext()
  const { organizationId = '' } = useParams()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col justify-between w-full">
      <div className="p-8">
        {loading ? (
          <div data-testid="custom-roles-loader" className="flex justify-center mt-5">
            <LoaderSpinner className="w-6" />
          </div>
        ) : (
          currentRole && (
            <>
              <div className="flex justify-between mb-8">
                <div>
                  <ButtonLegacy
                    size={ButtonLegacySize.TINY}
                    style={ButtonLegacyStyle.FLAT}
                    onClick={() => navigate(SETTINGS_URL(organizationId) + SETTINGS_ROLES_URL)}
                    className="!px-0 mb-1"
                  >
                    <Icon name={IconAwesomeEnum.ARROW_LEFT} className="mr-1 text-xs" />
                    Back
                  </ButtonLegacy>
                  <h1 className="h5 text-neutral-400 mb-2">Edit your custom role: {currentRole.name}</h1>
                  <p className="text-neutral-400 text-xs">
                    Set permissions for your custom role. Cluster level permissions allow you to define access
                    permission to each cluster of your organization (default is "Read-only"). Project Level permissions
                    allow you to customize the access to each project and its environments based on its type (PROD,DEV
                    etc.. default is "No Access").
                  </p>
                </div>
              </div>
              <form onSubmit={onSubmit}>
                <div className="max-w-content-with-navigation-left">
                  <BlockContent title="General information">
                    <Controller
                      name="name"
                      control={control}
                      rules={{ required: 'Please enter a name.' }}
                      render={({ field, fieldState: { error } }) => (
                        <InputText
                          dataTestId="input-name"
                          className="mb-3"
                          name={field.name}
                          onChange={field.onChange}
                          value={field.value}
                          label="Name"
                          error={error?.message}
                        />
                      )}
                    />
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <InputTextArea
                          dataTestId="input-description"
                          name={field.name}
                          onChange={field.onChange}
                          value={field.value}
                          label="Description"
                        />
                      )}
                    />
                  </BlockContent>
                </div>
                {currentRole?.cluster_permissions && <TableClusters clusters={currentRole?.cluster_permissions} />}
                {currentRole?.project_permissions && (
                  <Table
                    title="Project level permissions"
                    headArray={[
                      {
                        label: 'Full-Access',
                        tooltip:
                          'The user is admin of the project and can do everything he wants on it (no matter the environment type)',
                      },
                      {
                        label: 'Manage',
                        tooltip:
                          'Manage the deployments and the settings of this environment type (including adding or removing services)',
                      },
                      {
                        label: 'Deploy',
                        tooltip:
                          'Manage the deployments of this environment type, access the logs, connect via SSH to the application and manage its environment variables.',
                      },
                      {
                        label: 'Read-Only',
                        tooltip: 'Access in read-only this environment type.',
                      },
                      {
                        label: 'No Access',
                        tooltip: 'The user has no access to this environment type.',
                      },
                    ]}
                  >
                    {currentRole.project_permissions.map((project: OrganizationCustomRoleProjectPermissionsInner) => (
                      <RowProject key={project.project_id} project={project} />
                    ))}
                  </Table>
                )}
                <div className="flex gap-3 justify-between mt-6">
                  <ButtonLegacy
                    dataTestId="delete-button"
                    className="btn--no-min-w"
                    style={ButtonLegacyStyle.ERROR}
                    size={ButtonLegacySize.XLARGE}
                    onClick={() => onDeleteRole(currentRole)}
                  >
                    Delete role
                  </ButtonLegacy>
                  <ButtonLegacy
                    dataTestId="submit-save-button"
                    className="btn--no-min-w"
                    type="submit"
                    size={ButtonLegacySize.XLARGE}
                    disabled={!formState.isValid}
                    loading={loadingForm}
                  >
                    Save
                  </ButtonLegacy>
                </div>
              </form>
            </>
          )
        )}
      </div>
      <HelpSection
        description="Need help? You may find these links useful"
        links={[
          {
            link: 'https://hub.qovery.com/docs/using-qovery/configuration/organization/members-rbac/#roles-based-access-control-rbac',
            linkLabel: 'How to configure my custom roles',
          },
        ]}
      />
    </div>
  )
}

export default PageOrganizationRolesEdit
