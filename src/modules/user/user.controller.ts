import { UserModel } from "../user/user.model";

const currentUser = async (req: any, res: any): Promise<Response> => {
  try {
    // Assume req.user is populated from previous middleware (e.g., auth middleware)
    if (!req.user || !req.user.id) {
      // It's a good practice to check if req.user and req.user.id are actually set
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    // Find the user by ID stored in req.user.id
    const user = await UserModel.findById(req.user.id);

    // Handle case where user is not found in the database
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Successfully found the user, return relevant user details
    return res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    // Log the error and return a generic internal server error message
    console.error("Failed to retrieve user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { currentUser };
