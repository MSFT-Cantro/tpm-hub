const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  output: {
    publicPath: "http://localhost:4200/",
    uniqueName: "frontend-shell"
  },
  optimization: {
    runtimeChunk: false
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
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
      },
      remotes: {
        'status_update': 'http://localhost:4201/remoteEntry.js',
        'release_notes': 'http://localhost:4202/remoteEntry.js'
      }
    })
  ]
};
