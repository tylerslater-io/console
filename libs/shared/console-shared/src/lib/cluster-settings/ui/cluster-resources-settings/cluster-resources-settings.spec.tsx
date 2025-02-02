import { getByLabelText, getByTestId, getByText, queryByTestId, render, waitFor } from '__tests__/utils/setup-jest'
import { wrapWithReactHookForm } from '__tests__/utils/wrap-with-react-hook-form'
import { CloudProviderEnum } from 'qovery-typescript-axios'
import { type ClusterResourcesData } from '@qovery/shared/interfaces'
import ClusterResourcesSettings, { type ClusterResourcesSettingsProps } from './cluster-resources-settings'

describe('ClusterResourcesSettings', () => {
  let defaultValues: ClusterResourcesData
  let props: ClusterResourcesSettingsProps
  beforeEach(() => {
    defaultValues = {
      instance_type: 't2.micro',
      disk_size: 50,
      cluster_type: 'MANAGED',
      nodes: [1, 3],
    }

    props = {
      instanceTypeOptions: [
        {
          label: 't2.micro (1CPU - 1GB RAM)',
          value: 't2.micro',
        },
        {
          label: 't2.small (1CPU - 2GB RAM)',
          value: 't2.small',
        },
        {
          label: 't2.medium (2CPU - 4GB RAM - ARM)',
          value: 't2.medium',
        },
      ],
      clusterTypeOptions: [
        {
          label: 'Managed K8S (EKS)',
          value: 'MANAGED',
        },
        {
          label: 'BETA - Single EC2 (K3S)',
          value: 'SINGLE',
        },
      ],
      fromDetail: false,
      cloudProvider: CloudProviderEnum.AWS,
    }
  })

  it('should render successfully', () => {
    const { baseElement } = render(
      wrapWithReactHookForm<ClusterResourcesData>(<ClusterResourcesSettings />, {
        defaultValues,
      })
    )
    expect(baseElement).toBeTruthy()
  })

  it('should render 2 radios, 1 select, 1 input and 1 slider', () => {
    const { baseElement } = render(
      wrapWithReactHookForm<ClusterResourcesData>(<ClusterResourcesSettings {...props} />, {
        defaultValues,
      })
    )

    getByLabelText(baseElement, 'Managed K8S (EKS)')
    getByLabelText(baseElement, 'BETA - Single EC2 (K3S)')
    getByTestId(baseElement, 'select')
    getByTestId(baseElement, 'input-text')
    getByTestId(baseElement, 'input-slider')
  })

  it('should display min and max nodes', () => {
    const { baseElement } = render(
      wrapWithReactHookForm<ClusterResourcesData>(<ClusterResourcesSettings {...props} />, {
        defaultValues,
      })
    )

    getByText(baseElement, 'min 1 - max 3')
  })

  it('should display banner box', () => {
    const { baseElement } = render(
      wrapWithReactHookForm<ClusterResourcesData>(<ClusterResourcesSettings {...props} />, {
        defaultValues,
      })
    )

    getByTestId(baseElement, 'aws-cost-banner')
  })

  it('should not display banner box in detail mode and for Scaleway', () => {
    props.cloudProvider = CloudProviderEnum.SCW

    const { baseElement } = render(
      wrapWithReactHookForm<ClusterResourcesData>(<ClusterResourcesSettings {...props} fromDetail />, {
        defaultValues,
      })
    )

    expect(queryByTestId(baseElement, 'aws-cost-banner')).toBeNull()
  })

  it('should display warning instance box', async () => {
    const { baseElement } = render(
      wrapWithReactHookForm<ClusterResourcesData>(<ClusterResourcesSettings {...props} />, {
        defaultValues: {
          ...defaultValues,
          instance_type: 't2.medium',
        },
      })
    )

    await waitFor(() => {
      getByTestId(baseElement, 'warning-instance')
    })
  })
})
