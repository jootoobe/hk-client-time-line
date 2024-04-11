
### optimization  "scripts": false - se colocar true dá erro no carregamento dos microsserviços
### development "sourceMap": true, - para debug quando precisar 
````
            "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "10mb",
                  "maximumError": "10mb"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "200kb",
                  "maximumError": "400kb"
                }
              ],
              "outputHashing": "all",
              "aot": true,
              "optimization": {
                "scripts": true, // tem que ser flase
                "styles": {
                  "minify": true,
                  "inlineCritical": true
                },
                "fonts": true
              },
              "extractLicenses": false,
              "sourceMap": false,
              "namedChunks": true,
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.production.ts"
                }
              ]
            },
            "development": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "10mb",
                  "maximumError": "10mb"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "200kb",
                  "maximumError": "400kb"
                }
              ],
              "outputHashing": "all",
              "aot": true,
              "optimization": false,
              "extractLicenses": false,
              "sourceMap": false,
              "namedChunks": true,
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.development.ts"
                }
              ]
            },
            "local": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "10mb",
                  "maximumError": "10mb"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "200kb",
                  "maximumError": "400kb"
                }
              ],
              "outputHashing": "all",
              "aot": true,
              "optimization": {
                "scripts": true,
                "styles": {
                  "minify": true,
                  "inlineCritical": true
                },
                "fonts": true
              },
              "extractLicenses": false,
              "sourceMap": false,
              "namedChunks": true,
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.local.ts"
                }
              ]
            }
          },
          "defaultConfiguration": "production"
````


````
    // if (!isDevMode()) { // remove productions console.log
    //   // console.log = function() {};
    // }
````
