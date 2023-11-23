export declare namespace Keys {
    enum Type {
        nodeKey = 0,
        masterKey = 1
    }
    type InitialParams = {
        name: string;
        keylength: 1024 | 2048 | 4096;
        seed?: string;
    };
    enum FORMATS {
        TYPE = "pkcs1",
        FORMAT = "pem"
    }
}
