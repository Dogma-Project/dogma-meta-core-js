export namespace Message {
  export const enum Type {
    direct = 0,
    user = 1,
    chat = 2,
  }
  export const enum Action {
    send = 0,
    sync = 1,
    edit = 2,
    delete = 3,
  }
}
