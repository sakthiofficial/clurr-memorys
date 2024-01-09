function getDomainFromBrowser() {
  if (typeof window === "undefined") {
    return null;
  }
  const domainUrl = window.location.origin;
  return domainUrl;
}
const projectNames = {
  woj: "WOJ Miyapur",
  oncloud: "Oncloud33",
  balanagar: " Balanagar-Galleria Gardens",
};
export default {
  urlDb: process.env.URL_DB,
  appEnv: process.env.NEXT_PUBLIC_APPENV,
  buildNo: process.env.NEXT_PUBLIC_BUILDID,
  apiUrl: getDomainFromBrowser(),
  lsqConfig: {
    apiUrl: "https://api-in21.leadsquared.com/v2/",
    [projectNames?.woj]: {
      accessKey: "u$rc14713c6132c84aeffb24217ab56efd4",
      secretKey: "021b006097b48fefe3f6815241d178d3de53fece",
    },
    [projectNames?.oncloud]: {
      accessKey: " u$rd8c2f7aadd8dd7609e08abc230990943",
      secretKey: "ae3805268bdd7c3ece47e97188f05394bb509246",
    },
    [projectNames?.balanagar]: {
      accessKey: "u$rec5c31d52b2113a5a9cadee453dae26c",
      secretKey: "2a6afc04284668c4aa29662b537dda5eae156ab6",
    },
  },
};
