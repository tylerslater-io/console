import { getByText, render } from '__tests__/utils/setup-jest'
import { StateEnum } from 'qovery-typescript-axios'
import { clusterFactoryMock } from '@qovery/shared/factories'
import { ClusterButtonsActions, type ClusterButtonsActionsProps } from './cluster-buttons-actions'

const mockCluster = clusterFactoryMock(1)[0]
const props: ClusterButtonsActionsProps = {
  cluster: mockCluster,
}

describe('ClusterButtonsActionsFeature', () => {
  beforeEach(() => {
    mockCluster.status = StateEnum.STOPPED
  })

  it('should render successfully', () => {
    const { baseElement } = render(<ClusterButtonsActions {...props} />)
    expect(baseElement).toBeTruthy()
  })

  it('should render actions for DEPLOYED status', async () => {
    props.cluster.extendedStatus = {
      loadingStatus: 'loaded',
      status: {
        status: StateEnum.DEPLOYED,
      },
    }
    const { baseElement } = render(<ClusterButtonsActions {...props} />)

    getByText(baseElement, 'Update')
    getByText(baseElement, 'Stop')
    getByText(baseElement, 'See audit logs')
    getByText(baseElement, 'Copy identifier')
    getByText(baseElement, 'Delete cluster')
  })

  it('should render actions for STOPPED status', async () => {
    props.cluster.extendedStatus = {
      loadingStatus: 'loaded',
      status: {
        is_deployed: true,
        status: StateEnum.STOPPED,
      },
    }

    const { baseElement } = render(<ClusterButtonsActions {...props} />)

    getByText(baseElement, 'Deploy')
    getByText(baseElement, 'See audit logs')
    getByText(baseElement, 'Copy identifier')
    getByText(baseElement, 'Delete cluster')
  })

  it('should render actions for READY status', async () => {
    props.cluster.extendedStatus = {
      loadingStatus: 'loaded',
      status: {
        is_deployed: false,
        status: StateEnum.READY,
      },
    }

    const { baseElement } = render(<ClusterButtonsActions {...props} />)

    getByText(baseElement, 'Install')
    getByText(baseElement, 'See audit logs')
    getByText(baseElement, 'Copy identifier')
    getByText(baseElement, 'Delete cluster')
  })
})
