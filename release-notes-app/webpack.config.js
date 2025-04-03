const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const path = require('path');

module.exports = {
  output: {
    publicPath: "http://localhost:4202/",
    uniqueName: "deployment_readiness",
    path: path.join(__dirname, 'dist/release-notes-app'),
    filename: '[name].js'
  },
  optimization: {
    runtimeChunk: false
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist/release-notes-app'),
    },
    port: 4202,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'deployment_readiness',
      library: { type: 'var', name: 'deployment_readiness' },
      filename: 'remoteEntry.js',
      exposes: {
        './DeploymentReadinessModule': './src/app/app.module.ts'
      },
      shared: {
        "@angular/core": { 
          singleton: true, 
          strictVersion: false,
          requiredVersion: '^14.0.0'
        },
        "@angular/common": { 
          singleton: true, 
          strictVersion: false,
          requiredVersion: '^14.0.0'
        },
        "@angular/router": { 
          singleton: true, 
          strictVersion: false,
          requiredVersion: '^14.0.0'
        },
        "@angular/common/http": { 
          singleton: true, 
          strictVersion: false,
          requiredVersion: '^14.0.0'
        },
        "rxjs": {
          singleton: true,
          strictVersion: false
        }
      }
    })
  ]
};