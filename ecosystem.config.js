module.exports = {
    apps : [{
        name: "irreact",
        // script: "./node_modules/react-scripts/scripts/start.js",
        script: "index.js",
        instances: "max",
        watch: true,
        autorestart: true,
        env: {
            "NODE_ENV": "development",
        },
        env_production : {
            "NODE_ENV": "production"
        }
    }]
};
