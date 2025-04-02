# TPM Hub

TPM Hub is a collection of micro-frontend applications for project management tooling.

## Components

- **Frontend-Shell**: Main application shell that hosts the micro-frontends
- **Release Notes App**: Tool for generating release notes from Azure DevOps work items
- **Status Update App**: Tool for posting status updates to Teams/Slack
- **API Server**: Backend server for the applications

## Development Setup

### Prerequisites

- Node.js 14+
- Angular CLI

### Installation

1. Clone the repository
2. Run `npm install` in each application folder
3. Configure the environment files

### Running the Applications

Use the `StartAllApps.ps1` PowerShell script to start all applications simultaneously:

Or start each application individually:

cd api-server npm start

cd ../Frontend-Shell npm start

cd ../release-notes-app npm start

cd ../status-update-app npm start