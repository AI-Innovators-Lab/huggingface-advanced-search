import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize, { defaultSchema as sanitizeDefaultSchema } from 'rehype-sanitize';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Import languages (ensure these are also in ModelDetailPage.jsx if used standalone)
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
// ... import other languages you need, same as in ModelDetailPage.jsx

SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('python', python);
// ... register other languages

// --- Styles (can be shared or adapted from ModelDetailPage.jsx) ---
const modelHeaderStyle = {
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
    marginBottom: '15px',
};
const modelTitleStyle = {
    fontSize: '1.5em', // Smaller for comparison view
    color: '#333',
    margin: '0 0 5px 0',
    wordBreak: 'break-word',
};
const modelMetaStyle = {
    fontSize: '0.85em',
    color: '#666',
    marginBottom: '3px',
};
const sectionTitleStyle = {
    fontSize: '1.2em', // Smaller for comparison view
    color: '#444',
    marginTop: '20px',
    marginBottom: '10px',
    borderBottom: '1px solid #f0f0f0',
    paddingBottom: '5px',
};
const readmeWrapperStyle = { maxHeight: '400px', overflowY: 'auto', fontSize: '0.9em' }; // Limit height in comparison
const ggufListStyle = { listStyle: 'none', padding: 0, maxHeight: '200px', overflowY: 'auto' };
const ggufItemStyle = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '8px', border: '1px solid #e8e8e8', borderRadius: '4px',
    marginBottom: '5px', backgroundColor: '#fff', fontSize: '0.85em',
};
const ggufNameStyle = { fontWeight: '500', flexGrow: 1, marginRight: '8px', wordBreak: 'break-all' };
const ggufDetailStyle = { fontSize: '0.9em', color: '#555', margin: '0 8px', whiteSpace: 'nowrap' };
const downloadLinkStyle = {
    padding: '4px 8px', backgroundColor: '#28a745', color: 'white',
    textDecoration: 'none', borderRadius: '3px', fontSize: '0.85em',
};
const cardDataSectionStyle = {
    backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '4px',
    border: '1px solid #e0e0e0', fontSize: '0.85em', marginBottom: '15px',
    maxHeight: '200px', overflowY: 'auto',
};
const cardDataItemStyle = { marginBottom: '6px' };
const noGgufMessageStyle = { fontStyle: 'italic', color: '#666', padding: '8px 0', fontSize: '0.85em' };

// New style for the summary
const summaryStyle = {
    fontSize: '0.9em',
    color: '#454545',
    lineHeight: '1.5',
    maxHeight: '120px', // Limit height of summary in comparison view
    overflowY: 'auto',
    padding: '8px',
    backgroundColor: '#fdfdfd',
    border: '1px solid #eee',
    borderRadius: '4px',
    marginTop: '5px',
};
// Style for the GGUF conversion hint
const ggufHintStyle = {
    fontSize: '0.9em',
    color: '#454545',
    lineHeight: '1.5',
    padding: '10px',
    backgroundColor: '#e9f5ff', // A light blue background for hints
    border: '1px solid #b3d7ff',
    borderRadius: '4px',
    marginTop: '10px',
};
const linkStyle = { // General link style
    color: '#007bff',
    textDecoration: 'none',
};


function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

// Function to extract a summary from README
function extractSummary(readmeContent, maxLength = 250) {
    if (!readmeContent) return "No summary available.";
    // Remove Markdown headings, links, images for a cleaner text summary
    let text = readmeContent
        .replace(/^#.*$/gm, '') // Remove headings
        .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Replace links with their text
        .replace(/!\[(.*?)\]\(.*?\)/g, '') // Remove images
        .replace(/<\/?[^>]+(>|$)/g, "") // Strip HTML tags
        .replace(/(\r\n|\n|\r)/gm, " ") // Replace newlines with spaces
        .replace(/\s+/g, ' ') // Replace multiple spaces with single
        .trim();
    
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
    }
    return text || "No textual summary could be extracted.";
}


function ModelDetailPageContent({ modelDetails, isComparisonView = false }) {
    if (!modelDetails) return <p>No model details available.</p>;

    const sanitizePluginWithOptions = [rehypeSanitize, { ...sanitizeDefaultSchema }];
    const syntaxTheme = materialLight;

    // Adjust styles if in comparison view
    const currentModelTitleStyle = isComparisonView ? { ...modelTitleStyle, fontSize: '1.3em' } : modelTitleStyle;
    const currentSectionTitleStyle = isComparisonView ? { ...sectionTitleStyle, fontSize: '1.1em' } : sectionTitleStyle;
    const currentReadmeWrapperStyle = isComparisonView ? { ...readmeWrapperStyle, maxHeight: '300px', fontSize: '0.85em' } : readmeWrapperStyle;
    const modelSummary = extractSummary(modelDetails.readme_content);


    return (
        <>
            <div style={modelHeaderStyle}>
                <h2 style={currentModelTitleStyle}>{modelDetails.id}</h2>
                {modelDetails.author && <p style={modelMetaStyle}>Author: {modelDetails.author}</p>}
                {modelDetails.last_modified && <p style={modelMetaStyle}>Last Modified: {new Date(modelDetails.last_modified).toLocaleDateString()}</p>}
                <p style={modelMetaStyle}>Downloads: {modelDetails.downloads?.toLocaleString()} | Likes: {modelDetails.likes?.toLocaleString()}</p>
                {modelDetails.pipeline_tag && <p style={modelMetaStyle}>Task: {modelDetails.pipeline_tag}</p>}
                {/* In comparison, tags might be too verbose, consider omitting or shortening */}
                {!isComparisonView && modelDetails.tags && modelDetails.tags.length > 0 && (<div style={modelMetaStyle}>Tags: {modelDetails.tags.join(', ')}</div>)}
            </div>

            <section>
                <h3 style={currentSectionTitleStyle}>Summary</h3>
                <div style={summaryStyle}>
                    {modelSummary}
                </div>
            </section>

            {modelDetails.card_data && (Object.keys(modelDetails.card_data).length > 0) && (
                 <section>
                    <h3 style={currentSectionTitleStyle}>Model Card Highlights</h3>
                    <div style={cardDataSectionStyle}>
                        {modelDetails.card_data.license && <p style={cardDataItemStyle}><strong>License:</strong> {modelDetails.card_data.license}</p>}
                        {modelDetails.card_data.language && modelDetails.card_data.language.length > 0 && (
                            <p style={cardDataItemStyle}><strong>Language:</strong> {modelDetails.card_data.language.join(', ')}</p>
                        )}
                        {/* Add more card data fields as needed */}
                    </div>
                </section>
            )}

            <section>
                <h3 style={currentSectionTitleStyle}>
                    GGUF Files
                    {modelDetails.gguf_files && modelDetails.gguf_files.length > 0 && ` (${modelDetails.gguf_files.length})`}
                </h3>
                {modelDetails.gguf_files && modelDetails.gguf_files.length > 0 ? (
                    <ul style={ggufListStyle}>
                        {modelDetails.gguf_files.slice(0, isComparisonView ? 3 : modelDetails.gguf_files.length).map((file, index) => (
                            <li key={index} style={ggufItemStyle}>
                                <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1, marginRight: '5px', overflow: 'hidden'}}>
                                    <span style={ggufNameStyle} title={file.name}>{file.name}</span>
                                     {file.quantization && file.quantization !== "Unknown" && (
                                        <span style={{...ggufDetailStyle, marginLeft: 0, marginTop: '2px', fontSize: '0.8em' }}>Quant: {file.quantization}</span>
                                    )}
                                </div>
                                <div style={{display: 'flex', alignItems: 'center', flexShrink: 0}}>
                                    {file.size_bytes != null && <span style={{...ggufDetailStyle, fontSize: '0.8em'}}>{formatBytes(file.size_bytes)}</span>}
                                    {!isComparisonView && 
                                        <a href={file.url} target="_blank" rel="noopener noreferrer" style={downloadLinkStyle}>Dl</a>
                                    }
                                </div>
                            </li>
                        ))}
                         {isComparisonView && modelDetails.gguf_files.length > 3 && <li style={{fontSize: '0.8em', textAlign: 'center'}}>...and more</li>}
                    </ul>
                ) : (
                    <>
                        <p style={noGgufMessageStyle}>No GGUF files found for this model.</p>
                        <div style={ggufHintStyle}>
                            Want to run this model locally? You might be able to convert it to GGUF format. 
                            Follow this guide: <a 
                                href="https://medium.com/@narayanpanigrahy18/run-any-hugging-face-llm-locally-a-step-by-step-guide-to-gguf-conversion-with-llama-cpp-bd22250f1f70" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={linkStyle}
                            >
                                Step-by-step GGUF Conversion with llama.cpp
                            </a>.
                        </div>
                    </>
                )}
            </section>

            {!isComparisonView && ( 
                <section>
                    <h3 style={currentSectionTitleStyle}>Model Details (README)</h3>
                    <div style={currentReadmeWrapperStyle} className="markdown-body">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[sanitizePluginWithOptions]}
                            components={{
                                code({ node, inline, className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                        <SyntaxHighlighter
                                            style={syntaxTheme} language={match[1]} PreTag="div"
                                            showLineNumbers={false} wrapLines={true}
                                            customStyle={{ borderRadius: '4px', margin: '0.5em 0', fontSize: '0.85em', padding: '0.8em' }}
                                            codeTagProps={{style: {fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace'}}}
                                            {...props}>
                                            {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                    ) : ( <code className={className} {...props}> {children} </code> );
                                },
                                table: ({node, ...props}) => <div style={{overflowX: 'auto', marginBottom: '1em'}}><table style={{width: '100%'}} {...props} /></div>,
                                img: ({node, ...props}) => <img style={{maxWidth: '100%', height: 'auto', display: 'block', margin: '1em auto'}} {...props} />,
                            }}>
                            {modelDetails.readme_content || "No README content provided."}
                        </ReactMarkdown>
                    </div>
                </section>
            )}
        </>
    );
}

export default ModelDetailPageContent;