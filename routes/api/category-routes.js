const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/categories/', (req, res) => {
  // find all categories
  router.get('/models/categories/', (req, res) => {
    // find all products
    const sql = `SELECT * FROM categories`;
  
  
    // be sure to include its associated Products
    db.query(sql, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: rows
      });
    });

});

router.get('/categories/:id', (req, res) => {
  // find one category by its `id` value
    // find a single product by its `id`
    const sql = `SELECT * FROM product WHERE id = ?`;
    const params = [req.params.id];
  
    // be sure to include its associated Products
    db.query(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: row
      });
    });
  });


});

router.post('/categories/', (req, res) => {
  // create a new category
  router.post('/categories/', (req, res) => {

    Product.create(req.body)
      .then((product) => {
        // if there's product tags, we need to create pairings to bulk create in the ProductTag model
        if (req.body.tagIds.length) {
          const productTagIdArr = req.body.tagIds.map((tag_id) => {
            return {
              product_id: product.id,
              tag_id,
            };
          });
          return ProductTag.bulkCreate(productTagIdArr);
        }
        // if no product tags, just respond
        res.status(200).json(product);
      })
      .then((productTagIds) => res.status(200).json(productTagIds))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  });

});

router.put('/categories/:id', (req, res) => {
  // update a category by its `id` value
  Categories.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((Categories) => {
      // find all associated tags from ProductTag
      return Categories.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });

});

router.delete('/categories/:id', (req, res) => {
  // delete a category by its `id` value
  const sql = `DELETE FROM categories WHERE id = ?`;

  db.query(sql, req.params.id, (err, result) => {
    if (err) {
      res.status(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Category not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });

});

module.exports = router;
