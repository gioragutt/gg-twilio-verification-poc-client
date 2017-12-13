const defaultApiBaseUrl =
process.env.NODE_ENV === 'production'
  ? 'https://foody-poc-server.herokuapp.com/api/v1'
  : 'http://10.0.2.2:3000/api/v1'

export const apiBaseUrl = process.env.API_BASE_URL || defaultApiBaseUrl