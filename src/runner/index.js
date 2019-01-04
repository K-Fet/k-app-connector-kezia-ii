class Runner {
  constructor(options) {
    this.options = {
      tasks: [],
      interval: 1000 * 60 * 2,
      ...options,
    };
  }

  startAll() {
    this.intervalId = setTimeout(this.run.bind(this), this.options.interval);
  }

  start(taskName) {
    const task = this.options.tasks.find(t => t.name === taskName);
    if (!task) throw new Error(`Task ${taskName} not found!`);
    task.disabled = false;

    // If runner is shutdown, start it
    if (!this.intervalId) this.startAll();
  }

  stop(taskName) {
    const task = this.options.tasks.find(t => t.name === taskName);
    if (!task) throw new Error(`Task ${taskName} not found!`);
    task.disabled = true;

    // If every tasks are disabled, clear interval
    if (this.options.tasks.every(t => t.disabled)) this.stopAll();
  }

  stopAll() {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  run() {
    console.log('Starting new run session');

    // eslint-disable-next-line
    this.options.tasks.forEach(t => t.data = t.data || {});

    const runningTasks = this.options.tasks
      .filter(t => !t.disabled)
      .map(t => ({ p: t.handler(t.options, t.data), t }))
      .map(({ p, t }) => p
        .then(d => console.log(`Task ${t.name} terminated with success!`, d))
        .catch(e => console.error(`Task ${t.name} terminated failing!`, e)));

    Promise.all(runningTasks)
      .then(() => {
        this.intervalId = setTimeout(this.run.bind(this), this.options.interval);
      });
  }
}

module.exports = Runner;
