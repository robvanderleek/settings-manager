import {Label} from "../entities/Label";
import {GitHubApi} from "../utils/GitHubApi";
import {Syncer} from "./Syncer";
import {containsUpdate} from "../utils";


export class LabelsSyncer implements Syncer<Label[]> {

    async sync(api: GitHubApi, enable_delete: boolean, labels: Label[]) {
        const existingLabels = await api.getAll('/repos/{owner}/{repo}/labels') as Label[];
        for (const l of labels) {
            const existingLabel = existingLabels.find((el: Label) => el.name === l.name);
            if (existingLabel) {
                if (containsUpdate(l, existingLabel)) {
                    await api.patch('/repos/{owner}/{repo}/labels/{name}', l);
                }
            } else {
                await api.post('/repos/{owner}/{repo}/labels', l);
            }
        }
        if (enable_delete) {
            for (const el of existingLabels) {
                if (!labels.some((l: Label) => l.name === el.name)) {
                    await api.delete('/repos/{owner}/{repo}/labels/{name}', el);
                }
            }
        }
    }

}