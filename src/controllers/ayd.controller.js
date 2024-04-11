const jwt = require("jsonwebtoken")
const AYD = require("../models/ayd.model");
const Role = require("../models/role.model")

exports.getAyds = async (req, res, next) => {
  try {
    const ayd = await AYD.findAll();
    res.status(200).json(ayd);
  } catch (e) {
    res.status(400).json({ msg: e.message });  
  }
}


exports.createAyd = async (req, res, next) => {
  try {
    const roleExists = await Role.findByPk(req.user.roleId);
    const allowedRoles = ["Super Admin", "ADC Admin"]
    if (!(roleExists || allowedRoles.includes(roleExists.name))) {
      return res.status(401).json({ msg: "Unauthorized Action"});
    }
    const { theme, date, time, venue, host } = req.body;
    if (!(
      theme && date &&
      time && venue && host
    )) {
      res.status(400).json({ msg: "Incomplete Data"});
    }
    let bannerImage;
    if (req.file) {
      bannerImage = req.file.path;
    }
    const ayd = await AYD.create({ theme, date, time, venue, host, bannerImage});
    return res.status(200).json(ayd);
  } catch (e) {
    return res.status(400).json({ msg: e.message });
  }
}

exports.getCurrentAyd = async (req, res, next) => {
  try {
    const ayd = await AYD.findOne({ order: ['createdAt', 'DESC']});
    res.status(200).json(ayd);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
}

exports.getAyd = async (req, res, next) => {
  try {
    const ayd = await AYD.findByPk(req.params.aydId);
    res.status(200).json(ayd);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
}


exports.updateAyd = async (req, res, next) => {
  try {
      const roleExists = await Role.findByPk(req.user.roleId);
      const allowedRoles = ["Super Admin", "ADC Admin"]
      if (!(roleExists || allowedRoles.includes(roleExists.name))) {
        return res.status(401).json({ msg: "Unauthorized Action"});
      }
      const ayd = await AYD.findByPk(req.params.aydId);
      await ayd.update(req.body);
      let bannerImage;
      if (req.file) {
      bannerImage = req.file.path;
      }
      ayd.bannerImage = bannerImage || ayd.bannerImage;
      await ayd.save();
      return res.status(200).json({ msg: "Updated Successfully", ayd });
  } catch (e) {
      return res.status(400).json({ msg: e.message });
  }
}
