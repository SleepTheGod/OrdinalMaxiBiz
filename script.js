document.addEventListener('DOMContentLoaded', function() {
	fetch('images.json')
	.then(response => response.json())
	.then(data => {
		const gallery = document.querySelector('.gallery');
		data.forEach(image => {
		const imageUrl = `https://ord-mirror.magiceden.dev/content/${image.tokenId}`;

		// Create gallery item container
		const galleryItem = document.createElement('div');
		galleryItem.classList.add('gallery-item');

		// Set eyeColor and other optional attributes as data attributes
		const attributes = ['eyeColor', 'gender', 'hat', 'speaking', 'smoking', 'noFace', 'demon', 'alien', 'weapon', 'ape', 'openScalp', 'miner', 'shadow', 'lfg', 'clown', 'hoodie', 'famous', 'letterhead', 'robot', 'punk', 'undead', 'mask'];
		attributes.forEach(attr => {
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

		// Calculate the total number of attributes and create a display element
		const attributeCount = Object.keys(image).length; // Count all keys in the image object
		const attributeCountDisplay = document.createElement('div');
		attributeCountDisplay.classList.add('attribute-count');
		attributeCountDisplay.textContent = `${attributeCount}`;
		galleryItem.appendChild(attributeCountDisplay); // Append the count display to the gallery item

		// Append gallery item to gallery
		gallery.appendChild(galleryItem);
		});

		// After adding all images to the gallery, initialize lazy loading
		initializeLazyLoad();
		updateCount(); // This will update the count when the page loads
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

function updateCount() {
	// Select all the gallery items
	const galleryItems = document.querySelectorAll('.gallery-item');
	// Use Array.prototype.filter to count the items that are currently visible
	const count = Array.from(galleryItems).filter(item => item.style.display !== 'none').length;
	// Update the display with the new count. You will need an element in your HTML to show the count.
	const countDisplay = document.getElementById('count-display');
	if (countDisplay) {
	countDisplay.textContent = `${count} OMBs`;
	}
}

function toggleDropdown(show) {
	const filterOptions = document.getElementById('filter-options');
	if (show) {
	filterOptions.classList.add('show');
	} else {
	filterOptions.classList.remove('show');
	}
}  

function filterGallery() {
	const checkedAttributes = Array.from(document.querySelectorAll('.filter-dropdown input[type="checkbox"]:not([name="eyeColor"]):checked')).map(checkbox => checkbox.name);
	const checkedEyeColors = Array.from(document.querySelectorAll('.filter-dropdown input[type="checkbox"][name="eyeColor"]:checked')).map(checkbox => checkbox.value);
    const isNoTraitChecked = document.getElementById('no-trait').checked;

	document.querySelectorAll('.gallery-item').forEach(item => {
	const matchesAllAttributes = checkedAttributes.every(attr => item.dataset[attr] !== undefined);
	const matchesEyeColor = checkedEyeColors.length === 0 || checkedEyeColors.includes(item.dataset.eyeColor);

	// "No Trait" check: If checked, only display items with exactly two attributes
	const attributeCount = Object.keys(image).length;
	const matchesNoTrait = !isNoTraitChecked || (isNoTraitChecked && attributeCount === 2);

	item.style.display = (matchesAllAttributes && matchesEyeColor && matchesNoTrait) ? 'block' : 'none';

	});
	// Call updateCount after filtering is done
	updateCount();
}

// Add event listeners to checkboxes
document.querySelectorAll('.filter-dropdown input[type="checkbox"]').forEach(checkbox => {
	checkbox.addEventListener('change', filterGallery);
});

// Call this function initially to set up the initial state
filterGallery();  
