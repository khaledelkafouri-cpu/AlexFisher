declare module "cloudflare:workers" {
  interface D1Result<T> {
    results?: T[];
  }

  interface D1RunResult {
    meta: { last_row_id?: number | string };
  }

  interface D1BoundStatement {
    all<T>(): Promise<D1Result<T>>;
    run(): Promise<D1RunResult>;
  }

  interface D1Database {
    prepare(query: string): {
      bind(...values: unknown[]): D1BoundStatement;
    };
  }

  export const env: { DB?: D1Database };
}
