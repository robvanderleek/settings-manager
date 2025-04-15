import {Context, Probot} from "probot";
import {ApplicationFunctionOptions} from "probot/lib/types";
import {gitDate, gitSha, version} from "./version";
import {getOwner, getRepo, isDefaultBranch, isSettingsManagerRepo, isSettingsModified} from "./context";
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
                const supportedSettings = selectProperties(settings.repository, ['description', 'homepage', 'private']);
                console.log(supportedSettings);
                try {
                    await ctx.octokit.request(`PATCH /repos/${owner}/${repo}`, supportedSettings);
                    const sha = ctx.payload.after;
                    await ctx.octokit.repos.createCommitStatus({
                        owner: owner,
                        repo: repo,
                        sha: sha,
                        state: 'success',
                        description: 'Settings Manager settings updated',
                        context: 'Settings Manager'
                    });
                } catch (e: any) {
                    const description = `${e.response.data.message}: ${e.response.data.errors[0].message}`;
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
