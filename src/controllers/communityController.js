const supabase = require('../config/supabase');

// 1. Get All Posts with Nested Comments
exports.getCommunityFeed = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        content,
        image_url,
        created_at,
        user_id,
        author:user_id ( full_name, email, avatar_url ),
        comments (
          id,
          content,
          created_at,
          user_id,
          author:user_id ( full_name, avatar_url )
        )
      `)
      .order('created_at', { ascending: false }); // Newest posts first

    if (error) throw error;

    // Optional: Sort comments inside each post (Oldest first usually looks better for chat)
    const formattedData = data.map(post => ({
      ...post,
      comments: post.comments.sort((a, b) => 
        new Date(a.created_at) - new Date(b.created_at)
      )
    }));

    res.status(200).json({
      success: true,
      count: data.length,
      data: formattedData
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// 2. Delete Post (Cascades to comments automatically)
exports.deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: `Post ${id} and its comments have been deleted`
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// 3. Delete Specific Comment (Optional, if you want precise control)
exports.deleteComment = async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: `Comment ${id} deleted`
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ... existing imports

// 4. Get All Reports (Moderation Queue)
exports.getReports = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select(`
        id,
        reason,
        created_at,
        reporter:reporter_id ( full_name, email ),
        post:post_id (
          id,
          content,
          image_url,
          created_at,
          author:user_id ( full_name, email, avatar_url )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

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

// 5. Resolve Report (Usually means deleting the report after checking)
exports.deleteReport = async (req, res) => {
  const { id } = req.params; // Report ID

  try {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Report resolved/deleted successfully'
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};