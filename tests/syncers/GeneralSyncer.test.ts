import {GeneralSyncer} from "../../src/syncers/GeneralSyncer";
import {mockGitHubApi} from "../testutils";

test('Update on sync', async () => {
    const api = mockGitHubApi();

    const general = {description: 'Hello world'};

    await new GeneralSyncer().sync(api, false, general);

    expect(api.patch).toHaveBeenCalledTimes(1);
});