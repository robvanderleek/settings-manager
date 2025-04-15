import {selectProperties} from "../src/utils";

test('select properties', () => {
    const obj = {name: 'foo', description: 'foo bar', homepage: 'https://foo'};

    const result = selectProperties(obj, ['description', 'homepage']);

    expect(result).toHaveProperty('description');
    expect(result).toHaveProperty('homepage');
    expect(result).not.toHaveProperty('name');
});