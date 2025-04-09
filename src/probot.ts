import {Context, Probot} from "probot";
import {ApplicationFunctionOptions} from "probot/lib/types";
import {gitDate, gitSha, version} from "./version";
import {getOwner, getRepo, isDefaultBranch, isSettingsManagerRepo, isSettingsModified} from "./context";
import {Settings} from "./entities/Settings";

export const app = (app: Probot, {getRouter}: ApplicationFunctionOptions) => {
    const buildDate = gitDate.toISOString().substring(0, 10);
    app.log.info(`Settings  Manager, version: ${version}, revision: ${gitSha.substring(0, 8)}, built on: ${buildDate}`);

    app.on('push', async (ctx: Context<'push'>) => {
        if (isSettingsManagerRepo(ctx) && isDefaultBranch(ctx) && isSettingsModified(ctx)) {
            app.log.info('Settings Manager settings modified!');
            const settings = await ctx.config<Settings>('settings-manager.yml');
            if (settings && settings.repository) {
                const owner = getOwner(ctx);
                const repo = getRepo(ctx);
                console.log(settings.repository);
                await ctx.octokit.request(`PATCH /repos/${owner}/${repo}`, settings.repository);
                const sha = ctx.payload.after;
                await ctx.octokit.repos.createCommitStatus({
                    owner: owner,
                    repo: repo,
                    sha: sha,
                    state: 'success',
                    description: 'Settings Manager settings updated',
                    context: 'Settings Manager'
                });
            }
        }
    });
}

export default app;
