// Luth Core
// Gen 1
//
// Luth 核心类型

const logger = (ctx, handle, name) => {
    const name_width = 16;
    const sight_start = 18;
    const sight_end = 12;
    const start = ctx.offset;
    const res = handle(ctx);
    const end = ctx.offset;
    const range = ctx.stream.slice(start, end).replaceAll('\n', "↵");
    const pre_str = ctx.stream.slice(0, start);
    const column = pre_str.length - pre_str.lastIndexOf('\n') - 1;
    const line = [...pre_str.matchAll('\n')].length;
    const rlen = Math.max(1, range.length);
    const pstart = Math.max(0, start - sight_start + rlen);
    const pend = Math.min(ctx.stream.length, end + sight_end);
    let msg = (name || '').padStart(name_width, ' ') + " |" + ' ';
    msg += line.toString().padStart(2) + ':' + column.toString().padStart(2) + ' | ';
    if (res.is_success())
        msg += "-";
    else
        msg += "X";
    console.log(
        msg + ' %c' +
        '%c' + ctx.stream.slice(pstart, start).replaceAll('\n', "↵").padStart(Math.max(0, sight_start - rlen)) +
        '%c' + (range.length > 0 ? range : '​') +
        '%c' + ctx.stream.slice(end, pend).replaceAll('\n', "↵").padEnd(sight_end),
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
    pname = '';
    handle;
    f_log = false;
    constructor(handle = null, name = '') {
        this.handle = handle;
        this.pname = name;
    }
    matcher(ctx) {
        if (this.f_log || Word.log_all)
            return logger(ctx, () => this.handle(ctx), this.get_name());
        else
            return this.handle(ctx);
    }
    get_name() {
        return this.pname;
    }
    name(name) {
        this.pname = name;
        return this;
    }
    log(name = '') {
        this.pname = name;
        this.f_log = true;
        return this;
    }
    ref(word) {
        this.pname = word.pname;
        this.handle = word.handle;
        this.f_log = word.f_log;
        return this;
    }
    match_from(str, offset = 0) {
        const ctx = new Context();
        ctx.stream = str;
        ctx.offset = offset;
        const res = this.matcher(ctx);
        return res.is_success();
    }
    match_in(str, offset = 0) {
        const ctx = new Context();
        ctx.stream = str;
        ctx.offset = offset;
        while (ctx.offset < ctx.stream.length) {
            const res = this.matcher(ctx);
            if (res.is_success()) return true;
            offset++;
        }
        return false;
    }
    extract_from(str, offset = 0) {
        const ctx = new Context();
        ctx.stream = str;
        ctx.offset = offset;
        const res = this.matcher(ctx);
        if (res.is_success())
            return res.get_results()
        else
            return null;
    }
}

export const TraitWord = {
    handle: null,
    matcher: Word.prototype.matcher,
    get_name: Word.prototype.get_name,
    match_from: Word.prototype.match_from,
    match_in: Word.prototype.match_in,
};

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

export class Pin {
    data;
    constructor(data) {
        this.data = data;
    }
}

export class Pair {
    head; data;
    constructor(head, data) {
        this.head = head;
        this.data = data;
    }
}