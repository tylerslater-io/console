import { type ContainerRegistryKindEnum } from 'qovery-typescript-axios'
import { match } from 'ts-pattern'
import { IconEnum } from '@qovery/shared/enums'

export function containerRegistryKindToIcon(
  registryKind: keyof typeof ContainerRegistryKindEnum
): IconEnum | undefined {
  return match(registryKind)
    .with('DOCR', () => IconEnum.DO)
    .with('DOCKER_HUB', () => IconEnum.DOCKER)
    .with('SCALEWAY_CR', () => IconEnum.SCW)
    .with('GITHUB_CR', () => IconEnum.GITHUB)
    .with('GITLAB_CR', () => IconEnum.GITLAB)
    .with('GENERIC_CR', () => undefined)
    .with('ECR', 'PUBLIC_ECR', () => IconEnum.AWS)
    .exhaustive()
}
