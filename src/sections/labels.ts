import {Context} from "probot";
import {getOwner, getRepo} from "../context";
import {Label} from "../entities/Label";

export function equals(a: Label, b: Label) {
    return a.name === b.name &&
        (a.color === undefined || a.color === b.color) &&
        (a.description === undefined || a.description === b.description);
}

async function createLabels(ctx: Context<any>, labels: Label[]) {
    for (const l of labels) {
        await ctx.octokit.request(`POST /repos/${getOwner(ctx)}/${getRepo(ctx)}/labels`, {
            ...l
        });
    }
}

async function updateLabels(ctx: Context<any>, labels: Label[]) {
    for (const l of labels) {
        await ctx.octokit.request(`PATCH /repos/${getOwner(ctx)}/${getRepo(ctx)}/labels/${encodeURIComponent(l.name)}`, {
            ...l
        });
    }
}

async function deleteLabels(ctx: Context<any>, labels: Label[]) {
    for (const l of labels) {
        await ctx.octokit.request(`DELETE /repos/${getOwner(ctx)}/${getRepo(ctx)}/labels/${encodeURIComponent(l.name)}`);
    }
}

export async function syncLabels(ctx: Context<any>, enable_delete: boolean, labels: Label[]) {
    const owner = getOwner(ctx);
    const repo = getRepo(ctx);
    const existingLabels = await ctx.octokit.paginate(`GET /repos/${owner}/${repo}/labels`) as Label[];
    const map = existingLabels.reduce((map, l) => {
        map[l.name] = l; return map
    }, {} as {[name: string]: Label});
    const newLabels = labels.filter((l: Label) => !map.hasOwnProperty(l.name));
    const updatedLabels = labels.filter((l: Label) => map.hasOwnProperty(l.name) && !equals(l, map[l.name]));
    await createLabels(ctx, newLabels);
    await updateLabels(ctx, updatedLabels);
    if (enable_delete) {
        const deletedLabels = existingLabels.filter((l: Label) => !labels.some((nl: Label) => nl.name === l.name));
        await deleteLabels(ctx, deletedLabels);
    }
}