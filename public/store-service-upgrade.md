---
title: Store Service Upgrade
description: Store Service Upgrade
critical_path: true
date_of_completion: 2024-09-20
description: With this milestone, the store protocol becomes more easily usable for reliability purposes. Moreover, Nwaku PostgreSQL implementation will enable better disk space management and enable operators to hard cap the used disk space. All the work in his milestone is already in progress and near completion.
status: in_progress
---

All the work in this milestone is already in progress and near completion.

## FURPS

### Functionality

1. Messages can be retrieved from store using their hashes | (production)
2. Store nodes can be synchronised with each other | (production)
3. Service nodes are DoS protected using request rate limitation
4. PostgreSQL database growth is capped and pruning automated
5. A tool to compare the messages across fleet nodes is deployed

### Usability

1. Node operators are able to hard cap disk space used on local store nodes
2. Reliability protocols and Waku Sync can use message hash queries

### Reliability

1. No Store node outage due to low disk space
2. Fleet nodes resistant to DDoS attacks
3. All fleet store nodes have the same set of recent messages

### Performance

Dashboard: https://grafana.infra.status.im/d/nXLrxWZNk/store-service-upgrade?orgId=1
NOTE: Dashboard does not include number 3 below.

1. Zero message discrepancy on last hour, 24 hours, 7 days on status.prod and waku.sandbox fleets
2. Disk usage of DB fleet nodes do not grow over time
3. No Unplanned outages of fleet nodes due to low disk space

