import { UserModel } from "../user/user.model";

const currentUser = async (req: any, res: any) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ id: user._id, name: user.name, email: user.email });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
export { currentUser };
