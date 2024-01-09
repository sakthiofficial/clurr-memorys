const { default: axios } = require("axios");

class LSQLeadSrv {
  addLeadToLsq = async ({ userName, email, phoneNo, source }) => {
    const postBody = [
      {
        Attribute: "FirstName",
        Value: userName,
      },
      {
        Attribute: "EmailAddress",
        Value: email,
      },
      {
        Attribute: "Phone",
        Value: phoneNo,
      },
      {
        Attribute: "Source",
        Value: source,
      },
    ];

    const promise = axios.post(lsqConfig.apiUrl, postBody, {
      params: {
        accessKey: lsqConfig.accessKey,
        secretKey: lsqConfig.secretKey,
      },
    });
  };
}
