import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { editCluster, postClusterActionsDeploy, selectClusterById } from '@qovery/domains/organization'
import { type ClusterEntity, type ClusterRemoteData } from '@qovery/shared/interfaces'
import { type AppDispatch, type RootState } from '@qovery/state/store'
import PageSettingsRemote from '../../ui/page-settings-remote/page-settings-remote'

export const handleSubmit = (data: ClusterRemoteData, cluster: ClusterEntity): ClusterEntity => {
  return {
    ...cluster,
    ssh_keys: [data['ssh_key']],
  }
}

export function PageSettingsRemoteFeature() {
  const { organizationId = '', clusterId = '' } = useParams()
  const dispatch = useDispatch<AppDispatch>()

  const [loading, setLoading] = useState(false)

  const methods = useForm<ClusterRemoteData>({
    mode: 'onChange',
  })

  const cluster = useSelector<RootState, ClusterEntity | undefined>((state) => selectClusterById(state, clusterId))

  const onSubmit = methods.handleSubmit((data) => {
    if (data && cluster) {
      setLoading(true)

      const cloneCluster = handleSubmit(data, cluster)

      const toasterCallback = () => {
        if (cluster) {
          dispatch(postClusterActionsDeploy({ organizationId, clusterId }))
        }
      }

      dispatch(
        editCluster({
          organizationId: organizationId,
          clusterId: clusterId,
          data: cloneCluster,
          toasterCallback,
        })
      )
        .unwrap()
        .then(() => setLoading(false))
        .catch(() => setLoading(false))
    }
  })

  useEffect(() => {
    methods.setValue('ssh_key', cluster?.ssh_keys ? cluster.ssh_keys[0] : '')
  }, [methods, cluster?.ssh_keys])

  return (
    <FormProvider {...methods}>
      <PageSettingsRemote onSubmit={onSubmit} loading={loading} />
    </FormProvider>
  )
}

export default PageSettingsRemoteFeature
