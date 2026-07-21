export interface TaxonomyEngineConfig {
  features: {
    enableHierarchySupport: boolean;
    enableCustomAttributes: boolean;
    enableBulkOperations: boolean;
    enableAiAutoTagging: boolean;
  };
  limits: {
    maxHierarchyDepth: number;
    maxTagsPerItem: number;
  };
  defaults: {
    defaultSortBy: 'name-asc' | 'name-desc' | 'created-desc';
    pageSize: number;
  };
}

export const TAXONOMY_ENGINE_DEFAULT_CONFIG: TaxonomyEngineConfig = {
  features: {
    enableHierarchySupport: true,
    enableCustomAttributes: true,
    enableBulkOperations: false, // Future placeholder feature
    enableAiAutoTagging: false,    // Future placeholder feature
  },
  limits: {
    maxHierarchyDepth: 5,
    maxTagsPerItem: 30,
  },
  defaults: {
    defaultSortBy: 'name-asc',
    pageSize: 20,
  }
};
