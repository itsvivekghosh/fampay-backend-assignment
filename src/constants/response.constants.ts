// Status Codes Mapping
export class STATUS_CODES {
    static OK_HTTP_RESPONSE = 200;
    static FORBIDDEN_REQUEST = 403;
    static PAGE_NOT_FOUND = 404;
    static INTERNAL_SERVER_ERROR = 500;
    static SERVICE_UNAVAILABLE = 503;
  }
  
  // HTTP Request Query Params Mappings
  export enum HTTP_REQUEST_QUERY_PARAMS_KEYS {
    SORT_BY_ORDER = "sortByOrder",
    SORT_BY_KEY = "sortByKey",
    PAGE_NUMBER = "pageNumber",
    PAGE_SIZE = "pageSize",
  }