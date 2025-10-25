const Activity = require('../mongoose/Activity');

async function log(event, actor = {}, target = null, meta = {}) {
  try {
    await Activity.create({ event, actor, target, meta });
  } catch (err) {
    console.error('Activity log failed', err);
  }
}

module.exports = { log };
