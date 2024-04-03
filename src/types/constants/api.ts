export namespace API {
  export const enum ApiRequestType {
    services = 0,
    settings = 1,
    keys = 2,
    network = 3,
    user = 4,
    node = 5,
    system = 6,
    messages = 7,
    storage = 8,
    prefix = 9,
    prefixes = 10,
    certificate = 11,
  }

  export const enum ApiRequestAction {
    /**
     * Get a value or a state
     */
    get = 0,
    /**
     * Replace a value or a state
     */
    set = 1,
    /**
     * Append a value or a state
     */
    push = 2,
    /**
     * Delete a value or a state
     */
    delete = 3,
    /**
     * Only in node responces
     */
    result = 4,
    /**
     * Return error
     */
    error = 5,
  }
}
