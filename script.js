document.addEventListener('DOMContentLoaded', function() {
	fetch('images.json')
	  .then(response => response.json())
	  .then(data => {
		const gallery = document.querySelector('.gallery');
		data.forEach(image => {
		  const imageUrl = `https://ord-mirror.magiceden.dev/content/${image.tokenId}`;
		  const itemClass = image.eyeColor; // Assuming this is a class like 'red', 'green', or 'blue'.
		  let itemHtml = `<div class="gallery-item ${itemClass}">`;
		  itemHtml += `<a href="https://magiceden.io/ordinals/item-details/${image.tokenId}" target="_blank">`;
		  itemHtml += `<div class="image-container">`;
  
		  // Set data-src with the actual image URL and src with a placeholder
		  itemHtml += `<img data-src="${imageUrl}" alt="Ordinal Maxi Biz #${image.tokenId}" class="lazyload">`;
  
		  // Close the image-container div
		  itemHtml += `</div>`; // It's important to close this here
  
		  // Add a div for optional attributes outside of image-container
		  const optionalAttributes = ['gender', 'hat', 'speaking', 'smoking', 'noFace', 'demon', 'alien', 'weapon', 'ape', 'miner', 'shadow', 'lfg', 'clown', 'hoodie'];
		  optionalAttributes.forEach(attr => {
			if (image[attr]) {
			  itemHtml += `<div class="${attr}-tag">${image[attr]}</div>`;
			}
		  });
  
		  // Price tag with Bitcoin symbol
		  if (image.price) {
			itemHtml += `<div class="price-tag">₿${image.price}</div>`;
		  }
  
		  itemHtml += `</a></div>`; // Close the gallery-item div
		  gallery.innerHTML += itemHtml;
		});
		// After adding all images to the gallery, initialize lazy loading
		initializeLazyLoad();
	  })
	  .catch(error => console.error('Error loading image data:', error));
  });
  
  

function initializeLazyLoad() {
  const lazyImages = document.querySelectorAll('img.lazyload');

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.getAttribute('data-src');
        img.classList.remove('lazyload');
        observer.unobserve(entry.target);
      }
    });
  });

  lazyImages.forEach(img => {
    imageObserver.observe(img);
  });
}

document.getElementById('price-filter-checkbox').addEventListener('change', function() {
  var elements = document.getElementsByClassName('gallery-item');
  var isChecked = this.checked;

  for (var i = 0; i < elements.length; i++) {
    // Check if the item has a price tag
    var hasPriceTag = elements[i].getElementsByClassName('price-tag').length > 0;

    if (isChecked && hasPriceTag) {
      elements[i].style.display = 'block';
    } else if (isChecked && !hasPriceTag) {
      elements[i].style.display = 'none';
    } else {
      elements[i].style.display = ''; // Or use 'block' to show all
    }
  }
});
