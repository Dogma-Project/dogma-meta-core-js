export const Streams = {
  MX: {
    /**
     * Not encrypted MX used for handshake
     */
    handshake: 0,
    /**
     * RSA assymmetric-encrypted MX used for set AES symmetric keys
     */
    key: 1,
    /**
     * AES symmetric-encrypted MX
     */
    test: 2,
    /**
     * AES symmetric-encrypted MX
     */
    control: 3,
    /**
     * AES symmetric-encrypted MX
     */
    dht: 4,
    /**
     * AES symmetric-encrypted MX
     */
    relay: 5,

    /**
     * DATA MX
     * AES symmetric-encrypted MX
     */
    sync: 100,
    /**
     * DATA MX
     * AES symmetric-encrypted MX
     */
    messages: 101,
    /**
     * DATA MX
     * AES symmetric-encrypted MX
     */
    file: 102,
    /**
     * DATA MX
     * AES symmetric-encrypted MX
     */
    mail: 103,
    /**
     * DATA MX
     * AES symmetric-encrypted MX
     */
    web: 104,
  },

  SIZES: {
    /**
     * MX descriptor size in bytes
     */
    MX: 1,
    /**
     * Packet length in bytes
     */
    LEN: 2,
  },
} as const;
