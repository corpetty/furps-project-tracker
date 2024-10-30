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

- [store_messages_by_hash](../furps/store_messages_by_hash.md) - Messages can be retrieved from store using their hashes 

### Reliability

- [store_node_outage](../furps/store_node_outage.md) - No Store node outage due to low disk space 

### Performance

Dashboard: https://grafana.infra.status.im/d/nXLrxWZNk/store-service-upgrade?orgId=1
NOTE: Dashboard does not include number 3 below.

- [store_message_discrepancy](../furps/store_message_discrepancy.md) - Zero message discrepancy on last hour, 24 hours, 7 days on status.prod and waku.sandbox fleets 

