document.addEventListener('DOMContentLoaded', function() {
	fetch('images.json')
	  .then(response => response.json())
	  .then(data => {
		const gallery = document.querySelector('.gallery');
		data.forEach(image => {
		  const imageUrl = `https://ord-mirror.magiceden.dev/content/${image.tokenId}`;
		  const itemClass = image.eyeColor; // Assuming this is a class like 'red', 'green', or 'blue'.
  
		  // Create gallery item container
		  const galleryItem = document.createElement('div');
		  galleryItem.classList.add('gallery-item', itemClass);
  
		  // Create link element
		  const link = document.createElement('a');
		  link.href = `https://magiceden.io/ordinals/item-details/${image.tokenId}`;
		  link.target = "_blank";
  
		  // Create image container
		  const imageContainer = document.createElement('div');
		  imageContainer.classList.add('image-container');
  
		  // Create and set image element
		  const img = document.createElement('img');
		  img.dataset.src = imageUrl;
		  img.alt = `Ordinal Maxi Biz #${image.tokenId}`;
		  img.classList.add('lazyload');
  
		  // Append image to its container
		  imageContainer.appendChild(img);
  
		  // Append image container to link
		  link.appendChild(imageContainer);
  
		  // Append link to gallery item
		  galleryItem.appendChild(link);
  
		  // Optional attributes
		  const optionalAttributes = ['gender', 'hat', 'speaking', 'smoking', 'noFace', 'demon', 'alien', 'weapon', 'ape', 'miner', 'shadow', 'lfg', 'clown', 'hoodie'];
		  optionalAttributes.forEach(attr => {
			if (image[attr]) {
			  const tagDiv = document.createElement('div');
			  tagDiv.classList.add(`${attr}-tag`);
			  tagDiv.textContent = image[attr];
			  galleryItem.appendChild(tagDiv);
			}
		  });
  
		  // Price tag with Bitcoin symbol
		  if (image.price) {
			const priceTag = document.createElement('div');
			priceTag.classList.add('price-tag');
			priceTag.textContent = `₿${image.price}`;
			galleryItem.appendChild(priceTag);
		  }
  
		  // Append gallery item to gallery
		  gallery.appendChild(galleryItem);
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
