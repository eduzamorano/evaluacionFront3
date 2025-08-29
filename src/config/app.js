import packageJson from '../../package.json'

export const appConfig = {
  name: 'KPO SERVICES',
  version: packageJson.version,
  description: 'Sistema de gestión KPO Services',
  author: 'Azenion Ingeniería',
  website: 'https://azenion.ezamorano.cl',
  year: '2025'
}

export const getAppInfo = () => {
  return {
    ...appConfig,
    buildDate: new Date().toISOString(),
    userAgent: navigator.userAgent
  }
} 