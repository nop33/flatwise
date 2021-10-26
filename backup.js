const firestoreService = require('firestore-export-import')
const fs = require('fs')
const yargs = require('yargs')

require('dotenv').config()

const backupsDir = './backups'

const argv = yargs
  .command('export', 'Exports all the collections data into a timestamped JSON file')
  .command('import', 'Imports the data from a JSON file into the Firestore database', {
    file: {
      description: 'the JSON file with the data to import',
      alias: 'f'
    }
  })
  .help()
  .alias('help', 'h').argv

if (argv._.includes('export')) {
  if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir)
  }

  const serviceAccount = require('./keys/serviceAccountKey.json')
  firestoreService.initializeApp(serviceAccount, process.env.DATABASE_URL)
  firestoreService.backups([]).then((data) => {
    const timestamp = new Date().toISOString()
    fs.writeFile(`backups/${timestamp}-backup.json`, JSON.stringify(data), function (err) {
      if (err) console.log('error', err)
    })
  })
} else if (argv._.includes('import')) {
  const serviceAccount = require('./keys/serviceAccountBackupKey.json')
  firestoreService.initializeApp(serviceAccount, process.env.BACKUP_DATABASE_URL)
  if (argv.file) {
    try {
      if (fs.existsSync(`./backups/${argv.file}`)) {
        firestoreService.restore(`backups/${argv.file}`)
      }
    } catch (err) {
      console.error(err)
    }
  } else {
    console.log('You need to provide the filename of the file with the data to import through the --file option.')
  }
}
