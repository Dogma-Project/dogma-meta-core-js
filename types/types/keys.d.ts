declare namespace Keys {
    type InitialParams = {
        name: string;
        keylength: 1024 | 2048 | 4096;
        seed?: string;
    };
}
export default Keys;
