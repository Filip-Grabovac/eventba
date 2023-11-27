const { exec } = require("child_process");
const moment = require("moment");
const fs = require("fs");
const path = require("path");

// Function to perform MongoDB backups with rotation for multiple databases
function performBackup() {
  const databases = [
    { name: "main_database", url: process.env.DATABASE_URL },
    { name: "ticket_database", url: process.env.DATABASE_URL_TICKET },
    // Add more databases as needed
  ];

  const backupDir = "/root/db_backup"; // Backup directory path
  const maxBackups = 30; // Maximum number of backups to keep

  console.log("Backup started");

  // Ensure the backup directory exists
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  // Loop through each database
  databases.forEach((db) => {
    const timestamp = moment().format("YYYYMMDD-HHmmss"); // Current date and time
    console.log(`Backup started for database: ${db.name}`);

    // Construct the backup file name with date and database name
    const backupFileName = `${timestamp}_${db.name}_backup`;

    // Construct the backup command
    const backupCommand = `mongodump --uri ${db.url} --out ${path.join(
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
      console.log(`Backup completed at ${timestamp} for database: ${db.name}`);

      // List all backup files in the directory
      const backupFiles = fs.readdirSync(backupDir).map((file) => ({
        file,
        timestamp: moment(file.split("_")[0], "YYYYMMDD-HHmmss"),
      }));

      // Sort the backup files by timestamp in ascending order
      backupFiles.sort((a, b) => a.timestamp - b.timestamp);

      // Check if there are more backups than the maximum allowed
      if (backupFiles.length > maxBackups) {
        // Remove the oldest backup(s)
        const backupsToRemove = backupFiles.slice(
          0,
          backupFiles.length - maxBackups
        );
        backupsToRemove.forEach((backup) => {
          const backupPath = path.join(backupDir, backup.file);
          fs.unlinkSync(backupPath);
          console.log(`Removed old backup: ${backup.file}`);
        });
      }
    });
  });
}

module.exports = performBackup;
