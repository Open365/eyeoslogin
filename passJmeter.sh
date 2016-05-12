#!/bin/bash -e

~/apache-jmeter-2.11/bin/jmeter -n -t eyeosLogin.jmx -l test.csv
MAXTIME=100
TIME=`tail -1 test.csv  | cut -d, -f11`
if [[ "$TIME" -gt "$MAXTIME" ]]; then
    exit 1;
fi

