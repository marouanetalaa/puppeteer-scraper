const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
app.use(express.json());

// Endpoint to scrape dirigeant names
app.post('/scrape-dirigeant', async (req, res) => {
  const { companyName, siren } = req.body;

  if (!companyName || !siren) {
    return res.status(400).json({ error: 'Missing companyName or siren' });
  }

  const url = `https://www.pappers.fr/entreprise/${companyName.toLowerCase().replace(/ /g, '-')}-${siren}`;

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'load', timeout: 0 });

    // Wait for the dirigeants' section to load
    await page.waitForSelector('td.info-dirigeant');

    // Scrape the dirigeants' names
    const dirigeants = await page.evaluate(() => {
      const rows = document.querySelectorAll('td.info-dirigeant a');
      return Array.from(rows).map((row) => row.textContent.trim());
    });

    await browser.close();

    res.json({ dirigeants });
  } catch (error) {
    console.error('Error scraping dirigeants:', error);
    res.status(500).json({ error: 'Scraping failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
