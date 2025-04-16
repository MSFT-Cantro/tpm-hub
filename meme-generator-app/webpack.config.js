const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const path = require('path');

module.exports = {
  output: {
    publicPath: "auto",
    uniqueName: "meme_generator",
    path: path.join(__dirname, 'dist/meme-generator-app'),
    filename: '[name].js'
  },
  optimization: {
    runtimeChunk: false
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist/meme-generator-app'),
    },
    port: 4203,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'meme_generator',
      library: { type: 'var', name: 'meme_generator' },
      filename: 'remoteEntry.js',
      exposes: {
        './MemeGeneratorModule': './src/app/app.module#MemeGeneratorModule'
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
        "@angular/platform-browser": { 
          singleton: true, 
          strictVersion: false,
          requiredVersion: '^16.0.0'
        },
        "@angular/platform-browser-dynamic": { 
          singleton: true, 
          strictVersion: false,
          requiredVersion: '^16.0.0'
        },
        "@angular/animations": { 
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