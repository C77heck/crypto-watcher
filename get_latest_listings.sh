#!/bin/bash

curl http://localhost:3030/api/crypto/latest_listings;

echo date >> cront_tab_logs.txt;

exit 0;
