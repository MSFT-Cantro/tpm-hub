export interface AzureWorkItem {
    id: number;
    url: string;
    fields: {
        'System.Title': string;
        'System.State'?: string;
        'System.Tags'?: string;
        'System.AssignedTo'?: {
            displayName: string;
        };
        [key: string]: any;
    };
}

export interface DeploymentReadinessConfig {
    filterType: string;
    dataCenters?: {
        [key: string]: boolean;
    };
    releaseEngineer?: string;
    releaseVersion?: string;
    messagingPlatform?: string;
}