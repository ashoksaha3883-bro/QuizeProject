const { randomUUID } = require("crypto");

const sessions = new Map();

const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes
const MAX_SESSIONS = 200;

function removeExpiredSessions() {
  const now = Date.now();

  for (const [sessionId, session] of sessions.entries()) {
    if (session.expiresAt <= now) {
      sessions.delete(sessionId);
    }
  }
}

function createQuestionSession(questions, metadata) {
  removeExpiredSessions();

  // Prevent the in-memory store from growing without a limit.
  while (sessions.size >= MAX_SESSIONS) {
    const oldestSessionId = sessions.keys().next().value;

    if (!oldestSessionId) break;

    sessions.delete(oldestSessionId);
  }

  const sessionId = randomUUID();

  sessions.set(sessionId, {
  questions,
  metadata,
  createdAt: Date.now(),
  expiresAt: Date.now() + SESSION_TTL_MS,
  submittedResult: null,
});
  return sessionId;
}

function getQuestionSession(sessionId) {
  removeExpiredSessions();

  const session = sessions.get(sessionId);

  if (!session) {
    return null;
  }

  return session;
}

function deleteQuestionSession(sessionId) {
  return sessions.delete(sessionId);
}

function saveQuestionSessionResult(sessionId, result) {
  const session = sessions.get(sessionId);

  if (!session) {
    return false;
  }

  session.submittedResult = result;
  return true;
}

module.exports = {
  createQuestionSession,
  getQuestionSession,
  deleteQuestionSession,
    saveQuestionSessionResult,


};  
