# Packages Management (packages-management)

Tools in this toolset: **3**

## Tools

- `get_artifact` - [Packages Management] Get information about a single artifact in a package repository
    - **Required parameters**:
      - `organizationId` (string): Organization ID
      - `repoId` (string): Repository ID
      - `id` (integer): Artifact ID, can be obtained from ListArtifacts API
      - `repoType` (string): Repository type, available values: GENERIC/DOCKER/MAVEN/NPM/NUGET/PYPI


- `list_package_repositories` - [Packages Management] List package repositories in an organization with filtering options
    - **Required parameters**:
      - `organizationId` (string): Organization ID
    - **Optional parameters**:
      - `repoTypes` (string): Repository types, available values: GENERIC/DOCKER/MAVEN/NPM/NUGET, multiple types can be separated by commas
      - `repoCategories` (string): Repository modes, available values: Hybrid/Local/Proxy/ProxyCache/Group, multiple modes can be separated by commas
      - `perPage` (integer): Number of items per page, default value is 8
      - `page` (integer): Current page number


- `list_artifacts` - [Packages Management] List artifacts in a package repository with filtering options
    - **Required parameters**:
      - `organizationId` (string): Organization ID
      - `repoId` (string): Repository ID
      - `repoType` (string): Repository type, available values: GENERIC/DOCKER/MAVEN/NPM/NUGET
    - **Optional parameters**:
      - `page` (integer): Current page number
      - `perPage` (integer): Number of items per page, default is 10
      - `search` (string): Search by package name
      - `orderBy` (string): Sort method: latestUpdate - by latest update time in milliseconds; gmtDownload - by latest download time in milliseconds
      - `sort` (string): Sort order: asc - ascending; desc - descending
