import { type SignUpRequest } from 'qovery-typescript-axios'
import { type Dispatch, type SetStateAction, useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { postUserSignUp, selectUser, selectUserSignUp } from '@qovery/domains/users/data-access'
import { useAuth } from '@qovery/shared/auth'
import { ONBOARDING_MORE_URL, ONBOARDING_URL } from '@qovery/shared/routes'
import { type AppDispatch } from '@qovery/state/store'
import { StepPersonalize } from '../../ui/step-personalize/step-personalize'
import { ContextOnboarding } from '../container/container'

const dataTypes = [
  {
    label: 'Personal',
    value: 'personal',
  },
  {
    label: 'Work',
    value: 'work',
  },
  {
    label: 'School',
    value: 'school',
  },
]

export interface FormUserProps {
  setStepCompany: Dispatch<SetStateAction<boolean>>
}

export function FormUser(props: FormUserProps) {
  const { setStepCompany } = props
  const navigate = useNavigate()
  const user = useSelector(selectUser)
  const userSignUp = useSelector(selectUserSignUp)
  const dispatch = useDispatch<AppDispatch>()
  const { authLogout } = useAuth()
  const { handleSubmit, control, setValue } =
    useForm<Pick<SignUpRequest, 'first_name' | 'last_name' | 'user_email' | 'type_of_use'>>()
  const { organization_name, project_name, setContextValue } = useContext(ContextOnboarding)

  useEffect(() => {
    const { email, name } = user

    // adding default values by oAuth
    if (name && email) {
      setValue('first_name', userSignUp.first_name ? userSignUp.first_name : name?.split(' ')[0])
      setValue('last_name', userSignUp.last_name ? userSignUp.last_name : name?.split(' ')[1])
      setValue('user_email', userSignUp.user_email ? userSignUp.user_email : email)
      setValue('type_of_use', userSignUp.type_of_use)
    }
  }, [user, setValue, userSignUp])

  const onSubmit = handleSubmit(async (data) => {
    if (data) {
      const checkIfCompany = data['type_of_use'].toLowerCase() === 'work'
      if (checkIfCompany) {
        setStepCompany(true)

        await dispatch(
          postUserSignUp({
            ...userSignUp,
            ...data,
          })
        )
      } else {
        navigate(`${ONBOARDING_URL}${ONBOARDING_MORE_URL}`)

        const resetCompany = {
          company_name: undefined,
          company_size: undefined,
          user_role: undefined,
        }

        setContextValue &&
          setContextValue({
            organization_name,
            project_name,
            admin_email: data['user_email'],
          })

        await dispatch(postUserSignUp({ ...userSignUp, ...data, ...resetCompany }))
      }
    }
  })

  return <StepPersonalize dataTypes={dataTypes} onSubmit={onSubmit} control={control} authLogout={authLogout} />
}

export default FormUser
