const supabase = require('../config/supabase');

// Get total counts for each feature
exports.getFeatureUsage = async (req, res) => {
  try {
    // Fetch raw logs including time (created_at) and user (user_id)
    const { data, error } = await supabase
        .from('feature_logs')
        .select('id, feature_name, created_at, user_id, profiles(nickname, email)')
        .order('created_at', { ascending: false });

    if (error) throw error;

    // Optional: If you still want the "counts" summary for a chart, 
    // you can calculate it here, or just let the frontend do it.
    // For now, we return the raw list as requested.

    res.status(200).json({
      success: true,
      count: data.length,
      data: data
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Get Basic User Stats
exports.getUserStats = async (req, res) => {
  try {
    // Count total users (admin privilege allows reading auth.users if configured, 
    // but usually better to count public.profiles)
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    res.status(200).json({
      success: true,
      total_users: count
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};