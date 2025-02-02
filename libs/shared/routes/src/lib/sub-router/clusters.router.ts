export const CLUSTERS_URL = (organizationId = ':organizationId') => `/organization/${organizationId}/clusters`
export const CLUSTERS_GENERAL_URL = '/general'
export const CLUSTERS_CREATION_URL = '/create'

// subrouter for cluster create steps /create/general /create/settings etc...
export const CLUSTERS_CREATION_GENERAL_URL = '/general'
export const CLUSTERS_CREATION_RESOURCES_URL = '/resources'
export const CLUSTERS_CREATION_REMOTE_URL = '/remote'
export const CLUSTERS_CREATION_FEATURES_URL = '/features'
export const CLUSTERS_CREATION_SUMMARY_URL = '/summary'
