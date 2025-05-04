const Transporter = require("../../models/transporter");

const getTransporterByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id); // Log userId for debugging

    const transporters = await Transporter.find({ user: id }).populate(
      "user"
    );

    // Check if transporters array is empty
    if (transporters.length === 0) {
      return res
        .status(404)
        .json({ message: "Transporter not found for the given user ID" });
    }

    res.status(200).json({ transporters }); // Return transporters (note: plural form)
  } catch (error) {
    console.error("Error fetching transporter by user id:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getTransporterByUserId };
