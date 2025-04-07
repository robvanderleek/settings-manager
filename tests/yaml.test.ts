import {parse} from "yaml";
import {Org} from "../src/entities/Organization";

test('parse simple yaml', () => {
    let yamlString = '';
    yamlString += 'org:\n';
    yamlString += '  issue_types:\n';
    yamlString += '    - name: hello\n';
    yamlString += '    - name: world\n';

    const result = parse(yamlString);
    const org = result.org as Org;

    if (org.issue_types) {
        for (const it of org.issue_types) {
            console.log(`it:  ${it.name}`);
        }
    }
})