import PromptSuggestionButton from "./PromptSuggestionButton"

const PromptSugestionRow = ({onPromptClick}) => {
 const prompts=[
    "what is cultural value? ",
    "How do cultural values shape individual and collective behavior? ",
    "How do cultural values change over time?",
    "How do cultural values influence communication? ",
    "How are cultural values impacted by globalization? ",

 ]
 
    return (
    <div className="prompt-suggestion-row">
        {prompts.map((prompt, index) =>
        < PromptSuggestionButton 
        key={`sugestion-${index}`}
        text={prompt}
        onClick={()=>onPromptClick(prompt)}
        />)}
    </div>
  )
}
export default PromptSugestionRow