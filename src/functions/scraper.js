const { app } = require('@azure/functions');
const puppeteer = require('puppeteer-core');
//const puppeteer = require('puppeteer');

app.http('scraper', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);
        //const name = request.query.get('name') || await request.text() || 'world';

        // const  payload = await request.json();
        let urlString = "https://pptr.dev";
        const url = new URL(urlString);
        try {
            // const browser = await puppeteer.launch({
            //     headless: true,
            //     executablePath: '/home/site/wwwroot/chrome/linux-134.0.6998.165/chrome-linux64/chrome',
            //     args: ['--no-sandbox', '--disable-setuid-sandbox']
            // });
            const browser = await puppeteer.launch({
                headless: true,
                executablePath:  `${process.cwd()}/chrome/linux-134.0.6998.165/chrome-linux64/chrome`,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            // const browser = await puppeteer.launch({
            //     executablePath: `${process.cwd()}\\chrome\\win64-134.0.6998.165\\chrome-win64\\chrome.exe`,
            //     headless: true,
            //     args: [
            //         '--no-sandbox',
            //         '--disable-setuid-sandbox'
            //     ],
            // })
            // const browser = await puppeteer.launch({
            //     headless: true,
            //     args: [
            //       '--no-sandbox',
            //       '--disable-setuid-sandbox'
            //     ],
            //   })
            const page = await browser.newPage()
            await page.goto(url.href, { waitUntil: 'domcontentloaded' })
            const data = await page.evaluate(() => {
                const titles = Array.from(document.querySelectorAll('h2'))
                textValue = "";
                titles.forEach(title => {
                    textValue = textValue + title.innerHTML;
                });
                return textValue;
            })
            console.log(data)
            await browser.close()

            return { body: data };
        } catch (err) {
            return {
                body: JSON.stringify({ "error": err.stack })
            }
        }

        // const page = await browser.newPage()
        // await page.goto(url.href, { waitUntil: 'domcontentloaded' })

    }
});
