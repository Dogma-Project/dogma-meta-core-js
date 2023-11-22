declare namespace Keys {
    const enum Type {
        nodeKey = 0,
        masterKey = 1
    }
    type InitialParams = {
        name: string;
        keylength: 1024 | 2048 | 4096;
        seed?: string;
    };
    const enum FORMATS {
        TYPE = "pkcs1",
        FORMAT = "pem"
    }
}
export default Keys;
