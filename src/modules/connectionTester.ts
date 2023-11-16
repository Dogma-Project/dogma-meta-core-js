const externalIP = require("ext-ip");

/** @module ConnectionTester */

const getExternalIp4 = async (extServices: string[]) => {
  try {
    const extIP = externalIP({
      mode: "parallel",
      replace: true,
      timeout: 500,
      userAgent: "curl/ext-ip-getter",
      followRedirect: true,
      maxRedirects: 10,
      services: extServices,
    });

    return extIP.get();
  } catch (err) {
    return Promise.reject(err);
  }
};

export default { getExternalIp4 };
