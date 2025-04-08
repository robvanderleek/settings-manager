declare module '@repository-settings/app' {
    export class Settings {
        static sync(github: Octokit, repo: Repository, config: any): Promise;
    }
}