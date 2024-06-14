export default {
  meEndpoint: "/auth/me",
  loginEndpoint: "/sign-in",
  registerEndpoint: "/jwt/register",
  storageTokenKeyName: "accessToken",
  onTokenExpiration: "refreshToken", // logout | refreshToken
  expires: "expires",
  userData: "userData",
  tokenType: "Bearer"
}
