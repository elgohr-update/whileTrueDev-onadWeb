import doQuery from '../../model/doQuery';

const schedule = require('node-schedule');

function calculation() {
  const updateQuery = `
  UPDATE campaign
  SET limitState = 0
  `;
  doQuery(updateQuery, []);
}

const scheduler = schedule.scheduleJob('Marketer CampaignLimitState update scheduler', '0 * * *', () => {
  calculation();
});

export default scheduler;