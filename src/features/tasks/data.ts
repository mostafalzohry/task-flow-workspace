import type { Task } from "./types";

export const SAMPLE_TASKS: readonly Task[] = [
  {
    id: "task-review-customer-feedback",
    title: "Review customer feedback",
    description:
      "Read through last week's support tickets and survey responses, then group the recurring themes for the product sync.",
    status: "todo",
    priority: "medium",
    dueDate: "2026-09-04",
    createdAt: "2026-08-24T09:15:00.000Z",
  },
  {
    id: "task-competitor-research",
    title: "Complete competitor research",
    description:
      "Compare pricing, onboarding, and core features across the three closest competitors and note gaps we can win on.",
    status: "todo",
    priority: "low",
    dueDate: "2026-09-11",
    createdAt: "2026-08-25T13:40:00.000Z",
  },

  {
    id: "task-quarterly-presentation",
    title: "Prepare the quarterly presentation",
    description:
      "Build the Q3 review deck with revenue, retention, and roadmap slides for the leadership meeting.",
    status: "in-progress",
    priority: "high",
    dueDate: "2026-08-31",
    createdAt: "2026-08-20T08:00:00.000Z",
  },
  {
    id: "task-update-pricing-page",
    title: "Update the pricing page",
    description:
      "Reflect the new Team tier limits and refreshed FAQ copy, and confirm the annual toggle math with finance.",
    status: "in-progress",
    priority: "medium",
    dueDate: "2026-09-05",
    createdAt: "2026-08-21T15:25:00.000Z",
  },

  {
    id: "task-approve-homepage-redesign",
    title: "Approve the homepage redesign",
    description:
      "Walk through the staging build, check responsive breakpoints, and sign off on the new hero and testimonials section.",
    status: "in-review",
    priority: "urgent",
    dueDate: "2026-08-29",
    createdAt: "2026-08-19T11:10:00.000Z",
  },
  {
    id: "task-verify-analytics-report",
    title: "Verify monthly analytics report",
    description:
      "Cross-check the automated August metrics against the dashboard and flag any attribution discrepancies.",
    status: "in-review",
    priority: "high",
    dueDate: "2026-09-01",
    createdAt: "2026-08-23T17:05:00.000Z",
  },

  {
    id: "task-onboarding-email-content",
    title: "Create onboarding email content",
    description:
      "Draft the five-message welcome sequence covering setup, first project, invites, integrations, and support.",
    status: "done",
    priority: "medium",
    dueDate: "2026-08-22",
    createdAt: "2026-08-12T10:30:00.000Z",
  },
  {
    id: "task-publish-product-announcement",
    title: "Publish the product announcement",
    description:
      "Ship the changelog entry and in-app banner for the new board view, then schedule the social posts.",
    status: "done",
    priority: "high",
    dueDate: "2026-08-26",
    createdAt: "2026-08-14T14:45:00.000Z",
  },
];
