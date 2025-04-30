import {Label} from "../entities/Label";
import {GitHubApi} from "../utils/GitHubApi";
import {Syncer} from "./Syncer";
import {containsUpdate} from "../utils";
import {Branch} from "../entities/Branch";


export class BranchesSyncer implements Syncer<Branch[]> {

    async sync(api: GitHubApi, enable_delete: boolean, branches: Branch[]) {
        const existingBranches = await api.getAll('/repos/{owner}/{repo}/branches?protected=true') as Branch[];
        for (const b of branches) {
            const existingBranch = existingBranches.find((eb: Label) => eb.name === b.name);
            if (existingBranch) {
                if (containsUpdate(b.protection, existingBranch.protection)) {
                    await api.put('/repos/{owner}/{repo}/branches/{name}/protection', b.protection);
                }
            } else {
                await api.put('/repos/{owner}/{repo}/branches/{name}/protection', b.protection);
            }
        }
        if (enable_delete) {
            for (const eb of existingBranches) {
                if (!branches.some((b: Branch) => b.name === eb.name)) {
                    if (eb.protection) {
                        await api.delete('/repos/{owner}/{repo}/branches/{name}/protection', eb);
                    }
                }
            }
        }
    }

}