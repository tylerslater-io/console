import { useParams } from 'react-router-dom'
import { type ClusterEntity, type LoadingStatus } from '@qovery/shared/interfaces'
import { CLUSTERS_CREATION_GENERAL_URL, CLUSTERS_CREATION_URL, CLUSTERS_URL } from '@qovery/shared/routes'
import { ButtonLegacy, EmptyState, HelpSection, IconAwesomeEnum, LoaderSpinner } from '@qovery/shared/ui'
import CardCluster from '../card-cluster/card-cluster'

export interface PageClustersGeneralProps {
  clusters: ClusterEntity[]
  loading: LoadingStatus
}

export function PageClustersGeneral(props: PageClustersGeneralProps) {
  const { loading, clusters } = props
  const { organizationId = '' } = useParams()

  const goToCreateCluster = CLUSTERS_URL(organizationId) + CLUSTERS_CREATION_URL + CLUSTERS_CREATION_GENERAL_URL

  return (
    <div className="flex flex-col justify-between w-full">
      <div className="p-8">
        <div className="flex justify-between mb-8">
          <div>
            <h1 className="h5 text-neutral-400 mb-2">Manage your clusters</h1>
            <p className="text-neutral-400 text-xs">Manage your infrastructure across different Cloud providers.</p>
          </div>
          <ButtonLegacy iconRight={IconAwesomeEnum.CIRCLE_PLUS} link={goToCreateCluster}>
            Add Cluster
          </ButtonLegacy>
        </div>
        {(loading === 'not loaded' || loading === 'loading') && clusters?.length === 0 ? (
          <div data-testid="clusters-loader" className="flex justify-center">
            <LoaderSpinner className="w-6" />
          </div>
        ) : clusters && clusters.length > 0 ? (
          <div className="grid grid-cols-3 gap-5">
            {clusters.map((cluster) => (
              <CardCluster key={cluster.id} cluster={cluster} />
            ))}
          </div>
        ) : (
          loading === 'loaded' &&
          clusters?.length === 0 && (
            <EmptyState
              dataTestId="empty-state"
              imageWidth="160"
              title="No cluster set"
              description="A cluster is necessary to run your applications with Qovery"
            >
              <ButtonLegacy className="mt-5" link={goToCreateCluster}>
                Add Cluster
              </ButtonLegacy>
            </EmptyState>
          )
        )}
      </div>
      <HelpSection
        description="Need help? You may find these links useful"
        links={[
          {
            link: 'https://hub.qovery.com/docs/using-qovery/configuration/clusters/',
            linkLabel: 'How to configure my cluster',
          },
        ]}
      />
    </div>
  )
}

export default PageClustersGeneral
