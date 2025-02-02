import { type ContainerRegistryResponse } from 'qovery-typescript-axios'
import { useParams } from 'react-router-dom'
import { PodsMetrics, ServiceDetails } from '@qovery/domains/services/feature'
import { isJob } from '@qovery/shared/enums'
import { type ApplicationEntity, type JobApplicationEntity, type LoadingStatus } from '@qovery/shared/interfaces'
import { type BaseLink, HelpSection, Icon, Skeleton, Tooltip } from '@qovery/shared/ui'
import JobOverview from '../job-overview/job-overview'

export interface PageGeneralProps {
  application?: ApplicationEntity
  listHelpfulLinks: BaseLink[]
  loadingStatus?: LoadingStatus
  serviceStability?: number
  currentRegistry?: ContainerRegistryResponse
}

export function PageGeneral(props: PageGeneralProps) {
  const { application, listHelpfulLinks, serviceStability = 0 } = props
  const { environmentId = '', applicationId = '' } = useParams()

  return (
    <div className="mt-2 bg-white rounded flex flex-grow min-h-0">
      <div className="flex flex-col grow">
        <div className="flex flex-row grow">
          <div className="py-7 px-10 flex-grow overflow-y-auto min-h-0">
            {!isJob(application) ? (
              <>
                <div className="flex border border-neutral-200 mb-4">
                  <div className="flex-1 border-r border-neutral-200 p-5">
                    <Skeleton height={24} width={48} show={application?.instances?.loadingStatus === 'loading'}>
                      <span className="text-neutral-400 font-bold">
                        {application?.instances?.items?.length || '–'}/{application?.max_running_instances || '-'}
                      </span>
                    </Skeleton>
                    <span className="flex text-xs text-neutral-350 font-medium">
                      Running instances{' '}
                      <Tooltip side="right" content="Number of running instances">
                        <div className="flex items-center">
                          <Icon
                            className="cursor-pointer ml-1 text-xs text-neutral-350"
                            name="icon-solid-circle-info"
                          />
                        </div>
                      </Tooltip>
                    </span>
                  </div>
                  <div className="flex-1 p-5">
                    <div className="text-neutral-400 font-bold mb-1">{serviceStability}</div>
                    <span className="flex text-xs text-neutral-350 font-medium">
                      Service stability
                      <Tooltip
                        side="right"
                        content="Number of application instance restarts since the last deployment due to application errors"
                      >
                        <div className="flex items-center">
                          <Icon
                            className="cursor-pointer ml-1 text-xs text-neutral-350"
                            name="icon-solid-circle-info"
                          />
                        </div>
                      </Tooltip>
                    </span>
                  </div>
                </div>
                {application && application.environment && (
                  <PodsMetrics environmentId={application.environment.id} serviceId={application.id} />
                )}
              </>
            ) : (
              <JobOverview application={application as JobApplicationEntity} />
            )}
          </div>
          <ServiceDetails className="w-[360px] border-l" environmentId={environmentId} serviceId={applicationId} />
        </div>
        <div className="bg-white rounded-b flex flex-col justify-end">
          <HelpSection description="Need help? You may find these links useful" links={listHelpfulLinks} />
        </div>
      </div>
    </div>
  )
}

export default PageGeneral
