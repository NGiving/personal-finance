const schedule = require('node-schedule')
const db = require('../models')

function startJob() {
    console.log('Job Starting')
    schedule.scheduleJob('0 0 * * MON', async () => {
        console.log('---------------------');
        console.log('Clearing documents marked for delete')
        let query = await db.Expense.deleteMany({ deleted: true })
        console.log(`${query.deletedCount} document${query.deletedCount === 1 ? '' : 's'} deleted`)
    })
}

module.exports = {
    startJob
}