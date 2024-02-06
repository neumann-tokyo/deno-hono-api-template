# Kashimashi Server

```
deno task dev
```

## Using libraries

- [x] [Hono](https://hono.dev)
- [ ] [Timescale DB](https://www.timescale.com) for streaming data
- [ ] Full text search in English/Japanese
  - [pg_bigm](https://github.com/pgbigm/pg_bigm)
    - we can use this plug-in on AWS, GCP, but it is slow
  - [PGroonga](https://pgroonga.github.io)
    - This library is fast, and usage, but doesn't support any Cloud Hosts
      (excepts Supabase)
  - [TypeSense](https://typesense.org)
    - This is a full-text search server like Elasticsearch, Algoria, etc
    - This is an open-source project, and we can install it by docker.
    - This has a cloud service too
    - It seems best
