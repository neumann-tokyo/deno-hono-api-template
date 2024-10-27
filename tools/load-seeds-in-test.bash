#!/bin/bash
set -Ceu

PSQL="psql"
DB_URL="postgresql://postgres:password@db:5432/test?sslmode=disable"

for sql in db/seeds/{01_share,test}/*.sql; do
  $PSQL $DB_URL < $sql > /dev/null 2>&1
done

echo "*** load seeds"
