const express = require('express')
const router = express.Router()

const Program = require('../models/Program');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const categories = ['maintenance plans', 'weight loss', 'muscle building'];

    const result = await Program.aggregate([
      {
        $match: {
          'meta.visibility': true,
          'meta.categories': {
            $elemMatch: {
              $in: categories
            }
          }
        }
      },
      { $sample: { size: 3 } },
      {
        $project: {
          programId: 1,
          name: 1,
          'meta.imageUrl': 1,
          'meta.categories': 1,
          'meta.focusTag': 1,
          'meta.isNew': 1,
        }
      }
    ]);

    console.log(`Programs matched: ${result.length}`);
    res.json(result);

  } catch (err) {
    console.error('Failed to fetch programs:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
