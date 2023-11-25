declare const obj: {
    error: (type: string, ...message: any) => void;
    warn: (type: string, ...message: any) => void;
    info: (type: string, ...message: any) => void;
    log: (type: string, ...message: any) => void;
    debug: (type: string, ...message: any) => void;
};
export default obj;
