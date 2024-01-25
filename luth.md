# Luth

Gen 1

Luth 规则解析引擎的定义与说明文档，第1代

```js
// 单词
str(String)
reg(Regexp)

// 组合词
seq(...Word)
or(...Word)
and(...Word)

// 量词
any(Word)
may(Word)
some(Word)
count(Word, Number<min>, Number<max>?)

// 断言
is(Word)
not(Word)

// 提取器
$(Word)
list(Word)
pair(String<key>, Word)
join(Word)

// 修改器
del(Word)
put(String)
trans(Word, String | Func)

// 调试器

// 方法
Word.extract_from(String) -> Array | null
Word.extract_in(String) -> Array | null
Word.extract_all_in(String) -> [...Array]

Word.match_from(String) -> Boolean
Word.match_in(String) -> Boolean

Word.search_in(String) -> [Number<start>, Number<end>] | null
Word.search_all_in(String) -> [...[Number<start>, Number<end>]]

Word.trans_from(String) -> String | null
Word.trans_in(String) -> String | null
Word.trans_all_in(String) -> String
```