import {Label} from "../entities/Label";
import {GitHubApi} from "../utils/GitHubApi";

export function equals(a: Label, b: Label) {
    return a.name === b.name &&
        (a.color === undefined || a.color === b.color) &&
        (a.description === undefined || a.description === b.description);
}

async function createLabel(api: GitHubApi, label: Label) {
    await api.post('/repos/{owner}/{repo}/labels', label);
}

async function getLabels(api: GitHubApi): Promise<Label[]> {
    return await api.getAll('/repos/{owner}/{repo}/labels') as Label[];
}

async function updateLabel(api: GitHubApi, label: Label) {
    await api.patch('/repos/{owner}/{repo}/labels/{name}', label);
}

async function deleteLabel(api: GitHubApi, label: Label) {
    await api.delete('/repos/{owner}/{repo}/labels/{name}', label);
}

export async function syncLabels(api: GitHubApi, enable_delete: boolean, labels: Label[]) {
    const existingLabels = await getLabels(api);
    for (const l of labels) {
        const existingLabel = existingLabels.find((el: Label) => el.name === l.name);
        if (existingLabel) {
            if (!equals(l, existingLabel)) {
                await updateLabel(api, l);
            }
        } else {
            await createLabel(api, l);
        }
    }
    if (enable_delete) {
        for (const el of existingLabels) {
            if (!labels.some((l: Label) => l.name === el.name)) {
                await deleteLabel(api, el);
            }
        }
    }
}