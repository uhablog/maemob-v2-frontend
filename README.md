# MaeMob v2 Frontend

## 技術的なこだわりポイント

- useFetchDataの作り込み

### useFetchDataの作り込み

useFetchDataではバックエンドサーバーに対してHTTPリクエストを送信してデータの取得処理を行っている。

シンプルなデータ取得処理だけでなく、

- キャッシュの利用
- クエリパラメータを受け取り、エンコードしてHTTPリクエストする

というようなことを行なっている。

#### キャッシュの利用

URL+クエリパラメータをキーとして取得結果をキャッシュしている。
キャッシュする期間はカスタムフックを利用する側が指定可能。またキャッシュキーを指定してキャッシュを削除することもできるようになっている。

## Memo

- Icon: https://heroicons.com/
- Layout: https://tailwindui.com/components/application-ui/application-shells/stacked
