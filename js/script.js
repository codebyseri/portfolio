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

    document.querySelector('.brand')?.addEventListener('click', event => event.preventDefault());
    const nav = [...document.querySelectorAll('.sidebar nav .nav')];
    nav.forEach(item => item.addEventListener('click', event => {
        if (item.getAttribute('href') !== '#visual') event.preventDefault();
        nav.forEach(link => link.classList.remove('active'));
        item.classList.add('active');
    }));

    select(0);
});
