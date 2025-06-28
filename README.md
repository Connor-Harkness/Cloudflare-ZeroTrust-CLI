# Cloudflare ZeroTrust CLI

A command-line interface tool for managing Cloudflare ZeroTrust tunnels and related resources.

## Installation

```bash
npm install
```

## Setup

1. Obtain a Cloudflare API token with ZeroTrust permissions
2. Set environment variables or use CLI flags:

```bash
export CLOUDFLARE_API_TOKEN="your-api-token"
export CLOUDFLARE_ACCOUNT_ID="your-account-id"
```

## Usage

### List all tunnels

```bash
./bin/zerotrust.js tunnel list
```

### Show tunnel details

```bash
./bin/zerotrust.js tunnel show <tunnel-id>
```

### Create a new tunnel

```bash
./bin/zerotrust.js tunnel create "my-tunnel"
```

### Delete a tunnel

```bash
./bin/zerotrust.js tunnel delete <tunnel-id> --yes
```

### List tunnel hostnames

```bash
./bin/zerotrust.js tunnel hostname list <tunnel-id>
```

## Global Options

- `--token <token>`: Cloudflare API token
- `--account-id <id>`: Cloudflare account ID
- `--format <format>`: Output format (table, json, yaml)
- `--debug`: Enable debug output

## Output Formats

- `table`: Human-readable table (default)
- `json`: JSON format
- `yaml`: YAML format

## Examples

```bash
# List tunnels in JSON format
./bin/zerotrust.js tunnel list --format json

# Create tunnel with custom secret
./bin/zerotrust.js tunnel create "api-tunnel" --secret "my-secret-key"

# Show tunnel details with specific credentials
./bin/zerotrust.js tunnel show abc123 --token "your-token" --account-id "your-account"
```
