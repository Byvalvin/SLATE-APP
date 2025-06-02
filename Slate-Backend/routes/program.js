const express = require('express');
const router = express.Router();

const Program = require('../models/Program');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const categories = ['Maintenance Plans', 'Weight Loss', 'Muscle Building'];

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
      { $sample: { size: 10 } }, // sample more so we can fill up each category
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

    // Group programs into categories
    const grouped = {};
    for (const category of categories) {
      grouped[category] = result.filter(p =>
        p.meta.categories?.some(cat => cat.toLowerCase() === category.toLowerCase())
      ).slice(0, 3); // at most 3 per category
    }

    res.json(grouped);

  } catch (err) {
    console.error('Failed to fetch programs:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:programId', authMiddleware, async (req, res) => {
  try {
    const program = await Program.findOne({ programId: req.params.programId });

    if (!program) return res.status(404).json({ error: 'Program not found' });

    res.json(program);
  } catch (err) {
    console.error('Error fetching program by ID:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
