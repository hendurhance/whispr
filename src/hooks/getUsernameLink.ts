import { APP_URL } from "../configs";

export function getUsernameLink(username: string): string {
  const baseUrl = APP_URL;

  return `${baseUrl}/${username}`;
}