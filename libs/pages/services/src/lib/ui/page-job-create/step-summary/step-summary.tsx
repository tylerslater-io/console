import { BuildModeEnum } from 'qovery-typescript-axios'
import { type JobType, ServiceTypeEnum, isCronJob } from '@qovery/shared/enums'
import {
  type FlowVariableData,
  type JobConfigureData,
  type JobGeneralData,
  type JobResourcesData,
} from '@qovery/shared/interfaces'
import {
  ButtonIcon,
  ButtonIconStyle,
  ButtonLegacy,
  ButtonLegacySize,
  ButtonLegacyStyle,
  Icon,
  IconAwesomeEnum,
} from '@qovery/shared/ui'

export interface StepSummaryProps {
  onSubmit: (withDeploy: boolean) => void
  onPrevious: () => void
  generalData: JobGeneralData
  resourcesData: JobResourcesData
  configureData: JobConfigureData
  variableData: FlowVariableData
  gotoGlobalInformation: () => void
  gotoResources: () => void
  gotoVariables: () => void
  gotoConfigureJob: () => void
  isLoadingCreate: boolean
  isLoadingCreateAndDeploy: boolean
  selectedRegistryName?: string
  jobType: JobType
}

export function StepSummary(props: StepSummaryProps) {
  return (
    <div>
      <div className="mb-10">
        <div className="flex justify-between mb-2 items-center">
          <h3 className="text-neutral-400 text-lg">
            Ready to create your {isCronJob(props.jobType) ? 'Cron' : 'Lifecycle'} job
          </h3>
        </div>
        <p className="text-xs text-neutral-400 mb-2">
          The basic application setup is done, you can now deploy your application or move forward with some advanced
          setup.
        </p>
      </div>

      <div className="mb-10">
        <div className="flex p-4 w-full border rounded border-neutral-250 bg-neutral-100 mb-2">
          <Icon name={IconAwesomeEnum.CHECK} className="text-green-500 mr-2" />
          <div className="flex-grow mr-2">
            <div className="text-sm text-neutral-400 font-bold mb-5">General information</div>

            <div className="text-neutral-400 text-ssm mb-2 font-medium">General</div>

            <ul className="text-neutral-350 text-sm list-none">
              <li>
                <span className="font-medium">Name:</span> {props.generalData.name}
              </li>
              <li>
                <span className="font-medium">Description:</span> {props.generalData.description}
              </li>
            </ul>

            <div className="my-4 border-b border-neutral-250 border-dashed" />

            {props.generalData.serviceType === ServiceTypeEnum.APPLICATION && (
              <ul className="text-neutral-350 text-sm list-none">
                <li>
                  <span className="font-medium">Repository:</span> {props.generalData.repository}
                </li>
                <li>
                  <span className="font-medium">Branch:</span> {props.generalData.branch}
                </li>
                <li>
                  <span className="font-medium">Root path:</span> {props.generalData.root_path}
                </li>
                {props.generalData.build_mode === BuildModeEnum.DOCKER && (
                  <li>
                    <span className="font-medium">Dockerfile path:</span> {props.generalData.dockerfile_path}
                  </li>
                )}
                <li>
                  <span className="font-medium">Auto-deploy:</span> {props.generalData.auto_deploy.toString()}
                </li>
              </ul>
            )}
            {props.generalData.serviceType === ServiceTypeEnum.CONTAINER && (
              <ul className="text-neutral-350 text-sm list-none">
                <li>
                  <span className="font-medium">Registry:</span> {props.selectedRegistryName}
                </li>
                <li>
                  <span className="font-medium">Image name:</span> {props.generalData.image_name}
                </li>
                <li>
                  <span className="font-medium">Image tag:</span> {props.generalData.image_tag}
                </li>
                <li>
                  <span className="font-medium">Image entrypoint:</span> {props.generalData.image_entry_point}
                </li>
                <li>
                  <span className="font-medium">CMD arguments:</span> {props.configureData.cmd_arguments}
                </li>
                <li>
                  <span className="font-medium">Auto-deploy:</span> {props.generalData.auto_deploy.toString()}
                </li>
              </ul>
            )}
          </div>

          <ButtonIcon
            onClick={props.gotoGlobalInformation}
            icon={IconAwesomeEnum.WHEEL}
            style={ButtonIconStyle.FLAT}
            className="text-neutral-400 hover:text-neutral-400"
          />
        </div>

        <div className="flex p-4 w-full border rounded border-neutral-250 bg-neutral-100 mb-2">
          <Icon name={IconAwesomeEnum.CHECK} className="text-green-500 mr-2" />
          <div className="flex-grow mr-2">
            <div className="text-sm text-neutral-400 font-bold mb-5">Configure job</div>

            {props.jobType === ServiceTypeEnum.LIFECYCLE_JOB && (
              <>
                {props.configureData.on_start?.enabled && (
                  <>
                    <ul className="text-neutral-350 text-sm list-none">
                      <li>
                        <div className="font-medium text-ssm text-neutral-400">
                          <span className="mr-2 inline-block">Events</span>Environment Start
                        </div>
                      </li>
                      <li>
                        <span className="font-medium">Entrypoint:</span>{' '}
                        {props.configureData.on_start?.entrypoint || 'null'}
                      </li>
                      <li>
                        <span className="font-medium">CMD Arguments:</span>{' '}
                        {props.configureData.on_start?.arguments || 'null'}
                      </li>
                    </ul>
                    <div className="my-4 border-b border-neutral-250 border-dashed" />
                  </>
                )}
                {props.configureData.on_stop?.enabled && (
                  <>
                    <ul className="text-neutral-350 text-sm list-none">
                      <li>
                        <div className="font-medium text-ssm text-neutral-400">
                          <span className="mr-2 inline-block">Events</span>Environment Stop
                        </div>
                      </li>
                      <li>
                        <span className="font-medium">Entrypoint:</span>{' '}
                        {props.configureData.on_stop?.entrypoint || 'null'}
                      </li>
                      <li>
                        <span className="font-medium">CMD Arguments:</span>{' '}
                        {props.configureData.on_stop?.arguments || 'null'}
                      </li>
                    </ul>
                    <div className="my-4 border-b border-neutral-250 border-dashed" />
                  </>
                )}
                {props.configureData.on_delete?.enabled && (
                  <>
                    <ul className="text-neutral-350 text-sm list-none">
                      <li>
                        <div className="font-medium text-ssm text-neutral-400">
                          <span className="mr-2 inline-block">Events</span>Environment Delete
                        </div>
                      </li>
                      <li>
                        <span className="font-medium">Entrypoint:</span>{' '}
                        {props.configureData.on_delete?.entrypoint || 'null'}
                      </li>
                      <li>
                        <span className="font-medium">CMD Arguments:</span>{' '}
                        {props.configureData.on_delete?.arguments || 'null'}
                      </li>
                    </ul>
                    <div className="my-4 border-b border-neutral-250 border-dashed" />
                  </>
                )}
              </>
            )}

            {props.jobType === ServiceTypeEnum.CRON_JOB && (
              <>
                <ul className="text-neutral-350 text-sm list-none">
                  <li>
                    <span className="font-medium">Scheduled at:</span> {props.configureData.schedule}
                  </li>
                  {props.configureData.image_entry_point && (
                    <li>
                      <span className="font-medium">Entrypoint:</span> {props.configureData.image_entry_point}
                    </li>
                  )}
                  {props.configureData.cmd_arguments && (
                    <li>
                      <span className="font-medium">CMD arguments:</span> {props.configureData.cmd_arguments}
                    </li>
                  )}
                </ul>
                <div className="my-4 border-b border-neutral-250 border-dashed" />
              </>
            )}

            <div className="text-neutral-400 text-ssm mb-2 font-medium">Parameters</div>

            <ul className="text-neutral-350 text-sm list-none">
              <li>
                <span className="font-medium">Max restarts:</span> {props.configureData.nb_restarts}
              </li>
              <li>
                <span className="font-medium">Max duration:</span> {props.configureData.max_duration}
              </li>
              <li>
                <span className="font-medium">Port:</span> {props.configureData.port}
              </li>
            </ul>
          </div>

          <ButtonIcon
            onClick={props.gotoConfigureJob}
            icon={IconAwesomeEnum.WHEEL}
            style={ButtonIconStyle.FLAT}
            className="text-neutral-400 hover:text-neutral-400"
          />
        </div>

        <div className="flex p-4 w-full border rounded border-neutral-250 bg-neutral-100 mb-2">
          <Icon name={IconAwesomeEnum.CHECK} className="text-green-500 mr-2" />
          <div className="flex-grow mr-2">
            <div className="text-sm text-neutral-400 font-bold mb-5">Resources</div>

            <div className="text-neutral-400 text-ssm mb-2 font-medium">Parameters</div>
            <ul className="text-neutral-350 text-sm list-none">
              <li>
                <span className="font-medium">CPU:</span> {props.resourcesData['cpu']}
              </li>
              <li>
                <span className="font-medium">Memory:</span> {props.resourcesData.memory} MB
              </li>
            </ul>
          </div>

          <ButtonIcon
            onClick={props.gotoResources}
            icon={IconAwesomeEnum.WHEEL}
            style={ButtonIconStyle.FLAT}
            className="text-neutral-400 hover:text-neutral-400"
          />
        </div>

        <div className="flex p-4 w-full border rounded border-neutral-250 bg-neutral-100 mb-2">
          <Icon name={IconAwesomeEnum.CHECK} className="text-green-500 mr-2" />
          <div className="flex-grow mr-2">
            <div className="text-sm text-neutral-400 font-bold mb-5">Environment variables</div>

            <div className="text-neutral-400 text-ssm mb-2 font-medium">
              Parameters{' '}
              {props.variableData.variables && props.variableData.variables.length
                ? `(${props.variableData.variables.length})`
                : ''}
            </div>
            <ul className="text-neutral-350 text-sm">
              {props.variableData.variables && props.variableData.variables.length > 0 ? (
                props.variableData.variables?.map((variable, index) => (
                  <li key={index}>
                    <strong className="font-medium">{variable.variable}</strong> ={' '}
                    <strong className="font-medium">{variable.isSecret ? '********' : variable.value}</strong> – Secret:{' '}
                    <strong className="font-medium">{variable.isSecret ? 'Yes' : 'No'}</strong>
                  </li>
                ))
              ) : (
                <li>No variable declared</li>
              )}
            </ul>
          </div>

          <ButtonIcon
            onClick={props.gotoVariables}
            icon={IconAwesomeEnum.WHEEL}
            style={ButtonIconStyle.FLAT}
            className="text-neutral-400 hover:text-neutral-400"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <ButtonLegacy
          onClick={props.onPrevious}
          className="btn--no-min-w"
          type="button"
          size={ButtonLegacySize.XLARGE}
          style={ButtonLegacyStyle.STROKED}
        >
          Back
        </ButtonLegacy>
        <div className="flex gap-2">
          <ButtonLegacy
            dataTestId="button-create"
            loading={props.isLoadingCreate}
            onClick={() => props.onSubmit(false)}
            size={ButtonLegacySize.XLARGE}
            style={ButtonLegacyStyle.STROKED}
            className="btn--no-min-w"
          >
            Create
          </ButtonLegacy>
          <ButtonLegacy
            dataTestId="button-create-deploy"
            loading={props.isLoadingCreateAndDeploy}
            onClick={() => props.onSubmit(true)}
            size={ButtonLegacySize.XLARGE}
            style={ButtonLegacyStyle.BASIC}
          >
            Create and deploy
          </ButtonLegacy>
        </div>
      </div>
    </div>
  )
}

export default StepSummary
