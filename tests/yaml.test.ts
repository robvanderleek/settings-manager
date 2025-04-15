import {parse} from "yaml";
import {Organization} from "../src/entities/Organization";

test('parse simple yaml', () => {
    let yamlString = '';
    yamlString += 'org:\n';
    yamlString += '  issue_types:\n';
    yamlString += '    - name: hello\n';
    yamlString += '    - name: world\n';

    const result = parse(yamlString);
    const org = result.org as Organization;

    expect(org).toBeDefined();
    expect(org.issue_types).toBeDefined();
    expect(org.issue_types).toHaveLength(2);
    // @ts-ignore
    expect(org.issue_types[0].name).toBe('hello');
    // @ts-ignore
    expect(org.issue_types[1].name).toBe('world');
});