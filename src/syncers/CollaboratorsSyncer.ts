import {GitHubApi} from "../utils/GitHubApi";
import {Syncer} from "./Syncer";
import {containsUpdate} from "../utils";
import {Collaborator} from "../entities/Collaborator";


export class CollaboratorsSyncer implements Syncer<Collaborator[]> {

    resultItemToCollaborator(item: any): Collaborator {
        const permissions = item.permissions;
        const permission = permissions['admin'] ? 'admin' : permissions['maintain'] ? 'maintain' :
            permissions['push'] ? 'push' : permissions['triage'] ? 'triage' : permissions['triage'] ? 'triage' : 'pull';
        return {
            username: item.login,
            permission: permission
        };
    }

    async sync(api: GitHubApi, enable_delete: boolean, collaborators: Collaborator[]) {
        const queryResult = await api.getAll('/repos/{owner}/{repo}/collaborators');
        const existingCollaborators = queryResult.map(val => this.resultItemToCollaborator(val));
        for (const c of collaborators) {
            const existingCollaborator = existingCollaborators.find((ec: Collaborator) => ec.username === c.username);
            if (existingCollaborator) {
                if (containsUpdate(c, existingCollaborator)) {
                    await api.put('/repos/{owner}/{repo}/collaborators/{username}', c);
                }
            } else {
                await api.put('/repos/{owner}/{repo}/collaborators/{username}', c);
            }
        }
        if (enable_delete) {
            for (const ec of existingCollaborators) {
                if (!collaborators.some((c: Collaborator) => c.username === ec.username)) {
                    await api.delete('/repos/{owner}/{repo}/collaborators/{username}', ec);
                }
            }
        }
    }

}