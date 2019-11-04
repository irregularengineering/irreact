#!/bin/bash
#
# Launch docker container and run scrapers
#
# Usage: ./run_scrapers.sh

if [ -n "$(docker ps -q -f name=irregularly-irreact)" ]; then
    echo "Stopping irregularly-irreact"
    echo "Stopped $(docker stop irregularly-irreact)"
fi

docker pull irregularengineering/irregularly:latest
docker-compose up
