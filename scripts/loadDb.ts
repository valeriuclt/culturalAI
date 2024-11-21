import {DataAPIClient} from "@datastax/astra-db-ts"
import {PuppeteerWebBaseLoader} from "langchain/document_loaders/web/puppeteer"
import OpenAi from "openai"

import {RecursiveCharacterTextSplitter} from "langchain/text_splitter"
import "dotenv/config"


type SimilarityMetric = "dot_product" | "cosine" | "euclidean"

const {ASTRA_DB_NAMESPACE,ASTRA_DB_COLLECTION,ASTRA_DB_API_ENDPOINT, ASTRA_DB_APPLICATION_TOKEN,OPENAI_API_KEY} = process.env 
const openai = new OpenAi({apiKey:OPENAI_API_KEY})

// const f1Data =[
// 'https://en.wikipedia.org/wiki/Formula_One',
// 'https://www.formula1.com/en/latest/all',
// 'https://www.skysports.com/f1/news',
// 'https://en.wikipedia.org/wiki/List_of_FIA_championships',
// 'https://www.planetf1.com/news',
// 'https://www.bbc.com/sport/formula1',
// ]

const culturalData =[
    'https://www.worldvaluessurvey.org/WVSContents.jsp',
    'https://www.theculturefactor.com/resources/report/global-report-2024',
    'https://www.britannica.com/topic/culture',
    'https://en.wikipedia.org/wiki/Instrumental_and_intrinsic_value',
    'https://en.wikipedia.org/wiki/Value_(ethics_and_social_sciences)', 
    'https://en.wikipedia.org/wiki/World_Values_Survey', 
    'https://en.wikipedia.org/wiki/Rokeach_Value_Survey', 
    'https://en.wikipedia.org/wiki/Western_values',
    'https://en.wikipedia.org/wiki/Inglehart%E2%80%93Welzel_cultural_map_of_the_world',
    'https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2023.1090340/full', 
    ]
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
const db = client.db(ASTRA_DB_API_ENDPOINT, {namespace:ASTRA_DB_NAMESPACE})

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize:512, chunkOverlap:100
})

const createCollection = async ( similarityMetric : SimilarityMetric = "dot_product") => {
    const res = await db.createCollection( ASTRA_DB_COLLECTION, {
        vector: {
            dimension: 1536, 
            metric: similarityMetric
        }
    })
    console.log(res)
}

const loadSampleData = async() =>{
    const collection = await db.collection(ASTRA_DB_COLLECTION)
    // for await (const url of f1Data) {
    for await (const url of culturalData) {
        const content = await scrapePage(url)
        const chunks = await splitter.splitText(content)
        for await (const chunk of chunks){
            const embedding = await openai.embeddings.create({
                model:"text-embedding-3-small",
                input:chunk,
                encoding_format:"float"
            })
        const vector = embedding.data[0].embedding

        const res = await collection.insertOne({
            $vector: vector,
            text: chunk
        })
        console.log(res)
        }
    }
}

const scrapePage = async(url:string) => {

    const loader = new PuppeteerWebBaseLoader(url, {
        launchOptions: {headless: true},
        gotoOptions:{ waitUntil:"domcontentloaded"},
        evaluate: async (page, browser)=>{
            const result = await page.evaluate(()=>document.body.innerHTML)
            await browser.close()
            return result
        }
    })
    return (await loader.scrape())?.replace(/<[^>]*>?/gm, '')
}

createCollection().then(()=>loadSampleData())