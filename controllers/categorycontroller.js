const { Category } = require(`../models`)

class categoryController{
    static async read( req, res, next){
        try {
            const category = await Category.findAll()
            res.status(200).json({
                massage:"success read Category",
                category
            })
        } catch (err) {
            next(err)
        }
    }
    static async add( req, res,next ){
        try {
            const { name } = req.body
            const category = await Category.create({name})
            res.status(201).json({
                massage:"succes add Category",
                category
            }) 
        } catch (err) {
            next(err)
        }
    }
    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            const category = await Category.findByPk(id);
            if (!category) {
                return res.status(404).json({ message: `Category with id ${id} not found` });
            }
            await category.destroy();
            res.status(201).json({
                message: `${id} Success to delete `
            });
        } catch (err) {
            next(err)
        }
    }
}



module.exports = categoryController