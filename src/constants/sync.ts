export const Sync = {
  SIZES: {
    USER_ID: 5,
    NODE_ID: 5,
  },
  Type: {
    users: 0,
    nodes: 1,
    storage: 2,
    mail: 3,
    messages: 4,
    dht: 5,
  },
  Action: {
    get: 0,
    push: 1,
    notify: 2,
  },
} as const;
