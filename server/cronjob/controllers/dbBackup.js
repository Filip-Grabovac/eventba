const { exec } = require("child_process");
const moment = require("moment");
const fs = require("fs");
const path = require("path");

// MongoDB connection details from DATABASE_URL
const databaseUrl = process.env.DATABASE_URL; // Read from environment variable
const backupDir = path.join(__dirname, "backups"); // Backup directory in the same directory as the script
const timestamp = moment().format("YYYYMMDD-HHmmss"); // Current date and time

// Ensure the backup directory exists
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

// Construct the backup file name with date
const backupFileName = `${timestamp}_backup`;

// Construct the backup command
const backupCommand = `mongodump --uri ${databaseUrl} --out ${path.join(
  backupDir,
  backupFileName
)}`;

// Execute the backup command
exec(backupCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  console.log(`Backup completed at ${timestamp}`);
});
