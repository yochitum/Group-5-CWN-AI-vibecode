# LAB 3 — System design

สถาปัตยกรรมที่มีจริง Node + JSON; Mermaid source ยังไม่มีหลักฐาน render ด้วย Mermaid CLI. ERD เป็น logical model ของ nested JSON ไม่ใช่ schema PostgreSQL.

## Architecture

```mermaid
flowchart LR
  U[Traveler browser] --> F[HTML CSS JS and Leaflet]
  F --> API[Node HTTP API]
  API --> DB[(Local trips JSON)]
  API --> OSRM[Road routing provider]
  API --> Photon[Place search provider]
  API --> Overpass[POI discovery provider]
  F --> Tiles[OpenStreetMap tiles]
  Test[Isolated assessment server] --> Fixture[(Separate temporary JSON)]
```

## Use cases

```mermaid
flowchart LR
  Traveler[Traveler] --> Plan[Choose province and places]
  Traveler --> Road[View road route and photos]
  Traveler --> Save[Save edit and delete trip]
  Traveler --> Share[Export invitation and slides]
  Group[Simulated group member] --> Propose[Propose plan changes]
  Leader[Simulated leader] --> Decide[Accept or reject]
  Leader --> Ledger[Record expenses and balances]
  Reviewer[Reviewer] --> Verify[Run isolated tests]
```

## Flow 1 — Plan and road route

```mermaid
flowchart TD
  A[Enter province days budget places] --> B{Valid input?}
  B -- No --> C[400 validation error]
  B -- Yes --> D[Arrange selected places and anchors]
  D --> E[Request road geometry]
  E --> F{Provider succeeded?}
  F -- Yes --> G[Display route distance and duration]
  F -- No --> H[Report unavailable and allow retry]
```

## Flow 2 — Feedback decision

```mermaid
flowchart TD
  A[Pending proposal] --> B{Leader simulation?}
  B -- No --> X[Reject action]
  B -- Yes --> C{Accept?}
  C -- No --> D[Set rejected and preserve plan]
  C -- Yes --> E{Source exists and target has capacity?}
  E -- No --> F[Error and leave state unchanged]
  E -- Yes --> G[Apply once and set accepted]
```

## Logical ERD

```mermaid
erDiagram
  TRIP ||--o{ DAY : contains
  DAY ||--o{ STOP : contains
  TRIP ||--o{ MEMBER : contains
  TRIP ||--o{ EXPENSE : contains
  TRIP ||--o{ FEEDBACK : contains
  MEMBER ||--o{ EXPENSE : pays
  EXPENSE }o--o{ MEMBER : splits
  STOP {
    string stopId
    string name
    float lat
    float lng
    string photo
    object details
  }
  TRIP {
    string id
    string name
    string destination
    number savedAt
  }
```

## Sequence 1 — Save and reopen

```mermaid
sequenceDiagram
  actor U as Traveler
  participant F as Browser
  participant A as Node API
  participant J as JSON store
  U->>F: Save trip
  F->>A: POST /api/trips
  A->>A: Validate plan and metadata
  A->>J: Write temporary file and rename
  A-->>F: 201 trip with id and savedAt
  U->>F: Reopen saved trips
  F->>A: GET /api/trips
  A->>J: Read persisted trips
  J-->>A: Trip records
  A-->>F: Saved records
```

## Sequence 2 — Isolated assessment

```mermaid
sequenceDiagram
  participant T as Test runner
  participant A as Assessment server
  participant J as Isolated file
  T->>A: POST /api/test/reset with fixed now
  A->>J: Replace with empty array
  A-->>T: 200 fixed ISO timestamp
  T->>A: POST /api/trips
  A->>J: Save using injected timestamp
  A-->>T: 201 fixed savedAt
  T->>A: GET /api/trips
  A-->>T: Persisted trip
```

Security boundary: localhost service ไม่มี login; friend/leader เป็น UI simulation และไม่ใช่ authorization boundary. Atomic rename ลด partial-file writes แต่ไม่ใช่ database transaction/lock และไม่รับรอง concurrent writes.
