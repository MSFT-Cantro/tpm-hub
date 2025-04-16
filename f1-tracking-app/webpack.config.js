const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const path = require('path');

module.exports = {
  output: {
    publicPath: "http://localhost:4205/",
    uniqueName: "f1TrackingApp",
    path: path.join(__dirname, 'dist/f1-tracking-app'),
    filename: '[name].js'
  },
  optimization: {
    runtimeChunk: false
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist/f1-tracking-app'),
    },
    port: 4205,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'f1TrackingApp',
      library: { type: 'var', name: 'f1TrackingApp' },
      filename: 'remoteEntry.js',
      exposes: {
        './F1TrackingModule': './src/app/app.module.ts'
      },
      shared: {
        "@angular/core": { 
          singleton: true, 
          strictVersion: false,
          requiredVersion: '^16.0.0'
        },
        "@angular/common": { 
          singleton: true, 
          strictVersion: false,
          requiredVersion: '^16.0.0'
        },
        "@angular/router": { 
          singleton: true, 
          strictVersion: false,
          requiredVersion: '^16.0.0'
        },
        "@angular/common/http": { 
          singleton: true, 
          strictVersion: false,
          requiredVersion: '^16.0.0'
        },
        "rxjs": {
          singleton: true,
          strictVersion: false
        }
      }
    })
  ]
};
