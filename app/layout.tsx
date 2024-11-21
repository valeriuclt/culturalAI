 
import "./global.css" 

export const metadata ={
    title: "F1Gpt",
    description:"for all your f1 question"
}

const RootLayout=({children})=>{

    return(
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    )
}

export default RootLayout