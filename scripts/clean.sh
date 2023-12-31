#!/bin/bash

#clean frontend

echo "Cleaning  Frontend build and test coverage"
rm -rf ./frontend/build
rm -rf  ./frontend/coverage

#clean backend

echo "Cleaning  Backend build and test coverage"
rm -rf ./backend/coverage
mv ./backend/public/index.html .
rm -rf ./backend/public/*
mv index.html ./backend/public/

# clean node_modules and cache

if [[ $1 == --deep-clean ]]; then
    echo "Cleaning  node_modules"
    rm -rf frontend/node_modules
    rm -rf backend/node_modules
    rm -rf node_modules
    echo "Cleaning yarn cache for all"
    yarn cache clean
    cd frontend && yarn cache clean
    cd ..
    cd backend && yarn cache clean
else
    echo "node_modules are not cleared"
fi


