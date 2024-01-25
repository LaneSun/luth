// Luth Words
// Gen 1
//
// Luth 基本词语

import {
    Word,
    Result,
} from "./luth-core.js";
import {
    preserver,
    collector,
} from "./luth-types.js";

export const str = str => new Word(preserver(ctx => {
    for (const c of str)
        if (c !== ctx.read())
            return Result.Fail();
    return Result.Success(str);
}), "Str");

export const reg = reg => new Word(preserver(ctx => {
    const c = ctx.read();
    if (reg.test(c))
        return Result.Success(c);
    else
        return Result.Fail();
}), "Reg");

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

//