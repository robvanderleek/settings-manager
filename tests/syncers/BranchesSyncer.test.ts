import {BranchesSyncer} from "../../src/syncers/BranchesSyncer";
import {mockGitHubApi} from "../testutils";


test('add branch protection', async () => {
    const api = mockGitHubApi();

    const branch = {name: 'develop', protection: {required_pull_request_reviews: {required_approving_review_count: 1}}};

    await new BranchesSyncer().sync(api, false, [branch]);

    expect(api.getAll).toHaveBeenCalledWith('/repos/{owner}/{repo}/branches?protected=true');
    expect(api.put).toHaveBeenCalledWith('/repos/{owner}/{repo}/branches/{name}/protection', branch.protection);
});

test('update branch protection', async () => {
    const api = mockGitHubApi(
        [{name: 'develop', protection: {required_pull_request_reviews: {required_approving_review_count: 1}}}]);

    const branch = {name: 'develop', protection: {required_pull_request_reviews: {required_approving_review_count: 2}}};

    await new BranchesSyncer().sync(api, false, [branch]);

    expect(api.getAll).toHaveBeenCalledWith('/repos/{owner}/{repo}/branches?protected=true');
    expect(api.put).toHaveBeenCalledWith('/repos/{owner}/{repo}/branches/{name}/protection', branch.protection);
});

test('no update if all is in sync', async () => {
    const api = mockGitHubApi(
        [{name: 'develop', protection: {required_pull_request_reviews: {required_approving_review_count: 1}}}]);

    const branch = {name: 'develop', protection: {required_pull_request_reviews: {required_approving_review_count: 1}}};

    await new BranchesSyncer().sync(api, false, [branch]);

    expect(api.post).toHaveBeenCalledTimes(0);
    expect(api.put).toHaveBeenCalledTimes(0);
});

test('delete label', async () => {
    const branch = {name: 'develop', protection: {required_pull_request_reviews: {required_approving_review_count: 1}}}
    const api = mockGitHubApi([branch]);

    await new BranchesSyncer().sync(api, true, []);

    expect(api.put).toHaveBeenCalledTimes(0);
    expect(api.delete).toHaveBeenCalledWith('/repos/{owner}/{repo}/branches/{name}/protection', branch);
});

test('no delete if not enabled', async () => {
    const branch = {name: 'develop', protection: {required_pull_request_reviews: {required_approving_review_count: 1}}}
    const api = mockGitHubApi([branch]);

    await new BranchesSyncer().sync(api, false, []);

    expect(api.put).toHaveBeenCalledTimes(0);
    expect(api.delete).toHaveBeenCalledTimes(0);
});