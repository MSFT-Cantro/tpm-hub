const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const path = require('path');

module.exports = {
  output: {
    publicPath: "http://localhost:4204/",
    uniqueName: "status_update",
    path: path.join(__dirname, 'dist/status-update-app'),
    filename: '[name].js'
  },
  optimization: {
    runtimeChunk: false
  },
  devServer: {
    // Ensure the dev server correctly serves the remoteEntry.js file
    static: {
      directory: path.join(__dirname, 'dist/status-update-app'),
    },
    port: 4204,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'status_update',
      library: { type: 'var', name: 'status_update' },      filename: 'remoteEntry.js',
      exposes: {
        './StatusUpdateModule': './src/app/app.module.ts#StatusUpdateModule'
      },
      shared: {
        "@angular/core": { 
          singleton: true, 
          strictVersion: false,
          requiredVersion: '^15.0.0'
        },
        "@angular/common": { 
          singleton: true, 
          strictVersion: false,
          requiredVersion: '^15.0.0'
        },
        "@angular/router": { 
          singleton: true, 
          strictVersion: false,
          requiredVersion: '^15.0.0'
        },
        "@angular/common/http": { 
          singleton: true, 
          strictVersion: false,
          requiredVersion: '^15.0.0'
        },
        "rxjs": {
          singleton: true,
          strictVersion: false
        }
      }
    })
  ]
};