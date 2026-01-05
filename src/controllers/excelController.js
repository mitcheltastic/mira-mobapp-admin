const supabase = require('../config/supabase');
const XLSX = require('xlsx');

// --- A. EXPORT TO EXCEL (Download Database Data) ---
// Example: Export all User Profiles to Excel
exports.exportProfiles = async (req, res) => {
  try {
    // 1. Fetch data from Supabase
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, nickname, full_name, email, updated_at');

    if (error) throw error;

    if (!profiles || profiles.length === 0) {
      return res.status(404).json({ message: 'No data to export' });
    }

    // 2. Convert JSON to Worksheet
    const worksheet = XLSX.utils.json_to_sheet(profiles);

    // 3. Create Workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Profiles');

    // 4. Generate Buffer
    const excelBuffer = XLSX.write(workbook, { 
      bookType: 'xlsx', 
      type: 'buffer' 
    });

    // 5. Send File to Client
    res.setHeader('Content-Disposition', 'attachment; filename="Profiles_Export.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(excelBuffer);

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- B. IMPORT FROM EXCEL (Bulk Insert) ---
// Example: Bulk Create Posts from Excel
exports.importPosts = async (req, res) => {
  try {
    // 1. Check if file exists
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // 2. Read the Buffer from the uploaded file
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    if (rawData.length === 0) {
      return res.status(400).json({ success: false, message: 'Excel sheet is empty' });
    }

    // 3. FIX: Get a Valid User UUID to assign these posts to
    // We fetch the first user we find in 'profiles' to be the author
    const { data: validUser, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
      .single();

    if (userError || !validUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'No users found in profiles table to assign these posts to.' 
      });
    }

    const authorId = validUser.id; // This is a real UUID

    // 4. Map the data using the Valid User UUID
    const postsToInsert = rawData.map(row => ({
      user_id: authorId, // <--- Now using a valid UUID
      content: row.content,
      image_url: row.image_url || null,
    }));

    // 5. Bulk Insert
    const { data, error } = await supabase
      .from('posts')
      .insert(postsToInsert)
      .select();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: `Successfully imported ${data.length} posts (Assigned to User ID: ${authorId})`,
      data: data
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};