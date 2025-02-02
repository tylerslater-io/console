import { act, render } from '__tests__/utils/setup-jest'
import { type SignUp } from 'qovery-typescript-axios'
import { organizationFactoryMock, userSignUpFactoryMock } from '@qovery/shared/factories'
import { type OrganizationEntity } from '@qovery/shared/interfaces'
import { LOGOUT_URL, ORGANIZATION_URL } from '@qovery/shared/routes'
import { sortByKey } from '@qovery/shared/util-js'
import MenuAccount, { type MenuAccountProps } from './menu-account'

const mockNavigate = jest.fn()
const mockOrganizations: OrganizationEntity[] = organizationFactoryMock(2)
const mockUser: SignUp = userSignUpFactoryMock()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

describe('MenuAccount', () => {
  const props: MenuAccountProps = {
    organizations: mockOrganizations,
    currentOrganization: mockOrganizations[0],
    user: mockUser,
  }

  it('should render successfully', () => {
    const { baseElement } = render(<MenuAccount {...props} />)

    expect(baseElement).toBeTruthy()
  })

  it('should have a active organization on the menu', async () => {
    const { getByTestId } = render(<MenuAccount {...props} />)

    const item = getByTestId('content-0')

    expect(item.textContent).toBe(props.currentOrganization.name)
  })

  it('should have navigate to organization', async () => {
    const { getAllByTestId } = render(<MenuAccount {...props} />)

    const items = getAllByTestId('menuItem')

    await act(() => {
      items[1]?.click()
    })

    const sortedOrganizations = sortByKey(mockOrganizations)

    expect(items[1]?.textContent).toBe(sortedOrganizations[1].name)
    expect(mockNavigate).toHaveBeenCalledWith(ORGANIZATION_URL(sortedOrganizations[1].id))
  })

  it('should have navigate to logout', async () => {
    const { getAllByTestId } = render(<MenuAccount {...props} />)

    const items = getAllByTestId('menuItem')

    await act(() => {
      // 3 is menu for logout
      items[3]?.click()
    })

    expect(mockNavigate).toHaveBeenCalledWith(LOGOUT_URL)
  })
})
