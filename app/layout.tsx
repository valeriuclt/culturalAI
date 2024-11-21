 
import "./global.css" 

export const metadata ={
    title: "Cultural",
    description:"for all your cultural values questions"
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