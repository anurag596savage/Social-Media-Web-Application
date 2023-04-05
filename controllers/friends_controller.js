const Friendship = require("../models/friendship");
const User = require("../models/user");

module.exports.toggleFriend = async (request, response) => {
  try {
    let deleted = false;
    let from_user_id = await User.findById(request.query.source);
    let to_user_id = await User.findById(request.query.destination);
    let sourceToDestination = await Friendship.findOne({
      from_user: from_user_id,
      to_user: to_user_id,
    });
    let destinationToSource = await Friendship.findOne({
      from_user: to_user_id,
      to_user: from_user_id,
    });
    if (sourceToDestination) {
      await User.findByIdAndUpdate(from_user_id, {
        $pull: { friends: sourceToDestination._id },
      });
      await User.findByIdAndUpdate(to_user_id, {
        $pull: { friends: sourceToDestination._id },
      });
      await Friendship.deleteOne({ _id: sourceToDestination._id });
      deleted = true;
    } else if (destinationToSource) {
      await User.findByIdAndUpdate(from_user_id, {
        $pull: { friends: destinationToSource._id },
      });
      await User.findByIdAndUpdate(to_user_id, {
        $pull: { friends: destinationToSource._id },
      });
      await Friendship.deleteOne({ _id: destinationToSource._id });
      deleted = true;
    } else {
      let newFriend = await Friendship.create({
        from_user: from_user_id,
        to_user: to_user_id,
      });
      let source = await User.findById(from_user_id);
      source.friends.push(newFriend._id);
      source.save();
      let destination = await User.findById(to_user_id);
      destination.friends.push(newFriend._id);
      destination.save();
    }
    return response.status(200).json({
      data: {
        deleted: deleted,
      },
      message: "Request completed successfully!",
    });
  } catch (error) {
    console.log("Error in completing the request: ", error);
    return response.status(500).json({
      message: "Internal Server Error!",
    });
  }
};
