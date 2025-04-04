const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  output: {
    publicPath: "auto",
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
      }
      // Removing static remotes configuration to enable true lazy loading
      // Remote apps will be loaded dynamically via loadRemoteModule utility
    })
  ]
};
