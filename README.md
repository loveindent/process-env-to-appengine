# Process env to App Engine
Apply process environment variables to `app.yaml` filtered by **config.js** custom environment variables.

## How to install
```
npm i -D @loveindent/process-env-to-appengine
yarn add -D @loveindent/process-env-to-appengine
```

## Usage
```
Usage: process-env-to-appengine [options] [command]

Options:
  -v, --version            output the version number
  -s, --source [string]    Source app.yaml file to complete with env_variables (default: "./app.yaml")
  -d, --dest [string]      Destination to write file (default: "./dist/app.yaml")
  -p, --prefix [string]    If you have to prefix process env like DEV_HOST add DEV_ to output HOST in app.yaml
  -h, --help               output usage information

Commands:
  apply                    Apply env variables to destination app.yml file
  check                    Check if all environment variables are here, exit process if not
```
