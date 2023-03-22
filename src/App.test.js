const { chromium } = require('playwright');

jest.setTimeout(30000);

describe('Marker tests', () => {
  let browser, page;

  beforeAll(async () => {
    browser = await chromium.launch({ headless: false });
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:3000');
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  
  test('Add new marker', async () => {
    await page.click('text=+ Add new marker');
    console.log('Clicked on "Add new marker" button');

    await page.fill('input[type="text"]', 'Bondi Beach');
    console.log('Filled out name input field');

    await page.fill('input[type="number"]', '-33.8916');
    console.log('Filled out latitude input field');

    await page.fill('#longitude', '151.2747');
    console.log('Filled out longitude input field');

    await page.click('#addBtn');
    console.log('Clicked on "Add" button');

    const markerName = await page.textContent('li:last-child');
    console.log('Retrieved marker name from list --', markerName);

    expect(markerName).toBe('Bondi BeachX');
  });
});
