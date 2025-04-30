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

export function selectProperties(obj: any, keys: string[]): any {
    const result: any = {};
    for (const key of keys) {
        if (key in obj) {
            result[key] = obj[key];
        }
    }
    return result;
}

export function containsUpdate(value?: object, existing?: object): boolean {
    if (!value) {
        return false;
    }
    if (!existing) {
        return true;
    }
    for (const key in existing) {
        if (key in value) {
            const valueKey = key as keyof typeof value;
            const existingKey = key as keyof typeof existing;
            if (typeof value[valueKey] === 'object' && typeof existing[existingKey] === 'object') {
                if (containsUpdate(value[valueKey], existing[existingKey])) {
                    return true;
                }
            } else {
                if (value[valueKey] !== existing[existingKey]) {
                    return true;
                }
            }
        }
    }
    return false;
}