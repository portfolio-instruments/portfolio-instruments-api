import type { Config } from './Config';

function getDevelopmentEnvironment(): Config {
  return {
    HOSTNAME: `http://localhost`,
    PORT: 3001,
    JWT_ACCESS_TOKEN_SECRET: 'access-token-secret',
    JWT_REFRESH_TOKEN_SECRET: 'refresh-token-secret',
    JWT_EMAIL_TOKEN_SECRET: 'email-token-secret',
    SALT_WORK_FACTOR: 10,
  };
}

export default getDevelopmentEnvironment;
