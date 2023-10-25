declare namespace File {
  export type Description = {
    descriptor: number; // check
    size: number;
    pathname: string;
    data?: string;
  };
}

export default File;
