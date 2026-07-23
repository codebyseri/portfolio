document.addEventListener('DOMContentLoaded', () => {
    
    const currentArt = document.getElementById('current-art');
    const currentTitle = document.getElementById('current-title');
    const tracks = document.querySelectorAll('.track');
    
    // 🔍 getElementById 대신 querySelector를 사용하여 id가 없더라도 클래스(.vinyl, .tonearm)로 확실하게 잡히도록 보완
    const mainVinyl = document.getElementById('main-vinyl') || document.querySelector('.vinyl');
    const playerTonearm = document.getElementById('player-tonearm') || document.querySelector('.tonearm');
    const contentScroll = document.getElementById('content-scroll') || document.querySelector('.main-scroll-wrapper');
    const wireFill = document.getElementById('wire-fill') || document.querySelector('.neon-wire-fill');
    
    // LP 플레이어 가동 전개 함수
    function playTrack(trackElement) {
        if (!trackElement) return;
        
        tracks.forEach(t => t.classList.remove('active'));
        trackElement.classList.add('active');
        
        const title = trackElement.getAttribute('data-title');
        const img = trackElement.getAttribute('data-img');
        
        if (playerTonearm) playerTonearm.classList.add('playing');
        
        setTimeout(() => {
            if (mainVinyl) mainVinyl.classList.add('playing');
            if (title && currentTitle) currentTitle.innerText = `Project : ${title}`;
            if (img && currentArt) currentArt.style.backgroundImage = `url('${img}')`;
        }, 300);
    }
    
    // 💡 새로고침 시 어떤 트랙도 활성화하지 않고 기본 대기 상태로 설정
    tracks.forEach(t => t.classList.remove('active'));
    
    if (currentTitle) {
        currentTitle.innerText = "디자이너, 세리"; // 기본 타이틀 고정
    }
    // 💡 준비된 기본 LP 커버 이미지
    if (currentArt) {
        currentArt.style.backgroundImage = "url('https://i.pinimg.com/736x/9d/9d/47/9d9d47f453f817a8f72259bce864c353.jpg')";
    }
    
   // 🌟 트랙 리스트 인터랙션 (호버 시 LP 변경 / 클릭 시 페이지 이동)
    tracks.forEach(track => {
        // 1. 마우스 호버(mouseenter): LP 앨범 아트 & 타이틀 변경
        track.addEventListener('mouseenter', () => {
            if (mainVinyl) mainVinyl.classList.remove('playing');
            if (playerTonearm) playerTonearm.classList.remove('playing');
            
            setTimeout(() => {
                playTrack(track);
            }, 200);
        });

        // 2. 어디든 클릭(click): HTML의 data-url 경로로 이동
        track.addEventListener('click', () => {
            const linkUrl = track.getAttribute('data-url');
            if (linkUrl) {
                window.location.href = linkUrl; // 현재 탭에서 이동
                // 만약 새 탭에서 열고 싶다면 window.open(linkUrl, '_blank'); 사용
            }
        });
    });
    
    // 숨겨진 스크롤 연동형 우측 네온 와이어 액션
    if (contentScroll && wireFill) {
        contentScroll.addEventListener('scroll', () => {
            const scrollTop = contentScroll.scrollTop;
            const scrollHeight = contentScroll.scrollHeight - contentScroll.clientHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            
            requestAnimationFrame(() => {
                wireFill.style.height = `${scrollPercent}%`;
            });
        });
    }
    
    // 마우스 3D 글래스 틸트 & 반사 그림자 계산
    const tiltTargets = document.querySelectorAll('.tilt-target');
    tiltTargets.forEach(target => {
        target.addEventListener('mousemove', (e) => {
            const rect = target.getBoundingClientRect();
            const x = e.clientX - rect.left - (rect.width / 2);
            const y = e.clientY - rect.top - (rect.height / 2);
            
            const rotateX = -(y / rect.height) * 5;
            const rotateY = (x / rect.width) * 5;
            
            requestAnimationFrame(() => {
                target.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
            });
        });
        
        target.addEventListener('mouseleave', () => {
            requestAnimationFrame(() => {
                target.style.transform = '';
            });
        });
    });
    
    // 젤리 광택 벚꽃잎 낙하 생성기
    const blossomContainer = document.getElementById('blossom-container');
    const MAX_PETALS = 25;
    
    function createPetal() {
        if (!blossomContainer || blossomContainer.children.length >= MAX_PETALS) return;
        
        const petal = document.createElement('div');
        petal.classList.add('petal');
        
        const size = Math.random() * 15 + 12;
        const startLeft = Math.random() * (window.innerWidth + 200) - 100;
        const fallDuration = Math.random() * 8 + 8;
        const swayDuration = Math.random() * 4 + 4;
        const delay = Math.random() * 3;
        
        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        petal.style.left = `${startLeft}px`;
        
        petal.style.animationName = 'fall, sway';
        petal.style.animationDuration = `${fallDuration}s, ${swayDuration}s`;
        petal.style.animationDelay = `${delay}s, 0s`;
        
        blossomContainer.appendChild(petal);
        
        petal.addEventListener('animationend', (e) => {
            if (e.animationName === 'fall') {
                petal.remove();
            }
        });
    }
    
    setInterval(createPetal, 400);

    // About Me 모달 열기/닫기
    const profileModal = document.getElementById('profile-modal');
    const openBtn = document.getElementById('open-profile-modal');
    const closeBtn = document.getElementById('close-profile-modal');

    if (openBtn && profileModal) {
        openBtn.addEventListener('click', () => {
            profileModal.classList.add('active'); // CSS에서 active 시 display: flex 처리
        });
    }

    if (closeBtn && profileModal) {
        closeBtn.addEventListener('click', () => {
            profileModal.classList.remove('active');
        });
    }

    // 바깥 배경 클릭 시 닫기
    if (profileModal) {
        profileModal.addEventListener('click', (e) => {
            if (e.target === profileModal) {
                profileModal.classList.remove('active');
            }
        });
    }

});