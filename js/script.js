document.addEventListener('DOMContentLoaded', () => {
	
	const currentArt = document.getElementById('current-art');
	const currentTitle = document.getElementById('current-title');
	const tracks = document.querySelectorAll('.track');
	
	const mainVinyl = document.getElementById('main-vinyl');
	const playerTonearm = document.getElementById('player-tonearm');
	const contentScroll = document.getElementById('content-scroll');
	const wireFill = document.getElementById('wire-fill');
	
	// LP 플레이어 가동 전개 함수
	function playTrack(trackElement) {
		if(!trackElement) return;
		
		tracks.forEach(t => t.classList.remove('active'));
		trackElement.classList.add('active');
		
		const title = trackElement.getAttribute('data-title');
		const img = trackElement.getAttribute('data-img');
		
		if (playerTonearm) playerTonearm.classList.add('playing');
		
		setTimeout(() => {
			if (mainVinyl) mainVinyl.classList.add('playing');
			if (title && currentTitle) currentTitle.innerText = `김미진 : ${title}`;
			if (img && currentArt) currentArt.style.backgroundImage = `url('${img}')`;
		}, 300);
	}
	
	// 💡 [수정] 새로고침 시 어떤 트랙도 활성화하지 않고 기본 대기 상태로 설정
	tracks.forEach(t => t.classList.remove('active'));
	
	if (currentTitle) {
		currentTitle.innerText = "김미진 : Ready"; // 기본 타이틀 고정
	}
// 💡 준비된 기본 LP 커버 이미지가 있다면 아래 주소를 변경해 주세요.
	if (currentArt) {
		currentArt.style.backgroundImage = "url('https://i.pinimg.com/736x/9d/9d/47/9d9d47f453f817a8f72259bce864c353.jpg')";
	}
	
	// 트랙 리스트 터치 브레이크 인터랙션
	tracks.forEach(track => {
		track.addEventListener('click', (e) => {
			if(e.target.classList.contains('view-btn')) return;
			
			if (mainVinyl) mainVinyl.classList.remove('playing');
			if (playerTonearm) playerTonearm.classList.remove('playing');
			
			setTimeout(() => {
				playTrack(track);
			}, 200);
		});
	});
	
	// 숨겨진 스크롤 연동형 우측 핑크 네온 와이어 액션
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
	
	// 마우스 추적 조명 무빙
	const mouseGlow = document.querySelector('.mouse-glow');
	if (mouseGlow) {
		window.addEventListener('mousemove', (e) => {
			requestAnimationFrame(() => {
				mouseGlow.style.left = `${e.clientX}px`;
				mouseGlow.style.top = `${e.clientY}px`;
			});
		});
	}
	
	// 마우스 3D 글래스 틸트 & 핑크빛 반사 그림자 계산
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
				target.style.boxShadow = `${-rotateY * 1.2}px ${rotateX * 1.2}px 30px rgba(255, 117, 143, 0.25)`;
			});
		});
		
		target.addEventListener('mouseleave', () => {
			requestAnimationFrame(() => {
				target.style.transform = '';
				target.style.boxShadow = '';
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
		
		setTimeout(() => { petal.remove(); }, (fallDuration + delay) * 1000);
	}
	setInterval(createPetal, 400);
});