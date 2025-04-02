import {Probot} from "probot";
import {ApplicationFunctionOptions} from "probot/lib/types";
import express from "express";
import {gitDate, gitSha, version} from "./version";


export default (app: Probot, {getRouter}: ApplicationFunctionOptions) => {
    const buildDate = gitDate.toISOString().substring(0, 10);
    app.log.info(`Settings Manager, version: ${version}, revison: ${gitSha.substring(0, 8)}, built on: ${buildDate}`);
}
