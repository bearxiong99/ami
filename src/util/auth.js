import Cookies from 'js-cookie'

const TokenKey = 'x-access-token'
const RefreshTokenKey = 'x-access-refresh-token'
const tokenExpiresTime = new Date(new Date().getTime() + 60 * 60 * 1000 * 24 * 365 * 10 );
const refreshTokenExpiresTime = new Date(new Date().getTime() + 60 * 60 * 1000 * 24 * 365 * 10);

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, {expires: tokenExpiresTime})
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getRefreshToken() {
  return Cookies.get(RefreshTokenKey)
}

export function setRefreshToken(refreshToken) {
  return Cookies.set(RefreshTokenKey, refreshToken, {expires: refreshTokenExpiresTime})
}

export function removeRefreshToken() {
  return Cookies.remove(RefreshTokenKey)
}
