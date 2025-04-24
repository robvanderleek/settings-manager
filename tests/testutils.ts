import {GitHubApi} from "../src/utils/GitHubApi";

export function mockGitHubApi<T>(entities: T[] = []): GitHubApi {
    return {
        post: jest.fn(),
        put: jest.fn(),
        getAll: jest.fn().mockResolvedValue(entities),
        patch: jest.fn(),
        delete: jest.fn(),
    } as unknown as GitHubApi;
}