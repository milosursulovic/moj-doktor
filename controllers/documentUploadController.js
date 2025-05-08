// Renders EJS view with paginated and filtered user data
export const getDocumentUpload = async (req, res) => {
  try {

    // Render the EJS template 'index.ejs' of document upload
    res.render("document-upload/index");
  } catch (error) {
    // Handle errors (e.g., DB failure) by returning a 500 Internal Server Error
    res.status(500).json({ msg: error.message });
  }
};