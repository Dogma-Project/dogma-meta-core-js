export const Message = {
  Type: {
    direct: 0,
    user: 1,
    chat: 2,
  },
  Action: {
    send: 0,
    sync: 1,
    edit: 2,
    delete: 3,
  },
} as const;
