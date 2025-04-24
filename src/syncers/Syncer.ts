import {GitHubApi} from "../utils/GitHubApi";

export interface Syncer<T> {
    sync(api: GitHubApi, enable_delete: boolean, section: T): Promise<void>;
}