import { fetchAPI } from '../fetch'

export const getMe = async () => {
  return await fetchAPI({
    method: 'GET',
    url: 'me'
  })
}