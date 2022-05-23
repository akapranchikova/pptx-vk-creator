const cheerio = require('cheerio');
const puppeteer = require("puppeteer");
const pptxgen = require("pptxgenjs");


(async () => {
    let pptx = new pptxgen();
    pptx.defineSlideMaster({
        title: "MASTER_SLIDE",
        background: { color: "FFFFFF" },
    });

    const yTop = 25;
    const widthImage = 15;
    const offsetSlide = 16;

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 800 })
    await page.goto('https://vk.com/sportmaster?w=wall-48593_968503', { waitUntil: 'networkidle2' })

    for (let j = 0; j<10; j++) {
        let slide = pptx.addSlide({masterName: "MASTER_SLIDE"});
        slide.addImage({ x: 0.31, y: 0.3, w: 2.8125/3, h: 1.9063/3, path: "logo.png" });
        for (let i = 0; i < 6; i++) {
            if (i !== 0 || j !== 0) {
                await page.waitForNavigation()
            }
            console.log(`Slide - ${j + 1}, image - ${i + 1}`);
            const element2 = await page.$('#wk_content');
            await element2.screenshot({path: `screens/screenshot${i}${j}.jpeg`})
            const boxElement = await element2.boundingBox();
            const widthSlide = pptx._presLayout.width;
            const heightSlide = pptx._presLayout.height;
            const heightImage = (boxElement.height * widthImage * widthSlide) / (boxElement.width * heightSlide)
            const xElement = 3 + i * offsetSlide;
            slide.addImage({
                path: `screens/screenshot${i}${j}.jpeg`,
                x: xElement + '%',
                y: yTop + '%',
                w: widthImage + '%',
                h: heightImage + '%',
                sizing: {type: "crop", w: widthImage, h: 2, y: 0}
            });
            slide.addText(page.url().toString(), {
                x: xElement + '%',
                y: '75%',
                w: widthImage + '%',
                h: 0.3,
                bold: false,
                fontSize: 10,
                fontFace: 'Arial',
                color: '4295A5',
                hyperlink: {url: page.url().toString()},
            });

            await page.click('#wk_left_arrow_bg');
        }
    }
    pptx.writeFile();
    await browser.close()
})()
