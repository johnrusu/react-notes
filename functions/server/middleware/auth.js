const { auth } = require("express-oauth2-jwt-bearer");
const { AUTH0_AUDIENCE, AUTH0_ISSUER } = require("../constants/index.js");

// Auth0 middleware to validate JWT tokens
const checkJwt = auth({
  audience: AUTH0_AUDIENCE,
  issuerBaseURL: AUTH0_ISSUER,
  tokenSigningAlg: "RS256",
});

// Optional middleware to check if user is authenticated but not fail
const checkJwtOptional = auth({
  audience: AUTH0_AUDIENCE,
  issuerBaseURL: AUTH0_ISSUER,
  tokenSigningAlg: "RS256",
  required: false,
});

module.exports = {
  checkJwt,
  checkJwtOptional,
};
