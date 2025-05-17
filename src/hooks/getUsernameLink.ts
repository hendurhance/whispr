import { APP_URL_CLEAN } from "../configs";

export function getUsernameLink(username: string): string {
  const baseUrl = APP_URL_CLEAN;

  return `${baseUrl}/${username}`;
}