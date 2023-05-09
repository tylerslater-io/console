import { Button, ButtonSize, CopyToClipboard, InputText } from '@qovery/shared/ui'

export interface ValueModalProps {
  onClose: () => void
  token: string
}

export function ValueModal(props: ValueModalProps) {
  return (
    <div className="p-6">
      <h2 className="h4 text-text-600 max-w-sm truncate mb-6">You new API Token!</h2>

      <InputText
        name="token"
        label="Token"
        value={props.token}
        disabled
        className="mb-1"
        rightElement={<CopyToClipboard className="text-text-600 text-sm" content={props.token} />}
      />
      <p className="ml-4 text-xs text-text-400">
        <strong className="text-text-500">Please keep this key safe</strong>, you will not be able to retrieve it
        after...
      </p>

      <div className="flex gap-3 justify-end mt-6">
        <Button dataTestId="submit-button" className="btn--no-min-w" onClick={props.onClose} size={ButtonSize.XLARGE}>
          Close
        </Button>
      </div>
    </div>
  )
}

export default ValueModal