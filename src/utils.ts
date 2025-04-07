import {Context} from "probot";
import {SETTINGS_MANAGER_YML_FILE_NAME} from "./config";
import {parse} from "yaml";
import {getOwner, getRepo} from "./context";
import {Settings} from "./entities/Settings";

async function loadSettings(ctx: Context<'push'>): Promise<Settings> {
    const res = await ctx.octokit.repos.getContent({
        owner: getOwner(ctx),
        repo: getRepo(ctx),
        path: SETTINGS_MANAGER_YML_FILE_NAME
    }) as any;
    const yaml = Buffer.from(res.data.content, 'base64').toString();
    return parse(yaml) as Settings;
}