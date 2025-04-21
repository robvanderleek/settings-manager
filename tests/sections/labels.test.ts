import {equals, syncLabels} from "../../src/sections/labels";
import {GitHubApi} from "../../src/utils/GitHubApi";
import {Label} from "../../src/entities/Label";

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

function mockGitHubApi(labels: Label[] = []): GitHubApi {
    return {
        post: jest.fn(),
        getAll: jest.fn().mockResolvedValue(labels),
        patch: jest.fn(),
        delete: jest.fn(),
    } as unknown as GitHubApi;
}

test('add label', async () => {
    const api = mockGitHubApi();

    const label = {name: 'bug', color: 'red', description: 'A bug'};

    await syncLabels(api, false, [label]);

    expect(api.getAll).toHaveBeenCalledWith('/repos/{owner}/{repo}/labels');
    expect(api.post).toHaveBeenCalledWith('/repos/{owner}/{repo}/labels', label);
    expect(api.patch).toHaveBeenCalledTimes(0);
});

test('update label', async () => {
    const api = mockGitHubApi([{name: 'bug', color: 'red', description: 'A bug'}]);

    const label = {name: 'bug', color: 'red', description: 'A nasty bug'};

    await syncLabels(api, false, [label]);

    expect(api.getAll).toHaveBeenCalledWith('/repos/{owner}/{repo}/labels');
    expect(api.post).toHaveBeenCalledTimes(0);
    expect(api.patch).toHaveBeenCalledWith('/repos/{owner}/{repo}/labels/{name}', label);
});

test('no update if all is in sync', async () => {
    const api = mockGitHubApi([{name: 'bug', color: 'red', description: 'A bug'}]);

    const label = {name: 'bug', color: 'red', description: 'A bug'};

    await syncLabels(api, false, [label]);

    expect(api.post).toHaveBeenCalledTimes(0);
    expect(api.patch).toHaveBeenCalledTimes(0);
});

test('delete label', async () => {
    const featureLabel = {name: 'feature', color: 'blue', description: 'A feature'};
    const api = mockGitHubApi([{name: 'bug', color: 'red', description: 'A bug'}, featureLabel]);

    const label = {name: 'bug', color: 'red', description: 'A bug'};

    await syncLabels(api, true, [label]);

    expect(api.post).toHaveBeenCalledTimes(0);
    expect(api.patch).toHaveBeenCalledTimes(0);
    expect(api.delete).toHaveBeenCalledWith('/repos/{owner}/{repo}/labels/{name}', featureLabel);
});