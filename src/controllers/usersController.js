const supabase = require('../config/supabase');

// 1. Get List of Users (ID & Full Name)
exports.getUsersList = async (req, res) => {
  try {
    // Fetch minimal data: ID and Full Name (and email for reference)
    const { data: users, error } = await supabase
      .from('profiles')
      .select('id, full_name, email') 
      .order('updated_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
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
    // Optional: Check if user exists first
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