import axios from "axios";
import express, { response } from "express";
import ejs from 'ejs'; 
import bodyParser from "body-parser";
import { error } from "console";
import { chownSync } from "fs";

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const config = {
    headers: {
        'x-rapidapi-key': '5e258cf6admsh407fa5b7f88a797p1ec348jsn40c728c590da',
        'x-rapidapi-host': 'bhagavad-gita3.p.rapidapi.com'
      }
}

app.get("/", (req, res) => {
    res.render("index.ejs", {
                                head: `सर्वोपनिषदो गावो दोग्धा गोपालनन्दनः। पार्थो वत्सः सुधीर्भोक्ता दुग्धं गीतामृतं महत्॥`,
                                trail_1: "Meaning: All the Upanishads are like cows, and the milker is Krishna, the son of the cowherd. Arjuna is the calf, and the wise people are the enjoyers of the milk, which is the supreme nectar of the Bhagavad Gita.",
                                trail_2: "Mahabharat Chapter 6, Verse 25"
                            });
})

app.post("/shloka", async(req, res)=>{
    const chapter = req.body.chapter;
    const verse = req.body.verse;
    if(verse == 0)
    {
        try{
            const response = await axios.get("https://bhagavad-gita3.p.rapidapi.com/v2/chapters/"+ chapter+"/", config);
            res.render("index.ejs", {head: `Chapter ${chapter} - `+ response.data.name, trail_1: response.data.chapter_summary, trail_2: response.data.chapter_summary_hindi});
        }
        catch(error){
            console.log(error.body);
            res.render("index.ejs", {head: `Error loading the shloka`, trail_1: "", trail_2: ""});
        }
    }
    else{
        try{
            const response = await axios.get("https://bhagavad-gita3.p.rapidapi.com/v2/chapters/"+ chapter+"/verses/" + verse + "/", config);
            const data = response.data;
            res.render("index.ejs", {head: data.text, trail_1: data.translations[1].description, trail_2: data.translations[data.translations.length - 1].description});
        }
        catch(error){
            console.log(error.body);
            res.render("index.ejs", {head: `Error loading the shloka`, trail_1: "", trail_2: ""});
        }
    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
