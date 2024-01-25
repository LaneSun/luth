// Luth Types
// Gen 1
//
// Luth 基本拓展库

import {Context, Result} from "./luth-core.js";

export const try_read = handle => ctx => {
    try {
        const result = handle(ctx);
        return result;
    } catch (e) {
        if (e === Context.StreamReachEnd) {
            return Result.Fail();
        } else
            throw e;
    }
};

export const preserver = handle => ctx => {
    const nctx = ctx.extend();
    const result = handle(nctx);
    if (result.is_success()) ctx.merge(nctx);
    return result;
};

class CollectedContext extends Context {
    results = [];
    copy_to(ctx) {
        super.copy_to(ctx);
        ctx.results = [...this.results];
    }
    static from(ctx) {
        const nctx = new CollectedContext();
        ctx.extend_to(nctx);
        return nctx;
    }
    try_match(word) {
        const ctx = this.extend();
        const res = word.matcher(ctx);
        if (res.is_success()) {
            this.merge(ctx);
            this.results.push(...res.get_results());
            return true;
        } else
            return false;
    }
}

export const collector = handle => ctx => {
    const nctx = CollectedContext.from(ctx);
    const res = handle(nctx);
    if (res) {
        ctx.merge(nctx);
        return Result.Successv(nctx.results);
    } else
        return Result.Fail();
};