const supabase = require("../config/supabase");

const adminMiddleware = async (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // Get user's role from Supabase
    const { data: user, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", req.user.id)
      .single();

    if (error || !user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // Check admin role
    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admins only.",
      });
    }

    // User is admin
    next();

  } catch (error) {
    console.error(
      "Admin Middleware Error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = adminMiddleware;