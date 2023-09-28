declare const obj: {
    log: (type: string, ...message: any) => void;
    warn: (type: string, ...message: any) => void;
    error: (type: string, ...message: any) => void;
    debug: (type: string, ...message: any) => void;
    info: (type: string, ...message: any) => void;
};
export default obj;
