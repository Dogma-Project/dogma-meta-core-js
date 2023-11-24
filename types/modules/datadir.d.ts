type datadir = {
    main: string;
    data: string;
    nedb: string;
    keys: string;
    prefix: string;
};
/**
 * @todo add cache
 * @param prefix
 * @returns
 */
export declare function getDatadir(prefix: string): datadir;
export {};
