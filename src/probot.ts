import {Context, Probot} from "probot";
import {ApplicationFunctionOptions} from "probot/lib/types";
import {gitDate, gitSha, version} from "./version";
import {isDefaultBranch, isSettingsManagerRepo, isSettingsModified} from "./context";
import {Settings} from "@repository-settings";

export const app = (app: Probot, {getRouter}: ApplicationFunctionOptions) => {
    const buildDate = gitDate.toISOString().substring(0, 10);
    app.log.info(`Settings Manager, version: ${version}, revision: ${gitSha.substring(0, 8)}, built on: ${buildDate}`);

    app.on('push', async (ctx: Context<'push'>) => {
        if (isSettingsManagerRepo(ctx) && isDefaultBranch(ctx) && isSettingsModified(ctx)) {
            app.log.info('Settings Manager settings modified!');
            const config = await ctx.config('settings-manager.yml');
            await Settings.sync(ctx.octokit, ctx.payload.repository, config);
        }
    });
}

export default app;
