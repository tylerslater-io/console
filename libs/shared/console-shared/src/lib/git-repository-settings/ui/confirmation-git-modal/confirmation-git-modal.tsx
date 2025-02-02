import { GitProviderEnum } from 'qovery-typescript-axios'
import {
  BannerBox,
  BannerBoxEnum,
  ButtonLegacy,
  ButtonLegacySize,
  ButtonLegacyStyle,
  Icon,
  IconAwesomeEnum,
} from '@qovery/shared/ui'

export interface ConfirmationGitModalProps {
  currentAuthProvider?: string
  onSubmit?: () => void
  onClose: () => void
}

export function ConfirmationGitModal(props: ConfirmationGitModalProps) {
  return (
    <div className="p-6">
      <h2 className="h4 text-neutral-400 max-w-sm truncate mb-6">Change repository</h2>
      <BannerBox
        className="mb-5"
        type={BannerBoxEnum.WARNING}
        title="Access to the current repository"
        message="If you do not have access to the current repository, you will not be able to select it again after modification."
        icon={IconAwesomeEnum.CIRCLE_INFO}
      />
      <div className="relative flex w-full h-[52px] px-4 py-2 border rounded">
        <Icon name={GitProviderEnum.GITHUB} className="mr-3 w-4 h-4 mt-[10px]" width="16px" height="16px" />
        <div className="relative -top-[6px]">
          <span data-testid="auth-provider-name" className="text-xs text-neutral-400">
            {props.currentAuthProvider?.split(' ')[0]}
          </span>
          <p data-testid="auth-provider-owner" className="text-sm text-neutral-400 relative -top-1">
            {props.currentAuthProvider?.split(' ')[1].replace('(', '').replace(')', '')}
          </p>
        </div>
        <Icon name={IconAwesomeEnum.TRIANGLE_EXCLAMATION} className="absolute top-3 right-4 text-yellow-500" />
      </div>
      <div className="flex gap-3 justify-end mt-6">
        <ButtonLegacy
          dataTestId="cancel-button"
          className="btn--no-min-w"
          style={ButtonLegacyStyle.STROKED}
          size={ButtonLegacySize.XLARGE}
          onClick={() => props.onClose()}
        >
          Cancel
        </ButtonLegacy>
        <ButtonLegacy
          dataTestId="submit-button"
          size={ButtonLegacySize.XLARGE}
          onClick={() => {
            props.onSubmit && props.onSubmit()
            props.onClose()
          }}
        >
          I understand
        </ButtonLegacy>
      </div>
    </div>
  )
}

export default ConfirmationGitModal
