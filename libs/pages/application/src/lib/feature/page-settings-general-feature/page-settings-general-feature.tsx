import { useQueryClient } from '@tanstack/react-query'
import { BuildModeEnum, BuildPackLanguageEnum } from 'qovery-typescript-axios'
import { useEffect } from 'react'
import { type FieldValues, FormProvider, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { editApplication, getApplicationsState, postApplicationActionsRedeploy } from '@qovery/domains/application'
import { fetchOrganizationContainerRegistries, selectOrganizationById } from '@qovery/domains/organization'
import { ServiceTypeEnum, getServiceType, isApplication, isContainer, isJob } from '@qovery/shared/enums'
import { type ApplicationEntity, type OrganizationEntity } from '@qovery/shared/interfaces'
import { DEPLOYMENT_LOGS_URL, ENVIRONMENT_LOGS_URL } from '@qovery/shared/routes'
import { toastError } from '@qovery/shared/ui'
import { buildGitRepoUrl } from '@qovery/shared/util-js'
import { type AppDispatch, type RootState } from '@qovery/state/store'
import PageSettingsGeneral from '../../ui/page-settings-general/page-settings-general'

export const handleGitApplicationSubmit = (data: FieldValues, application: ApplicationEntity) => {
  let cloneApplication = Object.assign({}, application)
  cloneApplication.name = data['name']
  cloneApplication.description = data['description']
  cloneApplication.auto_deploy = data['auto_deploy']

  if ('build_mode' in cloneApplication) {
    cloneApplication.build_mode = data['build_mode']

    if (data['build_mode'] === BuildModeEnum.DOCKER) {
      cloneApplication.dockerfile_path = data['dockerfile_path']
      cloneApplication.buildpack_language = null
    } else {
      cloneApplication.buildpack_language = data['buildpack_language']
      cloneApplication.dockerfile_path = null
    }

    const git_repository = {
      url: buildGitRepoUrl(data['provider'], data['repository']),
      branch: data['branch'],
      root_path: data['root_path'],
    }

    cloneApplication.git_repository = git_repository
  }

  cloneApplication = {
    ...cloneApplication,
    arguments: (data['cmd_arguments'] && data['cmd_arguments'].length && eval(data['cmd_arguments'])) || [],
    entrypoint: data['image_entry_point'] || '',
  }

  return cloneApplication
}

export const handleContainerSubmit = (data: FieldValues, application: ApplicationEntity) => {
  return {
    ...application,
    name: data['name'],
    description: data['description'] || '',
    ['auto_deploy']: data['auto_deploy'],
    tag: data['image_tag'] || '',
    image_name: data['image_name'] || '',
    arguments: (data['cmd_arguments'] && data['cmd_arguments'].length && eval(data['cmd_arguments'])) || [],
    entrypoint: data['image_entry_point'] || '',
    registry: { id: data['registry'] || '' },
  }
}

export const handleJobSubmit = (data: FieldValues, application: ApplicationEntity): ApplicationEntity => {
  if (application.source?.docker) {
    const git_repository = {
      url: buildGitRepoUrl(data['provider'], data['repository']),
      branch: data['branch'],
      root_path: data['root_path'],
    }

    return {
      ...application,
      name: data['name'],
      description: data['description'],
      ['auto_deploy']: data['auto_deploy'],
      source: {
        docker: {
          git_repository,
          dockerfile_path: data['dockerfile_path'],
        },
      },
    }
  } else {
    return {
      ...application,
      name: data['name'],
      description: data['description'],
      ['auto_deploy']: data['auto_deploy'],
      source: {
        image: {
          tag: data['image_tag'] || '',
          image_name: data['image_name'] || '',
          registry_id: data['registry'] || '',
        },
      },
    }
  }
}

export function PageSettingsGeneralFeature() {
  const { organizationId = '', projectId = '', environmentId = '', applicationId = '' } = useParams()
  const queryClient = useQueryClient()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const application = useSelector<RootState, ApplicationEntity | undefined>(
    (state) => getApplicationsState(state).entities[applicationId],
    (a, b) =>
      a?.name === b?.name &&
      a?.description === b?.description &&
      a?.build_mode === b?.build_mode &&
      a?.buildpack_language === b?.buildpack_language &&
      a?.dockerfile_path === b?.dockerfile_path
  )

  const organization = useSelector<RootState, OrganizationEntity | undefined>((state) =>
    selectOrganizationById(state, organizationId)
  )
  const loadingStatus = useSelector((state: RootState) => getApplicationsState(state).loadingStatus)

  const methods = useForm({
    mode: 'onChange',
  })

  const watchBuildMode = methods.watch('build_mode')

  const toasterCallback = () => {
    if (application) {
      dispatch(
        postApplicationActionsRedeploy({
          applicationId,
          environmentId,
          serviceType: getServiceType(application),
          callback: () =>
            navigate(
              ENVIRONMENT_LOGS_URL(organizationId, projectId, environmentId) + DEPLOYMENT_LOGS_URL(applicationId)
            ),
        })
      )
    }
  }

  const onSubmit = methods.handleSubmit((data) => {
    if (data && application) {
      let cloneApplication: Omit<ApplicationEntity, 'registry'> & { registry?: { id?: string } }
      if (isApplication(application)) {
        cloneApplication = handleGitApplicationSubmit(data, application)
      } else if (isJob(application)) {
        cloneApplication = handleJobSubmit(data, application)
      } else {
        try {
          cloneApplication = handleContainerSubmit(data, application)
        } catch (e: unknown) {
          toastError(e as Error, 'Invalid CMD array')
          return
        }
      }

      dispatch(
        editApplication({
          applicationId: applicationId,
          data: cloneApplication,
          serviceType: getServiceType(application),
          toasterCallback,
          queryClient,
        })
      )
    }
  })

  useEffect(() => {
    if (!application) return

    if (isApplication(application)) {
      if (watchBuildMode === BuildModeEnum.DOCKER) {
        methods.setValue('dockerfile_path', application.dockerfile_path ? application.dockerfile_path : 'Dockerfile')
      } else {
        methods.setValue(
          'buildpack_language',
          application.buildpack_language ? application.buildpack_language : BuildPackLanguageEnum.PYTHON
        )
      }
    }
  }, [watchBuildMode, methods, application])

  useEffect(() => {
    methods.setValue('name', application?.name)
    methods.setValue('description', application?.description)
    methods.setValue('auto_deploy', application?.auto_deploy)

    if (application) {
      if (isApplication(application)) {
        methods.setValue('build_mode', application.build_mode)
        methods.setValue(
          'buildpack_language',
          application.buildpack_language ? application.buildpack_language : BuildPackLanguageEnum.PYTHON
        )
        methods.setValue('dockerfile_path', application.dockerfile_path ? application.dockerfile_path : 'Dockerfile')
      }

      if (isContainer(application)) {
        methods.setValue('registry', application.registry?.id)
        methods.setValue('image_name', application.image_name)
        methods.setValue('image_tag', application.tag)
        methods.unregister('buildpack_language')
        methods.unregister('dockerfile_path')

        methods.unregister('build_mode')

        dispatch(fetchOrganizationContainerRegistries({ organizationId }))
      }

      methods.setValue('image_entry_point', application.entrypoint)
      methods.setValue(
        'cmd_arguments',
        application.arguments && application.arguments?.length ? JSON.stringify(application.arguments) : ''
      )
    }

    if (isJob(application)) {
      methods.setValue('description', application?.description)

      const serviceType = application?.source?.docker ? ServiceTypeEnum.APPLICATION : ServiceTypeEnum.CONTAINER
      methods.setValue('serviceType', serviceType)

      if (serviceType === ServiceTypeEnum.CONTAINER) {
        dispatch(fetchOrganizationContainerRegistries({ organizationId }))

        methods.setValue('registry', application?.source?.image?.registry_id)
        methods.setValue('image_name', application?.source?.image?.image_name)
        methods.setValue('image_tag', application?.source?.image?.tag)
      } else {
        methods.setValue('build_mode', BuildModeEnum.DOCKER)
        methods.setValue('dockerfile_path', application?.source?.docker?.dockerfile_path)
      }
    }
  }, [methods, application, dispatch, organizationId])

  return (
    <FormProvider {...methods}>
      <PageSettingsGeneral
        onSubmit={onSubmit}
        watchBuildMode={watchBuildMode}
        loading={loadingStatus === 'loading'}
        type={application && getServiceType(application)}
        organization={organization}
      />
    </FormProvider>
  )
}

export default PageSettingsGeneralFeature
