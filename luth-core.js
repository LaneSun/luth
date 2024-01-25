// Luth Core
// Gen 1
//
// Luth 核心类型

const logger = (handle, log, name = null) => ctx => {
    const start = ctx.offset;
    const pstart = Math.max(0, start - 8);
    const res = handle(ctx);
    const end = ctx.offset;
    const pend = Math.min(ctx.stream.length, end + 8);
    let msg = name ? name + ' ' : '';
    if (res.is_success())
        msg += "-";
    else
        msg += "X";
    const range = ctx.stream.slice(start, end);
    log(
        msg + ' %c' +
        '%c' + ctx.stream.slice(pstart, start) +
        '%c' + (range.length ? range : '​') +
        '%c' + ctx.stream.slice(end, pend),
        "font-family: monospace;",
        "color: grey; background: none",
        `
            color: white;
            background: green;
            outline: solid green 1px;
        `,
        "color: grey; background: none",
        ...(Word.log_result ? [res.get_results()] : []),
    );
    return res;
};

export class Word {
    static log_all = false;
    static log_result = false;
    handle;
    constructor(handle = null, name = null) {
        if (handle) {
            if (Word.log_all)
                this.matcher = logger(
                    handle,
                    console.log.bind(console),
                    (name || '').padStart(8, ' ') + " |",
                );
            else
                this.matcher = handle;
        }
    }
    match_from(str, offset = 0) {
        const ctx = new Context();
        ctx.stream = str;
        ctx.offset = offset;
        const res = this.matcher(ctx);
        return res.is_success();
    }
    log(name = null) {
        this.matcher = logger(this.matcher, console.warn.bind(console), name);
        return this;
    }
}

export class Context {
    static StreamReachEnd = Symbol("Context::StreamReachEnd");
    root = null;
    stream = "";
    offset = 0;
    copy_to(ctx) {
        ctx.root = this.root;
        ctx.stream = this.stream;
        ctx.offset = this.offset;
    }
    extend_to(ctx) {
        ctx.root = this;
        ctx.stream = this.stream;
        ctx.offset = this.offset;
    }
    merge_from(ctx) {
        this.offset = ctx.offset;
    }
    clone() {
        const ctx = new this.constructor();
        this.copy_to(ctx);
        return ctx;
    }
    extend() {
        const ctx = new this.constructor();
        this.extend_to(ctx);
        return ctx;
    }
    merge(ctx) {
        this.merge_from(ctx);
    }
    read() {
        if (this.offset < this.stream.length) {
            const c = this.stream.charAt(this.offset);
            this.offset++;
            return c;
        } else
            throw Context.StreamReachEnd;
    }
}

export class Result {
    type;
    data;
    static TypeSuccess = Symbol("Result::TypeSuccess");
    static TypeFail = Symbol("Result::TypeFail");
    static Success(...datav) {
        const res = new Result(Result.TypeSuccess);
        res.data = datav;
        return res;
    }
    static Successv(datav) {
        const res = new Result(Result.TypeSuccess);
        res.data = datav;
        return res;
    }
    static Fail() {
        const res = new Result(Result.TypeFail);
        return res;
    }
    constructor(type) {
        this.type = type;
    }
    get_results() {
        return this.data;
    }
    is_success() {
        return this.type === Result.TypeSuccess;
    }
}