#! /bin/bash
#
# Deploy app to EC2 from localhost
#
# Currently runs on instance type t2.xlarge
#
# Usage: ./deploy_localhost.sh <host> <keyfile>
#
# Exampe: ./deploy_localhost.sh ec2-52-41-10-63.us-west-2.compute.amazonaws.com ~/.ssh/irreact.pem

# Read arguments with defaults
HOST=${1:-ec2-52-41-10-63.us-west-2.compute.amazonaws.com}
KEYFILE=${2:-~/.ssh/irreact.pem}

# Build locally
# export NODE_OPTIONS="--max-old-space-size=8192"
# npm run build

# Create directory for application
ssh ubuntu@$HOST -i $KEYFILE "\
    sudo mkdir -p /var/www/irreact && \
    find /var/www/irreact -type d -exec sudo chmod 777 {} \;
"

# Move files over
rsync -ravze "ssh -i $KEYFILE" \
    --exclude '.git/' \
    --exclude 'node_modules/' \
    --exclude '.idea/' \
    ~/irreact/* \
    ubuntu@$HOST:/var/www/irreact

# Execute install script
ssh ubuntu@$HOST -i $KEYFILE "/var/www/irreact/install.sh"
