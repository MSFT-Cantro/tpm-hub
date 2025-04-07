export interface AzureWorkItem {
  id: number;
  fields: {
    'System.Title': string;
    'System.State'?: string;
    'System.Tags'?: string;
    'System.AssignedTo'?: {
      displayName: string;
    };
    'System.History'?: string;
    'System.Description'?: string;
    'Custom.Discussion'?: { text: string }[];
    [key: string]: any;
  };
}

export interface AzureQueryResult {
  workItems: AzureWorkItem[];
}

export interface ReleaseNotesConfig {
  filterType: 'CommunitySift/Morpheus' | 'Pottymouth';
  dataCenters?: {
    'US-East (LIVE)': boolean;
    'US-West (UW2P)': boolean;
    'EU-West (EUON)': boolean;
  };
  releaseEngineer?: string;
  releaseVersion?: string;
  messagingPlatform: 'Teams' | 'Slack';
}