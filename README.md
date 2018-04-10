### 【内容】

液晶画面の状態(色ムラ、ドット欠け)をチェックするための簡単なブラウザアプリ。

### 【動作】

index.html を開いた初期表示の点線枠ボックスエリア上でマウスを動かす、あるいは
タッチパネルでタッチすると座標に応じて背景カラーが変化する。このときマウスまたは
タッチ座標のY軸を V, X軸を H または S の値としてHSV値を求めカラーを決定する。
マウスのドラッグまたは２点以上のマルチタッチ状態のX軸移動により彩度(Saturation)が
変化する。

ブラウザが対応している場合 [FULL SCREEN] ボタンでフルスクリーン表示にできる。
(各ブラウザの対応状況はこちら→ <https://caniuse.com/#feat=fullscreen> )
対応していない場合は、ブラウザのクライアント領域全体をカバーするようにdiv要素を拡張する。

### - LICENSE -

Copyright (c) 2013-2018 DigiSapo.  
Released under the WTFPL License:

This program is free software. It comes without any warranty, to  
the extent permitted by applicable law. You can redistribute it  
and/or modify it under the terms of the Do What The Fuck You Want  
To Public License, Version 2, as published by Sam Hocevar. See  
http://www.wtfpl.net/ for more details.

