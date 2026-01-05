const supabase = require('../config/supabase');

// 1. Get All Pending Requests (Joined with Profile to see names)
exports.getPendingRequests = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('subscription_requests')
      .select(`
        id,
        requested_plan,
        created_at,
        user_id,
        profiles:user_id ( full_name, email )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. Approve Request
exports.approveRequest = async (req, res) => {
  const { requestId } = req.body; // We send the request ID

  try {
    // A. Get the request details
    const { data: request, error: fetchError } = await supabase
      .from('subscription_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (fetchError || !request) throw new Error('Request not found');

    // B. Update the USER'S LEVEL table (Grant Access)
    const { error: updateLevelError } = await supabase
      .from('level')
      .upsert({
        id: request.user_id,
        status: request.requested_plan,
        updated_at: new Date().toISOString()
      });

    if (updateLevelError) throw updateLevelError;

    // C. Mark request as APPROVED
    await supabase
      .from('subscription_requests')
      .update({ status: 'approved' })
      .eq('id', requestId);

    res.status(200).json({ success: true, message: 'User upgraded successfully' });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 3. Reject Request
exports.rejectRequest = async (req, res) => {
  const { requestId } = req.body;

  try {
    const { error } = await supabase
      .from('subscription_requests')
      .update({ status: 'rejected' })
      .eq('id', requestId);

    if (error) throw error;

    res.status(200).json({ success: true, message: 'Request rejected' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 4. Force Update User Level (Admin God Mode)
exports.updateUserLevel = async (req, res) => {
  const { userId, newStatus } = req.body;

  // Valid statuses matching your DB constraint
  const validStatuses = [
    'Reguler', 
    'Monthly Plus', 
    'Monthly Premium', 
    'Yearly Premium'
  ];

  if (!userId || !newStatus) {
    return res.status(400).json({
      success: false,
      message: 'userId and newStatus are required'
    });
  }

  if (!validStatuses.includes(newStatus)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
    });
  }

  try {
    // Upsert ensures that if the user doesn't have a row in 'level' yet, it creates one.
    const { data, error } = await supabase
      .from('level')
      .upsert({
        id: userId,
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .select();

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: `User ${userId} status forced to ${newStatus}`,
      data: data
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};