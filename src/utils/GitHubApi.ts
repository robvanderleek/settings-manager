import {ProbotOctokit} from "probot";

export class GitHubApi {
    constructor(private readonly owner: string, private readonly repo: string, private readonly octokit: ProbotOctokit) {
    }

    async post(endpoint: string, body: any): Promise<void> {
        await this.octokit.request(`POST ${endpoint}`, {owner: this.owner, repo: this.repo, ...body});
    }

    async getAll(endpoint: string): Promise<any[]> {
        return await this.octokit.paginate(`GET ${endpoint}}`);
    }

    async patch(endpoint: string, body: any): Promise<void> {
        await this.octokit.request(`PATCH ${endpoint}}`, {owner: this.owner, repo: this.repo, ...body});
    }

    async delete(endpoint: string, body: any): Promise<void> {
        await this.octokit.request(`DELETE ${endpoint}}`, {owner: this.owner, repo: this.repo, ...body});
    }
}