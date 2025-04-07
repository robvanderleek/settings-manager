import {Organization} from "./Organization";
import {Repository} from "./Repository";

export interface Settings {
    organization?: Organization;
    repository?: Repository;
}