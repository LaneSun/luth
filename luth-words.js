// Luth Words
// Gen 1
//
// Luth 基本词语

import {
    Word,
    Result,
    Pin,
    Pair,
} from "./luth-core.js";
import {
    preserver,
    collector,
    try_read,
} from "./luth-types.js";

export const str = str => new Word(preserver(try_read(ctx => {
    for (const c of str)
        if (c !== ctx.read())
            return Result.Fail();
    return Result.Success(str);
})), "Str");

export const reg = reg => new Word(preserver(try_read(ctx => {
    const c = ctx.read();
    if (reg.test(c))
        return Result.Success(c);
    else
        return Result.Fail();
})), "Reg");

export const seq = (...words) => new Word(collector(ctx => {
    for (const w of words)
        if (!ctx.try_match(w))
            return false;
    return true;
}), "Seq");

export const or = (...words) => new Word(collector(ctx => {
    for (const w of words)
        if (ctx.try_match(w))
            return true;
    return false;
}), "Or");

export const and = (...words) => new Word(ctx => {
    let nctx = null;
    let res = Result.Success();
    for (const w of words) {
        nctx = ctx.extend();
        const r = w.matcher(nctx);
        if (r.is_success())
            res = r;
        else
            return Result.Fail();
    }
    if (nctx) ctx.merge(nctx);
    return res;
}, "And");

export const any = word => new Word(collector(ctx => {
    while (ctx.try_match(word));
    return true;
}), "Any");

export const may = word => new Word(collector(ctx => {
    ctx.try_match(word);
    return true;
}), "May");

export const some = word => new Word(collector(ctx => {
    if (ctx.try_match(word)) {
        while (ctx.try_match(word));
        return true;
    } else
        return false;
}), "Some");

export const count = (word, min, max) => new Word(collector(ctx => {
    let i = 0;
    while (ctx.try_match(word)) i++;
    if (min <= i && i <= max)
        return true;
    else
        return false;
}), "Count");

export const is = word => new Word(ctx => {
    if (word.matcher(ctx.extend()).is_success())
        return Result.Success();
    else
        return Result.Fail();
}, "Is");

export const not = word => new Word(ctx => {
    if (word.matcher(ctx.extend()).is_success())
        return Result.Fail();
    else
        return Result.Success();
}, "Not");

export const join = word => new Word(preserver(ctx => {
    const res = word.matcher(ctx);
        if (res.is_success()) {
            return Result.Success(res.get_results().join(''));
        } else
            return Result.Fail();
}), "Join");

export const $ = word => new Word(preserver(ctx => {
    const res = word.matcher(ctx);
        if (res.is_success()) {
            return Result.Success(new Pin(res.get_results()));
        } else
            return Result.Fail();
}), "$");

export const pair = (head, word) => new Word(preserver(ctx => {
    const res = word.matcher(ctx);
        if (res.is_success()) {
            return Result.Success(new Pair(head, res.get_results()));
        } else
            return Result.Fail();
}), "Pair");

export const trans = (word, mapper) => new Word(preserver(ctx => {
    const res = word.matcher(ctx);
        if (res.is_success()) {
            return Result.Successv(mapper(...res.get_results()));
        } else
            return Result.Fail();
}), "Trans");

export const first = word => new Word(preserver(ctx => {
    const res = word.matcher(ctx);
        if (res.is_success()) {
            return Result.Successv(res.get_results()[0]);
        } else
            return Result.Fail();
}), "First");

// deno-lint-ignore no-control-regex
export const whitespace = reg(/[\u0009\u000B\u000C\u0020\u00A0\u000A\u000D\u2028\u2029]/).name("Whitespace");
export const gap = any(whitespace).name("Gap");
export const blank = some(whitespace).name("Blank");

export const wseq = (...words) => new Word(collector(ctx => {
    for (const w of words) {
        ctx.try_match(gap);
        if (!ctx.try_match(w))
            return false;
    }
    return true;
}), "WSeq");

export const wany = word => new Word(collector(ctx => {
    while (ctx.try_match(gap), ctx.try_match(word));
    return true;
}), "WAny");

export const wmay = word => new Word(collector(ctx => {
    ctx.try_match(gap);
    ctx.try_match(word);
    return true;
}), "WMay");

export const wsome = word => new Word(collector(ctx => {
    if (ctx.try_match(gap), ctx.try_match(word)) {
        while (ctx.try_match(gap), ctx.try_match(word));
        return true;
    } else
        return false;
}), "WSome");

export const wcount = (word, min, max) => new Word(collector(ctx => {
    let i = 0;
    while (ctx.try_match(gap), ctx.try_match(word)) i++;
    if (min <= i && i <= max)
        return true;
    else
        return false;
}), "WCount");