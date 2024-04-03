export const DHT = {
  Type: {
    dhtAnnounce: 0,
    dhtLookup: 1,
    dhtBootstrap: 2,
  },
  Action: {
    get: 0,
    set: 1,
    push: 2,
  },
  Request: {
    announce: 0,
    lookup: 1,
    revoke: 2,
  },
  Response: {
    error: -1,
    alreadyPresent: 0,
    ok: 1,
  },
} as const;
