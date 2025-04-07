declare module '@repository-settings' {
    export class Settings {
        static sync(github: Octokit, repo: Repository, config: any): Promise;
    }
}