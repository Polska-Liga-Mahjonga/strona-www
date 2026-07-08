@description('Azure region for all resources.')
param location string = resourceGroup().location

@description('Deployment environment name from azd (for example dev, test, prod).')
param environmentName string

@description('Static Web App resource name.')
param staticWebAppName string = 'plm-swa-${environmentName}-${uniqueString(resourceGroup().id)}'

@description('Cosmos DB SQL database name.')
param cosmosDatabaseName string = 'plm-cms'

@description('Cosmos DB SQL container name.')
param cosmosContainerName string = 'content'

@description('Cosmos throughput mode. Serverless is typically the lowest-cost option for small traffic.')
@allowed([
  'serverless'
  'provisioned'
])
param cosmosThroughputMode string = 'serverless'

@description('Provisioned RU/s used only when cosmosThroughputMode is set to provisioned.')
@minValue(400)
param cosmosProvisionedThroughput int = 400

var suffix = toLower(uniqueString(subscription().subscriptionId, resourceGroup().id, environmentName))
var storageAccountName = take('plmapi${suffix}', 24)
var functionAppName = 'plm-api-${environmentName}-${suffix}'
var appInsightsName = 'plm-ai-${environmentName}-${suffix}'
var hostingPlanName = 'plm-plan-${environmentName}-${suffix}'
var cosmosAccountName = 'plm-cms-${suffix}'
var cosmosCapabilities = cosmosThroughputMode == 'serverless'
  ? [
      {
        name: 'EnableServerless'
      }
    ]
  : []
var cosmosContainerOptions = cosmosThroughputMode == 'provisioned'
  ? {
      throughput: cosmosProvisionedThroughput
    }
  : {}

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    supportsHttpsTrafficOnly: true
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: false
  }
}

resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    IngestionMode: 'ApplicationInsights'
  }
}

resource hostingPlan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: hostingPlanName
  location: location
  kind: 'functionapp'
  sku: {
    name: 'Y1'
    tier: 'Dynamic'
  }
  properties: {
    reserved: true
  }
}

resource cosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2023-04-15' = {
  name: cosmosAccountName
  location: location
  kind: 'GlobalDocumentDB'
  properties: {
    databaseAccountOfferType: 'Standard'
    locations: [
      {
        locationName: location
        failoverPriority: 0
        isZoneRedundant: false
      }
    ]
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
    }
    minimalTlsVersion: 'Tls12'
    publicNetworkAccess: 'Enabled'
    disableLocalAuth: false
    capabilities: cosmosCapabilities
  }
}

resource cosmosSqlDatabase 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2023-04-15' = {
  name: cosmosDatabaseName
  parent: cosmosAccount
  properties: {
    resource: {
      id: cosmosDatabaseName
    }
  }
}

resource cosmosSqlContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2023-04-15' = {
  name: cosmosContainerName
  parent: cosmosSqlDatabase
  properties: {
    resource: {
      id: cosmosContainerName
      partitionKey: {
        paths: [
          '/type'
        ]
        kind: 'Hash'
      }
      indexingPolicy: {
        indexingMode: 'consistent'
        automatic: true
        includedPaths: [
          {
            path: '/*'
          }
        ]
        excludedPaths: [
          {
            path: '/"_etag"/?'
          }
        ]
      }
    }
    options: cosmosContainerOptions
  }
}

var storageKeys = listKeys(storageAccount.id, storageAccount.apiVersion)
var cosmosKeys = listKeys(cosmosAccount.id, cosmosAccount.apiVersion)
var storageConnectionString = 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};AccountKey=${storageKeys.keys[0].value};EndpointSuffix=${environment().suffixes.storage}'

resource functionApp 'Microsoft.Web/sites@2023-12-01' = {
  name: functionAppName
  location: location
  kind: 'functionapp,linux'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: hostingPlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'Node|20'
      minTlsVersion: '1.2'
      ftpsState: 'Disabled'
      appSettings: [
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'node'
        }
        {
          name: 'WEBSITE_RUN_FROM_PACKAGE'
          value: '1'
        }
        {
          name: 'AzureWebJobsStorage'
          value: storageConnectionString
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: applicationInsights.properties.ConnectionString
        }
        {
          name: 'COSMOS_ENDPOINT'
          value: cosmosAccount.properties.documentEndpoint
        }
        {
          name: 'COSMOS_KEY'
          value: cosmosKeys.primaryMasterKey
        }
        {
          name: 'COSMOS_DATABASE'
          value: cosmosDatabaseName
        }
        {
          name: 'COSMOS_CONTAINER'
          value: cosmosContainerName
        }
      ]
    }
  }
  tags: {
    'azd-env-name': environmentName
    'azd-service-name': 'api'
  }
}

resource staticWebApp 'Microsoft.Web/staticSites@2023-12-01' = {
  name: staticWebAppName
  location: location
  sku: {
    name: 'Standard'
    tier: 'Standard'
  }
  properties: {
    stagingEnvironmentPolicy: 'Enabled'
  }
  tags: {
    'azd-env-name': environmentName
    'azd-service-name': 'web'
  }
}

resource staticWebAppLinkedBackend 'Microsoft.Web/staticSites/linkedBackends@2023-12-01' = {
  name: 'cms-api'
  parent: staticWebApp
  properties: {
    backendResourceId: functionApp.id
    region: location
  }
}

output staticWebAppHostName string = staticWebApp.properties.defaultHostname
output functionAppHostName string = functionApp.properties.defaultHostName
output cosmosEndpoint string = cosmosAccount.properties.documentEndpoint
output cosmosThroughputModeUsed string = cosmosThroughputMode
