document.addEventListener('DOMContentLoaded', () => {
    const tracks = [...document.querySelectorAll('.track')];
    const vinyl = document.getElementById('main-vinyl');
    const tonearm = document.getElementById('player-tonearm');
    const art = document.getElementById('current-art');
    const title = document.getElementById('current-title');
    const description = document.getElementById('current-description');
    const play = document.getElementById('toggle-play');
    let active = 0;
    let playing = true;

    function select(index, open = false) {
        active = (index + tracks.length) % tracks.length;
        const chosen = tracks[active];
        tracks.forEach((track, i) => track.classList.toggle('active', i === active));
        title.textContent = chosen.dataset.title;
        art.style.backgroundImage = `url('${chosen.dataset.img}')`;

        const lines = (chosen.dataset.description || '').split('|');
        description.replaceChildren();
        lines.forEach((line, i) => {
            if (i > 0) description.appendChild(document.createElement('br'));
            description.appendChild(document.createTextNode(line));
        });

        playing = true;
        vinyl.classList.add('playing');
        vinyl.classList.remove('paused');
        tonearm.classList.add('playing');
        play.innerHTML = '<i class="fa-solid fa-pause"></i>';
        if (open && chosen.dataset.url) location.href = chosen.dataset.url;
    }

    tracks.forEach((track, index) => {
        const activate = () => select(index, track.classList.contains('active'));
        track.addEventListener('click', activate);
        track.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                activate();
            }
        });
    });

    document.getElementById('prev-track').onclick = () => select(active - 1);
    document.getElementById('next-track').onclick = () => select(active + 1);
    play.onclick = () => {
        playing = !playing;
        vinyl.classList.toggle('paused', !playing);
        tonearm.classList.toggle('playing', playing);
        play.innerHTML = `<i class="fa-solid fa-${playing ? 'pause' : 'play'}"></i>`;
    };

    const modal = document.getElementById('profile-modal');
    const close = document.getElementById('close-profile-modal');
    let last;
    function openModal() {
        last = document.activeElement;
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
        close.focus();
    }
    function hideModal() {
        modal.hidden = true;
        document.body.style.overflow = '';
        last?.focus();
    }
    ['open-profile-modal', 'avatar-profile', 'card-profile'].forEach(id => document.getElementById(id)?.addEventListener('click', openModal));
    close.onclick = hideModal;
    modal.onclick = event => { if (event.target === modal) hideModal(); };
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && !modal.hidden) hideModal(); });

    const artworkModal = document.getElementById('artwork-modal');
    const artworkModalImage = document.getElementById('artwork-modal-image');
    const artworkModalTitle = document.getElementById('artwork-modal-title');
    const artworkClose = document.getElementById('close-artwork-modal');
    const artworks = [...document.querySelectorAll('.artworks figure')];
    let lastArtworkTrigger;

    function openArtwork(figure) {
        const image = figure.querySelector('img');
        const caption = figure.querySelector('figcaption')?.textContent.trim() || image.alt;
        lastArtworkTrigger = figure;
        artworkModalImage.src = image.currentSrc || image.src;
        artworkModalImage.alt = image.alt;
        artworkModalTitle.textContent = caption;
        artworkModal.hidden = false;
        document.body.style.overflow = 'hidden';
        artworkClose.focus();
    }

    function closeArtwork() {
        artworkModal.hidden = true;
        artworkModalImage.src = '';
        document.body.style.overflow = '';
        lastArtworkTrigger?.focus();
    }

    artworks.forEach(figure => {
        figure.tabIndex = 0;
        figure.setAttribute('role', 'button');
        figure.setAttribute('aria-label', `${figure.querySelector('figcaption')?.textContent.trim() || '작품'} 크게 보기`);
        figure.addEventListener('click', () => openArtwork(figure));
        figure.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openArtwork(figure);
            }
        });
    });

    artworkClose.addEventListener('click', closeArtwork);
    artworkModal.addEventListener('click', event => { if (event.target === artworkModal) closeArtwork(); });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !artworkModal.hidden) closeArtwork();
    });

    const artworkOverviewModal = document.getElementById('artwork-overview-modal');
    const artworkOverviewGrid = document.getElementById('artwork-overview-grid');
    const artworkOverviewOpen = document.getElementById('open-artwork-overview');
    const artworkOverviewClose = document.getElementById('close-artwork-overview');

    artworks.forEach(figure => {
        const image = figure.querySelector('img');
        const overviewFigure = document.createElement('figure');
        const overviewImage = document.createElement('img');
        const overviewCaption = document.createElement('figcaption');
        overviewImage.src = image.currentSrc || image.src;
        overviewImage.alt = image.alt;
        overviewCaption.textContent = figure.querySelector('figcaption')?.textContent.trim() || image.alt;
        overviewFigure.append(overviewImage, overviewCaption);
        artworkOverviewGrid.appendChild(overviewFigure);
    });

    function openArtworkOverview() {
        artworkOverviewModal.hidden = false;
        document.body.style.overflow = 'hidden';
        artworkOverviewClose.focus();
    }

    function closeArtworkOverview() {
        artworkOverviewModal.hidden = true;
        document.body.style.overflow = '';
        artworkOverviewOpen.focus();
    }

    artworkOverviewOpen.addEventListener('click', openArtworkOverview);
    artworkOverviewClose.addEventListener('click', closeArtworkOverview);
    artworkOverviewModal.addEventListener('click', event => {
        if (event.target === artworkOverviewModal) closeArtworkOverview();
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !artworkOverviewModal.hidden) closeArtworkOverview();
    });

    const artworkList = document.querySelector('.artworks');
    const artworkPrev = document.getElementById('artwork-prev');
    const artworkNext = document.getElementById('artwork-next');
    const artworkToggle = document.getElementById('artwork-toggle');
    const responsiveArtworks = window.matchMedia('(max-width: 1100px)');
    let artworkTimer;
    let artworkMoving = false;
    let artworkPaused = false;

    function artworkStep() {
        const firstArtwork = artworkList.querySelector('figure');
        const gap = parseFloat(getComputedStyle(artworkList).columnGap) || 0;
        return firstArtwork.getBoundingClientRect().width + gap;
    }

    function moveArtworks(direction) {
        if (!responsiveArtworks.matches || artworkMoving) return;
        artworkMoving = true;
        const step = artworkStep();

        if (direction > 0) {
            artworkList.scrollTo({ left: step, behavior: 'smooth' });
            window.setTimeout(() => {
                artworkList.append(artworkList.firstElementChild);
                artworkList.style.scrollBehavior = 'auto';
                artworkList.scrollLeft = 0;
                artworkList.style.scrollBehavior = '';
                artworkMoving = false;
            }, 450);
        } else {
            artworkList.prepend(artworkList.lastElementChild);
            artworkList.style.scrollBehavior = 'auto';
            artworkList.scrollLeft = step;
            artworkList.style.scrollBehavior = '';
            requestAnimationFrame(() => {
                artworkList.scrollTo({ left: 0, behavior: 'smooth' });
                window.setTimeout(() => { artworkMoving = false; }, 450);
            });
        }
    }

    function startArtworkAutoplay() {
        window.clearInterval(artworkTimer);
        if (responsiveArtworks.matches && !artworkPaused) {
            artworkTimer = window.setInterval(() => moveArtworks(1), 3200);
        }
    }

    function toggleArtworkAutoplay() {
        artworkPaused = !artworkPaused;
        artworkToggle.setAttribute('aria-pressed', String(artworkPaused));
        artworkToggle.setAttribute('aria-label', artworkPaused ? '자동 슬라이드 재생' : '자동 슬라이드 일시정지');
        artworkToggle.innerHTML = `<i class="fa-solid fa-${artworkPaused ? 'play' : 'pause'}"></i>`;
        startArtworkAutoplay();
    }

    artworkPrev.addEventListener('click', () => {
        moveArtworks(-1);
        startArtworkAutoplay();
    });
    artworkNext.addEventListener('click', () => {
        moveArtworks(1);
        startArtworkAutoplay();
    });
    artworkToggle.addEventListener('click', toggleArtworkAutoplay);
    responsiveArtworks.addEventListener('change', () => {
        artworkList.scrollLeft = 0;
        startArtworkAutoplay();
    });
    startArtworkAutoplay();

    const nav = [...document.querySelectorAll('.sidebar nav .nav')];
    const responsiveSectionNav = window.matchMedia('(max-width: 1100px)');
    const mobileNav = window.matchMedia('(max-width: 600px)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    document.querySelector('.brand')?.addEventListener('click', event => {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        nav.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#home'));
    });

    nav.forEach(item => item.addEventListener('click', event => {
        const href = item.getAttribute('href');

        if (href === '#home') {
            event.preventDefault();
            if (mobileNav.matches) {
                window.scrollTo({
                    top: 0,
                    behavior: reducedMotion.matches ? 'auto' : 'smooth'
                });
            }
        } else if (responsiveSectionNav.matches) {
            event.preventDefault();
            document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (href !== '#visual') {
            event.preventDefault();
        }

        nav.forEach(link => link.classList.remove('active'));
        item.classList.add('active');
    }));

    select(0);
});
