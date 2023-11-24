type datadir = {
    main: string;
    data: string;
    nedb: string;
    keys: string;
};
export declare function getDatadir(): datadir;
export declare function setDatadir(value: string): void;
export {};
