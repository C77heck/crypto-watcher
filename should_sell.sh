#!/bin/bash

curl http://localhost:3030/api/crypto/should_sell;

echo date >> cront_tab_logs.txt;

exit 0;
