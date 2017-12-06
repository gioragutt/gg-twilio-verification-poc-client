import {apiBaseUrl} from './config'

export const api = async (url, {base, body, method, raw = false} = {}) => {
  try {
    const options = {
      method: method || (body ? 'POST' : 'GET'),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: body && JSON.stringify(body)
    }

    const fullUrl = `${base || apiBaseUrl}${url}`
    const res = await fetch(fullUrl, options)

    if (raw) {
      return res
    }

    const json = await res.json()
    if (res.ok === false || res.success == false) {
      throw new Error(json.message)
    }
    return json
  } catch (err) {
    console.error('err', err)
    throw err
  }
}
