#!/bin/bash
set -e

if [ -n $TEST_DB ]; then
  psql "postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}?sslmode=disable" -c "create database ${TEST_DB};"
fi
