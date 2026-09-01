export const authCookieName = "rm_session";
export const authCookieValue = process.env.RM_AUTH_TOKEN ?? "dev-session-token";

export const adminCredentials = {
  username: process.env.RM_ADMIN_USERNAME ?? "admin@RM",
  password: process.env.RM_ADMIN_PASSWORD ?? "RM1@admin"
};

export function isValidLogin(username: string, password: string) {
  return username === adminCredentials.username && password === adminCredentials.password;
}
