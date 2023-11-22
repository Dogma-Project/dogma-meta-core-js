declare namespace Keys {
  export const enum Type {
    nodeKey,
    masterKey,
  }
  export type InitialParams = {
    name: string; // check
    keylength: 1024 | 2048 | 4096;
    seed?: string;
  };
  export const enum FORMATS {
    TYPE = "pkcs1",
    FORMAT = "pem",
  }
}

export default Keys;
