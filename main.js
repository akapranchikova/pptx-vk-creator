const cheerio = require('cheerio');
const puppeteer = require("puppeteer");
const pptxgen = require("pptxgenjs");



(async () => {
    let pptx = new pptxgen();
    pptx.defineSlideMaster({
        title: "MASTER_SLIDE",
        background: { color: "FFFFFF" },
        objects: [
            // { line: { x: 3.5, y: 1.0, w: 6.0, line: { color: "0088CC", width: 5 } } },
            // { rect: { x: 0.0, y: 5.3, w: "100%", h: 0.75, fill: { color: "F1F1F1" } } },
            // { text: { text: "Status Report", options: { x: 3.0, y: 5.3, w: 5.5, h: 0.75 } } },
            // { image: { x: 0.31, y: 0.3, w: 2.8125/3, h: 1.9063/3, path: "logo.png" } },
        ],
        // slideNumber: { x: 0.3, y: "90%" },
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


function createNewSlide(pptx) {
    let slide = pptx.addSlide({ masterName: "MASTER_SLIDE" });

    console.log(pptx._presLayout)
    const yTop = '30%'
    const width = '15%';
    // TOP: 1
    slide.addText("Sizing: Orig `w:6, h:2.7`", { x: 0.5, y: 0.6, w: 3.0, h: 0.3, color: COLOR_BLUE });
    slide.addImage({ path: '..'+image, x: '3%', y: yTop, w: width, h: 46.427083333/6, sizing: {type: "crop", w: width, h: 2, y: 0}});

    // TOP: 2
    slide.addText("Sizing: `contain, w:3`", { x: 0.6, y: 4.25, w: 3.0, h: 0.3, color: COLOR_BLUE });
    slide.addImage({ path: '..'+image, x: '19%', y: yTop, w: width, h: 46.427083333/6, sizing: { type: "crop", w: width, h: '20%', y: 0} });

    slide.addImage({ path: '..'+image, x: '35%%', y: yTop, w: width, h: 46.427083333/6, sizing: { type: "crop", w: width, h: '20%', y: 0} });

    // TOP: 2
    // slide.addText("Sizing: `contain, w:3`", { x: 0.6, y: 4.25, w: 3.0, h: 0.3, color: COLOR_BLUE });
    slide.addImage({ path: '..'+image, x: '51%', y: yTop, w: width, h: 4457, sizing: { type: "crop", w: width, h: '20%', y: 0} });
    slide.addImage({ path: '..'+image, x: '67%', y: yTop, w: width, h: 4457, sizing: { type: "crop", w: width, h: '20%', y: 0} });
    slide.addImage({ path: '..'+image, x: '83%', y: yTop, w: width, h: 4457, sizing: { type: "crop", w: width, h: '20%', y: 0} });

}
