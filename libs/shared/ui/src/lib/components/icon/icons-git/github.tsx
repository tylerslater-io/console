import { IconProps } from '../icon'

export function GithubIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      className={`svg-icon ${props.className || ''}`}
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <path
        d="M12.0013 1.03134e-06C5.37057 -0.00275316 0 5.51113 0 12.3167C0 17.6984 3.35962 22.2731 8.03843 23.9532C8.66853 24.1157 8.572 23.6557 8.572 23.3417V21.2073C4.93353 21.6452 4.78606 19.1719 4.54206 18.7588C4.04871 17.894 2.88236 17.6736 3.23092 17.2605C4.05943 16.8226 4.90403 17.3707 5.88269 18.8552C6.59055 19.9321 7.9714 19.7503 8.67121 19.5713C8.82404 18.924 9.15116 18.3456 9.60161 17.8967C5.83175 17.2027 4.26053 14.8396 4.26053 12.0303C4.26053 10.667 4.69758 9.41382 5.55558 8.40303C5.0086 6.73675 5.60652 5.31008 5.68696 5.098C7.24478 4.95479 8.86426 6.24375 8.99028 6.34565C9.8751 6.10053 10.8859 5.97108 12.0174 5.97108C13.1543 5.97108 14.1678 6.10604 15.0607 6.35391C15.3636 6.11705 16.8652 5.00987 18.313 5.14482C18.3908 5.3569 18.9753 6.75052 18.4605 8.39477C19.3292 9.40831 19.7716 10.6725 19.7716 12.0386C19.7716 14.8533 18.1897 17.2192 14.4091 17.9022C14.7329 18.2293 14.99 18.6195 15.1654 19.0498C15.3408 19.4801 15.431 19.942 15.4307 20.4085V23.507C15.4521 23.7549 15.4307 24 15.8329 24C20.5814 22.3557 24 17.748 24 12.3195C24 5.51113 18.6267 1.03134e-06 12.0013 1.03134e-06Z"
        fill="#fff"
      />
    </svg>
  )
}

export default GithubIcon