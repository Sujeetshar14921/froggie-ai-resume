import User from "../../../../models/User.js";

/**
 * User Profile tool handlers
 * Grounded in authenticated account identity
 */

export const getUserProfileHandler = async ({ userId }) => {
  const user = await User.findById(userId).select("-password").lean();
  if (!user) {
    return {
      success: false,
      message: "Authenticated user account not found.",
    };
  }

  return {
    success: true,
    profile: {
      id: user._id,
      name: user.name,
      email: user.email,
      profession: user.profession || "Not specified",
      phone: user.phone || "Not specified",
      location: user.location || "Not specified",
      bio: user.bio || "",
      authProvider: user.authProvider || "local",
    },
    message: `Account Holder: ${user.name} (${user.email})`,
  };
};

export const updateProfileHandler = async ({ userId, args }) => {
  const { name, profession, phone, location, bio } = args || {};

  const updates = {};
  if (name && name.trim()) updates.name = name.trim();
  if (profession !== undefined) updates.profession = profession.trim();
  if (phone !== undefined) updates.phone = phone.trim();
  if (location !== undefined) updates.location = location.trim();
  if (bio !== undefined) updates.bio = bio.trim();

  if (Object.keys(updates).length === 0) {
    return {
      success: false,
      message: "No profile changes provided.",
    };
  }

  const updated = await User.findByIdAndUpdate(userId, updates, { new: true })
    .select("-password")
    .lean();

  return {
    success: true,
    action: "profile_updated",
    updatedUser: updated,
    message: "Your profile details have been updated successfully.",
    cardType: "action_result",
    cardData: {
      action: "Profile Updated",
      status: "success",
      message: `Updated profile: ${Object.keys(updates).join(", ")}`,
      buttons: [
        { label: "View Profile", action: "modal", modalType: "profile", variant: "primary" },
      ],
    },
  };
};

export default {
  getUserProfileHandler,
  updateProfileHandler,
};
