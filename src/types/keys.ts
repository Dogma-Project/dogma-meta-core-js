export namespace Keys {
  export enum Type {
    nodeKey = 0,
    masterKey = 1,
  }
  export type InitialParams = {
    name: string; // check
    keylength: 1024 | 2048 | 4096;
    seed?: string;
  };
  export enum FORMATS {
    TYPE = "pkcs1",
    FORMAT = "pem",
  }
}
