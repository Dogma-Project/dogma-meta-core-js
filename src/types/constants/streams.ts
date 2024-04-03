export namespace Streams {
  export enum MX {
    /**
     * Not encrypted MX used for handshake
     */
    handshake = 0,
    /**
     * RSA assymmetric-encrypted MX used for set AES symmetric keys
     */
    key = 1,
    /**
     * AES symmetric-encrypted MX
     */
    test = 2,
    /**
     * AES symmetric-encrypted MX
     */
    control = 3,
    /**
     * AES symmetric-encrypted MX
     */
    messages = 4,
    /**
     * AES symmetric-encrypted MX
     */
    mail = 5,
    /**
     * AES symmetric-encrypted MX
     */
    dht = 6,
    /**
     * AES symmetric-encrypted MX
     */
    web = 7,
    /**
     * AES symmetric-encrypted MX
     */
    file = 8,
    /**
     * AES symmetric-encrypted MX
     */
    relay = 9,
    /**
     * AES symmetric-encrypted MX for sync
     */
    sync = 10,
  }

  export enum SIZES {
    /**
     * MX descriptor size in bytes
     */
    MX = 1,
    /**
     * Packet length in bytes
     */
    LEN = 2,
  }
}
