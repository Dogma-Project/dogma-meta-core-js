export namespace Types {
  export namespace Node {
    export type Id = string;
    export type Model = {
      node_id: Node.Id;
      user_id: User.Id;
      name: string;
      public_ipv4?: string;
      public_ipv6?: string;
      local_ipv4?: string;
      local_ipv6?: string;
      sync_id: Sync.Id;
    };
  }
  export namespace User {
    export type Id = string;
    export type Model = {
      user_id: User.Id;
      name: string;
      avatar: string;
    };
  }
  export namespace Sync {
    export type Id = string;
  }
}

declare global {
  interface String {
    toPlainHex(): string | null;
  }
  interface Array<T> {
    unique(): Array<T>;
  }
}
