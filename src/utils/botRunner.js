// Bot engine: processes a queue of tasks (like / comment / repost / follow)
// with human-like pacing and returns a session report.
// Pure JavaScript, no React Native imports, so it can run in plain Node tests.

export const TASK_ACTION_BY_TYPE = {
  like: 'like',
  comment: 'comment',
  repost: 'repost',
  follow: 'follow',
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const pickDelay = (min = 50, max = 200) =>
  Math.min(max, Math.max(min, min + Math.round(Math.random() * (max - min))));

const COMMENT_PHRASES = [
  'Отличный пост!',
  'Спасибо за информацию!',
  'Очень интересно!',
  'Класс!',
  'Супер!',
  'Понравилось!',
  'Интересная мысль.',
  'Полезная информация.',
];

export const generateComment = () =>
  COMMENT_PHRASES[Math.floor(Math.random() * COMMENT_PHRASES.length)];

export const createBot = ({ handlers, options = {} } = {}) => {
  const {
    delayRange = [50, 200],
    onEvent = () => {},
  } = options;

  const runTask = async (task, index, total) => {
    const action = TASK_ACTION_BY_TYPE[task.type];
    onEvent({ type: 'task-start', task, index, total });

    const result = {
      taskId: task.id,
      url: task.url,
      type: task.type,
      status: 'failed',
      comment: null,
    };

    if (!action || typeof handlers?.[action] !== 'function') {
      result.error = action ? `Missing bot handler: ${action}` : `Unknown task type: ${task.type}`;
      onEvent({ type: 'task-end', task, index, total, result });
      return result;
    }

    try {
      if (action === 'comment') {
        const comment = task.comment || generateComment();
        const res = await handlers.comment(task, comment);
        result.comment = comment;
        result.status = res?.ok ? 'completed' : 'failed';
      } else {
        const res = await handlers[action](task);
        result.status = res?.ok ? 'completed' : 'failed';
      }
    } catch (error) {
      result.status = 'failed';
      result.error = error?.message || String(error);
    }

    if (result.status === 'completed' && typeof handlers.complete === 'function') {
      try {
        const completion = await handlers.complete(task);
        result.status = completion?.ok ? 'completed' : 'failed';
      } catch (error) {
        result.status = 'failed';
        result.error = error?.message || String(error);
      }
    }

    onEvent({ type: 'task-end', task, index, total, result });
    return result;
  };

  const run = async (tasks = []) => {
    const report = {
      startedAt: new Date().toISOString(),
      total: tasks.length,
      completed: 0,
      failed: 0,
      results: [],
    };

    onEvent({ type: 'session-start', total: tasks.length });

    for (let i = 0; i < tasks.length; i += 1) {
      const result = await runTask(tasks[i], i + 1, tasks.length);
      if (result.status === 'completed') {
        report.completed += 1;
      } else {
        report.failed += 1;
      }
      report.results.push(result);

      if (i < tasks.length - 1) {
        const ms = pickDelay(delayRange[0], delayRange[1]);
        onEvent({ type: 'human-delay', ms });
        await sleep(ms);
      }
    }

    report.finishedAt = new Date().toISOString();
    onEvent({ type: 'session-end', report });
    return report;
  };

  return { run, runTask };
};

export default { createBot, pickDelay, generateComment, TASK_ACTION_BY_TYPE };
