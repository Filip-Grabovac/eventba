const { exec } = require("child_process");
const moment = require("moment");
const fs = require("fs");
const path = require("path");

// Function to perform a MongoDB backup with rotation
function performBackup() {
  const databaseUrl = process.env.DATABASE_URL; // Read from environment variable
  const backupDir = "/root/db_backup"; // Backup directory path
  const maxBackups = 30; // Maximum number of backups to keep

  const timestamp = moment().format("YYYYMMDD-HHmmss"); // Current date and time
  console.log("Backup started");

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

    // List all backup files in the directory
    const backupFiles = fs.readdirSync(backupDir).map((file) => ({
      file,
      timestamp: moment(file.split("_")[0], "YYYYMMDD-HHmmss"),
    }));

    // Sort the backup files by timestamp in ascending order
    backupFiles.sort((a, b) => a.timestamp - b.timestamp);

    // Check if there are more backups than the maximum allowed
    if (backupFiles.length > maxBackups) {
      // Remove the oldest backup (31st backup)
      const oldestBackup = backupFiles[0];
      const oldestBackupPath = path.join(backupDir, oldestBackup.file);
      fs.unlinkSync(oldestBackupPath);
      console.log(`Removed the oldest backup: ${oldestBackup.file}`);
    }
  });
}

module.exports = performBackup;
