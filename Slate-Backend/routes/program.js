// Example: Express route handler
const Program = require('../models/Program');

app.get('/api/programs', async (req, res) => {
  try {
    const categories = ['Maintenance Plans', 'Weight Loss', 'Muscle Building'];

    const pipeline = categories.map(category => ([
      { $match: { 'meta.visibility': true, 'meta.categories': category } },
      { $sample: { size: 3 } }, // random 3
      { $project: {
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