"use client"

import Image from "next/image"
import { useChat } from "ai/react"
import { Message } from "ai"
import logo from "./assets/logo.png"
import PromptSugestionRow from "./components/PromptSugestionRow"
import LoadingBubble from "./components/LoadingBubble"
import Bubble from "./components/Bubble"


const Home = () => {
    const { append, isLoading, messages, input, handleInputChange, handleSubmit } = useChat()

    const noMessage = !messages || messages.length === 0

    const handlePrompt = (promptText) => {
        const msg: Message = {
            id: crypto.randomUUID(),
            content: promptText,
            role: "user"
        }
        append(msg)
    }

    return (
        <main>
            <Image src={logo} width={130} alt="logo ul" />

            <section className={noMessage ? "" : "populated"}>
                {noMessage ? (
                    <>
                        <p className="starter-text">
                        Câte culturi cunoști cu adevărat? 
                        Valorile culturale sunt matricea invizibilă care modelează gândirea, comportamentul și destinul comunităților umane. Explorează  valorile culturale care ne definesc ... paseste spre  podul care ne unește dincolo de granițele mostenite !

                        </p>
                        <br />
                        <PromptSugestionRow onPromptClick={handlePrompt} />
                    </>
                ) : (
                    <>
                        {/* map message onto text bubbles  */}
                        {messages.map((message, index) => <Bubble key={`message-${index}`} message={message} />)}

                        {isLoading && <LoadingBubble />}
                        {/* {<LoadingBubble/>} */}
                    </>
                )

                }


            </section>
        
        
            <form onSubmit={handleSubmit}>
                <input className="question-box" onChange={handleInputChange} value={input} placeholder="ask me something" />
                <input type="submit" />
            </form>
        </main>
    )
}
export default Home