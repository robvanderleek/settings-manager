import {selectProperties} from "../utils";
import {GitHubApi} from "../utils/GitHubApi";
import {General} from "../entities/General";
import {Syncer} from "./Syncer";

export class GeneralSyncer implements Syncer<General> {

    async sync(api: GitHubApi, _: boolean, section: General) {
        const supportedSettings = selectProperties(section,
            ['description', 'homepage', 'private', 'security_and_analysis', 'has_issues', 'has_projects',
                'has_wiki', 'is_template', 'default_branch', 'allow_squash_merge', 'allow_merge_commit',
                'allow_rebase_merge', 'allow_auto_merge', 'delete_branch_on_merge', 'allow_update_branch',
                'squash_merge_commit_title', 'squash_merge_commit_message', 'merge_commit_title',
                'merge_commit_message', 'archived', 'allow_forking', 'web_commit_signoff_required']);
        await api.patch(`/repos/{owner}/{repo}`, supportedSettings);
    }

}