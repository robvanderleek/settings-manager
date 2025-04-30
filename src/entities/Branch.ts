export interface Branch {
    name: string;
    protection?: BranchProtection;
}

interface BranchProtection {
    required_pull_request_reviews?: RequiredPullRequestReviews;
}

interface RequiredPullRequestReviews {
    required_approving_review_count?: number;
}