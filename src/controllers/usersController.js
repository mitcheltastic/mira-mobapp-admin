const supabase = require('../config/supabase');

// 1. Get List of Users (ID, Full Name, Email, Avatar & Status)
exports.getUsersList = async (req, res) => {
  try {
    // UPDATED: Added 'avatar_url' to the select string
    const { data: users, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, avatar_url, level(status)') 
      .order('updated_at', { ascending: false });

    if (error) throw error;

    // Format data to flatten the structure for the Frontend
    const formattedData = users.map(user => ({
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      avatar_url: user.avatar_url, // <--- Added this line
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

// 2. Delete User (Unchanged)
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
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