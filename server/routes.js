const express = require('express');
const router = express.Router();

router.get('/health', (req,res) => res.json({ ok: true }));

router.get('/providers', (req,res)=>{
  res.json({ providers: [
    { id: 'hdfc', type: 'bank', name: 'HDFC Bank' },
    { id: 'sbi', type: 'bank', name: 'State Bank of India' },
    { id: 'icici', type: 'bank', name: 'ICICI Bank' },
    { id: 'phonepe', type: 'wallet', name: 'PhonePe' }
  ]});
});

router.post('/compare', express.json(), (req,res)=>{
  const { query = '', mode = 'flight', providers = [] } = req.body || {};
  const results = [
    { site: 'ExampleFlights', basePrice: 5000, merchant: 'ExampleFlights', href: 'https://example.com/flights' },
    { site: 'OtherPortal', basePrice: 4700, merchant: 'ExampleFlights', href: 'https://other.com/flights' }
  ];
  const computed = results.map(r => {
    let price = r.basePrice - (providers.length * 50);
    return { ...r, price };
  });
  const best = computed.reduce((a,b)=> a.price<b.price?a:b, computed[0]);
  res.json({ all: computed, best });
});

module.exports = router;
