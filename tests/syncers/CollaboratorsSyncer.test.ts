import {mockGitHubApi} from "../testutils";
import {CollaboratorsSyncer} from "../../src/syncers/CollaboratorsSyncer";


test('add collaborator', async () => {
    const api = mockGitHubApi();

    const collaborator = {username: 'robvanderleek', permission: 'triage'};

    await new CollaboratorsSyncer().sync(api, false, [collaborator]);

    expect(api.getAll).toHaveBeenCalledWith('/repos/{owner}/{repo}/collaborators');
    expect(api.put).toHaveBeenCalledWith('/repos/{owner}/{repo}/collaborators/{username}', collaborator);
});

test('update collaborator', async () => {
    const api = mockGitHubApi([{login: 'robvanderleek', permissions: {'pull': true}}]);

    const collaborator = {username: 'robvanderleek', permission: 'triage'};

    await new CollaboratorsSyncer().sync(api, false, [collaborator]);

    expect(api.getAll).toHaveBeenCalledWith('/repos/{owner}/{repo}/collaborators');
    expect(api.put).toHaveBeenCalledWith('/repos/{owner}/{repo}/collaborators/{username}', collaborator);
});

test('no update if all is in sync', async () => {
    const api = mockGitHubApi([{login: 'robvanderleek', permissions: {'pull': true}}]);

    const collaborator = {username: 'robvanderleek', permission: 'pull'};

    await new CollaboratorsSyncer().sync(api, false, [collaborator]);

    expect(api.put).toHaveBeenCalledTimes(0);
});

test('delete label', async () => {
    const api = mockGitHubApi(
        [{login: 'robvanderleek', permissions: {'pull': true}}, {login: 'foobar', permissions: {'admin': true}}]);

    await new CollaboratorsSyncer().sync(api, true, [{username: 'robvanderleek', permission: 'pull'}]);

    expect(api.put).toHaveBeenCalledTimes(0);
    expect(api.delete).toHaveBeenCalledWith('/repos/{owner}/{repo}/collaborators/{username}',
        {username: 'foobar', permission: 'admin'});
});

test('no delete if not enabled', async () => {
    const api = mockGitHubApi(
        [{login: 'robvanderleek', permissions: {'pull': true}}, {login: 'foobar', permissions: {'admin': true}}]);

    await new CollaboratorsSyncer().sync(api, false, [{username: 'robvanderleek', permission: 'pull'}]);

    expect(api.put).toHaveBeenCalledTimes(0);
    expect(api.delete).toHaveBeenCalledTimes(0);
});