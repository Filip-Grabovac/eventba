const tinyMCEConfig = {
  apiKey: "8fgmli1ap5y13x4cghw67c58b35yw86yj8mbiz1fh3gf96om",
  height: 450,
  menubar: true,
  language: "hr",
  plugins: [
    "advlist autolink lists link image charmap print preview anchor",
    "searchreplace visualblocks code fullscreen",
    "insertdatetime media table paste code help wordcount",
  ],
  toolbar:
    "undo redo | formatselect | " +
    "bold italic underline strikethrough | " + // Add underline and strikethrough buttons
    "forecolor backcolor | " + // Add text color and background color buttons
    "alignleft aligncenter alignright alignjustify | " +
    "bullist numlist outdent indent | " +
    "removeformat | help",
};

export default tinyMCEConfig;
