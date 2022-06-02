import { StateEnum } from 'qovery-typescript-axios'
import { upperCaseFirstLetter } from '@console/shared/utils'
import { IconEnum } from '@console/shared/enums'
import { Icon } from '@console/shared/ui'

export interface StatusLabelProps {
  status: StateEnum | undefined
  className?: string
}

export function StatusLabel(props: StatusLabelProps) {
  const { status, className = '' } = props

  function showProgressIcon(): boolean {
    switch (status) {
      case StateEnum.BUILDING:
        return true
      case StateEnum.STOPPING:
        return true
      case StateEnum.DEPLOYING:
        return true
      case StateEnum.DELETING:
        return true
      default:
        return false
    }
  }

  // function showSpinnerIcon(): boolean {
  //   switch (status) {
  //     case StateEnum.STOP_QUEUED:
  //       return true
  //     case StateEnum.QUEUED:
  //       return true
  //     case StateEnum.DELETE_QUEUED:
  //       return true
  //     default:
  //       return false
  //   }
  // }

  function showErrorIcon(): boolean {
    switch (status) {
      case StateEnum.DEPLOYMENT_ERROR:
        return true
      case StateEnum.STOP_ERROR:
        return true
      case StateEnum.DELETE_ERROR:
        return true
      default:
        return false
    }
  }

  return (
    <span
      className={`flex items-center px-2.5 h-7 border border-element-lighter-500 rounded-full text-text-500 text-xs font-medium truncate ${className}`}
      data-testid="status-label"
    >
      {showProgressIcon() && <Icon name={IconEnum.PROGRESS} width="12" viewBox="0 0 12 12" className="mr-2" />}
      {upperCaseFirstLetter(status?.replace('_', ' ').toLowerCase())}
      {showErrorIcon() && <Icon name={IconEnum.ERROR} width="12" viewBox="0 0 14 14" className="ml-1" />}
    </span>
  )
}

export default StatusLabel
