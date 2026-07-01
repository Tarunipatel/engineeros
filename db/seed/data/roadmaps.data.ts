export type RoadmapTopicSeed = {
  title: string;
  section?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  estimatedMinutes?: number;
  resources?: { label: string; url: string }[];
};

export const SYSTEM_DESIGN_TOPICS: RoadmapTopicSeed[] = [
  { title: "Client Server Architecture", difficulty: "Beginner", estimatedMinutes: 30 },
  { title: "DNS", difficulty: "Beginner", estimatedMinutes: 30 },
  { title: "HTTP", difficulty: "Beginner", estimatedMinutes: 45 },
  { title: "REST", difficulty: "Beginner", estimatedMinutes: 45 },
  { title: "Caching", difficulty: "Intermediate", estimatedMinutes: 60 },
  { title: "Redis", difficulty: "Intermediate", estimatedMinutes: 45 },
  { title: "CDN", difficulty: "Intermediate", estimatedMinutes: 30 },
  { title: "Load Balancer", difficulty: "Intermediate", estimatedMinutes: 45 },
  { title: "Reverse Proxy", difficulty: "Intermediate", estimatedMinutes: 30 },
  { title: "SQL vs NoSQL", difficulty: "Intermediate", estimatedMinutes: 45 },
  { title: "Replication", difficulty: "Advanced", estimatedMinutes: 60 },
  { title: "Sharding", difficulty: "Advanced", estimatedMinutes: 60 },
  { title: "Kafka", difficulty: "Advanced", estimatedMinutes: 75 },
  { title: "Rate Limiter", difficulty: "Intermediate", estimatedMinutes: 60 },
  { title: "Consistent Hashing", difficulty: "Advanced", estimatedMinutes: 60 },
  { title: "TinyURL Design", difficulty: "Intermediate", estimatedMinutes: 90 },
  { title: "Notification System Design", difficulty: "Advanced", estimatedMinutes: 90 },
  { title: "Chat System Design", difficulty: "Advanced", estimatedMinutes: 120 },
];

export const PYTHON_TOPICS: RoadmapTopicSeed[] = [
  { title: "Decorators", estimatedMinutes: 45 },
  { title: "Generators", estimatedMinutes: 45 },
  { title: "Iterators", estimatedMinutes: 30 },
  { title: "Context Managers", estimatedMinutes: 30 },
  { title: "Threading", estimatedMinutes: 60 },
  { title: "Multiprocessing", estimatedMinutes: 60 },
  { title: "Asyncio", estimatedMinutes: 75 },
  { title: "Typing", estimatedMinutes: 30 },
  { title: "Dataclasses", estimatedMinutes: 30 },
  { title: "Memory Management", estimatedMinutes: 45 },
];

export const POSTGRESQL_TOPICS: RoadmapTopicSeed[] = [
  { title: "Indexes", estimatedMinutes: 45 },
  { title: "Composite Indexes", estimatedMinutes: 30 },
  { title: "Execution Plans", estimatedMinutes: 45 },
  { title: "Explain Analyze", estimatedMinutes: 30 },
  { title: "Transactions", estimatedMinutes: 45 },
  { title: "Isolation Levels", estimatedMinutes: 60 },
  { title: "MVCC", estimatedMinutes: 60 },
  { title: "Locks", estimatedMinutes: 45 },
  { title: "Window Functions", estimatedMinutes: 60 },
  { title: "CTEs", estimatedMinutes: 30 },
  { title: "Partitioning", estimatedMinutes: 60 },
  { title: "Optimization", estimatedMinutes: 75 },
];

export const CORE_CS_TOPICS: RoadmapTopicSeed[] = [
  { title: "Processes & Threads", section: "Operating Systems", estimatedMinutes: 45 },
  { title: "Scheduling Algorithms", section: "Operating Systems", estimatedMinutes: 45 },
  { title: "Memory Management & Paging", section: "Operating Systems", estimatedMinutes: 60 },
  { title: "Deadlocks", section: "Operating Systems", estimatedMinutes: 45 },
  { title: "TCP vs UDP", section: "Networking", estimatedMinutes: 45 },
  { title: "OSI Model", section: "Networking", estimatedMinutes: 30 },
  { title: "HTTPS & TLS Handshake", section: "Networking", estimatedMinutes: 45 },
  { title: "Sockets", section: "Networking", estimatedMinutes: 30 },
  { title: "Normalization", section: "DBMS", estimatedMinutes: 45 },
  { title: "ACID Properties", section: "DBMS", estimatedMinutes: 30 },
  { title: "Joins & Query Optimization", section: "DBMS", estimatedMinutes: 45 },
  { title: "Indexing Strategies", section: "DBMS", estimatedMinutes: 45 },
  { title: "Encapsulation & Abstraction", section: "OOP", estimatedMinutes: 30 },
  { title: "Inheritance & Polymorphism", section: "OOP", estimatedMinutes: 30 },
  { title: "SOLID Principles", section: "OOP", estimatedMinutes: 60 },
  { title: "Design Patterns", section: "OOP", estimatedMinutes: 75 },
];
