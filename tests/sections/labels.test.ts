import {equals} from "../../src/sections/labels";

test('equals', () => {
    const a = {name: 'bug', color: 'red', description: 'A bug'};
    const b = {name: 'bug', color: 'red', description: 'A bug'};
    const c = {name: 'bug', description: 'A bug'};

    expect(equals(a, a)).toBeTruthy();
    expect(equals(a, b)).toBe(true);
    expect(equals(b, a)).toBe(true);
    expect(equals(a, c)).toBe(false);
    expect(equals(c, a)).toBe(true);
});