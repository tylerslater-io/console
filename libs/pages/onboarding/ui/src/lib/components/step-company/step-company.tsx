import { InputSelect, InputText } from '@console/shared-ui'
import { ONBOARDING_MORE_URL, ONBOARDING_URL, useDocumentTitle } from '@console/shared/utils'
import { Link } from 'react-router-dom'

export function StepCompany() {
  useDocumentTitle('Onboarding Personalize - Qovery')

  const dataSize = [
    {
      label: '1-10',
      value: '1-10',
    },
    {
      label: '11-50',
      value: '11-50',
    },
    {
      label: '51-200',
      value: '51-200',
    },
    {
      label: '201-500',
      value: '201-500',
    },
    {
      label: '500+',
      value: '500+',
    },
  ]

  const dataRole = [
    {
      label: 'Tech Lead',
      value: 'tech-lead',
    },
    {
      label: 'Software Developer',
      value: 'software-developer',
    },
    {
      label: 'DevOps',
      value: 'devops',
    },
    {
      label: 'Product/Project Manager',
      value: 'product-project-manager',
    },
    {
      label: 'CTO',
      value: 'cto',
    },
    {
      label: 'Founder',
      value: 'founder',
    },
    {
      label: 'Other',
      value: 'other',
    },
  ]

  return (
    <div>
      <h1 className="h3 text-text-700 mb-3">About your company</h1>
      <p className="text-sm mb-10 text-text-500">
        Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim
        velit mollit.
      </p>
      <form>
        <InputText className="mb-3" name="company" label="Company" />
        <InputSelect className="mb-3" name="companySize" label="Company size" items={dataSize} />
        <InputSelect className="mb-3" name="companySize" label="Company size" items={dataRole} />
        <span className="mr-4">back</span>
        <Link to={`${ONBOARDING_URL}${ONBOARDING_MORE_URL}`}>Continue</Link>
      </form>
    </div>
  )
}

export default StepCompany
