const { exec } = require("child_process");
const moment = require("moment");
const fs = require("fs");
const path = require("path");

// Function to perform MongoDB backups and remove files older than 30 days
function performBackup() {
  const adminDbUrl = process.env.DATABASE_ADMIN;
  const backupDir = "/root/db_backup"; // Backup directory path

  console.log("Backup started");

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
    console.log(`Backup directory created: ${backupDir}`);
  }

  const timestamp = moment().format("YYYYMMDD-HHmmss");
  const backupFileName = `${timestamp}_admin_db_backup`;
  const backupDirPath = path.join(backupDir, backupFileName);

  const backupCommand = `mongodump --uri ${adminDbUrl} --out ${backupDirPath}`;

  exec(backupCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error during backup: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr during backup: ${stderr}`);
      return;
    }

    console.log(`Backup completed at ${timestamp} for admin database`);
  });

  // Remove files older than 30 days in the entire backup directory
  const currentDate = moment();
  fs.readdirSync(backupDir).forEach((file) => {
    const filePath = path.join(backupDir, file);
    const fileStat = fs.statSync(filePath);
    const fileCreationTime = moment(fileStat.birthtime);

    // Check if the file is older than 30 days
    if (currentDate.diff(fileCreationTime, "days") > 30) {
      if (fileStat.isDirectory()) {
        fs.rmdirSync(filePath, { recursive: true });
        console.log(`Removed old directory: ${file}`);
      } else {
        fs.unlinkSync(filePath);
        console.log(`Removed old file: ${file}`);
      }
    }
  });
}

module.exports = performBackup;
