const express = require('express');
const app = express();
const Instagram = require('instagram-web-api')
const FileCookieStore = require('tough-cookie-file-store')
const cron = require('node-cron')
const WordPOS = require('wordpos')
const wordpos = new WordPOS();
require('dotenv').config()

const port = process.env.PORT || 8000;

//daily post
cron.schedule("00 12 ***", async () => {

    //persist logged in method
    const cookieStore = new FileCookieStore("./cookies.json")

    const client = new Instagram(
        {
            username: process.env.INSTAGRAM_USERNAME,
            password: process.env.INSTAGRAM_PASSWORD,
            cookieStore
        },
        {
            language: "en-US",
        }
    )

    const instagramPostFunction = async () => {
        wordpos.randAdjective({ count: 1 }, async (result) => {
            const resultWord = result[0].replace("_", " ");
            const newDesc = resultWord.slce(result[0].length - 3) === 'ing' ? resultWord : "feeling " + resultWord
        })

        const newCaption = `${newDesc} .\njal lijiye\n#jallijiye #jal-lijiye #jal_lijiye`

        await client.uploadPhoto({
            photo: "./jallijiye.jpeg",
            caption: `jal lijiye
        #jallijiye #jal-lijiye #jal_lijiye`,
            post: 'feed'
        }).then(async (res) => {
            const media = res.media;
            console.log(`https://www.instagram.com/p/${media.code}`)

            await client.addComment({
                mediaId: media.id,
                text: newCaption
            })
        })

        await client.uploadPhoto({
            photo: "./jallijiye.jpeg",
            caption: `jal lijiye
            #jallijiye #jal-lijiye #jal_lijiye`,
            post: 'feed'
        })

    }

    const loginFunction = async () => {
        console.log('Logging in...')

        await client.login().then(() => {
            console.log('Logoin successful!')
            instagramPostFunction()
        }).catch((err) => {
            console.log('Logon failed!')
            console.log(err)
        })
    }

    loginFunction()

})

app.listen(port, () => {
    console.log(`Listening on http://localhost:${8000}/`)
});