const { Product, User, Category } = require(`../models`)
const imagekit = require('../utils/imageKit');

class productController {
    static async read ( req, res, next ){
        try {
            const product = await Product.findAll({
                include: [
                    { model: User, attributes: ['username', 'email'] },
                    { model: Category, attributes: ['name'] }
                  ],
                  attributes: { exclude: ['User.password'] }
            })
            res.status(200).json({
                massage: "Success read Product",
                product
            })
        } catch (err) {
            next(err)
        }
    }

    static async readById(req, res, next){
        try {
            const { id } = req.params;
            const product = await Product.findByPk(id, {
              include: [
                { model: Category, attributes: ['name'] },
                { model: User, attributes: ['username', 'email'] }
              ],
              attributes: { exclude: ['authorId'] }
            });
            if (!product) {
              return res.status(404).json({ message: 'Product not found' });
            }
            res.status(200).json({product});
        } catch (err) {
            next(err)
        }
    }

    static async add( req, res, next ){
        try {
            const { userId } = req.loginInfo
            const { name, description, price, stok, imgUrl, categoryId } = req.body
            const product = await Product.create(
                {name, description, price, stok, imgUrl, categoryId, authorId: userId}
            )
            res.status(201).json({
                massage:"success input Product",
                product
            })
        } catch (err) {
            next(err)
        }
    }
    
    static async edit( req, res, next ){
        try {
            const { id } = req.params
            const {name, description, price, stok, imgUrl, categoryId} = req.body
            const product = await Product.findByPk(id);
            if (!product) {
                return res.status(404).json({message: "product not found"})
            }
            product.name = name,
            product.description = description,
            product.price = price,
            product.stok = stok,
            product.imgUrl = imgUrl,
            product.categoryId = categoryId
            await product.update()
            res.status(201).json({
                massage:"success Edit Product",
                product
            })
        } catch (err) {
            next(err)
        }
    }

    static async delete( req, res, next){
        try {
            const { id } = req.params
            const product = await Product.findByPk(id)
            if (!product) {
                return res.status(404).json({ message: 'product not found.' });
            }
            await product.destroy()
            res.status(200).json({
                massage: `successfully deleted.`,
            })
        } catch (err) {
            next(err)
        }
    }

    static async updateImage(req, res, next) {
        try {
          const { id } = req.params;
          const product = await Product.findByPk(id);
          if (!product) {
              return res.status(404).json({ message: 'Article not found' });
          }
          if (!req.file) {
              return res.status(400).json({ message: 'No file uploaded' });
          }
          const imageInBase64 = req.file.buffer.toString("base64");
          const result = await imagekit.upload({
              file: imageInBase64,
              fileName: req.file.originalname,
              tags: ["test"],
          });
          product.imgUrl = result.url;
          await product.save();
          res.status(200).json({
              message: 'Image product success to update',
              product
          });
      } catch (err) {
        console.log(err);
          next(err);
      }
  }
  
}

module.exports = productController