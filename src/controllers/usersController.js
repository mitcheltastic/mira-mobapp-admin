const supabase = require('../config/supabase');

// 1. Get List of Users (ID, Full Name, Email & Status)
exports.getUsersList = async (req, res) => {
  try {
    // Fetch profiles AND join with the 'level' table
    // Note: 'level(status)' fetches the status column from the related level table
    const { data: users, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, level(status)') 
      .order('updated_at', { ascending: false });

    if (error) throw error;

    // Format data to flatten the structure for the Frontend
    // If a user has no row in 'level' table, we default to 'Reguler'
    const formattedData = users.map(user => ({
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      status: user.level ? user.level.status : 'Reguler' 
    }));

    res.status(200).json({
      success: true,
      count: formattedData.length,
      data: formattedData
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// 2. Delete User
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if user exists first
    const { data: existing, error: findError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', id)
      .single();

    if (findError || !existing) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Execute Delete
    // Note: Ensure your 'level', 'posts', etc. have ON DELETE CASCADE in SQL
    // so this single delete cleans up everything.
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: `User with ID ${id} deleted successfully`
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};