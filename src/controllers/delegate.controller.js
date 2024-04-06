const Delegate = require("../models/delegate.model");
const AYD = require("../models/ayd.model")


exports.getDelegates =  async (req, res, next) => {
  try {
    const delegates = await Delegate.findAll()
    res.status(200).json(delegates)
  } catch (e) {
    res.status(400).json({ msg: e.message})
  }
}

exports.createDelegate = async (req, res, next) => {
  try {
    const { lastName, firstName, email, phoneNumber, parishId, aydId } = req.body;
    if (!(
        lastName &&
        firstName &&
        email &&
        phoneNumber &&
        parishId &&
        aydId
    )) {
         return res.status(400).json({ msg: "Incomplete Data"});
    }
    const delegate = await Delegate.create({
      lastName, firstName, email, phoneNumber, parishId, aydId
    })
    const ayd = await AYD.findByPk(aydId);
    ayd.totalDelegates += 1;
    await ayd.save();
    return res.status(200).json(delegate);
  } catch (e) {
    return res.status(400).json({ msg: e.message });
  }
}
