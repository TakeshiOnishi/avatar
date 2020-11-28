## 開発環境立ち上げ

1.  **Start developing.**

    Navigate into your new site’s directory and start it up.

    ```shell
    cd my-default-starter/
    gatsby develop
    ```

1.  **Open the source code and start editing!**

    Your site is now running at `http://localhost:8000`!

    _Note: You'll also see a second link: _`http://localhost:8000/___graphql`_. This is a tool you can use to experiment with querying your data. Learn more about using this tool in the [Gatsby tutorial](https://www.gatsbyjs.com/tutorial/part-five/#introducing-graphiql)._

    Open the `my-default-starter` directory in your code editor of choice and edit `src/pages/index.js`. Save your changes and the browser will update in real time!

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

## TODO

+ ユーザーの画像情報を登録
  + realTimeDataBaseにすると量が増えるから設定系を別のパスにしたほうがいいかも
  + 画像保存先が悩ましいけどbase64で保存するとかすれば楽かも
+ ステータス
  + マスター管理を FireStore? ...あるいはrealTimeDataBaseでroomを分ける (マスター管理)
  + RTDなら`{uid: xxxxx, st_name: '離席', st_type: 1}` , `ラベルは自由でtypeで制限するとか
+ レイアウト(css)

## OTHER

+ チャットはUserIdをkeyにしたObjectに格納してる
  + ので、過去の分は保持ていない
+ サイズ: 
    + Small: 50px
    + Medium: 200px
    + Large: 400px
