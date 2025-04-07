import {Context} from "probot";
import {SETTINGS_MANAGER_REPO_NAME, SETTINGS_MANAGER_YML_FILE_NAME} from "./config";

export function getOwner(ctx: Context<any>): string {
    return ctx.payload.repository.owner.login;
}

export function getRepo(ctx: Context<any>): string {
    return ctx.payload.repository.name;
}

export function isSettingsManagerRepo(ctx: Context<any>): boolean {
    return ctx.payload.repository.name === SETTINGS_MANAGER_REPO_NAME;
}

export function isSettingsModified(ctx: Context<'push'>): boolean {
    return ctx.payload.commits.find(
        commit => commit.added.includes(SETTINGS_MANAGER_YML_FILE_NAME) ||
            commit.modified.includes(SETTINGS_MANAGER_YML_FILE_NAME)) !== undefined;
}

export function isDefaultBranch(ctx: Context<'push'>): boolean {
    const defaultBranch = ctx.payload.repository.default_branch;
    const ref = ctx.payload.ref;
    return ref === `refs/heads/${defaultBranch}`;
}