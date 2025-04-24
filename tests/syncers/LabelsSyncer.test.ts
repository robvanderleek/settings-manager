import {LabelsSyncer} from "../../src/syncers/LabelsSyncer";
import {mockGitHubApi} from "../testutils";


test('add label', async () => {
    const api = mockGitHubApi();

    const label = {name: 'bug', color: 'red', description: 'A bug'};

    await new LabelsSyncer().sync(api, false, [label]);

    expect(api.getAll).toHaveBeenCalledWith('/repos/{owner}/{repo}/labels');
    expect(api.post).toHaveBeenCalledWith('/repos/{owner}/{repo}/labels', label);
    expect(api.patch).toHaveBeenCalledTimes(0);
});

test('update label', async () => {
    const api = mockGitHubApi([{name: 'bug', color: 'red', description: 'A bug'}]);

    const label = {name: 'bug', color: 'red', description: 'A nasty bug'};

    await new LabelsSyncer().sync(api, false, [label]);

    expect(api.getAll).toHaveBeenCalledWith('/repos/{owner}/{repo}/labels');
    expect(api.post).toHaveBeenCalledTimes(0);
    expect(api.patch).toHaveBeenCalledWith('/repos/{owner}/{repo}/labels/{name}', label);
});

test('no update if all is in sync', async () => {
    const api = mockGitHubApi([{name: 'bug', color: 'red', description: 'A bug'}]);

    const label = {name: 'bug', color: 'red', description: 'A bug'};

    await new LabelsSyncer().sync(api, false, [label]);

    expect(api.post).toHaveBeenCalledTimes(0);
    expect(api.patch).toHaveBeenCalledTimes(0);
});

test('delete label', async () => {
    const featureLabel = {name: 'feature', color: 'blue', description: 'A feature'};
    const api = mockGitHubApi([{name: 'bug', color: 'red', description: 'A bug'}, featureLabel]);

    const label = {name: 'bug', color: 'red', description: 'A bug'};

    await new LabelsSyncer().sync(api, true, [label]);

    expect(api.post).toHaveBeenCalledTimes(0);
    expect(api.patch).toHaveBeenCalledTimes(0);
    expect(api.delete).toHaveBeenCalledWith('/repos/{owner}/{repo}/labels/{name}', featureLabel);
});

test('no delete if not enabled', async () => {
    const featureLabel = {name: 'feature', color: 'blue', description: 'A feature'};
    const api = mockGitHubApi([{name: 'bug', color: 'red', description: 'A bug'}, featureLabel]);

    const label = {name: 'bug', color: 'red', description: 'A bug'};

    await new LabelsSyncer().sync(api, false, [label]);

    expect(api.post).toHaveBeenCalledTimes(0);
    expect(api.patch).toHaveBeenCalledTimes(0);
    expect(api.delete).toHaveBeenCalledTimes(0);
});