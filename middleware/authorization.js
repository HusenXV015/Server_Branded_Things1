// middleware/authorization.js
const { User, Article } = require('../models');

const authorization = async (req, res, next) => {
    try {
        const { userId, role } = req.loginInfo; 

        if (role === 'Staff') {
            const user = await User.findByPk(userId);
            if (!user) throw { name: "Forbidden" };

            const { id } = req.params;
            const article = await Article.findByPk(id);
            if (!article) throw { name: "NotFound" };
            if (article.authorId !== user.id) throw { name: "Forbidden" };
        }
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = authorization;
