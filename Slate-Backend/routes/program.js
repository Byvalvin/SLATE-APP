// Example: Express route handler
const express = require('express')
const router = express.Router()

const Program = require('../models/Program');
const authMiddleware = require('../middleware/auth'); // You need to extract user ID from token

router.get('/', authMiddleware, async (req, res) => {
  try {
    const categories = ['maintenance plans', 'weight loss', 'muscle building'];

    const pipeline = categories.map(category => ([
      {
        $match: {
          'meta.visibility': true,
          $expr: {
            $gt: [
              {
                $size: {
                  $filter: {
                    input: '$meta.categories',
                    as: 'cat',
                    cond: {
                      $eq: [
                        { $toLower: '$$cat' },
                        category.toLowerCase()
                      ]
                    }
                  }
                }
              },
              0
            ]
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
    ])).flat();
    

    const result = await Program.aggregate(pipeline);
    console.log(`Programs matched: ${result.length}`);

    
    // Group them by category
    const grouped = {};
    result.forEach(p => {
      const cat = p.meta.categories.find(c => categories.includes(c));
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(p);
    });

    res.json(grouped);
    

  } catch (err) {
    console.error('Failed to fetch programs:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;