export interface General {
    description?: string;
    homepage?: string;
    private?: boolean;
    security_and_analysis?: any;
    has_issues?: boolean;
    has_projects?: boolean;
    has_wiki?: boolean;
    is_template?: boolean;
    default_branch?: string;
    allow_squash_merge?: boolean;
    allow_merge_commit?: boolean;
    allow_rebase_merge?: boolean;
    allow_auto_merge?: boolean;
    delete_branch_on_merge?: boolean;
    allow_update_branch?: boolean;
    squash_merge_commit_title?: 'PR_TITLE' | 'COMMIT_OR_PR_TITLE';
    squash_merge_commit_message?: string;
    merge_commit_title?: 'PR_TITLE' | 'MERGE_MESSAGE';
    merge_commit_message?: string;
    archived?: boolean;
    allow_forking?: boolean;
    web_commit_signoff_required?: boolean;
}