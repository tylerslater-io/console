import { act, render, waitFor } from '__tests__/utils/setup-jest'
import { CloudProviderEnum } from 'qovery-typescript-axios'
import { type ReactNode } from 'react'
import selectEvent from 'react-select-event'
import { ClusterContainerCreateContext } from '../page-clusters-create-feature'
import StepFeaturesFeature from './step-features-feature'

const mockSetFeaturesData = jest.fn()
const mockNavigate = jest.fn()

const mockFeatures = [
  {
    id: 'STATIC_IP',
    title: 'feature-1',
    cost_per_month: 23,
    value: 'my-value',
    accepted_values: ['test', 'my-value'],
  },
]

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ organizationId: '1' }),
  useNavigate: () => mockNavigate,
}))

const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}))

jest.mock('@qovery/domains/organization', () => {
  return {
    ...jest.requireActual('@qovery/domains/organization'),
    fetchClusterFeatures: () => ({
      results: mockFeatures,
    }),
  }
})

const ContextWrapper = (props: { children: ReactNode }) => {
  return (
    <ClusterContainerCreateContext.Provider
      value={{
        currentStep: 1,
        setCurrentStep: jest.fn(),
        featuresData: undefined,
        generalData: {
          name: 'test',
          production: false,
          cloud_provider: CloudProviderEnum.AWS,
          region: 'Paris',
          credentials: '111-111-111',
          credentials_name: 'name',
        },
        setGeneralData: jest.fn(),
        setFeaturesData: mockSetFeaturesData,
        resourcesData: undefined,
        setResourcesData: jest.fn(),
        remoteData: undefined,
        setRemoteData: jest.fn(),
      }}
    >
      <StepFeaturesFeature />
    </ClusterContainerCreateContext.Provider>
  )
}

describe('StepFeaturesFeature', () => {
  beforeEach(() => {
    mockDispatch.mockImplementation(() => ({
      unwrap: () =>
        Promise.resolve({
          results: mockFeatures,
        }),
    }))
  })

  it('should render successfully', () => {
    const { baseElement } = render(
      <ContextWrapper>
        <StepFeaturesFeature />
      </ContextWrapper>
    )
    expect(baseElement).toBeTruthy()
  })

  it('should submit form and navigate', async () => {
    const { getByTestId, getByLabelText } = render(
      <ContextWrapper>
        <StepFeaturesFeature />
      </ContextWrapper>
    )

    await waitFor(() => {
      const feature = getByTestId('feature')
      feature.click()
    })

    const selectMenu = getByLabelText('VPC Subnet address')
    await selectEvent.select(selectMenu, mockFeatures[0].accepted_values[0], {
      container: document.body,
    })

    const button = getByTestId('button-submit')
    expect(button).not.toBeDisabled()

    await act(() => {
      button.click()
    })

    const STATIC_IP = 'STATIC_IP'

    expect(mockSetFeaturesData).toHaveBeenCalledWith({
      [STATIC_IP]: {
        title: 'feature-1',
        value: true,
        extendedValue: 'test',
      },
    })

    expect(mockNavigate).toHaveBeenCalledWith('/organization/1/clusters/create/summary')
  })
})
