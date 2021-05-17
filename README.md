# mirainya

## Usage

```sh
npm install mirainya
```

or

```sh
yarn add mirainya
```

## Sample

_First, launch your mirai-console with mirai-http-api~_

```js
import MiraiBot from 'mirainya';

const main = async () => {
  // authKey is that in mirai-http-api
  const bot = new MiraiBot({ qq: 114514, authKey: 'ww' });

  let checkLogin = bot.login();
  if (!checkLogin) {
    return;
  }

  bot.listen((msg) => {
    //do something
  }, 'all');
};

main();
```
