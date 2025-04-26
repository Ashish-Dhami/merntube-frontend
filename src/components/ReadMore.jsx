import { useState } from 'react';

export default function ReadMore({ id, text, amountOfWords = 36, className }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const splittedText = text.split(' ');
  const itCanOverflow = splittedText.length > amountOfWords;
  const beginText = itCanOverflow
    ? splittedText.slice(0, amountOfWords - 1).join(' ')
    : text;
  const endText = splittedText.slice(amountOfWords - 1).join(' ');

  const renderTextWithLinks = (text) => {
    return text.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="link link-info link-hover"
          >
            {part}
          </a>
        );
      }
      return (
        <span key={index} className="whitespace-pre-wrap">
          {part}
        </span>
      );
    });
  };

  const handleKeyboard = (e) => {
    if (e.code === 'Space' || e.code === 'Enter') {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <p id={id} className={className}>
      {renderTextWithLinks(beginText)}
      {itCanOverflow && (
        <>
          {!isExpanded && <span>... </span>}
          <span
            className={`${!isExpanded && 'hidden'}`}
            aria-hidden={!isExpanded}
          >
            {renderTextWithLinks(endText)}
          </span>
          <span
            className="block w-fit cursor-pointer font-medium text-sky-500 hover:text-sky-400"
            role="button"
            tabIndex={0}
            aria-expanded={isExpanded}
            aria-controls={id}
            onKeyDown={handleKeyboard}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </span>
        </>
      )}
    </p>
  );
}
