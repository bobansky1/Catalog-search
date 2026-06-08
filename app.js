const COURSES = [
  {
    id: 1,
    title: 'The Ultimate Google Ads Training Course',
    category: 'marketing',
    price: 100,
    author: 'Jerome Bell',
    image: 'images/people1.jpg',
  },
  {
    id: 2,
    title: 'Product Management Fundamentals',
    category: 'management',
    price: 480,
    author: 'Marvin McKinney',
    image: 'images/people2.jpg',
  },
  {
    id: 3,
    title: 'HR Management and Analytics',
    category: 'hr',
    price: 200,
    author: 'Leslie Alexander Li',
    image: 'images/people3.jpg',
  },
  {
    id: 4,
    title: 'Brand Management & PR Communications',
    category: 'marketing',
    price: 530,
    author: 'Kristin Watson',
    image: 'images/people4.jpg',
  },
  {
    id: 5,
    title: 'Graphic Design Basic',
    category: 'design',
    price: 500,
    author: 'Guy Hawkins',
    image: 'images/people5.jpg',
  },
  {
    id: 6,
    title: 'Business Development Management',
    category: 'management',
    price: 400,
    author: 'Dianne Russell',
    image: 'images/people6.jpg',
  },
  {
    id: 7,
    title: 'Highload Software Architecture',
    category: 'development',
    price: 600,
    author: 'Brooklyn Simmons',
    image: 'images/people7.jpg',
  },
  {
    id: 8,
    title: 'Human Resources – Selection and Recruitment',
    category: 'hr',
    price: 150,
    author: 'Kathryn Murphy',
    image: 'images/people8.jpg',
  },
  {
    id: 9,
    title: 'User Experience. Human-centered Design',
    category: 'design',
    price: 240,
    author: 'Cody Fisher',
    image: 'images/people9.jpg',
  },
  {
    id: 10,
    title: 'SEO & Content Marketing Masterclass',
    category: 'marketing',
    price: 320,
    author: 'Sarah Johnson',
    image: 'images/people1.jpg',
  },
  {
    id: 11,
    title: 'Agile Project Management',
    category: 'management',
    price: 270,
    author: 'Tom Richards',
    image: 'images/people2.jpg',
  },
  {
    id: 12,
    title: 'React & Node.js Full Stack',
    category: 'development',
    price: 750,
    author: 'Alex Park',
    image: 'images/people7.jpg',
  },
];


const CATEGORY_LABELS = {
  marketing:   'Marketing',
  management:  'Management',
  hr:          'HR & Recruiting',
  design:      'Design',
  development: 'Development',
};


const PAGE_SIZE = 9;

const state = {

  activeCategory: 'all',
  query: '',

  visibleCount: PAGE_SIZE,
};



const filterList  = /** @type {HTMLUListElement}  */ (document.getElementById('filterList'));
const cardGrid    = /** @type {HTMLDivElement}     */ (document.getElementById('cardGrid'));
const emptyState  = /** @type {HTMLDivElement}     */ (document.getElementById('emptyState'));
const loadMoreBtn = /** @type {HTMLButtonElement}  */ (document.getElementById('loadMoreBtn'));
const searchInput = /** @type {HTMLInputElement}   */ (document.getElementById('searchInput'));


function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}


function getFilteredCourses() {
  return COURSES.filter((course) => {
    const matchesCategory =
      state.activeCategory === 'all' || course.category === state.activeCategory;

    const matchesQuery =
      state.query === '' ||
      course.title.toLowerCase().includes(state.query);

    return matchesCategory && matchesQuery;
  });
}


function countByCategory(category) {
  if (category === 'all') return COURSES.length;
  return COURSES.filter((c) => c.category === category).length;
}

function renderFilters() {
  const categories = ['all', ...Object.keys(CATEGORY_LABELS)];

  filterList.innerHTML = categories
    .map((cat) => {
      const label = cat === 'all' ? 'All' : CATEGORY_LABELS[cat];
      const count = countByCategory(cat);
      const isActive = state.activeCategory === cat;

      return `
        <li class="filter__item">
          <button
            class="filter__btn${isActive ? ' filter__btn--active' : ''}"
            data-category="${escHtml(cat)}"
            aria-pressed="${isActive}"
            type="button"
          >
            ${escHtml(label)}<sup class="filter__count">${count}</sup>
          </button>
        </li>`;
    })
    .join('');
}


 
function buildCardHTML(course) {
  const badgeLabel = CATEGORY_LABELS[course.category] || course.category;
  const badgeMod   = `card__badge--${course.category}`;

  return `
    <article class="card" data-id="${course.id}">
      <div class="card__image-wrap">
        <img
          class="card__image"
          src="${escHtml(course.image)}"
          alt="${escHtml(course.title)}"
          loading="lazy"
          width="400"
          height="300"
        />
      </div>
      <div class="card__body">
        <span class="card__badge ${escHtml(badgeMod)}">${escHtml(badgeLabel)}</span>
        <h2 class="card__title">${escHtml(course.title)}</h2>
        <p class="card__meta">
          <span class="card__price">$${course.price}</span>
          <span class="card__divider" aria-hidden="true"> | </span>
          <span class="card__author">by ${escHtml(course.author)}</span>
        </p>
      </div>
    </article>`;
}

function renderGrid() {
  const filtered = getFilteredCourses();
  const visible  = filtered.slice(0, state.visibleCount);

  emptyState.hidden = filtered.length > 0;

  cardGrid.innerHTML = visible.map(buildCardHTML).join('');

  const hasMore = filtered.length > state.visibleCount;
  loadMoreBtn.classList.toggle('load-more--hidden', !hasMore);
}


filterList.addEventListener('click', (e) => {
  const btn = /** @type {HTMLElement} */ (e.target).closest('[data-category]');
  if (!btn) return;

  const cat = btn.dataset.category;
  if (cat === state.activeCategory) return; 

  state.activeCategory = cat;
  state.visibleCount   = PAGE_SIZE; 

  renderFilters();
  renderGrid();
});


let searchDebounceTimer = null;

searchInput.addEventListener('input', () => {
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    state.query        = searchInput.value.trim().toLowerCase();
    state.visibleCount = PAGE_SIZE; // reset pagination on new search
    renderGrid();
  }, 200);
});


loadMoreBtn.addEventListener('click', () => {
  state.visibleCount += PAGE_SIZE;
  renderGrid();


  const cards = cardGrid.querySelectorAll('.card');
  const firstNew = cards[state.visibleCount - PAGE_SIZE];
  if (firstNew) {
    firstNew.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
});


(function init() {
  renderFilters();
  renderGrid();
})();
