import React, { useState } from 'react';

interface ShareButtonsProps {
  story: string;
  visible: boolean;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ story, visible }) => {
  const [copyText, setCopyText] = useState('Kopijuoti pasaką');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(story);
      setCopyText('Nukopijuota! ✓');
      setTimeout(() => {
        setCopyText('Kopijuoti pasaką');
      }, 2000);
    } catch (err) {
      alert('Nepavyko nukopijuoti teksto');
    }
  };

  const shareStory = (platform: 'twitter' | 'facebook') => {
    const shareText = encodeURIComponent(`Pasaka sukurta su PasakAI:\n\n${story.substring(0, 200)}...`);
    const shareUrl = encodeURIComponent(window.location.href);
    
    const shareLinks = {
      twitter: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareText}`
    };
    
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
  };

  if (!visible) return null;

  return (
    <div className="share-buttons" style={{ display: 'flex' }}>
      <button className="share-btn copy" onClick={handleCopy}>
        <span className="share-icon">📋</span>
        <span className="share-text">{copyText}</span>
      </button>
      <button className="share-btn twitter" onClick={() => shareStory('twitter')}>
        <span className="share-icon">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </span>
        <span className="share-text">Dalintis X</span>
      </button>
      <button className="share-btn facebook" onClick={() => shareStory('facebook')}>
        <span className="share-icon">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </span>
        <span className="share-text">Dalintis Facebook</span>
      </button>
    </div>
  );
};