import {Context, Probot} from "probot";
import {ApplicationFunctionOptions} from "probot/lib/types";
import {gitDate, gitSha, version} from "./version";
import {getOwner, getRepo, isDefaultBranch, isSettingsModified} from "./context";
import {Settings} from "./entities/Settings";
import {selectProperties} from "./utils";

export const app = (app: Probot, {getRouter}: ApplicationFunctionOptions) => {
    const buildDate = gitDate.toISOString().substring(0, 10);
    app.log.info(`Settings  Manager, version: ${version}, revision: ${gitSha.substring(0, 8)}, built on: ${buildDate}`);

    app.on('push', async (ctx: Context<'push'>) => {
        if (isDefaultBranch(ctx) && isSettingsModified(ctx)) {
            app.log.info('Settings Manager settings modified!');
            const settings = await ctx.config<Settings>('settings-manager.yml');
            if (settings && settings.repository) {
                const owner = getOwner(ctx);
                const repo = getRepo(ctx);
                const supportedSettings = selectProperties(settings.repository,
                    ['description', 'homepage', 'private', 'security_and_analysis', 'has_issues', 'has_projects',
                        'has_wiki', 'is_template', 'default_branch', 'allow_squash_merge', 'allow_merge_commit',
                        'allow_rebase_merge', 'allow_auto_merge', 'delete_branch_on_merge', 'allow_update_branch',
                        'squash_merge_commit_title', 'squash_merge_commit_message', 'merge_commit_title',
                        'merge_commit_message', 'archived', 'allow_forking', 'web_commit_signoff_required']);
                console.log(supportedSettings);
                try {
                    await ctx.octokit.request(`PATCH /repos/${owner}/${repo}`, supportedSettings);
                    const sha = ctx.payload.after;
                    await ctx.octokit.repos.createCommitStatus({
                        owner: owner,
                        repo: repo,
                        sha: sha,
                        state: 'success',
                        description: 'Repository settings updated',
                        context: 'Settings Manager'
                    });
                } catch (e: any) {
                    let description = e.response.data.message;
                    if ('errors' in e.response.data) {
                        description += `: ${e.response.data.errors[0].message}`;
                    }
                    const sha = ctx.payload.after;
                    await ctx.octokit.repos.createCommitStatus({
                        owner: owner,
                        repo: repo,
                        sha: sha,
                        state: 'error',
                        description: description.substring(0, 140),
                        context: 'Settings Manager'
                    });
                }
            }
        }
    });
}

export default app;
