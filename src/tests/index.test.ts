import {log, error} from "../index";

describe('Basic Tests', () => {
    test('Does even work?', () => {
        const e = new Error("TEST ERROR");
        log("LOG", 123, [1, 2, 3]);
        log(e, "LOG", 123, [1, 2, 3]);
        error("LOG", 123, [1, 2, 3]);
        try {
            error(e, "LOG", 123, [1, 2, 3]);
        }catch (e1){
            expect(String(e) === String(e1));
        }
    });
});



