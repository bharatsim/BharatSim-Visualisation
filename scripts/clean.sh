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

# clean node_modules

if [[ $1 == --deep-clean ]]; then
    echo "Cleaning  node_modules"
    rm -rf frontend/node_modules
    rm -rf backend/node_modules
else
    echo "node_modules are not cleared"
fi


