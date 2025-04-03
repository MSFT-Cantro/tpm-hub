const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const path = require('path');

module.exports = {
  output: {
    publicPath: "http://localhost:4201/",
    uniqueName: "sos_update", // Updated to new name
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
    port: 4201,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'sos_update', // Updated to new name
      library: { type: 'var', name: 'sos_update' },
      filename: 'remoteEntry.js',
      exposes: {
        './SosUpdateModule': './src/app/app.module.ts' // Updated to new module name
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