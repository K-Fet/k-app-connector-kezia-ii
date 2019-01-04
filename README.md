# K-App Connector - KeziaII

Kezia II connector for the inventory management module of the K-App.

## Usage

Just run the app in production mode.

You will need to have some environment variables set:
- `ODBC_CN`: ODBC Connection string to connect to KeziaII database (e.g.: `DSN=odbc_dsn;Uid=User;Pwd=Password;`)
- `K_APP_URL`: URL to the K-App (e.g.: `https://kfet-insa.fr`)
- `K_APP_USERNAME`: K-App username to the connector account
- `K_APP_PASSWORD`: K-App password to the connector account

## Roadmap

- Connect to the K-App through a token instead of an account

