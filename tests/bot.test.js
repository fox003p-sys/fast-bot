// Demo test: shows the bot working end to end.
// Mock tasks + mock server actions, real bot engine (human-paced task loop).
// Run with: npm test

import { test, describe } from 'node:test';
import assert from 'node:assert';

import { createBot, TASK_ACTION_BY_TYPE } from '../src/utils/botRunner.js';

const MOCK_TASKS = [
  { id: 1, type: 'like', url: 'https://vk.com/wall-123_456' },
  { id: 2, type: 'comment', url: 'https://vk.com/wall-123_457' },
  { id: 3, type: 'like', url: 'https://vk.com/wall-123_458' },
  { id: 4, type: 'repost', url: 'https://vk.com/wall-123_459' },
  { id: 5, type: 'follow', url: 'https://vk.com/vkserfing' },
  { id: 6, type: 'like', url: 'https://vk.com/wall-123_460' },
];

const makeServer = () => {
  const calls = [];
  const respond = (name, ok = true) => {
    calls.push(name);
    return Promise.resolve({ ok });
  };
  return {
    calls,
    handlers: {
      like: (task) => respond(`like:${task.id}`),
      comment: (task, comment) => respond(`comment:${task.id}:${comment}`),
      repost: (task) => respond(`repost:${task.id}`),
      follow: (task) => respond(`follow:${task.id}`),
      complete: (task) => respond(`complete:${task.id}`),
    },
  };
};

describe('Bot engine', () => {
  test('known task types map to handlers', () => {
    assert.strictEqual(TASK_ACTION_BY_TYPE.like, 'like');
    assert.strictEqual(TASK_ACTION_BY_TYPE.comment, 'comment');
  });

  test('bot processes the whole task queue and completes tasks', async () => {
    const server = makeServer();
    const events = [];

    const bot = createBot({
      handlers: server.handlers,
      options: {
        delayRange: [1, 2],
        onEvent: (event) => events.push(event),
      },
    });

    const report = await bot.run(MOCK_TASKS);

    assert.strictEqual(report.total, MOCK_TASKS.length);
    assert.strictEqual(report.completed, MOCK_TASKS.length);
    assert.strictEqual(report.failed, 0);
    assert.strictEqual(server.calls.filter((c) => c.startsWith('complete:')).length, MOCK_TASKS.length);
    assert.ok(events.some((e) => e.type === 'session-start'));
    assert.ok(events.some((e) => e.type === 'session-end'));
  });

  test('bot generates a human-like comment when task has no text', async () => {
    const server = makeServer();
    const bot = createBot({ handlers: server.handlers, options: { delayRange: [1, 2] } });

    const report = await bot.run([MOCK_TASKS[1]]);

    assert.strictEqual(report.completed, 1);
    const commentCall = server.calls.find((c) => c.startsWith('comment:2:'));
    assert.ok(commentCall, 'comment action must be called');
    const comment = commentCall.split(':')[2];
    assert.ok(comment.length > 0);
  });

  test('bot marks task failed when server rejects the action', async () => {
    const handlers = {
      like: async () => ({ ok: false }),
      comment: async () => ({ ok: true }),
    };
    const bot = createBot({ handlers, options: { delayRange: [1, 2] } });

    const report = await bot.run([MOCK_TASKS[0]]);

    assert.strictEqual(report.completed, 0);
    assert.strictEqual(report.failed, 1);
    assert.strictEqual(report.results[0].status, 'failed');
  });

  test('bot survives handler errors and continues the session', async () => {
    const handlers = {
      like: async (task) => {
        if (task.id === 1) throw new Error('server 500');
        return { ok: true };
      },
    };
    const bot = createBot({ handlers, options: { delayRange: [1, 2] } });

    const report = await bot.run([MOCK_TASKS[0], MOCK_TASKS[2]]);

    assert.strictEqual(report.completed, 1);
    assert.strictEqual(report.failed, 1);
    assert.strictEqual(report.results[0].error, 'server 500');
    assert.strictEqual(report.results[1].status, 'completed');
  });
});

// Self-demonstration run: prints the bot session log to the console.
describe('Bot demo (visual run)', () => {
  test('shows a full bot session on mock data', async () => {
    const server = makeServer();
    const log = [];
    const bot = createBot({
      handlers: server.handlers,
      options: {
        delayRange: [1, 3],
        onEvent: (event) => {
          if (event.type === 'session-start') log.push(`=== Сессия бота: задач ${event.total} ===`);
          if (event.type === 'task-start') log.push(`  ▶ задача ${event.index}/${event.total}: ${event.task.type} ${event.task.url}`);
          if (event.type === 'task-end') log.push(`  ✔ ${event.result.status}${event.result.comment ? ` → "${event.result.comment}"` : ''}`);
          if (event.type === 'session-end') log.push(`=== Итог: выполнено ${event.report.completed}, ошибок ${event.report.failed} ===`);
        },
      },
    });

    await bot.run(MOCK_TASKS);
    console.log(log.join('\n'));

    assert.ok(log.some((line) => line.includes('Сессия бота')));
  });
});
