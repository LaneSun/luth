# Luth Gen 1

Luth 规则解析引擎，第1代

用于模式匹配和文本解析，可以作为更高级的正则表达式库使用

该库的目标是为 Easy-Lang 项目的源代码解析部分提供支持

## Reference

### 单词

进行原始匹配的元素

```js
// 从文本流中匹配一个字符串
str(String)

// 从文本流中匹配一个字符，使用正则表达式
reg(Regexp)
```

### 组合词

组合多个其它词语进行匹配的元素

```js
// 按顺序匹配传入的词语，需要全部匹配成功才判断为匹配完成
seq(...Word)

// 当传入词语中的任意一个匹配成功时匹配完成
or(...Word)

// 和 seq 相似，但每个词语匹配后不更新当前位置，并返回最后一个词语的匹配结果
and(...Word)
```

### 量词

对传入的词语进行不定次数匹配

```js
// 匹配传入的词语 0 ~ N 次
any(Word)

// 匹配传入的词语 0 ~ 1 次
may(Word)

// 匹配传入的词语 1 ~ N 次
some(Word)

// 匹配传入的词语 <min> ~ <max> 次
count(Word, Number<min>, Number<max>?)
```

### 断言

根据传入词语对上下文进行匹配，但不更新上下文位置

```js
// 如果词语匹配成功则匹配成功
is(Word)

// 如果词语匹配失败才匹配成功
not(Word)
```

### 提取器

将匹配结果存储以供之后使用，类似于正则表达式的捕获括号

```js
$(Word)
list(Word)
pair(String<key>, Word)
join(Word)
```

### 方法

#### 提取方法

```js
Word.extract_from(String, Number?<offset>) -> Array | null
Word.extract_in(String, Number?<offset>) -> Array | null
Word.extract_all_in(String, Number?<offset>) -> [...Array]
```

#### 匹配方法

```js
Word.match_from(String, Number?<offset>) -> Boolean
Word.match_in(String, Number?<offset>) -> Boolean
```

#### 搜索方法

```js
Word.search_in(String, Number?<offset>) -> [Number<start>, Number<end>] | null
Word.search_all_in(String, Number?<offset>) -> [...[Number<start>, Number<end>]]
```

#### 转换方法

```js
Word.trans_from(String, Number?<offset>) -> String | null
Word.trans_in(String, Number?<offset>) -> String | null
Word.trans_all_in(String, Number?<offset>) -> String
```