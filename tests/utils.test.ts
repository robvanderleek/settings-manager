import {containsUpdate, selectProperties} from "../src/utils";

test('select properties', () => {
    const obj = {name: 'foo', description: 'foo bar', homepage: 'https://foo'};

    const result = selectProperties(obj, ['description', 'homepage']);

    expect(result).toHaveProperty('description');
    expect(result).toHaveProperty('homepage');
    expect(result).not.toHaveProperty('name');
});

test('containsUpdate', () => {
    const a = {name: 'bug', color: 'red', description: 'A bug'};
    const b = {name: 'bug', color: 'red', description: 'A bug'};
    const c = {name: 'bug', description: 'A bug'};
    const d = {name: 'bug', color: 'orange', description: 'A bug'};

    expect(containsUpdate(a, a)).toBe(false);
    expect(containsUpdate(a, b)).toBe(false);
    expect(containsUpdate(b, a)).toBe(false);
    expect(containsUpdate(a, c)).toBe(false);
    expect(containsUpdate(c, a)).toBe(false);
    expect(containsUpdate(d, a)).toBe(true);
    expect(containsUpdate(a, d)).toBe(true);
    expect(containsUpdate(undefined, a)).toBe(false);
    expect(containsUpdate(a, undefined)).toBe(true);
});

test('containsUpdate with nested object', () => {
    const a = {name: 'develop', protection: {required_pull_request_reviews: {required_approving_review_count: 1}}};
    const b = {name: 'develop', protection: {required_pull_request_reviews: {required_approving_review_count: 1}}};
    const c = {name: 'develop', protection: {required_pull_request_reviews: {required_approving_review_count: 2}}};

    expect(containsUpdate(a, a)).toBe(false);
    expect(containsUpdate(a, b)).toBe(false);
    expect(containsUpdate(b, a)).toBe(false);
    expect(containsUpdate(a, c)).toBe(true);
    expect(containsUpdate(c, a)).toBe(true);
});