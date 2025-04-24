import {parse} from "yaml";
import {General} from "../src/entities/General";

test('parse simple yaml', () => {
    let yamlString = '';
    yamlString += 'general:\n';
    yamlString += '  description: Hello world\n';

    const result = parse(yamlString);
    const general = result.general as General;

    expect(general).toBeDefined();
    expect(general.description).toBeDefined();
    expect(general.description).toBe('Hello world');
});