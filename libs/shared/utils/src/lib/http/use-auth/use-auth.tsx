import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useAuth0 } from '@auth0/auth0-react'
import { userActions, UserInterface } from '@console/domains/user'

export function useAuth() {
  const { loginWithPopup, logout, user, getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0()
  const dispatch = useDispatch()

  /**
   * Authentification login
   * Gitlab uppercase is needed
   */
  const authLogin = useCallback(
    (provider: string) => {
      return loginWithPopup({
        connection: provider,
        login: 'login',
      })
    },
    [loginWithPopup]
  )

  /**
   * Authentification logout
   */
  const authLogout = useCallback(async () => {
    dispatch(userActions.remove())
    return await logout({
      returnTo: window.location.origin,
    })
  }, [logout, dispatch])

  /**
   * Get current user with auth0
   */
  const getCurrentUser = useCallback(async () => {
    try {
      const token = await getAccessTokenSilently()

      if (user) {
        const userInfos: UserInterface = {
          name: user.name,
          email: user.email,
          sub: user.sub,
          picture: user.picture,
          isAuthenticated,
          isLoading,
          token,
        }
        dispatch(userActions.add(userInfos))
      }
    } catch (e) {
      console.log(e)
    }
  }, [user, getAccessTokenSilently, dispatch, isLoading, isAuthenticated])

  /**
   * Create authentification cookies
   */
  const createAuthCookies = useCallback(async () => {
    const currentToken = localStorage.getItem(
      '@@auth0spajs@@::S4fQF5rkTng8CqHsc1kw41fG09u4R7A0::https://core.qovery.com::openid profile email offline_access'
    )

    function setCookie(name: string, value: string, days: number) {
      let expires = ''
      if (days) {
        const date = new Date()
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
        expires = '; expires=' + date.toUTCString()
      }
      document.cookie = name + '=' + (value || '') + expires + '; path=/'
    }

    const data = currentToken && JSON.parse(currentToken)

    setCookie('jwtToken', data.body.access_token, 100000)
    setCookie('idToken', data.body.id_token, 100000)
  }, [])

  return {
    authLogin,
    authLogout,
    getCurrentUser,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
    createAuthCookies,
  }
}

export default useAuth
