import { relations } from "drizzle-orm";
import { users, sessions } from "./users";
import { dsaTopics, dsaPatterns, dsaProblems, dsaAttempts } from "./dsa";
import { roadmapDomains, roadmapSections, roadmapTopics } from "./roadmaps";
import { dailyPlans, dailyPlanProblems, studySessions } from "./daily";
import { applications } from "./applications";
import { interviewJournalEntries } from "./journals";

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const dsaTopicsRelations = relations(dsaTopics, ({ many }) => ({
  problems: many(dsaProblems),
}));

export const dsaPatternsRelations = relations(dsaPatterns, ({ many }) => ({
  problems: many(dsaProblems),
}));

export const dsaProblemsRelations = relations(dsaProblems, ({ one, many }) => ({
  topic: one(dsaTopics, { fields: [dsaProblems.topicId], references: [dsaTopics.id] }),
  pattern: one(dsaPatterns, { fields: [dsaProblems.patternId], references: [dsaPatterns.id] }),
  attempts: many(dsaAttempts),
}));

export const dsaAttemptsRelations = relations(dsaAttempts, ({ one }) => ({
  problem: one(dsaProblems, { fields: [dsaAttempts.problemId], references: [dsaProblems.id] }),
}));

export const roadmapDomainsRelations = relations(roadmapDomains, ({ many }) => ({
  sections: many(roadmapSections),
  topics: many(roadmapTopics),
}));

export const roadmapSectionsRelations = relations(roadmapSections, ({ one, many }) => ({
  domain: one(roadmapDomains, { fields: [roadmapSections.domainId], references: [roadmapDomains.id] }),
  topics: many(roadmapTopics),
}));

export const roadmapTopicsRelations = relations(roadmapTopics, ({ one }) => ({
  domain: one(roadmapDomains, { fields: [roadmapTopics.domainId], references: [roadmapDomains.id] }),
  section: one(roadmapSections, { fields: [roadmapTopics.sectionId], references: [roadmapSections.id] }),
}));

export const dailyPlansRelations = relations(dailyPlans, ({ one, many }) => ({
  systemDesignTopic: one(roadmapTopics, {
    fields: [dailyPlans.systemDesignTopicId],
    references: [roadmapTopics.id],
  }),
  pythonTopic: one(roadmapTopics, { fields: [dailyPlans.pythonTopicId], references: [roadmapTopics.id] }),
  postgresqlTopic: one(roadmapTopics, {
    fields: [dailyPlans.postgresqlTopicId],
    references: [roadmapTopics.id],
  }),
  coreCsTopic: one(roadmapTopics, { fields: [dailyPlans.coreCsTopicId], references: [roadmapTopics.id] }),
  planProblems: many(dailyPlanProblems),
}));

export const dailyPlanProblemsRelations = relations(dailyPlanProblems, ({ one }) => ({
  dailyPlan: one(dailyPlans, { fields: [dailyPlanProblems.dailyPlanId], references: [dailyPlans.id] }),
  problem: one(dsaProblems, { fields: [dailyPlanProblems.problemId], references: [dsaProblems.id] }),
}));

export const studySessionsRelations = relations(studySessions, ({ one }) => ({
  problem: one(dsaProblems, { fields: [studySessions.relatedProblemId], references: [dsaProblems.id] }),
  topic: one(roadmapTopics, { fields: [studySessions.relatedTopicId], references: [roadmapTopics.id] }),
}));

export const applicationsRelations = relations(applications, ({ many }) => ({
  interviewEntries: many(interviewJournalEntries),
}));

export const interviewJournalEntriesRelations = relations(interviewJournalEntries, ({ one }) => ({
  application: one(applications, {
    fields: [interviewJournalEntries.applicationId],
    references: [applications.id],
  }),
}));
