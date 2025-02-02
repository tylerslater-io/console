import { Controller, useFormContext } from 'react-hook-form'
import { ButtonLegacy, ButtonLegacySize, ButtonLegacyStyle, InputText, useModal } from '@qovery/shared/ui'

export interface DeployOtherTagModalProps {
  serviceName?: string
  onSubmit: () => void
  isLoading: boolean
}

export function DeployOtherTagModal(props: DeployOtherTagModalProps) {
  const { serviceName = 'application service', onSubmit, isLoading } = props
  const { closeModal } = useModal()
  const { control, formState } = useFormContext()

  return (
    <div className="p-6">
      <h2 className="h4 text-neutral-400 max-w-sm truncate mb-1">Deploy another version</h2>
      <p className="mb-2 text-neutral-350 text-sm">Select the tag you want to deploy.</p>
      <p className="mb-6 text-neutral-400 text-sm">
        For <strong className="font-medium">{serviceName}</strong>
      </p>

      <form onSubmit={onSubmit}>
        <Controller
          name="tag"
          control={control}
          rules={{
            required: 'Please enter a tag',
          }}
          render={({ field, fieldState: { error } }) => (
            <InputText
              className="mb-6"
              name={field.name}
              onChange={field.onChange}
              value={field.value}
              error={error?.message}
              label="Tag"
              type="text"
            />
          )}
        />
      </form>
      <div className="flex gap-3 justify-end -mb-6 py-6 bg-white sticky bottom-0">
        <ButtonLegacy
          dataTestId="cancel-button"
          className="btn--no-min-w"
          style={ButtonLegacyStyle.STROKED}
          size={ButtonLegacySize.XLARGE}
          onClick={() => closeModal()}
        >
          Cancel
        </ButtonLegacy>
        <ButtonLegacy
          dataTestId="submit-button"
          disabled={!formState.isValid}
          className="btn--no-min-w"
          type="submit"
          size={ButtonLegacySize.XLARGE}
          onClick={onSubmit}
          loading={isLoading}
        >
          Deploy
        </ButtonLegacy>
      </div>
    </div>
  )
}

export default DeployOtherTagModal
