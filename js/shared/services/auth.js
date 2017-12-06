import { AsyncStorage } from 'react-native'

export const getToken = async () => AsyncStorage.getItem('token')
export const setToken = token => AsyncStorage.setItem('token', token)
export const clearToken = () => AsyncStorage.removeItem('token')
