import { type Cluster, type ProjectDeploymentRuleRequest, type Value } from 'qovery-typescript-axios'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchClusters, selectClustersEntitiesByOrganizationId } from '@qovery/domains/organization'
import { postDeploymentRule } from '@qovery/domains/projects'
import { weekdaysValues } from '@qovery/shared/enums'
import { ENVIRONMENTS_DEPLOYMENT_RULES_URL, ENVIRONMENTS_URL } from '@qovery/shared/routes'
import { useDocumentTitle } from '@qovery/shared/util-hooks'
import { type AppDispatch, type RootState } from '@qovery/state/store'
import PageCreateEditDeploymentRule from '../../ui/page-create-edit-deployment-rule/page-create-edit-deployment-rule'

export function PageCreateDeploymentRuleFeature() {
  const { organizationId = '', projectId = '' } = useParams()
  useDocumentTitle('Create Deployment Rule - Qovery')

  const { control, handleSubmit, setValue } = useForm()

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const clusters = useSelector<RootState, Cluster[]>((state) =>
    selectClustersEntitiesByOrganizationId(state, organizationId)
  )

  useEffect(() => {
    dispatch(fetchClusters({ organizationId }))

    setValue('timezone', 'UTC')
    setValue('start_time', '08:00')
    setValue('stop_time', '19:00')
    setValue('mode', 'PRODUCTION')
    setValue('auto_stop', false)
    setValue('weekdays', weekdaysValues)
  }, [setValue, dispatch, organizationId])

  const onSubmit = handleSubmit((data) => {
    if (data) {
      const fields = data as ProjectDeploymentRuleRequest
      fields.start_time = `1970-01-01T${fields.start_time}:00.000Z`
      fields.stop_time = `1970-01-01T${fields.stop_time}:00.000Z`
      fields.weekdays = data['weekdays'][0].value ? data['weekdays'].map((day: Value) => day.value) : data['weekdays']

      dispatch(postDeploymentRule({ projectId, data: fields }))
        .unwrap()
        .then(() => {
          navigate(`${ENVIRONMENTS_URL(organizationId, projectId)}${ENVIRONMENTS_DEPLOYMENT_RULES_URL}`)
        })
        .catch((e) => console.error(e))
    }
  })

  return <PageCreateEditDeploymentRule title="Create rule" control={control} clusters={clusters} onSubmit={onSubmit} />
}

export default PageCreateDeploymentRuleFeature
