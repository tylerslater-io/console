import {
  OrganizationEventOrigin,
  type OrganizationEventResponse,
  OrganizationEventTargetType,
  OrganizationEventType,
} from 'qovery-typescript-axios'
import { Link, useParams } from 'react-router-dom'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dark } from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import { match } from 'ts-pattern'
import { IconEnum } from '@qovery/shared/enums'
import {
  APPLICATION_URL,
  CLUSTER_SETTINGS_URL,
  CLUSTER_URL,
  DATABASE_GENERAL_URL,
  DATABASE_URL,
  SERVICES_URL,
  SETTINGS_CONTAINER_REGISTRIES_URL,
  SETTINGS_MEMBERS_URL,
  SETTINGS_PROJECT_GENERAL_URL,
  SETTINGS_PROJECT_URL,
  SETTINGS_URL,
  SETTINGS_WEBHOOKS,
} from '@qovery/shared/routes'
import { Badge, Icon, IconAwesomeEnum, Skeleton, Tooltip } from '@qovery/shared/ui'
import { dateYearMonthDayHourMinuteSecond } from '@qovery/shared/util-dates'
import { upperCaseFirstLetter } from '@qovery/shared/util-js'
import CopyButton from '../copy-button/copy-button'

export interface RowEventProps {
  event: OrganizationEventResponse
  expanded: boolean
  columnsWidth: string
  setExpanded: (expanded: boolean) => void
  isPlaceholder?: boolean
}

export const getSourceIcon = (origin?: OrganizationEventOrigin) => {
  switch (origin) {
    case OrganizationEventOrigin.GIT:
      return <Icon name={IconAwesomeEnum.CODE_BRANCH} />
    case OrganizationEventOrigin.CONSOLE:
      return <Icon name={IconAwesomeEnum.BROWSER} />
    case OrganizationEventOrigin.QOVERY_INTERNAL:
      return <Icon name={IconAwesomeEnum.WAVE_PULSE} />
    case OrganizationEventOrigin.API:
      return <Icon name={IconAwesomeEnum.CLOUD_ARROW_UP} />
    case OrganizationEventOrigin.CLI:
      return <Icon name={IconAwesomeEnum.TERMINAL} />
    case OrganizationEventOrigin.TERRAFORM_PROVIDER:
      return <Icon name={IconEnum.TERRAFORM} width="12" />
    default:
      return null
  }
}

export function RowEvent(props: RowEventProps) {
  const { event, expanded, setExpanded, isPlaceholder, columnsWidth } = props
  const { organizationId = '' } = useParams()

  const renderLink = (targetType: OrganizationEventTargetType) => {
    const { event_type, target_name, project_id, environment_id, target_id } = event

    const customLink = (url: string, content = target_name) => (
      <Link className="truncate cursor-pointer hover:text-neutral-350 transition" to={url}>
        {content}
      </Link>
    )

    const generateApplicationLink = () =>
      customLink(`${APPLICATION_URL(organizationId, project_id!, environment_id!, target_id!)}`)

    const linkConfig: { [key in OrganizationEventTargetType]: () => JSX.Element } = {
      [OrganizationEventTargetType.APPLICATION]: generateApplicationLink,
      [OrganizationEventTargetType.CONTAINER]: generateApplicationLink,
      [OrganizationEventTargetType.JOB]: generateApplicationLink,
      [OrganizationEventTargetType.ORGANIZATION]: () => customLink(SETTINGS_URL(organizationId)),
      [OrganizationEventTargetType.MEMBERS_AND_ROLES]: () =>
        customLink(SETTINGS_URL(organizationId) + SETTINGS_MEMBERS_URL),
      [OrganizationEventTargetType.PROJECT]: () =>
        customLink(SETTINGS_URL(organizationId) + SETTINGS_PROJECT_URL(target_id!) + SETTINGS_PROJECT_GENERAL_URL),
      [OrganizationEventTargetType.ENVIRONMENT]: () =>
        customLink(SERVICES_URL(organizationId, project_id!, target_id!), target_name),
      [OrganizationEventTargetType.DATABASE]: () =>
        customLink(DATABASE_URL(organizationId, project_id!, environment_id!, target_id!) + DATABASE_GENERAL_URL),
      [OrganizationEventTargetType.CLUSTER]: () =>
        customLink(CLUSTER_URL(organizationId, target_id!) + CLUSTER_SETTINGS_URL),
      [OrganizationEventTargetType.WEBHOOK]: () => customLink(SETTINGS_URL(organizationId) + SETTINGS_WEBHOOKS),
      [OrganizationEventTargetType.CONTAINER_REGISTRY]: () =>
        customLink(SETTINGS_URL(organizationId) + SETTINGS_CONTAINER_REGISTRIES_URL),
    }

    if (event_type !== OrganizationEventType.DELETE) {
      return linkConfig[targetType]()
    } else {
      return <span className="truncate">{target_name}</span>
    }
  }

  const badge = match(event.event_type)
    .with(OrganizationEventType.ACCEPT, () => (
      <Badge size="xs" color="green">
        Accept <Icon name={IconAwesomeEnum.CHECK} className="ml-1" />
      </Badge>
    ))
    .with(OrganizationEventType.CREATE, () => (
      <Badge size="xs" color="green">
        Create <Icon name={IconAwesomeEnum.CHECK} className="ml-1" />
      </Badge>
    ))
    .with(OrganizationEventType.DELETE, () => (
      <Badge size="xs" color="neutral">
        Delete <Icon name={IconAwesomeEnum.ERASER} className="ml-1" />
      </Badge>
    ))
    .with(OrganizationEventType.UPDATE, () => (
      <Badge size="xs" color="sky">
        Update <Icon name={IconAwesomeEnum.ROTATE} className="ml-1" />
      </Badge>
    ))
    .with(OrganizationEventType.TRIGGER_CANCEL, () => (
      <Badge size="xs" color="neutral">
        Trigger Cancel <Icon name={IconAwesomeEnum.XMARK} className="ml-1" />
      </Badge>
    ))
    .with(OrganizationEventType.TRIGGER_DELETE, () => (
      <Badge size="xs" color="neutral">
        Trigger Delete <Icon name={IconAwesomeEnum.ERASER} className="ml-1" />
      </Badge>
    ))
    .with(OrganizationEventType.TRIGGER_DEPLOY, () => (
      <Badge size="xs" color="neutral">
        Trigger Deploy <Icon name={IconAwesomeEnum.CHECK} className="ml-1" />
      </Badge>
    ))
    .with(OrganizationEventType.TRIGGER_REDEPLOY, () => (
      <Badge size="xs" color="neutral">
        Trigger Redeploy <Icon name={IconAwesomeEnum.CHECK} className="ml-1" />
      </Badge>
    ))
    .with(OrganizationEventType.TRIGGER_STOP, () => (
      <Badge size="xs" color="sky">
        Trigger Stop <Icon name={IconAwesomeEnum.XMARK} className="ml-1" />
      </Badge>
    ))
    .with(OrganizationEventType.TRIGGER_RESTART, () => (
      <Badge size="xs" color="sky">
        Trigger Restart <Icon name={IconAwesomeEnum.ROTATE_RIGHT} className="ml-1" />
      </Badge>
    ))
    .otherwise(() => '-')

  return (
    <>
      <div
        data-testid="row-event"
        className="grid h-11 py-2.5 items-center text-xs text-neutral-400 font-medium border-b-neutral-200 border-b hover:bg-neutral-100 last:border-b-0"
        style={{ gridTemplateColumns: columnsWidth }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="px-4 flex gap-3">
          <Skeleton height={16} width={120} show={isPlaceholder}>
            <div className="flex gap-3">
              <Icon
                name={IconAwesomeEnum.ANGLE_DOWN}
                className={`text-xs cursor-pointer block ${expanded ? 'rotate-180' : ''}`}
              />
              <Tooltip content={dateYearMonthDayHourMinuteSecond(new Date(event.timestamp || ''))}>
                <span className="truncate">{dateYearMonthDayHourMinuteSecond(new Date(event.timestamp || ''))}</span>
              </Tooltip>
            </div>
          </Skeleton>
        </div>
        <div className="px-4" data-testid="tag">
          <Skeleton height={16} width={80} show={isPlaceholder}>
            {badge}
          </Skeleton>
        </div>
        <div className="px-4">
          <Skeleton height={16} width={80} show={isPlaceholder}>
            <>{upperCaseFirstLetter(event.target_type)}</>
          </Skeleton>
        </div>
        <div className="px-4">
          <Skeleton height={16} width={80} show={isPlaceholder}>
            <Tooltip
              content={
                <div>
                  {event.project_name && (
                    <span>
                      Project: {event.project_name} <br />
                    </span>
                  )}
                  {event.environment_name && (
                    <span>
                      Environment: {event.environment_name} <br />
                    </span>
                  )}
                  Target: {event.target_name}
                </div>
              }
            >
              {event.target_type && renderLink(event.target_type)}
            </Tooltip>
          </Skeleton>
        </div>
        <div className="px-4">
          <Skeleton height={16} width={80} show={isPlaceholder}>
            <span className="truncate">{upperCaseFirstLetter(event.sub_target_type ?? '')?.replace('_', ' ')}</span>
          </Skeleton>
        </div>
        <div className="px-4">
          <Skeleton height={16} width={80} show={isPlaceholder}>
            <Tooltip content={event.triggered_by || ''}>
              <span className="truncate">{event.triggered_by}</span>
            </Tooltip>
          </Skeleton>
        </div>
        <div className="px-4">
          <Skeleton height={16} width={80} show={isPlaceholder}>
            <div className="truncate">
              <span className="inline-block text-neutral-400 mr-1.5">{getSourceIcon(event.origin)}</span>
              {upperCaseFirstLetter(event.origin)?.replace('_', ' ')}
            </div>
          </Skeleton>
        </div>
      </div>
      {expanded && (
        <div className="relative bg-neutral-700 max-h-[388px] overflow-y-auto" data-testid="expanded-panel">
          <div className="sticky top-[0px] flex items-center h-7 px-4 bg-neutral-550 text-neutral-100 text-xs z-[1]">
            Object Status after request (here you can find the JSON returned by our API)
          </div>
          <div className="flex justify-end sticky top-9 z-[1]">
            <CopyButton className="mr-7" content={event.change || ''} />
          </div>
          <SyntaxHighlighter
            language="json"
            style={dark}
            customStyle={{
              padding: '1rem',
              borderRadius: '0.25rem',
              backgroundColor: 'transparent',
              fontSize: '12px',
              position: 'relative',
              top: '-12px',
              height: 'calc(100% - 12px)',
              zIndex: 0,
            }}
            wrapLines
          >
            {JSON.stringify(JSON.parse(event.change || ''), null, 2)}
          </SyntaxHighlighter>
        </div>
      )}
    </>
  )
}

export default RowEvent
