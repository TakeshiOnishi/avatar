## 開発環境立ち上げ

1.  **Start developing.**

    Navigate into your new site’s directory and start it up.

    ```shell
    cd my-default-starter/
    gatsby develop
    ```

### 動作

- [firebaseホスティング](https://multi-connect-f53ad.web.app/)

### deploy

- `gatsby build`
- `firebase deploy`

### react依存関係ビジュアライズ

[madge](https://github.com/pahen/madge)

```
madge --exclude layout --image madge_graph.png src/pages/index.js
```

<img src="./madge_graph.png" />
