const excel = require("exceljs");
const User = require("../../models/User");

async function generateExcelFile() {
  try {
    // Fetch all users from the database
    const users = await User.find(
      {},
      { full_name: 1, email: 1, city: 1, _id: 0 }
    );

    // Create a new workbook
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet("Users");

    // Add headers to the worksheet
    worksheet.addRow(["Name", "Email", "City"]);

    // Add user data to the worksheet
    users.forEach((user) => {
      worksheet.addRow([user.full_name, user.email, user.city]);
    });

    // Save the workbook to a file
    const excelFileName = `${__dirname}/users.xlsx`;
    await workbook.xlsx.writeFile(excelFileName);

    console.log(`Excel file "${excelFileName}" generated successfully.`);
  } catch (error) {
    console.error("Error generating Excel file:", error);
  }
}

// Call the function to generate the Excel file
// generateExcelFile();

module.exports = generateExcelFile;
