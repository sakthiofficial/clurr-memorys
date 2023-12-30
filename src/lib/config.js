function getDomainFromBrowser() {
  if (typeof window === "undefined") {
    return null;
  }
  const domainUrl = window.location.origin;
  return domainUrl;
}

export default {
  urlDb: process.env.URL_DB,
  appEnv: process.env.NEXT_PUBLIC_APPENV,
  buildNo: process.env.NEXT_PUBLIC_BUILDID,
  apiUrl: getDomainFromBrowser()
};
