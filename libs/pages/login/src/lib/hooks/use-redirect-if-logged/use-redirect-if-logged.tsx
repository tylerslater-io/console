import { useGTMDispatch } from '@elgorditosalsero/react-gtm-hook'
import { type Organization, type Project } from 'qovery-typescript-axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchOrganization } from '@qovery/domains/organization'
import { fetchProjects } from '@qovery/domains/projects'
import { fetchUserSignUp } from '@qovery/domains/users/data-access'
import { useAuth } from '@qovery/shared/auth'
import {
  ONBOARDING_PERSONALIZE_URL,
  ONBOARDING_PROJECT_URL,
  ONBOARDING_URL,
  ORGANIZATION_URL,
  OVERVIEW_URL,
} from '@qovery/shared/routes'
import { type AppDispatch } from '@qovery/state/store'
import {
  getCurrentOrganizationIdFromStorage,
  getCurrentProjectIdFromStorage,
  getRedirectLoginUriFromStorage,
} from './utils/utils'

export function useRedirectIfLogged() {
  const navigate = useNavigate()
  const { createAuthCookies, checkIsAuthenticated, user } = useAuth()
  const dispatch = useDispatch<AppDispatch>()
  const sendDataToGTM = useGTMDispatch()

  useEffect(() => {
    async function fetchData() {
      let organization: Organization[] = []

      try {
        organization = await dispatch(fetchOrganization()).unwrap()
      } catch (e) {
        console.warn(e)
      }

      await createAuthCookies()

      if (organization.length > 0) {
        const organizationId = organization[0].id
        const projects: Project[] = await dispatch(fetchProjects({ organizationId })).unwrap()
        if (projects.length > 0) navigate(OVERVIEW_URL(organizationId, projects[0].id))
        else navigate(ORGANIZATION_URL(organizationId))
      } else {
        const userSignUp = await dispatch(fetchUserSignUp()).unwrap()
        if (userSignUp.dx_auth) {
          navigate(ONBOARDING_URL + ONBOARDING_PROJECT_URL)
        } else {
          sendDataToGTM({ event: 'new_signup', value: user?.email })
          navigate(ONBOARDING_URL + ONBOARDING_PERSONALIZE_URL)
        }
      }
    }

    if (checkIsAuthenticated) {
      const currentOrganization = getCurrentOrganizationIdFromStorage()
      const currentProject = getCurrentProjectIdFromStorage()
      const redirectLoginUri = getRedirectLoginUriFromStorage()

      if (redirectLoginUri) {
        navigate(redirectLoginUri)
        localStorage.removeItem('redirectLoginUri')
        return
      }

      if (currentOrganization && currentProject) {
        navigate(OVERVIEW_URL(currentOrganization, currentProject))
        return
      }

      fetchData()
    }
  }, [navigate, checkIsAuthenticated, createAuthCookies, dispatch, sendDataToGTM, user?.email])
}

export default useRedirectIfLogged
