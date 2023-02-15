const cheerio = require("cheerio");
const https = require('https');
var express = require('express')
var app = express();
var bodyParser = require('body-parser');
var urlencodedparser = bodyParser.urlencoded({extended:false});
var session = require('express-session');

app.use(session({ secret: 'keyboard cat',  saveUninitialized: false,resave: false, cookie: { maxAge: 60000 }}));
const fs = require('fs');
var http = require('http');
var path = require("path");
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));
var sess; // global session, NOT recommended
app.post('/imgurl', (req, res) => {
    res.header('Access-Control-Allow-Credentials', 'true');   

    (async () => {

    	const unirest = require("unirest");
    const cheerio = require("cheerio");
    
    const getImagesData = () => {
        const selectRandom = () => {
        const userAgents = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
        ];
        var randomNumber = Math.floor(Math.random() * userAgents.length);
        return userAgents[randomNumber];
        };
        let user_agent = selectRandom();
        let header = {
        "User-Agent": `${user_agent}`,
        };
        var searched =req.body.marque+" "+req.body.year+" "+req.body.version;
        return unirest
        
        .get(
            "https://www.google.com/search?q="+searched+"+&oq="+req.body.marque+"&hl=en&tbm=isch&asearch=ichunk&async=_id:rg_s,_pms:s,_fmt:pc&sourceid=chrome&ie=UTF-8"
        )
        .headers(header)
        .then((response) => {
            let $ = cheerio.load(response.body);
    
            let images_results = [];
            $("div.rg_bx").each((i, el) => {
            let json_string = $(el).find(".rg_meta").text();
            images_results.push({
                title: $(el).find(".iKjWAf .mVDMnf").text(),
                source: $(el).find(".iKjWAf .FnqxG").text(),
                link: JSON.parse(json_string).ru,
                original: JSON.parse(json_string).ou,
                thumbnail: $(el).find(".rg_l img").attr("src") ? $(el).find(".rg_l img").attr("src") : $(el).find(".rg_l img").attr("data-src"),
            });
            });
    
            console.log(images_results);
             res.send(images_results);
        });
    };
    
    getImagesData(); 

     
    })();
});




app.listen(3000, () => console.log('Server ready'));
