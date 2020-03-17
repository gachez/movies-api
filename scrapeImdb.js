const mongoose = require('mongoose');
const TvShow = require( './models/tvShowsModel');
const puppeteer = require('puppeteer');

module.exports = async () => {
    const browser = await puppeteer.launch({ headless: true  });
    const page = await browser.newPage();

     // Configure the navigation timeout
     await page.setDefaultNavigationTimeout(0); 

    await page.goto('https://www.imdb.com/chart/tvmeter/?ref_=nv_tvv_mptv');

    // get all elements to be clicked
    let moviesAll = [];
    const elementsToClickSelector = 'div.lister > table td.titleColumn a';
    let elementsToClick = await page.$$(elementsToClickSelector);
    console.log(`Elements to click: ${elementsToClick.length}`);
    console.log('Getting and adding films...')

    for (let i = 0; i < elementsToClick.length; i++) {
        // click element
        elementsToClick[i].click();
        await page.waitForSelector('div.title_bar_wrapper')
          // Configure the navigation timeout
        await page.setDefaultNavigationTimeout(0); 
        

        // generate result for the current page
        const result = await page.evaluate(() => {
          //elements that are meant to work
            let title = document.querySelector('h1').innerText;
            let genre = document.querySelector('div.title_bar_wrapper div.subtext a') === null ? 'film' : document.querySelector('div.title_bar_wrapper div.subtext a').innerText;
            let description = document.querySelector('div.plot_summary_wrapper div.plot_summary div.summary_text') === null ? 'no description' : document.querySelector('div.plot_summary_wrapper div.plot_summary div.summary_text').innerText;
            let rating = document.querySelector('div.title_bar_wrapper div.ratings_wrapper strong span') === null ? 'not rated' : document.querySelector('div.title_bar_wrapper div.ratings_wrapper strong span').innerText; 
            let poster = document.querySelector('div.heroic-overview img') === null ? '' : document.querySelector('div.heroic-overview img').src;
            let trailer = document.querySelector('div.heroic-overview div.slate a') === null ? 'no trailer' : document.querySelector('div.heroic-overview div.slate a').href; 
          
            return { 
                title,
                genre,
                description,
                rating,
                poster,
                trailer
            };
        });

        // do something with the result here...
        moviesAll.push(result)
        console.log(`Added ${moviesAll.length} of ${elementsToClick.length}`)

        // go back one page and repopulate the elements
        await page.goBack();
        elementsToClick = await page.$$(elementsToClickSelector);
    }

    browser.close();

        // //connect to Mongodb
        mongoose.connect('mongodb+srv://dbUser:dbPassword@cluster0-cu3wb.gcp.mongodb.net/test?retryWrites=true&w=majority',
        {
          useUnifiedTopology: true,
          useNewUrlParser: true
        });
    
        //Go through each movie
        moviesAll.map(movieData => {
        //initialize a model with movie data
        const series = new TvShow(movieData);
        //now lets save to database
        series.save()
        });
        console.log('All done')    
};
