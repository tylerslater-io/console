import equal from 'fast-deep-equal'
import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { selectApplicationById } from '@qovery/domains/application'
import { isApplication, isJob } from '@qovery/shared/enums'
import { type ApplicationEntity } from '@qovery/shared/interfaces'
import {
  APPLICATION_SETTINGS_ADVANCED_SETTINGS_URL,
  APPLICATION_SETTINGS_CONFIGURE_URL,
  APPLICATION_SETTINGS_DANGER_ZONE_URL,
  APPLICATION_SETTINGS_DEPLOYMENT_RESTRICTIONS,
  APPLICATION_SETTINGS_DOMAIN_URL,
  APPLICATION_SETTINGS_GENERAL_URL,
  APPLICATION_SETTINGS_HEALTHCHECKS_URL,
  APPLICATION_SETTINGS_PORT_URL,
  APPLICATION_SETTINGS_RESOURCES_URL,
  APPLICATION_SETTINGS_STORAGE_URL,
  APPLICATION_SETTINGS_URL,
  APPLICATION_URL,
} from '@qovery/shared/routes'
import { IconAwesomeEnum } from '@qovery/shared/ui'
import { useDocumentTitle } from '@qovery/shared/util-hooks'
import { type RootState } from '@qovery/state/store'
import { ROUTER_APPLICATION_SETTINGS } from '../../router/router'
import PageSettings from '../../ui/page-settings/page-settings'

export function PageSettingsFeature() {
  const { organizationId = '', projectId = '', environmentId = '', applicationId = '' } = useParams()

  useDocumentTitle('Application - Settings')

  const pathSettings = `${APPLICATION_URL(
    organizationId,
    projectId,
    environmentId,
    applicationId
  )}${APPLICATION_SETTINGS_URL}`

  const application = useSelector<RootState, ApplicationEntity | undefined>(
    (state) => selectApplicationById(state, applicationId),
    equal
  )

  const getLinks = useCallback(() => {
    const links = [
      {
        title: 'General',
        icon: IconAwesomeEnum.WHEEL,
        url: pathSettings + APPLICATION_SETTINGS_GENERAL_URL,
      },
    ]

    if (isJob(application)) {
      links.push({
        title: 'Configure Job',
        icon: IconAwesomeEnum.GEARS,
        url: pathSettings + APPLICATION_SETTINGS_CONFIGURE_URL,
      })
    }

    links.push({
      title: 'Resources',
      icon: IconAwesomeEnum.CHART_BULLET,
      url: pathSettings + APPLICATION_SETTINGS_RESOURCES_URL,
    })

    if (!isJob(application)) {
      links.push(
        {
          title: 'Storage',
          icon: IconAwesomeEnum.HARD_DRIVE,
          url: pathSettings + APPLICATION_SETTINGS_STORAGE_URL,
        },
        {
          title: 'Domain',
          icon: IconAwesomeEnum.EARTH_AMERICAS,
          url: pathSettings + APPLICATION_SETTINGS_DOMAIN_URL,
        },
        {
          title: 'Port',
          icon: IconAwesomeEnum.PLUG,
          url: pathSettings + APPLICATION_SETTINGS_PORT_URL,
        },
        {
          title: 'Health Checks',
          icon: IconAwesomeEnum.SHIELD_CHECK,
          url: pathSettings + APPLICATION_SETTINGS_HEALTHCHECKS_URL,
        }
      )
    }

    if (isApplication(application) || isJob(application)) {
      links.push({
        title: 'Deployment restrictions',
        icon: IconAwesomeEnum.CART_FLATBED,
        url: pathSettings + APPLICATION_SETTINGS_DEPLOYMENT_RESTRICTIONS,
      })
    }

    links.push(
      {
        title: 'Advanced settings',
        icon: IconAwesomeEnum.GEARS,
        url: pathSettings + APPLICATION_SETTINGS_ADVANCED_SETTINGS_URL,
      },
      {
        title: 'Danger zone',
        icon: IconAwesomeEnum.SKULL,
        url: pathSettings + APPLICATION_SETTINGS_DANGER_ZONE_URL,
      }
    )

    return links
  }, [application, pathSettings])

  return (
    <PageSettings links={getLinks()}>
      <Routes>
        {ROUTER_APPLICATION_SETTINGS.map((route) => (
          <Route key={route.path} path={route.path} element={route.component} />
        ))}
        <Route path="*" element={<Navigate replace to={pathSettings + APPLICATION_SETTINGS_GENERAL_URL} />} />
      </Routes>
    </PageSettings>
  )
}

export default PageSettingsFeature
