import {Context, Probot} from "probot";
import {ApplicationFunctionOptions} from "probot/lib/types";
import {gitDate, gitSha, version} from "./version";
import {isDefaultBranch, isSettingsModified} from "./context";
import {Settings} from "./entities/Settings";
import {syncGeneral} from "./sections/general";
import {createCommitStatus} from "./github";
import {syncLabels} from "./sections/labels";

export const app = (app: Probot, {getRouter}: ApplicationFunctionOptions) => {
    const buildDate = gitDate.toISOString().substring(0, 10);
    app.log.info(`Settings  Manager, version: ${version}, revision: ${gitSha.substring(0, 8)}, built on: ${buildDate}`);

    app.on('push', async (ctx: Context<'push'>) => {
            if (isDefaultBranch(ctx) && isSettingsModified(ctx)) {
                const settings = await ctx.config<Settings>('settings-manager.yml');
                if (settings) {
                    try {
                        if (settings.repository) {
                            await syncGeneral(ctx, settings.repository);
                        }
                        if (settings.labels) {
                            await syncLabels(ctx, false, settings.labels);
                        }
                        await createCommitStatus(ctx, 'success', 'Repository settings updated');
                    } catch (e: any) {
                        let description = `${e.response.data.message} (${e.response.status})`;
                        if ('errors' in e.response.data) {
                            description += `: ${e.response.data.errors[0].message}`;
                        }
                        app.log.error(`Error updating settings: ${description}`);
                        await createCommitStatus(ctx, 'error', description.substring(0, 140));
                    }
                }
            }
        }
    );
}

export default app;
