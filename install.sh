#! /bin/bash
#
# This is intended to be run locally on remote EC2 server.
#
# Usage: ./install.sh

# Install node if not already installed
if [ - $(command -v node) ]; then
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
    . ~/.nvm/nvm.sh
    nvm install node
fi
echo "Using node $(node -v)"

# Install pm2 if not already installed
if [ -z $(command -v pm2) ]; then
    npm install pm2@latest -g
fi
echo "Using pm2 $(pm2 -v)"

# Do permissiony things
sudo chown -R $USER:$(id -gn $USER) /home/ubuntu/.config
sudo mkdir -p /var/www/irreact/node_modules
sudo chown -R $USER /var/www/irreact/node_modules

# Install modules
cd /var/www/irreact
npm install

# Start server
pm2 start
