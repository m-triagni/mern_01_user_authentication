
exports.read = (req, res) => {
    req.profile.hash_password = undefined;
    req.profile.salt = undefined;

    return res.json(req.profile)
}