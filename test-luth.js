import {
    Word,
    seq,
    reg,
    str,
    some,
    any,
} from "./luth.js";

Word.log_all = true;
Word.log_result = true;
console.log(
    seq(some(reg(/[A-Z]/)), str(' '), any(reg(/[a-z]/)), str('!'))
    .match_from("HELLO world!")
);