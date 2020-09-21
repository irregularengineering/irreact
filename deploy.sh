#! /bin/bash
#
# Deploy app to EC2
#
# Currently runs on instance type t2.xlarge
#
# Usage: ./deploy.sh <host>
#
# Exampe: ./deploy.sh ec2-52-41-10-63.us-west-2.compute.amazonaws.com

# Read arguments with defaults
HOST=${1:-ec2-52-41-10-63.us-west-2.compute.amazonaws.com}

# Build locally
# export NODE_OPTIONS="--max-old-space-size=8192"
# npm run build

# Create directory for application
ssh ubuntu@$HOST "\
    sudo mkdir -p /var/www/irreact && \
    find /var/www/irreact -type d -exec sudo chmod 777 {} \;
"

# Move files over
rsync -ravze "ssh" \
    --exclude '.git/' \
    --exclude 'node_modules/' \
    --exclude '.idea/' \
    /var/www/irreact/* \
    ubuntu@$HOST:/var/www/irreact

# Execute install script
ssh ubuntu@$HOST "/var/www/irreact/install.sh"
