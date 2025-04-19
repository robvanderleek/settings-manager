import {Context} from "probot";
import {getOwner, getRepo} from "../context";
import {selectProperties} from "../utils";

export async function syncGeneral(ctx: Context<any>, settings: any) {
    const owner = getOwner(ctx);
    const repo = getRepo(ctx);
    const supportedSettings = selectProperties(settings,
        ['description', 'homepage', 'private', 'security_and_analysis', 'has_issues', 'has_projects',
            'has_wiki', 'is_template', 'default_branch', 'allow_squash_merge', 'allow_merge_commit',
            'allow_rebase_merge', 'allow_auto_merge', 'delete_branch_on_merge', 'allow_update_branch',
            'squash_merge_commit_title', 'squash_merge_commit_message', 'merge_commit_title',
            'merge_commit_message', 'archived', 'allow_forking', 'web_commit_signoff_required']);
    await ctx.octokit.request(`PATCH /repos/${owner}/${repo}`, supportedSettings);
}