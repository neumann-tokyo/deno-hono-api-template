#!/bin/bash
set -Ceu

PSQL="psql"
DB_URL="postgresql://postgres:password@db:5432/test?sslmode=disable"
TABLES=$(${PSQL} ${DB_URL} -t -c "SELECT relname FROM pg_stat_user_tables WHERE relname <> 'schema_migrations';");

SQL=""
for table in $TABLES
do
  SQL="truncate table ${table} cascade; ${SQL}"
done

${PSQL} ${DB_URL} -c "${SQL}" > /dev/null 2>&1

echo "*** cleanup testdb"
