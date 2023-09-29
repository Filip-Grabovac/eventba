import React from "react";

function RenderFormattedText({ content }) {
  // Check if content is defined before splitting and rendering
  if (content === undefined) {
    return null; // or handle the case where content is undefined
  }

  // Split the content into paragraphs based on empty lines
  const paragraphs = content.split(/\n\s*\n/);

  // Initialize a variable to store the JSX elements
  let renderedContent = [];

  // Loop through the paragraphs
  for (let i = 0; i < paragraphs.length; i++) {
    // Split each paragraph into parts based on '**' for bold and '*' for italic
    const parts = paragraphs[i].split(/(\*\*|\*)/);

    // Initialize a variable to store the JSX elements for this paragraph
    let paragraphContent = [];

    // Variable to track whether the text should be bold or italic
    let isBold = false;
    let isItalic = false;

    // Loop through the parts of the paragraph
    for (let j = 0; j < parts.length; j++) {
      if (parts[j] === "**") {
        // Toggle the isBold flag when '**' is encountered
        isBold = !isBold;
      } else if (parts[j] === "*") {
        // Toggle the isItalic flag when '*' is encountered
        isItalic = !isItalic;
      } else {
        // Apply formatting based on the flags
        if (isBold && isItalic) {
          paragraphContent.push(
            <strong key={j}>
              <i>{parts[j]}</i>
            </strong> // Apply bold and italic formatting
          );
        } else if (isBold) {
          paragraphContent.push(
            <strong key={j}>{parts[j]}</strong> // Apply bold formatting
          );
        } else if (isItalic) {
          paragraphContent.push(
            <i key={j}>{parts[j]}</i> // Apply italic formatting
          );
        } else {
          paragraphContent.push(parts[j]); // Plain text
        }
      }
    }

    // Add the paragraph's content to the rendered content
    renderedContent.push(<p key={i}>{paragraphContent}</p>);
  }

  return <div>{renderedContent}</div>;
}

export default RenderFormattedText;
