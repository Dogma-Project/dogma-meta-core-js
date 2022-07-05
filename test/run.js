var expect = require("chai").expect;
const init = require("../index");

describe("run app", () => {
    describe("init", () => {
        it("start", (done) => {
            const result = init();
            expect(result).to.have.keys(["api", "ee"]);
            done();
        });
    });
});