import { type PropsWithChildren, useState } from 'react'
import { Link } from 'react-router-dom'
import { type IconEnum } from '@qovery/shared/enums'
import Icon from '../../icon/icon'
import Menu, { MenuAlign, type MenuData } from '../../menu/menu'
import { ButtonLegacySize } from '../button-legacy/button-legacy'

export enum ButtonActionStyle {
  BASIC = 'basic',
  RAISED = 'raised',
  STROKED = 'stroked',
  FLAT = 'flat',
}

export interface ButtonActionProps {
  style?: ButtonActionStyle
  iconRight?: IconEnum | string
  link?: string
  external?: boolean
  disabled?: boolean
  className?: string
  onClick?: () => void
  menus?: MenuData
  dropdown?: MenuData
  size?: ButtonLegacySize
}

export function ButtonAction(props: PropsWithChildren<ButtonActionProps>) {
  const {
    children,
    style = ButtonActionStyle.BASIC,
    iconRight,
    link,
    disabled = false,
    external = false,
    className = '',
    onClick,
    menus = [],
    dropdown = [],
    size = ButtonLegacySize.REGULAR,
  } = props

  const [menuOpen, setMenuOpen] = useState(false)

  const defineClass = `btn-action btn--${size} ${style ? `btn-action--${style}` : ''} ${
    disabled ? 'btn-action--disabled' : ''
  } ${className}`

  function contentBtn() {
    return (
      <>
        {!link && (
          <button className="btn-action__content" onClick={onClick}>
            <span>{children}</span>
            {iconRight && <Icon name={iconRight} className="text-sm" />}
          </button>
        )}
        {link && !external && (
          <Link className="btn-action__content" to={link} onClick={onClick}>
            <span>{children}</span>
            {iconRight && <Icon name={iconRight} className="text-sm" />}
          </Link>
        )}
        {link && external && (
          <a className="btn-action__content" href={link} target="_blank" onClick={onClick} rel="noreferrer">
            <span>{children}</span>
            {iconRight && <Icon name={iconRight} className="text-sm" />}
          </a>
        )}
      </>
    )
  }

  return (
    <div data-testid="button-action" className={defineClass}>
      {menus.length > 0 && (
        <Menu
          menus={menus}
          arrowAlign={MenuAlign.END}
          onOpen={(isOpen) => setMenuOpen(isOpen)}
          trigger={
            <div className={`btn-action__trigger btn-action__trigger--${menuOpen ? 'open' : 'closed'}`}>
              <Icon name="icon-solid-ellipsis-vertical" />
            </div>
          }
        />
      )}
      {dropdown.length > 0 ? (
        <Menu menus={dropdown} arrowAlign={MenuAlign.CENTER} trigger={contentBtn()} />
      ) : (
        contentBtn()
      )}
    </div>
  )
}

export default ButtonAction
