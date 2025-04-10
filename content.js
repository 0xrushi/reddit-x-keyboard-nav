let currentFocusedPostIndex = -1;

function getInitialFocusedIndex(posts) {
  const viewportCenter = window.innerHeight / 2;
  let minDistance = Infinity;
  let bestIndex = 0;
  
  posts.forEach((post, index) => {
    const rect = post.getBoundingClientRect();
    // Calculate the vertical center of each post.
    const postCenter = rect.top + rect.height / 2;
    const distance = Math.abs(viewportCenter - postCenter);
    if (distance < minDistance) {
      minDistance = distance;
      bestIndex = index;
    }
  });
  
  return bestIndex;
}

document.addEventListener('keydown', function(event) {
  if ((event.key === 'ArrowUp' || event.key === 'ArrowDown') && 
      !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
    event.preventDefault();

    const posts = Array.from(document.querySelectorAll('shreddit-post, div[data-testid="post-container"]'));
    if (posts.length === 0) return;

    // Define the scroll direction: +1 for down, -1 for up.
    const direction = event.key === 'ArrowDown' ? 1 : -1;

    if (currentFocusedPostIndex === -1) {
      // Pick the post whose center is closest to the viewport center.
      const initialIndex = getInitialFocusedIndex(posts);
      // Immediately move the index by the direction pressed.
      currentFocusedPostIndex = Math.min(Math.max(initialIndex + direction, 0), posts.length - 1);
    } else {
      // On subsequent key presses, just update the index.
      currentFocusedPostIndex = Math.min(Math.max(currentFocusedPostIndex + direction, 0), posts.length - 1);
    }

    if (currentFocusedPostIndex >= 0) {
      const post = posts[currentFocusedPostIndex];
      
      // Remove any previous inline highlights.
      posts.forEach(p => {
        p.style.removeProperty('box-shadow');
        p.style.removeProperty('z-index');
      });
      
      // Apply new highlight styles to the selected post.
      post.style.boxShadow = '0 0 0 2px rgba(0, 121, 211, 0.5)';
      post.style.zIndex = '1';
      
      // Option 1: Use scrollIntoView so that the post is centered.
      post.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Option 2: Alternatively, if more control is required, use a manual scroll:
      // const rect = post.getBoundingClientRect();
      // const postCenter = rect.top + rect.height / 2;
      // const viewportCenter = window.innerHeight / 2;
      // const scrollOffset = postCenter - viewportCenter;
      // window.scrollBy({ top: scrollOffset, behavior: 'smooth' });
      
      // Focus the post element while preventing default scroll behavior.
      post.focus({ preventScroll: true });
    }
  }
});

// Function to reset highlights and focused post index.
function resetHighlights() {
  currentFocusedPostIndex = -1;
  document.querySelectorAll('shreddit-post, div[data-testid="post-container"]').forEach(post => {
    post.style.removeProperty('box-shadow');
    post.style.removeProperty('z-index');
  });
}

document.addEventListener('click', resetHighlights);
window.addEventListener('scroll', () => {
  clearTimeout(window.scrollResetTimer);
  window.scrollResetTimer = setTimeout(resetHighlights, 100);
});

console.log('Centered-scroll Reddit keyboard navigation loaded');
