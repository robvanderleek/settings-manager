import {Logger, ProbotOctokit} from "probot";

export class GitHubApi {
    constructor(private readonly owner: string, private readonly repo: string, private readonly octokit: ProbotOctokit, private readonly log: Logger) {
        log.info(`API initialized for ${owner}/${repo}`);
    }

    async post(endpoint: string, entity: any): Promise<void> {
        this.log.info(`POST ${endpoint}`);
        await this.octokit.request(`POST ${endpoint}`, {owner: this.owner, repo: this.repo, ...entity});
    }

    async put(endpoint: string, entity: any): Promise<void> {
        this.log.info(`PUT ${endpoint}`);
        await this.octokit.request(`PUT ${endpoint}`, {owner: this.owner, repo: this.repo, ...entity});
    }

    async get(endpoint: string, entity: any): Promise<any> {
        this.log.info(`GET ${endpoint}`);
        return await this.octokit.request(`GET ${endpoint}`, {owner: this.owner, repo: this.repo, ...entity});
    }

    async getAll(endpoint: string): Promise<any[]> {
        this.log.info(`GET ${endpoint}`);
        return await this.octokit.paginate(`GET ${endpoint}`, {owner: this.owner, repo: this.repo});
    }

    async patch(endpoint: string, entity: any): Promise<void> {
        this.log.info(`PATCH ${endpoint}`);
        await this.octokit.request(`PATCH ${endpoint}`, {owner: this.owner, repo: this.repo, ...entity});
    }

    async delete(endpoint: string, entity: any): Promise<void> {
        this.log.info(`DELETE ${endpoint}`);
        await this.octokit.request(`DELETE ${endpoint}`, {owner: this.owner, repo: this.repo, ...entity});
    }
}