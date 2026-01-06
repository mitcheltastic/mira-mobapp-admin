const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Import JWT

// 1. Add New Admin
exports.registerAdmin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Username and password are required' 
    });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { data, error } = await supabase
      .from('admins')
      .insert([
        { 
          username: username, 
          password_hash: hashedPassword 
        }
      ])
      .select('id, username, created_at')
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ 
          success: false, 
          message: 'Username already exists' 
        });
      }
      throw error;
    }

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: data
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// 2. Login Admin
exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Username and password are required' 
    });
  }

  try {
    // A. Find admin by username
    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
      .single();

    // Handle user not found or DB error
    if (error || !admin) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // B. Verify Password
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // C. Generate JWT Token
    const payload = { 
      id: admin.id, 
      username: admin.username 
    };

    const token = jwt.sign(
      payload, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    // Return token and basic info (exclude hash)
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: token,
      user: {
        id: admin.id,
        username: admin.username
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// 3. WhoAmI (Get Current Admin)
exports.getMe = async (req, res) => {
  // We assume middleware has already attached 'req.user'
  try {
    const { data: admin, error } = await supabase
      .from('admins')
      .select('id, username, created_at') // Exclude password_hash
      .eq('id', req.user.id)
      .single();

    if (error || !admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      data: admin
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// 4. Delete Admin
exports.deleteAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('admins')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: `Admin with ID ${id} has been deleted`
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// 5. Logout Admin
exports.logoutAdmin = async (req, res) => {
  try {
    // NOTE: In a JWT setup, the server doesn't actually "delete" the session.
    // This endpoint mainly serves to tell the frontend to clear the token.
    
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// NEW: Get List of All Admins
exports.getAdminsList = async (req, res) => {
  try {
    // Select specific columns only (NEVER select password_hash)
    const { data: admins, error } = await supabase
      .from('admins')
      .select('id, username, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({
      success: true,
      count: admins.length,
      data: admins
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};