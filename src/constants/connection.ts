export const Connection = {
  Status: {
    error: -1,
    notConnected: 0,
    connected: 1,
    /**
     * Remote peer not in friends
     */
    notAuthorized: 2,
    /**
     * Remote peer is in friends
     */
    authorized: 3,
  },
  Group: {
    unknown: 0,
    all: 1,
    friends: 2,
    selfUser: 3,
    selfNode: 4,
    nobody: 5,
  },
  Direction: {
    outcoming: 0,
    incoming: 1,
  } as const,
  Stage: {
    /**
     * Send StageInitRequest with out session code and own credentials
     */
    init: 0,
    /**
     * Send signed out session code and public keys
     */
    verification: 1,
  },
} as const;
