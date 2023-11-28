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
  
		  // Set optional attributes as data attributes
		  const optionalAttributes = ['gender', 'hat', 'speaking', 'smoking', 'noFace', 'demon', 'alien', 'weapon', 'ape', 'miner', 'shadow', 'lfg', 'clown', 'hoodie'];
		  optionalAttributes.forEach(attr => {
			if (image[attr]) {
			  galleryItem.dataset[attr] = image[attr];
			}
		  });
  
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

function toggleDropdown() {
	const filterOptions = document.getElementById('filter-options');
	filterOptions.style.display = filterOptions.style.display === 'block' ? 'none' : 'block';
  }
  
  // Add event listeners to checkboxes
  document.querySelectorAll('.filter-dropdown input[type="checkbox"]').forEach(checkbox => {
	checkbox.addEventListener('change', filterGallery);
  });
  
  function filterGallery() {
	const checkedAttributes = Array.from(document.querySelectorAll('.filter-dropdown input[type="checkbox"]:checked')).map(checkbox => checkbox.name);
  
	document.querySelectorAll('.gallery-item').forEach(item => {
	  const matchesAll = checkedAttributes.every(attr => item.dataset[attr] !== undefined);
	  item.style.display = matchesAll ? 'block' : 'none';
	});
  }
  
  // Call this function initially to set up the initial state
  filterGallery();  
