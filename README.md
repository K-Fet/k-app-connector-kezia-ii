# K-App Connector - KeziaII

Kezia II connector for the inventory management module of the K-App.

## Usage

Just run the app in production mode.

You will need to have some environment variables set:
- `ODBC_CN`: ODBC Connection string to connect to KeziaII database (e.g.: `DSN=odbc_dsn;Uid=User;Pwd=Password;`)
- `K_APP_URL`: URL to the K-App (e.g.: `https://kfet-insa.fr`)
- `K_APP_USERNAME`: K-App username to the connector account
- `K_APP_PASSWORD`: K-App password to the connector account
- `PRODUCTS_MATCH_THRESHOLD`: Optional. Threshold for product matching
- `PULL_MINUTES_INTERVAL`: Optional. Interval to run tasks

### Connector Account

For now, you will need a special account with 2 permissions:
- `inventory-management:products:list` to match KeziaII products and K-App products
- `inventory-management:stock-events:add` to add events


## Roadmap

- Connect to the K-App through a token instead of an account
- Improve matching between KeziaII and K-App products
