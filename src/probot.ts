import {Context, Probot} from "probot";
import {ApplicationFunctionOptions} from "probot/lib/types";
import {gitDate, gitSha, version} from "./version";
import {getOwner, getRepo, isDefaultBranch, isSettingsModified} from "./context";
import {Settings} from "./entities/Settings";
import {GeneralSyncer} from "./syncers/GeneralSyncer";
import {createCommitStatus} from "./github";
import {GitHubApi} from "./utils/GitHubApi";
import {LabelsSyncer} from "./syncers/LabelsSyncer";
import {Syncer} from "./syncers/Syncer";
import {CollaboratorsSyncer} from "./syncers/CollaboratorsSyncer";
import {BranchesSyncer} from "./syncers/BranchesSyncer";

export const app = (app: Probot, {getRouter}: ApplicationFunctionOptions) => {
    const buildDate = gitDate.toISOString().substring(0, 10);
    app.log.info(`Settings  Manager, version: ${version}, revision: ${gitSha.substring(0, 8)}, built on: ${buildDate}`);

    app.on('push', async (ctx: Context<'push'>) => {
            if (isDefaultBranch(ctx) && isSettingsModified(ctx)) {
                const settings = await ctx.config<Settings>('settings-manager.yml');
                // TODO: Use Zod to validate the settings? https://github.com/colinhacks/zod?
                if (settings) {
                    const api = new GitHubApi(getOwner(ctx), getRepo(ctx), ctx.octokit, app.log);
                    const syncerMap: { [k: string]: Syncer<any> } = {};
                    syncerMap['general'] = new GeneralSyncer();
                    syncerMap['labels'] = new LabelsSyncer();
                    syncerMap['collaborators'] = new CollaboratorsSyncer();
                    syncerMap['branches'] = new BranchesSyncer();
                    try {
                        type SettingsKey = keyof typeof settings;
                        for (const key in syncerMap) {
                            const syncer = syncerMap[key];
                            const section = key as SettingsKey;
                            if (section in settings) {
                                await syncer.sync(api, false, settings[section]);
                            }
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
