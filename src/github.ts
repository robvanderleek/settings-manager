import {Context} from "probot";
import {getOwner, getRepo} from "./context";

export async function createCommitStatus(ctx: Context<any>, state: 'success' | 'error', description: string) {
    const owner = getOwner(ctx);
    const repo = getRepo(ctx);
    const sha = ctx.payload.after;
    await ctx.octokit.repos.createCommitStatus({
        owner: owner,
        repo: repo,
        sha: sha,
        state: state,
        description: description,
        context: 'Settings Manager'
    });
}